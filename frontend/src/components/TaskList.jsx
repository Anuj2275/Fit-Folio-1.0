import React from 'react'
import TaskCard from './TaskCard.jsx';
import { ListChecks } from 'lucide-react';

const TaskList = ({tasks,onDelete,onEdit,onToggleComplete}) => {
  return (
    <div className='lg:col-span-2'>
      <h2>
        <ListChecks/> Tasks
      </h2>
      {tasks.length > 0 ? (
        <div>
            {tasks.map((task)=>(
                <TaskCard 
                key={task._id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                onToggleComplete={onToggleComplete}
                />
            ))}
        </div>
      ):(
        <div>
            <p>No tasks here. Add one!</p>
        </div>
      )}
    </div>
  )
}

export default TaskList
