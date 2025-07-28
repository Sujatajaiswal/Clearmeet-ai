import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `transition duration-200 hover:underline ${
      location.pathname === path ? "font-bold text-blue-400" : "text-gray-300"
    }`;

  const links = [
    { path: "/", label: "Home" },
    { path: "/summary", label: "Summary" },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between flex-wrap">
        <div className="text-xl font-semibold text-blue-300">Clearmeet AI</div>
        <div className="flex space-x-6 mt-2 md:mt-0">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={linkStyle(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
