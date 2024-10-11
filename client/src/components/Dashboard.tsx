import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import UserResponses from "./UserResponses";
import Summaries from "./Summaries";
import Stories from "./Stories";
import UserSelect from "./UserSelect";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <div className="flex flex-row">
        <Sidebar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
