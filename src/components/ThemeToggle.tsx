import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'mati'
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-purple-400 hover:bg-purple-500 text-white'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'mati' ? (
        <Sun size={20} className="text-gold-300" />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;