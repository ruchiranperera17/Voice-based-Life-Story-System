import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection

interface Category {
  _id: string;
  categoryQnsId: string;
  type: string;
  description: string;
  createdAt: string;
}

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null); // State for notification
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      setError("Error fetching categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete a category by ID
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setNotification("Category deleted successfully!");
      setTimeout(() => setNotification(null), 4000); // Clear notification after 4 seconds
    } catch (error) {
      setError("Error deleting category");
      console.error("Error deleting category:", error);
    }
  };

  // Edit a selected category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditMode(true);
  };

  // Update the selected category
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      await axios.put(
        `http://localhost:8080/api/categories/${selectedCategory._id}`,
        selectedCategory
      );
      setEditMode(false);
      setSelectedCategory(null);
      setNotification("Category updated successfully!"); // Show notification
      setTimeout(() => setNotification(null), 4000); // Clear notification after 4 seconds
      fetchCategories();
    } catch (error) {
      setError("Error updating category");
      console.error("Error updating category:", error);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Categories List</h1>
        <Link to="/create-category">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create New Category
          </button>
        </Link>
      </div>

      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 transition duration-500 ease-in-out">
          {notification}
        </div>
      )} {/* Notification message */}

      {editMode && selectedCategory ? (
        <>
          <Link to="/categories" className="inline-block mb-4 text-blue-500">Back</Link> {/* Back button */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={selectedCategory.categoryQnsId}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  categoryQnsId: e.target.value,
                })
              }
              placeholder="CategoryQnsID"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              value={selectedCategory.type}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  type: e.target.value,
                })
              }
              placeholder="Type"
              className="border p-2 rounded w-full"
            />
            <textarea
              value={selectedCategory.description}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              }
              placeholder="Description"
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Category
            </button>
          </form>
        </>
      ) : (
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category._id}
                className="bg-white p-4 shadow rounded-lg border"
              >
                <h3 className="text-lg font-semibold">{category.type}</h3>
                <p className="text-gray-600">{category.description}</p>
                <small className="text-gray-400">
                  Created At: {new Date(category.createdAt).toLocaleDateString()}
                </small>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
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

export default CategoriesList;
