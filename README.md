# Jadu & Art Foundation

Full-stack application for Jadu & Art Foundation.

## Environment Setup

### Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `backend/.env` with your backend secrets (Database URI, JWT secret, Razorpay credentials, Cloudinary credentials).

### Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `frontend/.env` with your frontend configurations (such as `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID`).

> **Security Note:** Never commit `.env` files containing real secrets to Git.
