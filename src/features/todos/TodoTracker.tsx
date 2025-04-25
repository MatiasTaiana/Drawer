import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { useTheme } from '../../context/ThemeContext';

const TodoTracker: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className={`text-2xl font-bold mb-6 ${
        theme === 'mati' ? 'text-white' : 'text-slate-800'
      }`}>Todo List</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default TodoTracker;