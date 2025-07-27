const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const parseDeadlinesFromText = require("./helpers/deadlineParser");
const fetch = require("node-fetch");

// 🔥 NEW: Import Slack Route
const slackRoute = require("./routes/slack");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", /\.app\.github\.dev$/],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});
app.use(limiter);

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["audio/mpeg", "audio/wav"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .mp3 and .wav files are allowed"));
    }
    cb(null, true);
  },
});

// 🔥 NEW: Slack route
app.use("/api/send-to-slack", slackRoute);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Clearmeet AI backend is running!");
});

// Summarization route
app.post("/api/summarize", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  try {
    const prompt = `
You are a meeting assistant. Read the following transcript and extract:

1. Summary of discussion points.
2. Action items (task, assignee, deadline).
3. Maintain speaker awareness like: [Speaker Name]: message.

Transcript:
${transcript}
`;

    const togetherRes = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.4,
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
    const deadlines = parseDeadlinesFromText(summary);

    res.json({ summary, deadlines });
  } catch (error) {
    console.error(
      "Together API Error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// Transcription route
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  const filePath = req.file.path;

  try {
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
          fs.unlinkSync(filePath);
          return res.json({ transcript: polling.data.text });
        } else if (polling.data.status === "error") {
          fs.unlinkSync(filePath);
          return res.status(500).json({ error: polling.data.error });
        } else {
          setTimeout(pollTranscription, 3000); // Retry
        }
      } catch (pollError) {
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: "Polling failed" });
      }
    };

    pollTranscription();
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Clearmeet AI backend running at http://localhost:${PORT}`);
});
