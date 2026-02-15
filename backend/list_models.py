import google.generativeai as genai
import os

# Placeholder for API Key - Paste your key here
GOOGLE_API_KEY = "AIzaSyBDshDoYgSsaf3aEMFFaleIhcfmsfDepQs"

# Configure Gemini
api_key = os.environ.get("GOOGLE_API_KEY", GOOGLE_API_KEY)
genai.configure(api_key=api_key)

try:
    print("Listing models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
