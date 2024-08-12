import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <div className="flex flex-row">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
