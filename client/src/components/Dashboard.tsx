import { Routes, Route } from "react-router-dom";
import UserResponses from "./UserResponses";
import Summaries from "./Summaries";
import Stories from "./Stories";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="user-responses" element={<UserResponses />} />
      <Route path="summaries" element={<Summaries />} />
      <Route path="stories" element={<Stories />} />
    </Routes>
  );
};

export default Dashboard;
