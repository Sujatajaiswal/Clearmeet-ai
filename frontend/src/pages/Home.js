import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Clearmeet AI</h1>
      <p className="mb-6">Upload your meeting transcript and get a summarized report instantly.</p>
      <Link to="/summary" className="text-blue-600 underline">
        Go to Summary
      </Link>
    </div>
  );
}

export default Home;
