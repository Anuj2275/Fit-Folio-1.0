import React, { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import TaskCard from "../components/TaskCard";
import FileUpload from "../components/FileUpload";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Zap, ListChecks } from "lucide-react";
import HabitRow from "../components/HabitRow";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const res = await api.tasks.getTasks();

        if (Array.isArray(res.data)) {
          setItems(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setItems(res.data.data);
        } else {
          console.error(
            "Backend response for /items was not an array:",
            res.data
          );
          setFetchError("Unexpected data format from server. Please try again.");
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setFetchError(
          error.response?.data?.message || "Failed to load items."
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const { tasks, habits } = useMemo(() => {
    const tasks = items.filter((item) => item.type === "task");
    const habits = items.filter((item) => item.type === "habit");
    return { tasks, habits };
  }, [items]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    const prevItems = items;
    setItems(items.filter((item) => item._id !== id));

    try {
      await api.tasks.deleteTask(id);
    } catch (error) {
      console.error("Delete failed", error);
      setFetchError(error.response?.data?.message || "Failed to delete item.");
      setItems(prevItems);
    }
  };

  const handleToggleComplete = async (itemToToggle) => {
    const updatedItem = { ...itemToToggle, completed: !itemToToggle.completed };

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemToToggle._id ? updatedItem : item
      )
    );

    try {
      await api.tasks.updateTask(itemToToggle._id, {
        completed: updatedItem.completed,
      });
    } catch (error) {
      console.error("Failed to update item status", error);
      setFetchError(
        error.response?.data?.message || "Failed to update item status."
      );
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === itemToToggle._id ? itemToToggle : item))
      );
    }
  };

  const handleUploadSuccess = (filePath) => {
    setUploadedImageUrl(`http://localhost:3000${filePath}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto mt-12 text-center text-red-600 text-lg">
        Error: {fetchError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="container mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Here's what you've got on your plate.
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg"
          >
            <PlusCircle size={20} />
            Create New Item
          </button>
        </header>

        <div className="my-8 p-6 rounded-xl bg-white shadow-lg border border-gray-200">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          {uploadedImageUrl && (
            <div className="mt-6 text-center">
              <p className="text-gray-700 font-medium mb-2">
                Last uploaded image preview:
              </p>
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="max-w-xs mx-auto rounded-lg shadow-md border border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-2 break-all">
                Image served from: {uploadedImageUrl}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <ListChecks size={28} className="text-blue-600" /> Tasks
            </h2>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-xl text-gray-500 font-medium">
                  No tasks here. Add one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={() => handleDelete(task._id)}
                    onEdit={() => navigate(`/edit/${task._id}`)}
                    onToggleComplete={() => handleToggleComplete(task)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Zap size={28} className="text-blue-600" /> Daily Habits
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              {habits.length > 0 ? (
                habits.map((habit) => (
                  <HabitRow
                    key={habit._id}
                    habit={habit}
                    onDelete={() => handleDelete(habit._id)}
                    onEdit={() => navigate(`/edit/${habit._id}`)}
                    onToggleComplete={() => handleToggleComplete(habit)}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 font-medium">
                  <p>No habits defined.</p>
                  <p>Add a new item and select 'habit'.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;