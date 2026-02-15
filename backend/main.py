from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import google.generativeai as genai
from PIL import Image
import io
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder for API Key - Paste your key here
GOOGLE_API_KEY = "AIzaSyBDshDoYgSsaf3aEMFFaleIhcfmsfDepQs"

# Configure Gemini
# Check if environment variable is set, otherwise use the placeholder
api_key = os.environ.get("GOOGLE_API_KEY", GOOGLE_API_KEY)

if not api_key or api_key == "YOUR_API_KEY_HERE":
    logger.warning("GOOGLE_API_KEY is not set. Please set it in main.py or as an environment variable.")

genai.configure(api_key=api_key)

# Configuration for Gemini 1.5 Flash
generation_config = {
  "temperature": 0.1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-flash-latest",
  generation_config=generation_config,
)

@app.post("/extract")
@limiter.limit("10/minute")
async def extract_invoice(request: Request, file: UploadFile = File(...)):
    # 1. File Type Validation
    if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
        raise HTTPException(status_code=415, detail="Invalid file type. Only JPEG, PNG, and PDF are allowed.")

    # 2. File Size Validation (Max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
    
    await file.seek(0)  # Reset file pointer after reading size
    try:
        image = Image.open(io.BytesIO(contents))

        prompt = """
Analyze this invoice image. Extract the following fields into a clean JSON format:

merchant_name: The prominent business name (Ignore addresses like 'Tamil Nadu').
gstin: The 15-character GST number (e.g., 29ABCDE1234F1Z5).
date: The invoice date in YYYY-MM-DD format.
total_amount: The final payable amount (number only).
tax_amount: The total tax/GST amount.
invoice_number: The invoice ID.

Return only the JSON.
"""
        response = model.generate_content([prompt, image])
        
        # Clean up response to ensure it's pure JSON
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        try:
            json_data = json.loads(response_text)
            return json_data
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON: {response_text}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")

    except Exception as e:
        logger.error(f"Extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
