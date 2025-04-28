import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import ExpenseItem from './ExpenseItem';

interface ExpenseListProps {
  selectedMonth: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ selectedMonth }) => {
  const { expenses } = useAppContext();
  const { theme } = useTheme();

  const filteredExpenses = expenses.filter(expense => 
    expense.date.startsWith(selectedMonth)
  );

  if (filteredExpenses.length === 0) {
    return (
      <div className={`rounded-lg shadow-md p-6 text-center ${
        theme === 'mati'
          ? 'bg-zinc-900 text-gray-400'
          : 'bg-white text-gray-500'
      }`}>
        <p>No expenses recorded for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>
        <p className="text-sm mt-1 text-gray-400">
          Add your first expense using the form above.
        </p>
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
        {filteredExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;