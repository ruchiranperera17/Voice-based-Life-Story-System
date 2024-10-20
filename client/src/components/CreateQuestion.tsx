import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    QuestionId: "",
    Question: "",
    Category: "",
    categoryQnsId: "",
    lastUpdated: new Date().toISOString(),
  });

  const [categories, setCategories] = useState<{ categoryQnsId: string; type: string }[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/questions", questionData, {
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
      });
      if (response.status === 201) {
        setNotification("Question created successfully!");
        setTimeout(() => {
          setNotification(null);
          navigate("/questions");
        }, 4000);
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setError("Error creating question. Please try again.");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    const selectedCategoryObj = categories.find(cat => cat.type === selectedCategory);

    setQuestionData({
      ...questionData,
      Category: selectedCategory,
      categoryQnsId: selectedCategoryObj ? selectedCategoryObj.categoryQnsId : "",
    });
  };

  return (
    <div className="p-8">
      <Link to="/questions" className="inline-block mb-4 text-blue-500">Back</Link>
      <h1 className="text-2xl font-semibold mb-4">Create New Question</h1>

      {notification && <div className="bg-green-500 text-white p-2 rounded mb-4">{notification}</div>}
      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Question ID"
          value={questionData.QuestionId}
          onChange={(e) => setQuestionData({ ...questionData, QuestionId: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <textarea
          placeholder="Enter the question"
          value={questionData.Question}
          onChange={(e) => setQuestionData({ ...questionData, Question: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <select
          value={questionData.Category}
          onChange={handleCategoryChange}
          className="border p-2 rounded w-full mb-2"
          required
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryQnsId} value={cat.type}>{cat.type}</option>
          ))}
        </select>
        <input
          type="text"
          value={questionData.categoryQnsId}
          readOnly
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="date"
          value={questionData.lastUpdated}
          onChange={(e) => setQuestionData({ ...questionData, lastUpdated: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
