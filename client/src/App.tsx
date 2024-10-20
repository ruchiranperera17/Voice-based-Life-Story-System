import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CategoriesList from "./components/CategoriesList";
import CreateCategory from "./components/CreateCategory";
import QuestionsList from "./components/QuestionsList";
import CreateQuestion from "./components/CreateQuestion";
import Stories from "./components/Stories";
import Summaries from "./components/Summaries";
import UserResponses from "./components/UserResponses";
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<CategoriesList />} />
              <Route path="/create-category" element={<CreateCategory />} />
              <Route path="/questions" element={<QuestionsList />} />
              <Route path="/create-question" element={<CreateQuestion />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/summaries" element={<Summaries />} />
              <Route path="/user-responses" element={<UserResponses />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
