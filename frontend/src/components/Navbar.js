import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `hover:underline ${
      location.pathname === path ? "font-bold text-blue-300" : ""
    }`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow">
      <div className="flex space-x-6 items-center">
        <Link to="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link to="/summary" className={linkStyle("/summary")}>
          Summary
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
