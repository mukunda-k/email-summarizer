# Email Thread Summarizer Backend

This is the backend service for the Email Thread Summarizer application. It uses the Google Gemini API to analyze and summarize email threads.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory and add your Google API key:
```
GOOGLE_API_KEY=your_google_api_key_here
```

## Running the Service

1. Make sure your virtual environment is activated
2. Run the Flask application:
```bash
python app.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

### POST /api/summarize

Summarizes an email thread using the Google Gemini API.

Request body:
```json
{
  "email_thread": "Your email thread text here"
}
```

Response:
```json
{
  "summary": "Formatted summary of the email thread"
}
```

## Error Handling

The API will return appropriate error messages if:
- The email thread is missing
- The Google API key is not configured
- There's an error processing the request

## Development

To modify the summarization logic, edit the `email_summarizer.py` file. The main processing pipeline is in the `summarize_email_thread` function. 