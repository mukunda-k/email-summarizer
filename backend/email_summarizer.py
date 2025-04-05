from google.generativeai import configure, GenerativeModel
import re
import html
from typing import Dict, List, Tuple

def setup_gemini_model(api_key: str) -> GenerativeModel:
    """Initialize and configure the Gemini model."""
    try:
        # Remove any quotes or whitespace from the API key
        api_key = api_key.strip().strip("'").strip('"')
        
        print(f"Setting up Gemini model with API key: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
        configure(api_key=api_key)
        model = GenerativeModel('gemini-1.5-pro')
        print("Gemini model setup successful")
        return model
    except Exception as e:
        print(f"Error setting up Gemini model: {str(e)}")
        raise Exception(f"Failed to initialize Gemini model: {str(e)}")

def preprocess_email_thread(email_thread: str) -> str:
    """Clean and normalize the email thread for better processing."""
    # Remove email signatures and disclaimers
    cleaned_text = re.sub(r'--\s*\n.*?(?=\n\n|\Z)', '', email_thread, flags=re.DOTALL)
    
    # Remove forwarded message headers
    cleaned_text = re.sub(r'(-{3,}|={3,})\s*Forwarded message\s*(-{3,}|={3,})', '', cleaned_text)
    
    # Clean up reply indicators
    cleaned_text = re.sub(r'(>+\s*)+', '', cleaned_text)
    
    # Decode HTML entities if present
    cleaned_text = html.unescape(cleaned_text)
    
    # Remove excessive newlines
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    return cleaned_text

def extract_email_metadata(email_thread: str) -> Dict:
    """Extract sender, recipients, dates from the email thread."""
    metadata = {
        'participants': [],
        'timestamps': []
    }
    
    # Extract email addresses
    email_pattern = r'[\w.+-]+@[\w-]+\.[\w.-]+'
    metadata['participants'] = list(set(re.findall(email_pattern, email_thread)))
    
    # Extract dates (simple pattern, can be improved)
    date_pattern = r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}'
    metadata['timestamps'] = re.findall(date_pattern, email_thread)
    
    return metadata

def generate_structured_prompt(email_thread: str) -> str:
    """Create a structured prompt aligned with frontend labels."""
    metadata = extract_email_metadata(email_thread)
    
    prompt = """
Please analyze the following email thread and return a structured summary with the following format exactly:

SUMMARY:
(Write a concise summary of the email thread in 3-5 sentences)

ACTION ITEMS:
- [OWNER: Name] Task description [DEADLINE: Date if available]

KEY DECISIONS:
- Description of decisions made

QUESTIONS RAISED:
- List of unresolved or raised questions

Email Thread:
-------------
"""
    
    prompt += email_thread
    
    if metadata['participants']:
        prompt += f"\n\nParticipants: {', '.join(metadata['participants'])}"
    
    return prompt

def parse_gemini_response(response_text: str) -> Dict:
    """Parse the response into structured components."""
    result = {
        'summary': '',
        'action_items': [],
        'decisions': [],
        'questions': []
    }
    
    # Extract summary section
    summary_match = re.search(r'SUMMARY:?\s*(.*?)(?=ACTION ITEMS:|$)', response_text, re.DOTALL)
    if summary_match:
        result['summary'] = summary_match.group(1).strip()
    
    # Extract action items section
    action_items_match = re.search(r'ACTION ITEMS:?\s*(.*?)(?=KEY DECISIONS:|QUESTIONS:|$)', response_text, re.DOTALL)
    if action_items_match:
        action_items_text = action_items_match.group(1).strip()
        action_items = re.findall(r'[-•*]\s*(.*?)(?=\n[-•*]|\Z)', action_items_text, re.DOTALL)
        result['action_items'] = [item.strip() for item in action_items if item.strip()]
    
    # Extract decisions section
    decisions_match = re.search(r'KEY DECISIONS:?\s*(.*?)(?=QUESTIONS:|$)', response_text, re.DOTALL)
    if decisions_match:
        decisions_text = decisions_match.group(1).strip()
        decisions = re.findall(r'[-•*]\s*(.*?)(?=\n[-•*]|\Z)', decisions_text, re.DOTALL)
        result['decisions'] = [decision.strip() for decision in decisions if decision.strip()]
    
    # Extract questions section
    questions_match = re.search(r'QUESTIONS:?\s*(.*?)(?=$)', response_text, re.DOTALL)
    if questions_match:
        questions_text = questions_match.group(1).strip()
        questions = re.findall(r'[-•*]\s*(.*?)(?=\n[-•*]|\Z)', questions_text, re.DOTALL)
        result['questions'] = [question.strip() for question in questions if question.strip()]
    
    return result

def analyze_email_thread(api_key: str, long_email_thread: str) -> Dict:
    """Complete pipeline to analyze an email thread."""
    try:
        print("Starting email thread analysis...")
        
        # Setup model
        try:
            model = setup_gemini_model(api_key)
        except Exception as model_setup_error:
            print(f"Error setting up model: {str(model_setup_error)}")
            raise Exception(f"Failed to set up Gemini model: {str(model_setup_error)}")
        
        # Preprocess the email thread
        print("Preprocessing email thread...")
        cleaned_thread = preprocess_email_thread(long_email_thread)
        print(f"Preprocessed thread length: {len(cleaned_thread)} characters")
        
        # Generate structured prompt
        print("Generating structured prompt...")
        prompt = generate_structured_prompt(cleaned_thread)
        print(f"Generated prompt length: {len(prompt)} characters")
        
        # Get model response
        try:
            print("Sending request to Gemini API...")
            response = model.generate_content(prompt)
            print("Received response from Gemini API")
            
            if not response:
                print("Error: Empty response from Gemini model")
                raise Exception("Empty response from Gemini model")
                
            if not response.text:
                print("Error: Response has no text content")
                raise Exception("Response has no text content")
                
            print(f"Response text length: {len(response.text)} characters")
            print(f"Response text preview: {response.text[:100]}...")
            
        except Exception as model_error:
            print(f"Error generating content with Gemini: {str(model_error)}")
            raise Exception(f"Gemini API error: {str(model_error)}")
        
        # Parse the response
        print("Parsing Gemini response...")
        result = parse_gemini_response(response.text)
        print("Response parsing complete")
        
        return result
    except Exception as e:
        print(f"Error in analyze_email_thread: {str(e)}")
        raise

def format_results(analysis_results: Dict) -> str:
    """Format the analysis results for display."""
    output = "📧 EMAIL THREAD SUMMARY\n"
    output += "=" * 50 + "\n\n"
    
    # Format summary section
    output += "📝 SUMMARY:\n"
    if analysis_results['summary']:
        # Clean up any markdown formatting or extra characters
        summary = analysis_results['summary'].replace('**', '').replace('*', '').strip()
        output += summary + "\n"
    else:
        output += "No summary available.\n"
    output += "\n"
    
    # Format action items section
    output += "✅ ACTION ITEMS:\n"
    if analysis_results['action_items']:
        for i, item in enumerate(analysis_results['action_items'], 1):
            # Clean up any markdown formatting or extra characters
            cleaned_item = item.replace('**', '').replace('*', '').strip()
            # Highlight owners and deadlines
            highlighted_item = re.sub(r'\[OWNER:\s*(.*?)\]', r'👤 \1 →', cleaned_item)
            highlighted_item = re.sub(r'\[DEADLINE:\s*(.*?)\]', r'⏰ \1', highlighted_item)
            output += f"{i}. {highlighted_item}\n"
    else:
        output += "No action items detected.\n"
    output += "\n"
    
    # Format decisions section
    output += "🔍 KEY DECISIONS:\n"
    if analysis_results['decisions']:
        for i, decision in enumerate(analysis_results['decisions'], 1):
            # Clean up any markdown formatting or extra characters
            cleaned_decision = decision.replace('**', '').replace('*', '').strip()
            output += f"{i}. {cleaned_decision}\n"
    else:
        output += "No decisions detected.\n"
    output += "\n"
    
    # Format questions section
    output += "❓ OPEN QUESTIONS:\n"
    if analysis_results['questions']:
        for i, question in enumerate(analysis_results['questions'], 1):
            # Clean up any markdown formatting or extra characters
            cleaned_question = question.replace('**', '').replace('*', '').strip()
            output += f"{i}. {cleaned_question}\n"
    else:
        output += "No open questions detected.\n"
    
    print(f"Formatted summary: {output}")  # Add logging for debugging
    return output

def summarize_email_thread(api_key: str, long_email_thread: str) -> str:
    """Process an email thread and return formatted results."""
    try:
        print("Starting email thread summarization...")
        analysis = analyze_email_thread(api_key, long_email_thread)
        print("Analysis complete, formatting results...")
        return format_results(analysis)
    except Exception as e:
        error_message = str(e)
        print(f"Error in summarize_email_thread: {error_message}")
        
        # Check for specific error types
        if "API key" in error_message or "authentication" in error_message.lower():
            error_message = "Invalid or expired API key. Please check your Google API key configuration."
        elif "quota" in error_message.lower():
            error_message = "API quota exceeded. Please try again later or upgrade your API plan."
        elif "network" in error_message.lower() or "connection" in error_message.lower():
            error_message = "Network error connecting to Google API. Please check your internet connection."
        
        # Return a more detailed error message
        return f"""📧 EMAIL THREAD SUMMARY
==================================================

📝 SUMMARY:
We encountered an error while processing your email thread: {error_message}

Please try again later or contact support if the issue persists.

✅ ACTION ITEMS:
No action items detected.

🔍 KEY DECISIONS:
No decisions detected.

❓ OPEN QUESTIONS:
No open questions detected.
""" 