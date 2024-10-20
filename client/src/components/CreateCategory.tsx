import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for redirection

const CreateCategory = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [categoryData, setCategoryData] = useState({
    categoryQnsId: "",
    type: "",
    description: "",
  });
  const [notification, setNotification] = useState<string | null>(null); // State for notification
  const [error, setError] = useState<string | null>(null); // State for error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/categories", categoryData);
      if (response.status === 201) {
        setNotification("Category created successfully!"); // Show notification
        setTimeout(() => {
          setNotification(null);
          navigate("/categories"); // Redirect to Categories List after 4 seconds
        }, 4000); // Clear notification and navigate after 4 seconds
      }
    } catch (error) {
      setError("Error creating category. Please try again."); // Show error message
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="p-8">
      <Link to="/categories" className="inline-block mb-4 text-blue-500">Back</Link> {/* Back button */}
      <h1 className="text-2xl font-semibold mb-4">Create New Category</h1>
      
      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 transition duration-500 ease-in-out">
          {notification}
        </div>
      )} {/* Notification message */}

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 transition duration-500 ease-in-out">
          {error}
        </div>
      )} {/* Error message */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category ID"
          value={categoryData.categoryQnsId}
          onChange={(e) => setCategoryData({ ...categoryData, categoryQnsId: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={categoryData.type}
          onChange={(e) => setCategoryData({ ...categoryData, type: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={categoryData.description}
          onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
