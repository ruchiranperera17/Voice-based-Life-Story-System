import { useEffect, useState } from "react";
//import data from "../data/data.json";

function Summaries() {
  const [summaries, setSummaries] = useState<{
    [category: string]: Array<{ summary: string; timestamp: string }>;
  }>({});

  const getSummaries = async () => {
    try {
      const response = await fetch(
        "http://13.54.54.25/api/user/retrieveUserDetails"
      );

      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      //setUserResponses(json.summaries);
      setSummaries(json.summaries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSummaries();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-8 overflow-y-auto bg-gray-50">
      <div className="w-full lg:flex-grow">
        <h1 className="text-3xl font-semibold text-center mb-8">Summaries</h1>
        {Object.entries(summaries).map(([category, summariesList]) => (
          <div
            key={category}
            className="bg-white shadow-lg rounded-xl p-4 pr-6 pl-6 mb-6 border border-gray-300"
          >
            <div className="flex items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-600 uppercase">
                {category}
              </h2>
            </div>
            {summariesList.map(({ summary, timestamp }) => (
              <div
                key={timestamp}
                className="bg-blue-50 p-4 rounded-lg mb-3 border-l-4 border-blue-400"
              >
                <p className="text-md font-medium text-gray-800">{summary}</p>
              </div>
            ))}
          </div>
        ))}
        <div className="pb-16"></div>
      </div>
    </div>
  );
}

export default Summaries;
