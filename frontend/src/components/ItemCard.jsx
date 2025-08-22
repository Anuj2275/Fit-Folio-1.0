import React from "react";
import { Edit, Trash2, Calendar, Check, Zap } from "lucide-react";

const ItemCard = ({ task, onDelete, onEdit, onToggleComplete }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const statusClasses = task.completed
    ? "border-l-4 border-green-500 bg-green-50"
    : "border-l-4 border-yellow-500 bg-white";

  return (
    <div
      className={`rounded-xl shadow-lg p-5 transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl ${statusClasses} ${
        task.deleted ? "opacity-0 scale-90" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3
          className={`font-bold text-lg text-gray-800 ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </h3>
        <div
          className={`text-xs font-bold px-3 py-1 rounded-full capitalize flex items-center gap-1 ${
            task.type === "habit"
              ? "bg-purple-100 text-purple-800"
              : "bg-indigo-100 text-indigo-800"
          }`}
        >
          <Zap size={12} />
          {task.type}
        </div>
      </div>

      {formattedDate && (
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="mr-2" size={16} />
          <span>{formattedDate}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onToggleComplete}
          className={`flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
            task.completed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {task.completed ? <Check size={16} /> : null}
          {task.completed ? "Completed" : "Mark as Complete"}
        </button>
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit Task"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

// import React from "react";
// import { Link } from "react-router-dom";

// const ItemCard = ({ task, onDelete }) => {
//   return (
//     <>
//       <div className="bg-white shadow rounded-md p-4 flex justify-between items-start">
//         <div>
//           <h3 className="text-lg font-semibold">{task.title}</h3>
//           {task.completed && (
//             <span className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
//               Completed
//             </span>
//           )}
//         </div>
//         <div className="flex space-x-2">
//           <Link
//             to={`/edit/${task._id}`}
//             className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Edit
//           </Link>
//           <button
//             onClick={() => onDelete(task._id)}
//             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ItemCard;
