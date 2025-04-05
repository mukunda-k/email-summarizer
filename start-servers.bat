@echo off
echo Starting Thread Clearing Skimmer servers...

echo Starting backend server...
start cmd /k "cd backend && python app.py"

echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo Servers started! 
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 