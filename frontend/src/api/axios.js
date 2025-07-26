import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ✅ Change this to your deployed backend URL in production
});

// Summarize the transcript
export const summarizeTranscript = async (transcript) => {
  if (!transcript) {
    throw new Error("Transcript is required for summarization");
  }

  try {
    const response = await API.post("/api/summarize", { transcript });
    return response.data.summary;
  } catch (error) {
    console.error(
      "Error summarizing transcript:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Transcribe audio file to text
export const transcribeAudio = async (audioFile) => {
  if (!audioFile) {
    throw new Error("Audio file is required for transcription");
  }

  try {
    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await API.post("/api/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.transcript;
  } catch (error) {
    console.error(
      "Error transcribing audio:",
      error.response?.data || error.message
    );
    throw error;
  }
};
