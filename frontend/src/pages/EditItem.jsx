import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { Edit } from "lucide-react";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "task",
    completed: false,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.tasks.getTaskById(id);
        const { title, description, dueDate, type, completed } = res.data;

        setFormData({
          title: title || "",
          description: description || "",
          dueDate: dueDate ? new Date(dueDate).toISOString().split("T")[0] : "",
          type: type || "task",
          completed: completed || false,
        });
        setError("");
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Could not load task data.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.tasks.updateTask(id, formData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 font-medium animate-pulse">
          Loading item for editing...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Edit size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Edit Item</h2>
          <p className="mt-2 text-base text-gray-600">
            Modify the details of your task or habit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
            >
              <option value="task">Task</option>
              <option value="habit">Habit</option>
            </select>
          </div>
          <label className="flex items-center space-x-3 text-lg text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">Mark as Completed</span>
          </label>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-gray-600 bg-gray-200 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;