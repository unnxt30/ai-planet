# Document Chat-Bot

This is part of the Fullstack assignment for AI-Planet.

## Setup Information:
- From root of the project directory, run:
    ```bash
    pip install -r requirements.txt
    ```
- Frontend: Navigate to the frontend/ directory and run:
    ``` bash
    npm i
    npm start
    ```
- Backend: Navigate to the backend/ directory and run:
    ``` bash
    uvicorn main:app --reload
    ```
- Your app is ready to be loaded on `localhost:3000`

## Architecture Overview

This application follows a client-server architecture with the following components:

### Frontend (React + TypeScript)
- Built with React and TypeScript using Chakra UI for styling
- Main components:
  - File Upload: Handles PDF document uploads
  - Chat Interface: Manages conversation with the document
  - Question Prompt: Handles user input and message sending

### Backend (FastAPI)
- REST API built with FastAPI (Python)
- Key integrations:
  - AWS S3: PDF document storage
  - Supabase: Metadata storage and file tracking
  - Groq LLM: AI model for document question-answering
- Main endpoints:
  - `/upload`: Handles PDF file uploads
  - `/question`: Processes questions about uploaded documents

### Data Flow
1. User uploads PDF → Backend stores in S3 and records metadata in Supabase
2. User asks question → Backend:
   - Retrieves latest PDF from S3
   - Extracts text content
   - Processes question using Groq LLM
   - Returns AI-generated response

## API Documentation

The backend provides two main endpoints:

### Upload PDF
```http
POST /upload
```
Uploads a PDF file to the system.

**Request**
- Content-Type: `multipart/form-data`
- Body: PDF file

**Response**
```json
{
    "message": "File uploaded successfully",
    "file_url": "string"
}
```

### Ask Question
```http
POST /question
```
Asks a question about the most recently uploaded PDF document.

**Request**
- Content-Type: `application/json`
- Body:
```json
{
    "question": "string"
}
```

**Response**
```json
{
    "message": "Question received",
    "question": "string",
    "answer": "string"
}
```

**Error Responses**
- `400`: Only PDF files are allowed
- `404`: No PDF file found
- `500`: Server error (AWS credentials, file processing, etc.)

