import { useEffect, useState } from "react";
import data from "../data/data.json";

function UserResponses() {
  const [userResponses, setUserResponses] = useState<{
    [date: string]: Array<{
      question: string;
      answer: string;
      timestamp: string;
      tags: string[];
    }>;
  }>({});
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getUserResponses = async () => {
    try {
      const response = await fetch(
        "http://13.54.54.25/api/user/retrieveUserDetails"
        // "http://localhost:8080/api/user/retrieveUserDetails"
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      setUserResponses(json.user_responses);
      //setUserResponses(data.user_responses);

      // extract unique categories from user responses
      const allCategories = new Set<string>();
      Object.values(data.user_responses).forEach((responses) =>
        responses.forEach((response) => {
          response.tags.forEach((tag) => allCategories.add(tag));
        })
      );
      setCategories(allCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserResponses();
  }, []);

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full pb-16">
      <div
        className={`lg:w-125 p-8 lg:border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 overflow-y-auto ${
          selectedCategory === null ? "block" : "hidden sm:block"
        }`}
        style={{ minHeight: "300px", maxHeight: "100%" }}
      >
        <h1 className="text-3xl font-semibold text-center mb-4">Categories</h1>
        <div className="flex flex-col items-center">
          {[...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-2 m-2 rounded-lg w-full ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`w-full lg:flex-grow p-8 overflow-y-auto ${
          selectedCategory !== null ? "block" : "hidden sm:block"
        }`}
      >
        {selectedCategory && (
          <>
            <button
              onClick={handleBackClick}
              className="mb-4 text-blue-500 hover:underline lg:hidden"
            >
              &larr; Back to Categories
            </button>
            <h1 className="text-3xl font-semibold text-center mb-2">
              User Responses
            </h1>
            <h6 className="text-xs font-semibold text-gray-500 uppercase text-center mb-6">
              {selectedCategory}
            </h6>
            {Object.entries(userResponses).flatMap(([date, responses]) =>
              responses
                .filter((response) => response.tags.includes(selectedCategory))
                .map(({ question, answer, timestamp }) => (
                  <div
                    key={timestamp}
                    className="bg-white shadow-md rounded-xl p-4 pr-6 pl-6 mb-5 border border-gray-300"
                  >
                    <div className="flex items-start mb-4">
                      <h2 className="text-md font-bold text-gray-700">
                        {question}
                      </h2>
                    </div>
                    <div
                      key={timestamp}
                      className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-400"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        {answer}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserResponses;
