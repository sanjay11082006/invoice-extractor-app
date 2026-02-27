import google.generativeai as genai
import os

# Placeholder for API Key - Paste your key here
GEMINI_API_KEY = "AIzaSyAWS2j-abb0WT_AHxTWb0bFUTIbJG_9Wpw"

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)
genai.configure(api_key=api_key)

try:
    print("Listing models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
