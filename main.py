import os
from fastapi import FastAPI
# supabase_url = os.getenv("SUPABASE_URL")
# supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")

# print(supabase_url)
# print(supabase_anon_key)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
