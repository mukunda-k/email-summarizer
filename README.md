# Email Summarizer

An AI-powered tool that summarizes email threads, extracting key points, action items, decisions, and open questions.

## Features

- Summarize long email threads with AI
- Extract action items with owners and deadlines
- Identify key decisions made in the thread
- Highlight open questions that need answers
- Clean, modern UI with responsive design

## Project Structure

```
thread-clearing-skimmer/
├── frontend/           # All frontend code and assets
│   ├── src/           # React source code
│   ├── public/        # Static assets including favicons
│   ├── node_modules/  # Frontend dependencies
│   └── [config files] # Frontend configuration files
├── backend/           # Python backend code
├── .git/             # Git repository
└── [root config files] # Root level configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google API key for Gemini

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/thread-clearing-skimmer.git
   cd thread-clearing-skimmer
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

### Running the Application

#### Option 1: Using the start script (Windows)

The project includes a `start-servers.bat` file in the root directory that automatically starts both the frontend and backend servers in separate command windows. This is the easiest way to run the application on Windows.

1. Run the start script:
   ```
   start-servers.bat
   ```

2. The script will:
   - Start the backend server on http://localhost:5000
   - Start the frontend server on http://localhost:5173
   - Open separate command windows for each server

3. You can close the application by closing both command windows.

#### Option 2: Manual start

1. Start the backend server:
   ```
   cd backend
   python app.py
   ```

2. In a new terminal, start the frontend server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## How to Use

1. Paste your email thread into the text area on the home page
2. Click "Summarize Email Thread"
3. View the summary on the dedicated summary page
4. Copy individual sections as needed

## Troubleshooting

- If you see a "Failed to fetch" error, make sure the backend server is running
- Check the browser console and backend terminal for error messages
- Verify that your Google API key is correctly set in the `.env` file

## License

This project is licensed under the MIT License - see the LICENSE file for details.
