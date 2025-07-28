# Backend_ClearmeetAI
Backend for Clearmeet AI — an intelligent meeting summarization and action item extraction platform. This Node.js + Express server handles transcription (via AssemblyAI), LLM-based summarization (via Together API), and integrations with Slack,. Designed for deployment on Render.

# Backend_ClearmeetAI

This is the backend service for **Clearmeet AI**, a smart meeting assistant that:
- Transcribes meeting audio using AssemblyAI
- Summarizes transcripts with Together API (LLM)
- Extracts deadlines, action items, and more
- Exports summaries to Slack, Notion, Email, and Firebase
- Serves frontend clients via a REST API

## 🔧 Tech Stack
- Node.js & Express
- AssemblyAI (speech-to-text)
- Together AI (LLM summarization)
- Slack integrations
- dotenv, node-fetch, and more

## 🚀 Deployment
Designed to be deployed on **Render**. Configure the following environment variables:
