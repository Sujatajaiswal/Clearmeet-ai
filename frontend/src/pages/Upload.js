import React, { useState } from "react";

const Upload = ({ onTranscriptSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a .txt file to upload.");
      return;
    }

    try {
      const text = await file.text();
      onTranscriptSubmit(text); // Pass raw transcript to parent
    } catch (err) {
      console.error("File read error:", err);
      setError("Failed to read file.");
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">📄 Upload Transcript (.txt)</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="block mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Summarize
        </button>
      </form>

      {error && <p className="text-red-600 mt-3 font-semibold">❌ {error}</p>}
    </div>
  );
};

export default Upload;
