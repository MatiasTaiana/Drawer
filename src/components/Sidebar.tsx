import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { BarChartBig, CheckSquare, Cookie, Home, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar: React.FC = () => {
  const { currentUtility, setCurrentUtility, isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const { theme } = useTheme();

  const utilities = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'expenses', name: 'Expense Tracker', icon: BarChartBig },
    { id: 'todos', name: 'Todo List', icon: CheckSquare },
    { id: 'muffins', name: 'Muffin Calculator', icon: Cookie },
  ];

  return (
    <div 
      className={`fixed md:relative h-full min-h-screen w-64 py-6 px-3 transform transition-transform duration-300 ease-in-out z-30 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${
        theme === 'mati'
          ? 'bg-zinc-900 text-white'
          : 'bg-purple-800 text-white'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Utility Drawer</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button 
            className="md:hidden text-white hover:text-gray-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      </div>
      <nav>
        <ul className="space-y-2">
          {utilities.map((utility) => {
            const Icon = utility.icon;
            return (
              <li key={utility.id}>
                <button
                  onClick={() => {
                    setCurrentUtility(utility.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentUtility === utility.id
                      ? theme === 'mati'
                        ? 'bg-red-600 text-white'
                        : 'bg-purple-600 text-white'
                      : theme === 'mati'
                        ? 'text-gray-300 hover:bg-zinc-800'
                        : 'text-purple-200 hover:bg-purple-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{utility.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;