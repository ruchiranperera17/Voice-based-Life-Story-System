import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserResponses from "./UserResponses";
import Summaries from "./Summaries";
import Stories from "./Stories";
import App from "../App";

const Dashboard = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index path="/" element={<UserResponses />} />
          <Route path="summaries" element={<Summaries />} />
          <Route path="stories" element={<Stories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Dashboard;
