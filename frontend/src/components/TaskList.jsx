import React from 'react';
import TaskCard from './TaskCard.jsx';
import { ListChecks } from 'lucide-react';

const TaskList = ({ tasks, onDelete, onEdit, onToggleComplete }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-xl shadow-inner min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <ListChecks size={28} className="text-blue-600" />
        Your Tasks
      </h2>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-xl text-gray-500 font-medium">
            No tasks found. Add a new one to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;