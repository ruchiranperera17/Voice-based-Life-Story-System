import { useEffect, useState } from "react";
//import data from "../data/data.json";

function Summaries() {
  const [story, setStory] = useState([]);

  const getStory = async () => {
    try {
      const response = await fetch(
        "http://13.54.54.25/api/user/retrieveUserDetails"
      );

      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      //setUserResponses(json.summaries);
      setStory(json.story);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStory();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-8 overflow-y-auto bg-gray-50">
      <div className="w-full lg:flex-grow">
        <h1 className="text-3xl font-semibold text-center mb-8">Life Story</h1>
        <div className="bg-white shadow-lg rounded-xl p-4 pr-6 pl-6 mb-6 border border-gray-300">
          <p className="text-md font-medium text-gray-800">{story}</p>
        </div>
        <div className="pb-16"></div>
      </div>
    </div>
  );
}

export default Summaries;
