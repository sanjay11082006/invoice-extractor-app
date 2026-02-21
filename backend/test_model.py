
import os
import sys
from google import genai
from google.genai import types

# Add current directory to path to import main if needed, but we can just setup client directly
# to avoid side effects of importing main (like creating app, limiter, etc)

# Configuration from .env
from dotenv import load_dotenv, find_dotenv
import pathlib

# Load .env from backend directory explicitly
backend_env = pathlib.Path(__file__).parent / ".env"
load_dotenv(backend_env)

api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key or api_key == "YOUR_NEW_API_KEY_HERE":
    print("Error: API Key not set.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

try:
    print("Testing gemini-2.5-flash model...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Hello, are you working?",
        config=types.GenerateContentConfig(
            max_output_tokens=50,
        )
    )
    print("Success! Response:")
    print(response.text)
except Exception as e:
    print(f"Error testing model: {e}")
    sys.exit(1)
