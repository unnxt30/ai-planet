from fastapi import FastAPI, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
import uvicorn
from io import BytesIO
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import PyPDF2
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

os.environ["GROQ_API_KEY"] = os.environ.get("GROQ_API_KEY")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")

s3 = boto3.client('s3', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION"))
BUCKET_NAME = os.environ.get("AWS_BUCKET_NAME")

supabase: Client = create_client(url, key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    try:

        file_contents = await file.read()
        file_contents = BytesIO(file_contents)

        s3_key = f"uploads/{file.filename}"
        s3.upload_fileobj(file_contents, BUCKET_NAME, s3_key, ExtraArgs={'ContentType': "application/pdf"})

        file_url = f"https://{BUCKET_NAME}.s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{s3_key}"

        response = (supabase.table("File").insert({"file_name" : file.filename, "file_url": file_url}).execute())
        return {"message": "File uploaded successfully", "file_url": file_url}
    
    except (NoCredentialsError, PartialCredentialsError):
        raise HTTPException(status_code=500, detail="AWS credentials are not properly configured.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {e}")
    
@app.post("/question")
async def question(question: dict = Body(...)):
    try:
        # Get the latest uploaded file from Supabase
        response = supabase.table("File").select("*").order('created_at', desc=True).limit(1).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No PDF file found")
        
        file_url = response.data[0]['file_url']
        s3_key = file_url.split('.amazonaws.com/')[1]
        
        # Download PDF from S3
        file_obj = BytesIO()
        s3.download_fileobj(BUCKET_NAME, s3_key, file_obj)
        file_obj.seek(0)
        
        # Read PDF content
        pdf_reader = PyPDF2.PdfReader(file_obj)
        pdf_text = "" # PDF content
        for page in pdf_reader.pages:
            pdf_text += page.extract_text()

        # Question recieved from frontend
        user_question = question.get("question")
        
        system_prompt = """You are a helpful assistant that answers questions based on the provided document. 
Use the following document content to answer the user's question:

{context}

Answer the question based only on the information provided above. If you cannot find the answer in the document, say so."""

        system_prompt_fmt = system_prompt.format(context=pdf_text)

        model = ChatGroq(model="llama3-8b-8192")
        
        messages = [
            SystemMessage(content=system_prompt_fmt),
            HumanMessage(content=f"Question: {user_question}\nAnswer:")
        ]
        
        answer = model.invoke(messages)

        return {
            "message": "Question received",
            "pdf_content_preview": system_prompt_fmt,
            "question": user_question,
            "answer": answer.content
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)