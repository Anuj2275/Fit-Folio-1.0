import React from 'react';
import { Edit, Trash2, Check } from 'lucide-react';

const HabitRow = ({ habit, onDelete, onEdit, onToggleComplete }) => {
  return (
    <div className={`group flex items-center justify-between p-3 rounded-lg transition-colors ${habit.completed ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleComplete}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            habit.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 group-hover:border-green-400'
          }`}
        >
          {habit.completed && <Check size={15} className="text-white" />}
        </button>
        <span className={`font-medium ${habit.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {habit.title}
        </span>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-500" title="Edit Habit">
          <Edit size={18} />
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500" title="Delete Habit">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default HabitRow;
