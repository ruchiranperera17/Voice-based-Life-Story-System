import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="flex p-4 ">
        <div className="">
          <h1 className="p-1">Preview</h1>
          <textarea className="w-96 h-96 border-2 border-black"></textarea>
          <div className="mt-4">
            <button className="border-2 border-black rounded-md p-2">
              SUBMIT
            </button>
            <button className="border-2 border-black rounded-md p-2 ml-2">
              PRINT
            </button>
          </div>
        </div>
        <div className="ml-4">
          <div>
            <h1 className="p-1">Previous</h1>
          </div>
          <div>
            <div className="flex-col">
              <div className="border-2 border-slate-500 p-1 rounded-lg">
                <h4>Summary of my childhood mem...</h4>
              </div>
              <div className="border-2 border-slate-500 p-1 mt-2 rounded-lg">
                <h4>Summary of my childhood mem...</h4>
              </div>
              <div className="border-2 border-slate-500 p-1 mt-2 rounded-lg">
                <h4>Summary of my childhood mem...</h4>
              </div>
              <div className="border-2 border-slate-500 p-1 mt-2 rounded-lg">
                <h4>Summary of my childhood mem...</h4>
              </div>
              <div>
                <h4></h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
