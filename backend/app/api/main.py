from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
import uvicorn
from io import BytesIO
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")

s3 = boto3.client('s3', aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name=os.environ.get("AWS_REGION"))
BUCKET_NAME = os.environ.get("AWS_BUCKET_NAME")

supabase: Client = create_client(url, key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://loacalhost:3000"],
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)