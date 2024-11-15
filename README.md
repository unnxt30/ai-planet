# Document Chat-Bot

A full-stack application that enables users to upload PDF documents and interact with them through natural language questions.

## Architecture Overview

### Frontend Architecture (React + TypeScript)
- **Components**:
  - `FileUpload.tsx`: Manages PDF document uploads with progress tracking and validation
  - `Chat.tsx`: Maintains chat history and message display
  - `QuestionPrompt.tsx`: Handles user input and message submission
- **State Management**: Uses React's useState for local state management
- **UI Framework**: Chakra UI for consistent, responsive design
- **API Integration**: Fetch API for backend communication

### Backend Architecture (FastAPI)
- **Core Components**:
  - FastAPI application with CORS middleware
  - File handling system with AWS S3 integration
  - Database integration with Supabase
  - LLM integration with Groq
- **Services**:
  - **Storage Service**: AWS S3 for PDF storage
  - **Database Service**: Supabase for file metadata
  - **AI Service**: Groq LLM for document analysis
- **API Endpoints**:
  - `/upload`: PDF document processing
  - `/question`: Document Q&A processing

### Data Flow Architecture
1. **Document Upload Flow**:
   ```
   Client → Upload Request → FastAPI → AWS S3
                                   → Supabase (metadata)
   ```

2. **Question-Answer Flow**:
   ```
   Client → Question → FastAPI → Retrieve PDF from S3
                              → Extract Text
                              → Process with Groq LLM
                              → Return Response
   ```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- AWS Account
- Supabase Account
- Groq API Key

### Environment Variables
Create a `.env` file with:
```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Groq Configuration
GROQ_API_KEY=your_groq_api_key
```

### Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Unix
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start server
cd backend/api
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

## API Documentation

### Upload Endpoint
```http
POST /upload
Content-Type: multipart/form-data

Response: {
    "message": "File uploaded successfully",
    "file_url": "string"
}
```

### Question Endpoint
```http
POST /question
Content-Type: application/json

Request: {
    "question": "string"
}

Response: {
    "message": "Question received",
    "question": "string",
    "answer": "string"
}
```

## Error Handling
- Frontend: Comprehensive error handling for file uploads and API requests
- Backend: 
  - Input validation for file types
  - AWS credential verification
  - Error handling for file processing
  - LLM processing error handling

## Security Considerations
- CORS configuration for controlled access
- Environment variable management for sensitive credentials
- File type validation
- Size limitations on uploads
- Rate limiting (recommended for production)

## Future Improvements
- Authentication system
- Multiple document support
- Conversation history persistence
- Advanced document processing features
- Caching layer for improved performance
