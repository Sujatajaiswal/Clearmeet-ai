# Clearmeet-ai

# Clearmeet AI – Your AI-Powered Meeting Summarizer 🤖📋

Clearmeet AI is a smart meeting summarization tool that transcribes audio files, generates concise summaries, extracts action items with deadlines and assignees, and supports export options like PDF, JSON, and Slack sharing.

---

## 🌟 Features

- 🎙️ Upload `.txt`, `.mp3`, or `.wav` meeting transcripts
- 🧠 LLM-powered summarization using Together API
- ✍️ Action item extraction with speaker awareness
- 🗓️ Deadline detection and natural language parsing (e.g., “by Friday” → `YYYY-MM-DD`)
- 👤 Assignee identification from dialogue
- 🔗 Integrations:
  - 📤 Export to PDF / JSON
  - 💬 Share to Slack (Webhook)

- ☁️ Fully deployable with Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | Next.js, React, Tailwind CSS |
| Backend      | Node.js, Express.js         |
| Transcription| AssemblyAI                  |
| Summarization| Together AI API             |       
| Export       | `pdf-lib`, JSON, Slack Webhook |
| Hosting      | Vercel (frontend), Render (backend) |

---


---

## ⚙️ Installation

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/Clearmeet-ai.git
cd Clearmeet-ai


cd backend
npm install

# Create .env with the following
TOGETHER_API_KEY=your_together_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
SLACK_WEBHOOK_URL=your_webhook_url

# Start server
node index.js

cd ../frontend
npm install

# Run locally
npm run dev


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
