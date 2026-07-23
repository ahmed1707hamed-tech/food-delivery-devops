# Food Delivery Web Application

This is a complete, production-ready Food Delivery Web Application built with React 19, Vite, FastAPI, and PostgreSQL.

## Features
- **Authentication**: JWT-based secure authentication (Register/Login).
- **Users**: Profile management.
- **Restaurants**: Browse restaurants, view details, categories, and ratings.
- **Menu**: View menu items for restaurants with dynamic pricing and images.
- **Cart**: Add/remove items, update quantity, dynamic total calculation.
- **Orders**: Secure checkout, order history with dynamic statuses.
- **Responsive UI**: Modern UI with glassmorphism, smooth animations, and interactive elements.

## Tech Stack
- **Frontend**: React 19, Vite, React Router DOM, Axios, Context API, Lucide React (Icons).
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy ORM, Alembic, Pydantic, Passlib, JWT.
- **Database**: PostgreSQL

## Running Locally

### 1. Database
Ensure you have a local PostgreSQL server running on port `5432`.
The application expects a role `postgres` with password `postgres`.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Create a virtual environment and install dependencies:
```bash
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```
Run Alembic migrations to setup tables:
```bash
.\.venv\Scripts\alembic upgrade head
```
Run the seed script (from the backend folder, point to database folder):
```bash
.\.venv\Scripts\python ../database/seed.py
```
Start the FastAPI server:
```bash
.\.venv\Scripts\uvicorn app.main:app --reload
```
The API will run at `http://localhost:8000`.

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to the localhost port provided by Vite (e.g., `http://localhost:5173`).
