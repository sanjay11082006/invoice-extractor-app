from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from google import genai
from google.genai import types
from PIL import Image
import io
import os
import json
import logging
import filetype

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
from dotenv import load_dotenv
import os

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key or api_key == "YOUR_NEW_API_KEY_HERE":
    logger.warning("GEMINI_API_KEY is not set. Please set it in backend/.env")

client = genai.Client(api_key=api_key)

@app.post("/extract")
@limiter.limit("5/minute")
async def extract_invoice(request: Request, file: UploadFile = File(...)):
    # 1. File Type Validation (Header-based)
    logger.info(f"Received file upload: {file.filename}, content_type: {file.content_type}")
    header = await file.read(2048)
    kind = filetype.guess(header)
    allowed_mimes = {"application/pdf", "image/png", "image/jpeg", "image/jpg"}
    if not kind or kind.mime not in allowed_mimes:
        await file.seek(0)
        raise HTTPException(status_code=400, detail="Invalid file type")

    await file.seek(0)

    # 2. File Size Validation (Max 5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
    
    await file.seek(0)  # Reset file pointer after reading size so downstream readers start at 0
    try:
        if kind.mime == "application/pdf":
            logger.info("Processing file as PDF using raw bytes")
            input_file = types.Part.from_bytes(data=contents, mime_type="application/pdf")
        else:
            # For images, verify it's a valid image using PIL
            input_file = Image.open(io.BytesIO(contents))

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
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
                contents=[prompt, input_file],
            config=types.GenerateContentConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=64,
                max_output_tokens=8192,
                response_mime_type="application/json",
            )
        )
        
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
