import os
from dotenv import load_dotenv
from google.generativeai import configure, GenerativeModel

# Load environment variables
load_dotenv()

def test_gemini_api():
    """Test if the Gemini API key is working correctly."""
    try:
        # Get the API key from environment variables
        api_key = os.getenv('GOOGLE_API_KEY')
        
        if not api_key:
            print("Error: GOOGLE_API_KEY not found in environment variables")
            return False
        
        # Remove any quotes or whitespace from the API key
        api_key = api_key.strip().strip("'").strip('"')
        
        print(f"Testing Gemini API with key: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
        
        # Configure the API
        configure(api_key=api_key)
        
        # Create a model
        model = GenerativeModel('gemini-1.5-pro')
        
        # Generate a simple response
        prompt = "Hello, can you tell me if this API key is working?"
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            print("Error: Empty response from Gemini model")
            return False
        
        print("Success! Gemini API is working correctly.")
        print(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"Error testing Gemini API: {str(e)}")
        return False

if __name__ == "__main__":
    test_gemini_api() 