// import React, { useState, useRef } from "react";
// import Upload from "./Upload";
// import { summarizeTranscript } from "../api/axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const Summarize = () => {
//   const [summary, setSummary] = useState("");
//   const [actionItems, setActionItems] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const pdfRef = useRef(null);

//   // Converts natural language deadline to YYYY-MM-DD format
//   const getDateFromNaturalLanguage = (text) => {
//     const today = new Date();
//     const lower = text.toLowerCase();

//     if (lower.includes("today")) {
//       return today.toISOString().split("T")[0];
//     } else if (lower.includes("tomorrow")) {
//       const tomorrow = new Date(today);
//       tomorrow.setDate(today.getDate() + 1);
//       return tomorrow.toISOString().split("T")[0];
//     }

//     const weekdays = {
//       sunday: 0,
//       monday: 1,
//       tuesday: 2,
//       wednesday: 3,
//       thursday: 4,
//       friday: 5,
//       saturday: 6,
//     };

//     for (const [day, index] of Object.entries(weekdays)) {
//       if (lower.includes(day)) {
//         return getNextWeekdayDate(today, index);
//       }
//     }

//     return "TBD";
//   };

//   const getNextWeekdayDate = (current, dayOfWeek) => {
//     const result = new Date(current);
//     const distance = (dayOfWeek + 7 - current.getDay()) % 7 || 7;
//     result.setDate(current.getDate() + distance);
//     return result.toISOString().split("T")[0];
//   };

//   const handleTranscriptSubmit = async (transcript) => {
//     setError("");
//     setSummary("");
//     setActionItems([]);
//     setLoading(true);

//     try {
//       const responseText = await summarizeTranscript(transcript);
//       const [summaryPart, actionPart] = responseText.split("Action Items:");

//       setSummary(summaryPart?.trim() || "No summary generated.");

//       const actions =
//         actionPart
//           ?.trim()
//           ?.split("- ")
//           ?.filter((s) => s.trim())
//           ?.map((line) => {
//             const taskMatch = line.match(/Task:\s?(.*?)(?=,|$)/i);
//             const assigneeMatch = line.match(/Assignee:\s?(.*?)(?=,|$)/i);
//             const deadlineMatch = line.match(/Deadline:\s?(.*?)(?=\.|$)/i);

//             const task = taskMatch?.[1]?.trim() || "N/A";
//             const assignee = assigneeMatch?.[1]?.trim() || "N/A";
//             const deadlineText = deadlineMatch?.[1]?.trim();

//             return {
//               task,
//               assignee,
//               deadline: deadlineText
//                 ? getDateFromNaturalLanguage(deadlineText)
//                 : "TBD",
//             };
//           }) || [];

//       setActionItems(actions);
//     } catch (err) {
//       console.error(err);
//       setError("❌ Failed to generate summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportJSON = () => {
//     const exportData = { summary, actionItems };
//     const blob = new Blob([JSON.stringify(exportData, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "meeting-summary.json";
//     link.click();
//   };

//   const handleExportPDF = () => {
//     if (!pdfRef.current) return;
//     html2canvas(pdfRef.current).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("meeting-summary.pdf");
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         🎙️ AI Meeting Summarizer
//       </h1>

//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <Upload onTranscriptSubmit={handleTranscriptSubmit} />
//       </div>

//       {loading && (
//         <p className="text-blue-500 mt-4">⏳ Generating summary...</p>
//       )}
//       {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}

//       {(summary || actionItems.length > 0) && (
//         <div ref={pdfRef}>
//           {summary && (
//             <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow">
//               <h2 className="text-xl font-semibold mb-4">✅ Summary</h2>
//               {summary.split("\n").map((line, idx) => (
//                 <p key={idx} className="whitespace-pre-wrap">
//                   {line}
//                 </p>
//               ))}
//             </div>
//           )}

//           {actionItems.length > 0 && (
//             <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow">
//               <h2 className="text-xl font-semibold mb-4">📌 Action Items</h2>
//               <ul className="space-y-4">
//                 {actionItems.map((item, index) => (
//                   <li
//                     key={index}
//                     className="border p-4 rounded bg-white shadow-sm hover:shadow transition"
//                   >
//                     <p>
//                       <strong>Task:</strong> {item.task}
//                     </p>
//                     <p>
//                       <strong>Assignee:</strong> {item.assignee}
//                     </p>
//                     <p>
//                       <strong>Deadline:</strong> {item.deadline}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}

//       {(summary || actionItems.length > 0) && (
//         <div className="mt-6 text-center space-x-4">
//           <button
//             onClick={handleExportJSON}
//             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
//           >
//             ⬇️ Export as JSON
//           </button>
//           <button
//             onClick={handleExportPDF}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
//           >
//             📤 Export to PDF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summarize;

import React, { useState, useRef } from "react";
import Upload from "./Upload";
import { summarizeTranscript } from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios"; // ✅ Use axios to call backend instead of direct Slack import

const Summarize = () => {
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef(null);

  const getDateFromNaturalLanguage = (text) => {
    const today = new Date();
    const lower = text.toLowerCase();

    if (lower.includes("today")) {
      return today.toISOString().split("T")[0];
    } else if (lower.includes("tomorrow")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }

    const weekdays = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    for (const [day, index] of Object.entries(weekdays)) {
      if (lower.includes(day)) {
        return getNextWeekdayDate(today, index);
      }
    }

    return "TBD";
  };

  const getNextWeekdayDate = (current, dayOfWeek) => {
    const result = new Date(current);
    const distance = (dayOfWeek + 7 - current.getDay()) % 7 || 7;
    result.setDate(current.getDate() + distance);
    return result.toISOString().split("T")[0];
  };

  const handleTranscriptSubmit = async (transcript) => {
    if (!transcript) {
      setError("❗ Transcript is empty.");
      return;
    }

    setError("");
    setSummary("");
    setActionItems([]);
    setLoading(true);

    try {
      const responseText = await summarizeTranscript(transcript);
      const [summaryPart, actionPart] = responseText.split("Action Items:");

      setSummary(summaryPart?.trim() || "No summary generated.");

      const actions =
        actionPart
          ?.trim()
          .split("- ")
          .filter((line) => line.trim())
          .map((line) => {
            const taskMatch = line.match(/Task:\s?(.*?)(?=,|$)/i);
            const assigneeMatch = line.match(/Assignee:\s?(.*?)(?=,|$)/i);
            const deadlineMatch = line.match(/Deadline:\s?(.*?)(?=\.|$)/i);

            const task = taskMatch?.[1]?.trim() || "N/A";
            const assignee = assigneeMatch?.[1]?.trim() || "N/A";
            const deadlineText = deadlineMatch?.[1]?.trim();

            return {
              task,
              assignee,
              deadline: deadlineText
                ? getDateFromNaturalLanguage(deadlineText)
                : "TBD",
            };
          }) || [];

      setActionItems(actions);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const exportData = { summary, actionItems };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meeting-summary.json";
    link.click();
  };

  const handleExportPDF = () => {
    if (!pdfRef.current) return;
    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("meeting-summary.pdf");
    });
  };

  const handleSendToSlack = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-to-slack", {
        summary,
        actionItems,
      });
      alert("✅ Summary sent to Slack!");
    } catch (err) {
      console.error("Slack error:", err);
      alert("❌ Failed to send to Slack. Check your backend server.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎙️ AI Meeting Summarizer
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <Upload onTranscriptSubmit={handleTranscriptSubmit} />
      </div>

      {loading && (
        <p className="text-blue-500 mt-4">⏳ Generating summary...</p>
      )}
      {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}

      {(summary || actionItems.length > 0) && (
        <div ref={pdfRef}>
          {summary && (
            <section className="mt-6 bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">✅ Summary</h2>
              {summary.split("\n").map((line, idx) => (
                <p key={idx} className="whitespace-pre-wrap">
                  {line}
                </p>
              ))}
            </section>
          )}

          {actionItems.length > 0 && (
            <section className="mt-6 bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">📌 Action Items</h2>
              <ul className="space-y-4">
                {actionItems.map((item, index) => (
                  <li
                    key={index}
                    className="border p-4 rounded bg-white shadow-sm hover:shadow transition"
                  >
                    <p>
                      <strong>Task:</strong> {item.task}
                    </p>
                    <p>
                      <strong>Assignee:</strong> {item.assignee}
                    </p>
                    <p>
                      <strong>Deadline:</strong> {item.deadline}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {(summary || actionItems.length > 0) && (
        <div className="mt-6 text-center space-x-4">
          <button
            onClick={handleExportJSON}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            ⬇️ Export as JSON
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            📤 Export to PDF
          </button>
          <button
            onClick={handleSendToSlack}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            💬 Send to Slack
          </button>
        </div>
      )}
    </div>
  );
};

export default Summarize;
