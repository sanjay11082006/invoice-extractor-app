# Intelligent Invoice and Receipt Data Extraction System

## Overview
The Intelligent Invoice and Receipt Data Extraction System leverages the advanced capabilities of Google Gemini 2.5 Flash Lite to automate the extraction of critical data from invoices and receipts. This system replaces manual data entry with intelligent processing. It parses uploaded files (PDFs and images) and returns highly accurate, structured JSON data.

## Tech Stack
*   **Frontend**: Next.js
*   **Backend**: Python FastAPI
*   **Data Extraction Engine**: Google Gemini 2.5 Flash Lite

## Local Development Setup

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   Google API Key (Google AI Studio)

### 1. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file for your API key
# Replace 'YOUR_API_KEY' with your actual key from Google AI Studio
echo GOOGLE_API_KEY=YOUR_API_KEY > .env

# Start the Backend Server
uvicorn main:app --reload
```
The backend will start on `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal window, navigate to the project root, and start the Next.js development server.

```bash
# Install Node dependencies
npm install

# Start the Frontend Server
npm run dev
```
The application will be available at `http://localhost:3000`.

### 3. Usage
1.  Open `http://localhost:3000` in your browser.
2.  Upload an invoice (PDF, JPG, PNG).
3.  View the extracted data and JSON output.
