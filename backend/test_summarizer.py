from email_summarizer import summarize_email_thread
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv('GOOGLE_API_KEY')

# Test email thread
test_email = """
From: john@example.com
To: team@example.com
Subject: Project Status Update

Hi Team,

Just following up on our previous discussion about the Q3 deliverables.

We need to finalize the report by Friday and also prepare the presentation for the client meeting next week.

Jane, could you please send me the updated analytics?

Also, remember that we need to schedule the team offsite by end of month.

Thanks,
John
"""

# Test the summarizer
if __name__ == "__main__":
    print("Testing email summarizer...")
    result = summarize_email_thread(api_key, test_email)
    print("\nSummary result:")
    print(result) 