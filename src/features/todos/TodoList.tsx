import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { todos } = useAppContext();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'active' | 'all' | 'completed'>('active');

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  const filteredTodos = sortedTodos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (todos.length === 0) {
    return (
      <div className={`rounded-lg shadow-md p-6 text-center ${
        theme === 'mati'
          ? 'bg-zinc-900 text-gray-400'
          : 'bg-white text-gray-500'
      }`}>
        <p>No tasks added yet.</p>
        <p className={`text-sm mt-1 ${
          theme === 'mati' ? 'text-gray-500' : 'text-gray-400'
        }`}>Add your first task using the form above.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      theme === 'mati'
        ? 'bg-zinc-900 text-white'
        : 'bg-white text-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          {(['active', 'all', 'completed'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                filter === value
                  ? theme === 'mati'
                    ? 'bg-red-600 text-white'
                    : 'bg-purple-600 text-white'
                  : theme === 'mati'
                    ? 'text-gray-400 hover:bg-zinc-800'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;