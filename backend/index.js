const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      /\.app\.github\.dev$/, // GitHub Codespaces
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Multer setup for audio upload
const upload = multer({ dest: "uploads/" });

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Clearmeet AI backend is running!");
});

// ✅ POST /api/summarize — Summarize text transcript
app.post("/api/summarize", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  try {
    const togetherRes = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "user",
            content: `Summarize this meeting transcript and extract key points:\n${transcript}`,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = togetherRes.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Together.ai Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// ✅ POST /api/transcribe — Transcribe .mp3/.wav audio using AssemblyAI
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Step 1: Upload audio to AssemblyAI
    const uploadRes = await axios({
      method: "post",
      url: "https://api.assemblyai.com/v2/upload",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "transfer-encoding": "chunked",
      },
      data: fs.createReadStream(filePath),
    });

    const audio_url = uploadRes.data.upload_url;

    // Step 2: Request transcription
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url },
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
        },
      }
    );

    const transcriptId = transcriptRes.data.id;

    // Step 3: Poll for completion
    const pollTranscription = async () => {
      try {
        const polling = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: process.env.ASSEMBLYAI_API_KEY,
            },
          }
        );

        if (polling.data.status === "completed") {
          fs.unlinkSync(filePath); // cleanup
          return res.json({ transcript: polling.data.text });
        } else if (polling.data.status === "error") {
          fs.unlinkSync(filePath);
          return res.status(500).json({ error: polling.data.error });
        } else {
          setTimeout(pollTranscription, 3000); // retry in 3 sec
        }
      } catch (pollError) {
        console.error("Polling Error:", pollError.message);
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: "Polling failed" });
      }
    };

    pollTranscription();
  } catch (err) {
    console.error("AssemblyAI Error:", err.message);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Clearmeet AI backend running at http://localhost:${PORT}`);
});
