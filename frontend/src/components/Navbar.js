import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/summary" className="hover:underline">
          Summary
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
