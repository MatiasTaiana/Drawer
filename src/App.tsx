import React from 'react';
import { Toaster } from 'sonner';
import Sidebar from './components/Sidebar';
import ExpenseTracker from './features/expenses/ExpenseTracker';
import TodoTracker from './features/todos/TodoTracker';
import MuffinCalculator from './features/muffins/MuffinCalculator';
import HomePage from './features/home/HomePage';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Menu } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';

const MainContent: React.FC = () => {
  const { currentUtility, setIsSidebarOpen } = useAppContext();
  const { theme } = useTheme();
  
  return (
    <div className={`flex-1 min-h-screen ${
      theme === 'mati' 
        ? 'bg-black' 
        : 'bg-purple-50'
    }`}>
      <div className={`md:hidden p-4 shadow-sm flex items-center justify-between ${
        theme === 'mati'
          ? 'bg-zinc-900'
          : 'bg-white'
      }`}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={theme === 'mati' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}
        >
          <Menu size={24} />
        </button>
        <ThemeToggle />
      </div>
      <div className="p-4 md:p-6 overflow-y-auto">
        {currentUtility === 'home' && <HomePage />}
        {currentUtility === 'expenses' && <ExpenseTracker />}
        {currentUtility === 'todos' && <TodoTracker />}
        {currentUtility === 'muffins' && <MuffinCalculator />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <MainContent />
        </div>
        <Toaster 
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          duration={3000}
        />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;