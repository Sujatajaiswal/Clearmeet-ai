const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS fix for GitHub Codespaces
app.use(
  cors({
    origin: /\.app\.github\.dev$/, // regex to allow all *.app.github.dev
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Clearmeet AI backend is running!");
});

// ✅ Summarize endpoint
app.post("/api/summarize", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Please summarize this meeting:\n${transcript}` },
      ],
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Clearmeet AI backend is running on http://localhost:${PORT}`);
});
