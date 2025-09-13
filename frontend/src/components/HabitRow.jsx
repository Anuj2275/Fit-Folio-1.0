import React from 'react';
import { Edit, Trash2, Check } from 'lucide-react';

const HabitRow = ({ habit, onDelete, onEdit, onToggleComplete }) => {
  return (
    <div
      className={`
        flex items-center justify-between p-4 sm:p-5 my-2 
        rounded-xl transition-all duration-300 ease-in-out
        border border-gray-200 shadow-sm
        ${habit.completed ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}
        group
      `}
    >
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleComplete}
          className={`
            w-8 h-8 md:w-9 md:h-9 flex-shrink-0 
            rounded-full border-2 
            flex items-center justify-center 
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              habit.completed
                ? 'bg-green-600 border-green-600 focus:ring-green-500'
                : 'border-gray-300 text-transparent group-hover:bg-blue-50 group-hover:border-blue-400 focus:ring-blue-500'
            }
          `}
        >
          {habit.completed && <Check size={20} className="text-white" />}
        </button>
        <span
          className={`
            font-semibold text-lg md:text-xl truncate 
            ${habit.completed ? 'text-gray-400 line-through' : 'text-gray-800'}
          `}
        >
          {habit.title}
        </span>
      </div>
      <div
        className={`
          flex items-center gap-2 md:gap-3 
          ml-4 flex-shrink-0
          ${habit.completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity duration-300
        `}
      >
        <button
          onClick={onEdit}
          className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          title="Edit Habit"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
          title="Delete Habit"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default HabitRow;