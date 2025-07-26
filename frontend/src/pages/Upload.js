// import React, { useState } from "react";

// const Upload = ({ onTranscriptSubmit }) => {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!file) {
//       setError("Please select a .txt, .mp3, or .wav file to upload.");
//       setLoading(false);
//       return;
//     }

//     // File size limit: 30MB
//     if (file.size > 30 * 1024 * 1024) {
//       setError("File size exceeds 30MB limit.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const fileType = file.type;
//       const fileName = file.name.toLowerCase();

//       if (fileType === "text/plain" || fileName.endsWith(".txt")) {
//         const text = await file.text();
//         onTranscriptSubmit(text);
//       } else if (
//         fileType.startsWith("audio/") ||
//         fileName.endsWith(".mp3") ||
//         fileName.endsWith(".wav")
//       ) {
//         const formData = new FormData();
//         formData.append("audio", file);

//         const response = await fetch("http://localhost:5000/api/transcribe", {
//           method: "POST",
//           body: formData,
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.error || "Transcription failed.");
//         }

//         onTranscriptSubmit(result.transcript);
//       } else {
//         setError("Unsupported file type. Please upload .txt, .mp3, or .wav.");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       setError("Something went wrong: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg p-8 rounded-2xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
//         📄 Upload Transcript{" "}
//         <span className="ml-2 text-base font-medium text-gray-600">
//           (.txt / .mp3 / .wav)
//         </span>
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="file"
//           accept=".txt,.mp3,.wav,audio/*"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="w-full file:mr-4 file:py-2 file:px-4
//             file:rounded-full file:border-0
//             file:text-sm file:font-semibold
//             file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
//             file:text-white hover:file:from-blue-600 hover:file:to-indigo-700
//             transition"
//         />

//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold py-3 rounded-xl shadow-md transition duration-300"
//           disabled={loading}
//         >
//           {loading ? "⏳ Processing..." : "🚀 Summarize"}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4 font-semibold">❌ {error}</p>}
//     </div>
//   );
// };

// export default Upload;

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setLoading(false);
      return;
    }

    try {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        // Handle .txt transcript
        const text = await file.text();
        onTranscriptSubmit(text);
      } else if (
        fileType.startsWith("audio/") ||
        fileName.endsWith(".mp3") ||
        fileName.endsWith(".wav")
      ) {
        // Handle audio file
        const formData = new FormData();
        formData.append("audio", file);

        const response = await fetch("http://localhost:5000/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Transcription failed.");
        }

        const transcript = result.transcript;
        onTranscriptSubmit(transcript);
      } else {
        setError("Unsupported file type. Please upload .txt, .mp3, or .wav.");
      }
    } catch (err) {
      console.error("Upload error:", err);
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
          accept=".txt,.mp3,.wav,audio/*"
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
