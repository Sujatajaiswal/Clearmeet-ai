import React, { useState } from "react";

const Upload = ({ onTranscriptSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!file) {
      setError("Please select a .txt, .mp3, or .wav file to upload.");
      setLoading(false);
      return;
    }

    // Optional: Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setLoading(false);
      return;
    }

    try {
      const fileType = file.type;

      if (fileType === "text/plain") {
        // 📄 Handle .txt file
        const text = await file.text();
        onTranscriptSubmit(text);
      } else if (
        fileType === "audio/wav" ||
        fileType === "audio/mpeg" ||
        file.name.endsWith(".mp3") ||
        file.name.endsWith(".wav")
      ) {
        // 🔊 Handle audio file (mp3 or wav)
        const formData = new FormData();
        formData.append("audio", file);

        const transcribeRes = await fetch(
          "http://localhost:5000/api/transcribe",
          {
            method: "POST",
            body: formData,
          }
        );

        const transcribeData = await transcribeRes.json();

        if (!transcribeRes.ok) {
          throw new Error(transcribeData.error || "Transcription failed.");
        }

        const transcript = transcribeData.transcript;
        onTranscriptSubmit(transcript);
      } else {
        setError("Unsupported file type. Please upload .txt, .mp3, or .wav");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        📄 Upload Transcript (.txt / .mp3 / .wav)
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".txt, .mp3, .wav, audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block mb-3 border border-gray-300 rounded px-2 py-1"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Summarize"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-3 font-semibold">❌ {error}</p>}
    </div>
  );
};

export default Upload;
