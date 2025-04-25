import React from 'react';
import { Todo } from '../../types';
import { Check, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

interface TodoItemProps {
  todo: Todo;
}

const priorityColors = {
  mati: {
    low: 'bg-amber-900/20 text-amber-300',
    medium: 'bg-red-900/20 text-red-300',
    high: 'bg-red-900/30 text-red-300',
  },
  sofi: {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  },
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useAppContext();
  const { theme } = useTheme();
  
  const formattedDate = new Date(todo.date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`rounded-lg shadow-sm mb-3 transition-all duration-200 hover:shadow-md ${
      theme === 'mati'
        ? 'bg-zinc-800 border border-zinc-700'
        : 'bg-white border border-gray-100'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? theme === 'mati'
                    ? 'bg-red-600 border-red-600'
                    : 'bg-purple-600 border-purple-600'
                  : theme === 'mati'
                    ? 'border-gray-600 hover:border-red-500'
                    : 'border-gray-300 hover:border-purple-500'
              }`}
            >
              {todo.completed && <Check size={12} className="text-white" />}
            </button>
            
            <div className="flex-1">
              <p className={`font-medium ${
                todo.completed 
                  ? theme === 'mati'
                    ? 'line-through text-gray-500'
                    : 'line-through text-gray-500'
                  : theme === 'mati'
                    ? 'text-white'
                    : 'text-slate-800'
              }`}>
                {todo.title}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-sm ${
                  theme === 'mati' ? 'text-gray-400' : 'text-gray-500'
                }`}>{formattedDate}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  theme === 'mati'
                    ? priorityColors.mati[todo.priority]
                    : priorityColors.sofi[todo.priority]
                }`}>
                  {todo.priority}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => deleteTodo(todo.id)}
            className={`transition-colors ${
              theme === 'mati'
                ? 'text-gray-500 hover:text-red-400'
                : 'text-gray-400 hover:text-red-600'
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;