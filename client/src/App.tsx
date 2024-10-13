import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-row">
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-grow pt-16 overflow-y-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
