import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import UserSelect from "./components/UserSelect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Summaries from "./components/Summaries";
import UserResponses from "./components/UserResponses";
import Stories from "./components/Stories";

function App() {
  return (
    // <div className="flex flex-col flex-1 overflow-hidden">
    //   {/* <Header />
    //   <div className="flex flex-row">
    //     <Sidebar />
    //     <Dashboard />
    //   </div> */}

    //   <UserSelect />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/" element={<UserSelect />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="summaries" element={<Summaries />} />
            <Route
              path="/dashboard/userResponses"
              element={<UserResponses />}
            />
            <Route path="questions" element={<Dashboard />} />
            <Route path="categories" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
