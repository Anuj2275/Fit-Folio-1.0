import React from 'react'
import TaskCard from './TaskCard';
import { Zap } from 'lucide-react';

const HabitList = ({habits, onDelete, onEdit, onToggleComplete}) => {
  return (
    <div>
      <h2><Zap/> Daily Habits</h2>

      <div>
        {habits.length > 0 ?(
            <div>
                {habits.map((habit)=>{
                    <TaskCard
                    key={habit._id}
                    task={habit}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onToggleComplete={onToggleComplete}
                    />
                })}
            </div>
        ):(
            <p>
                no habits defined , add a new item adn select 'Habit'
            </p>
        )}
      </div>
    </div>
  )
}

export default HabitList
