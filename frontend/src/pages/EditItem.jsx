// frontend/src/pages/EditItem.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // FIX: Set initial loading state to true
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "", // FIX: Add description to formData
    dueDate: "",
    type: "task",
    completed: false,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.tasks.getTaskById(id); // FIX: Use the correct API method
        const { title, description, dueDate, type, completed } = res.data;

        setFormData({
          title: title || "", // Ensure no null values for controlled components
          description: description || "",
          dueDate: dueDate ? new Date(dueDate).toISOString().split("T")[0] : "", // FIX: Correctly format date for input
          type: type || "task",
          completed: completed || false,
        });
        setError("");
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Could not load task data.");
      } finally {
        setLoading(false); // FIX: Stop loading after fetch
      }
    };
    fetchItem();
  }, [id]); // FIX: Dependency array includes id to re-fetch if URL param changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.tasks.updateTask(id, formData); // FIX: Use the correct API method
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // FIX: Render loading state or error message before the form
  if (loading) {
    return <div className="text-center mt-10">Loading item for editing...</div>;
  }
  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Item</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* FIX: Add description input */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="task">Task</option>
          <option value="habit">Habit</option>
        </select>
        <label className="flex items-center space-x-3 text-gray-700">
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Mark as Completed</span>
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
