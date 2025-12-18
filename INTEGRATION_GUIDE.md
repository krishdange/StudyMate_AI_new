# Frontend-Backend Integration Guide

## Overview

The frontend has been fully integrated with the FastAPI backend, replacing Supabase completely. All authentication and API calls now use the backend API.

## Changes Made

### 1. New API Client (`src/lib/api.ts`)
- Created a centralized API client that replaces Supabase
- Handles JWT token authentication automatically
- Provides typed methods for all backend endpoints

### 2. Authentication System (`src/hooks/useAuth.ts`)
- New `AuthProvider` component for managing authentication state
- `useAuth` hook for accessing auth state and methods
- JWT token stored in localStorage as `auth_token`

### 3. Updated Components

#### Login (`src/pages/Login.tsx`)
- Now uses backend `/auth/register` and `/auth/login` endpoints
- Proper form handling with email, password, first name, last name
- Error handling with toast notifications

#### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Uses `useAuth` hook to check authentication
- Validates JWT token from localStorage

#### ChatTutor (`src/components/ChatTutor.tsx`)
- Uses `/chat/message` endpoint instead of Supabase functions
- Simplified message handling (no streaming for now)

#### PdfQA (`src/components/PdfQA.tsx`)
- Uses `/documents/upload` for file uploads
- Uses `/documents/` to list documents
- Uses `/documents/{id}/ask` for Q&A
- Supports both PDF and image uploads

#### MCQGenerator (`src/components/MCQGenerator.tsx`)
- Uses `/mcq/generate` to create MCQ sets
- Uses `/mcq/sets` to load saved sets
- Uses `/mcq/sets/{id}/submit` to submit answers

#### NotesGenerator (`src/components/NotesGenerator.tsx`)
- Uses `/notes/generate` to create notes
- Uses `/notes/` to load saved notes
- Uses `/notes/{id}` DELETE to delete notes

#### Dashboard (`src/pages/Dashboard.tsx`)
- Updated logout to remove `auth_token` instead of `isLoggedIn`

### 4. Removed Dependencies
- Removed `@supabase/supabase-js` from package.json
- Supabase client files can be deleted (kept for reference)

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_URL=http://localhost:8000
   ```

3. **Start backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

4. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints Used

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Chat
- `POST /chat/message` - Send chat message
- `GET /chat/history` - Get chat history
- `DELETE /chat/clear` - Clear chat history

### Documents
- `POST /documents/upload` - Upload PDF/image
- `GET /documents/` - List documents
- `DELETE /documents/{id}` - Delete document
- `POST /documents/{id}/ask` - Ask question about document

### MCQ
- `POST /mcq/generate` - Generate MCQ questions
- `GET /mcq/sets` - Get MCQ sets
- `GET /mcq/sets/{id}` - Get specific MCQ set
- `POST /mcq/sets/{id}/submit` - Submit answers

### Notes
- `POST /notes/generate` - Generate notes
- `GET /notes/` - Get notes
- `DELETE /notes/{id}` - Delete note

### Study Planner
- `POST /planner/create` - Create study plan
- `GET /planner/` - Get study plans
- `PUT /planner/{id}` - Update study plan

## Authentication Flow

1. User registers/logs in via `/auth/register` or `/auth/login`
2. Backend returns JWT token in `access_token` field
3. Token is stored in localStorage as `auth_token`
4. All subsequent API calls include token in `Authorization: Bearer <token>` header
5. Protected routes check for token via `useAuth` hook

## Testing

1. Start both backend and frontend
2. Navigate to `http://localhost:5173` (or your frontend port)
3. Click "Login" or "Get Started"
4. Register a new account
5. You should be redirected to dashboard
6. All features should work with backend API

## Troubleshooting

### CORS Errors
- Make sure backend CORS is configured for your frontend URL
- Check `backend/app/config.py` CORS_ORIGINS setting

### Authentication Errors
- Check that token is being stored: `localStorage.getItem('auth_token')`
- Verify backend is running and accessible
- Check browser console for API errors

### API Connection Errors
- Verify `VITE_API_URL` in `.env` matches backend URL
- Check backend is running on correct port (default: 8000)
- Verify network connectivity

## Next Steps

- [ ] Add token refresh mechanism
- [ ] Implement streaming for chat responses
- [ ] Add error boundary components
- [ ] Add loading states for better UX
- [ ] Implement offline support (optional)

