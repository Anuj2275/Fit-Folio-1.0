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
    ? "border-l-4 border-green-600 bg-green-50"
    : "border-l-4 border-blue-500 bg-white";

  return (
    <div
      className={`
        rounded-xl shadow-md p-5 transition-all duration-300 ease-in-out 
        transform hover:shadow-lg hover:scale-[1.01] 
        ${statusClasses}
        ${
          task.deleted
            ? "opacity-0 scale-95 -translate-y-2"
            : "opacity-100 scale-100 translate-y-0"
        }
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <h3
          className={`
            font-bold text-lg md:text-xl text-gray-800 flex-1 
            ${task.completed ? "line-through text-gray-400" : ""}
          `}
        >
          {task.title}
        </h3>
        <div
          className={`
            text-xs font-bold px-3 py-1 rounded-full capitalize 
            flex items-center gap-1 flex-shrink-0
            ${
              task.type === "habit"
                ? "bg-purple-100 text-purple-800"
                : "bg-indigo-100 text-indigo-800"
            }
          `}
        >
          <Zap size={12} />
          {task.type}
        </div>
      </div>

      {formattedDate && (
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="mr-2" size={16} />
          <span className="font-medium">{formattedDate}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onToggleComplete}
          className={`
            flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg 
            transition-colors duration-200
            ${
              task.completed
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }
          `}
        >
          <Check size={16} />
          {task.completed ? "Completed" : "Mark as Complete"}
        </button>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            title="Edit Task"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
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