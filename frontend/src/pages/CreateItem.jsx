import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { PlusCircle } from "lucide-react";

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "task",
    completed: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const val = inputType === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.tasks.createTask(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.message || 'Failed to create a task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
            <PlusCircle size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create New {formData.type === 'task' ? 'Task' : 'Habit'}
          </h2>
          <p className="mt-2 text-base text-gray-600">
            Fill in the details for your new item.
          </p>
        </div>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder={formData.type === 'task' ? 'Task Title' : 'Habit Name'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={formData.type === 'habit' ? 'Habit Description (Optional)' : 'Task Description (Optional)'}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
            >
              <option value="task">Task</option>
              <option value="habit">Habit</option>
            </select>
            {formData.type === "task" && (
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
              />
            )}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
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
                Creating...
              </>
            ) : (
              "Create Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;