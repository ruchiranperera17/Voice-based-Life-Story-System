import React from "react";
import { Link, Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserSelect from "./UserSelect";
import UserResponses from "./UserResponses";
import Summaries from "./Summaries";
import Dashboard from "./Dashboard";
const Sidebar = () => {
  const navigationItems = [
    { name: "Stories", path: "/stories" },
    { name: "Summaries", path: "/summaries" },
    { name: "User Responses", path: "/userResponses" },
  ];
  const pathname = window.location.pathname;
  // console.log(pathname);
  return (
    <div className="flex h-screen z-10">
      <div className="flex flex-col w-64 h-full bg-gray-800 text-white">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="#" className="block px-4 py-2 rounded hover:bg-gray-700">
            Summary
          </Link>
          <Link
            to="/userResponses"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            User Responses
          </Link>
          <Link to="#" className="block px-4 py-2 rounded hover:bg-gray-700">
            Question
          </Link>
          <Link to="#" className="block px-4 py-2 rounded hover:bg-gray-700">
            Categories
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
