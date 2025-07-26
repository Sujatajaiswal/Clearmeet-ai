import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to Clearmeet AI
      </h1>
      <p className="mb-6 text-lg text-gray-600">
        Upload your meeting transcript and get an instant summary, action items,
        and more powered by AI.
      </p>
      <Link
        to="/summary"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
      >
        Go to Summary
      </Link>
    </div>
  );
}

export default Home;
