import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to <span className="text-blue-600">Clearmeet AI</span>
      </h1>
      <p className="mb-6 text-lg text-gray-600 max-w-xl">
        Upload your meeting transcript and get an instant summary, action items,
        deadlines, and much more—powered by Generative AI.
      </p>
      <Link
        to="/summary"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Go to Summary
      </Link>
    </div>
  );
}

export default Home;
