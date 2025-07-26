import React, { useState } from "react";
import Upload from "./Upload";

const Summarize = () => {
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranscriptSubmit = async (transcript) => {
    setError("");
    setSummary("");
    setActionItems([]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary || "No summary generated.");
        setActionItems(data.action_items || []);
      } else {
        setError(data.error || "❌ Something went wrong.");
      }
    } catch (err) {
      setError("❌ Network or server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎙️ AI Meeting Summarizer</h1>

      {/* Upload component */}
      <Upload onTranscriptSubmit={handleTranscriptSubmit} />

      {/* Loading spinner */}
      {loading && (
        <p className="text-blue-500 mt-4">⏳ Generating summary...</p>
      )}

      {/* Error message */}
      {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}

      {/* Generated summary */}
      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">✅ Summary</h2>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">📌 Action Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            {actionItems.map((item, index) => (
              <li key={index}>
                <strong>Task:</strong> {item.task} <br />
                <strong>Assignee:</strong> {item.assignee || "N/A"} <br />
                <strong>Deadline:</strong> {item.deadline || "Not specified"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Summarize;
