# Clearmeet-ai
AI Agent for meeting summarization and action items using GPT-4


An AI-powered meeting assistant that:
- 📄 Transcribes audio or text files
- 🧠 Summarizes discussions
- ✅ Extracts action items
- 📌 Detects deadlines and responsibilities

## Features
- Upload `.txt`, `.mp3`, or `.wav` files
- Transcription using AssemblyAI
- Summarization and action item detection using Together AI
- Export to PDF or JSON

## Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- AI APIs: AssemblyAI, Together AI

## How to Run Locally
```bash
git clone https://github.com/Sujatajaiswal/Clearmeet-ai.git
cd Clearmeet-ai
# Frontend
cd frontend
npm install
npm start
# Backend
cd ../backend
npm install
node index.js
