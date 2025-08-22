import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "", // NEW: Add the description field to the state
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
      console.log("creating item", formData);
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {/* FIX: Use conditional rendering for the title */}
        Create New {formData.type === 'task' ? 'Task' : 'Habit'}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          // FIX: Change placeholder dynamically
          placeholder={formData.type === 'task' ? 'Task Title' : 'Habit Name'}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {/* NEW: Add a textarea for the description */}
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={formData.type === 'habit' ? 'Habit Description (Optional)' : 'Task Description (Optional)'}
            className="w-full border px-3 py-2 rounded"
        />
         {formData.type === "task" && (
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="task">Task</option>
          <option value="habit">Habit</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
          <span>Mark as Completed</span>
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";

// const CreateItem = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     dueDate: "",
//     type: "task",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // When switching to 'habit', clear the due date
//     if (name === "type" && value === "habit") {
//       setFormData({ ...formData, type: value, dueDate: "" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       // Create a payload, ensuring dueDate is null if it's an empty string
//       const payload = {
//         ...formData,
//         dueDate: formData.dueDate || null,
//       };
//       await api.post("/items", payload);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create item.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">
//         Create a New Item
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <input
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Title (e.g., 'Workout for 30 mins')"
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="task">Task</option>
//           <option value="habit">Habit</option>
//         </select>

//         {/* Conditionally render the date input only if the type is 'task' */}
//         {formData.type === "task" && (
//           <input
//             type="date"
//             name="dueDate"
//             value={formData.dueDate}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}

//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate("/dashboard")}
//             className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//           >
//             {loading ? "Creating..." : "Create Item"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateItem;
