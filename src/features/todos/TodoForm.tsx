import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const TodoForm: React.FC = () => {
  const { addTodo } = useAppContext();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task');
      return;
    }

    addTodo({
      title: title.trim(),
      completed: false,
      priority,
    });

    setTitle('');
    setError('');
  };

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 ${
      theme === 'mati'
        ? 'bg-zinc-900 text-white'
        : 'bg-white text-slate-800'
    }`}>
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      
      {error && (
        <div className={`p-3 rounded-md mb-4 ${
          theme === 'mati'
            ? 'bg-red-900/20 text-red-400'
            : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className={`block text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Task
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              theme === 'mati'
                ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
            }`}
            placeholder="What needs to be done?"
          />
        </div>
        
        <div>
          <label htmlFor="priority" className={`block text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              theme === 'mati'
                ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === 'mati'
              ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
              : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
          }`}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TodoForm;