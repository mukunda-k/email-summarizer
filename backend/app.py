from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging
from email_summarizer import summarize_email_thread
from typing import Dict, Any

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the API is running."""
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/api/summarize', methods=['POST'])
def summarize() -> Dict[str, Any]:
    """
    Endpoint to summarize an email thread.
    
    Returns:
        Dict[str, Any]: JSON response containing either the summary or error message
    
    Raises:
        400: When no email thread is provided
        500: When API key is missing or invalid, or when processing fails
    """
    try:
        # Get the email thread from the request
        data = request.get_json()
        
        if not data or 'email_thread' not in data:
            logger.error("No email_thread provided in request")
            return jsonify({"error": "No email_thread provided"}), 400
        
        email_thread = data['email_thread']
        
        # Get the API key from environment variables
        api_key = os.getenv('GOOGLE_API_KEY')
        
        if not api_key:
            logger.error("GOOGLE_API_KEY not found in environment variables")
            return jsonify({"error": "API key not configured"}), 500
        
        # Check if the API key is valid
        if len(api_key) < 10:
            logger.error(f"API key appears to be invalid: {api_key}")
            return jsonify({"error": "Invalid API key format"}), 500
        
        # Log the request
        logger.info(f"Received request to summarize email thread (length: {len(email_thread)})")
        logger.info(f"Using API key: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
        
        # Process the email thread
        try:
            summary = summarize_email_thread(api_key, email_thread)
            
            # Check if the summary contains an error message
            if "We encountered an error while processing your email thread" in summary:
                error_message = summary.split("We encountered an error while processing your email thread:")[1].split("\n\n")[0].strip()
                logger.error(f"Error in summary: {error_message}")
                return jsonify({"error": error_message}), 500
            
            # Log the summary (first 100 characters)
            logger.info(f"Generated summary: {summary[:100]}...")
            
            # Return the summary
            return jsonify({"summary": summary})
        except Exception as summarize_error:
            logger.error(f"Error in summarize_email_thread: {str(summarize_error)}", exc_info=True)
            return jsonify({"error": f"Error processing email: {str(summarize_error)}"}), 500
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 