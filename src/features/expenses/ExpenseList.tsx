import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import ExpenseItem from './ExpenseItem';

const ExpenseList: React.FC = () => {
  const { expenses } = useAppContext();
  const { theme } = useTheme();

  if (expenses.length === 0) {
    return (
      <div className={`rounded-lg shadow-md p-6 text-center ${
        theme === 'mati'
          ? 'bg-zinc-900 text-gray-400'
          : 'bg-white text-gray-500'
      }`}>
        <p>No expenses recorded yet.</p>
        <p className={`text-sm mt-1 ${
          theme === 'mati' ? 'text-gray-500' : 'text-gray-400'
        }`}>Add your first expense using the form above.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      theme === 'mati'
        ? 'bg-zinc-900 text-white'
        : 'bg-white text-slate-800'
    }`}>
      <h2 className="text-xl font-semibold mb-4">Expense History</h2>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;