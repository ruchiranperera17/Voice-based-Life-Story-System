import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for redirection

interface Question {
  _id: string;
  QuestionId: string;
  Question: string;
  categoryQnsId: string;
  lastUpdated: string;
}

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null); // State for notification
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/questions/${id}`);
      setQuestions(questions.filter((question) => question._id !== id));
      setNotification("Question deleted successfully!"); // Show notification
      setTimeout(() => setNotification(null), 4000); // Clear notification after 4 seconds
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setEditMode(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    try {
      await axios.put(
        `http://localhost:8080/api/questions/${selectedQuestion._id}`,
        selectedQuestion
      );
      setEditMode(false);
      setSelectedQuestion(null);
      setNotification("Question updated successfully!"); // Show notification
      setTimeout(() => {
        setNotification(null);
        fetchQuestions(); // Refresh the question list
      }, 4000); // Clear notification after 4 seconds
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Questions List</h1>
        <Link to="/create-question">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New Question
          </button>
        </Link>
      </div>

      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 transition duration-500 ease-in-out">
          {notification}
        </div>
      )} {/* Notification message */}

      {editMode && selectedQuestion ? (
        <>
          <Link to="/questions" className="inline-block mb-4 text-blue-500">Back</Link> {/* Back button */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={selectedQuestion.QuestionId}
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  QuestionId: e.target.value,
                })
              }
              placeholder="Question ID"
              className="border p-2 rounded w-full"
            />
            <textarea
              value={selectedQuestion.Question}
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  Question: e.target.value,
                })
              }
              placeholder="Question"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              value={selectedQuestion.categoryQnsId}
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  categoryQnsId: e.target.value,
                })
              }
              placeholder="CategoryQnsID"
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={selectedQuestion.lastUpdated}
              onChange={(e) =>
                setSelectedQuestion({
                  ...selectedQuestion,
                  lastUpdated: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Question
            </button>
          </form>
        </>
      ) : (
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="space-y-4">
            {questions.map((question) => (
              <li
                key={question._id}
                className="bg-white p-4 shadow rounded-lg border"
              >
                <h3 className="text-lg font-semibold">{question.Question}</h3>
                <p className="text-gray-600">Category ID: {question.categoryQnsId}</p>
                <small className="text-gray-400">
                  Last Updated:{" "}
                  {new Date(question.lastUpdated).toLocaleDateString()}
                </small>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
