import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/currency';

const ExpenseSummary: React.FC = () => {
  const { expenses, monthlySalary, setMonthlySalary } = useAppContext();
  const { theme } = useTheme();
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingAmount = monthlySalary - totalExpenses;
  const percentageSpent = monthlySalary > 0 ? (totalExpenses / monthlySalary) * 100 : 0;
  
  const necessaryExpenses = expenses
    .filter(expense => expense.isNecessary)
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const unnecessaryExpenses = expenses
    .filter(expense => !expense.isNecessary)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 ${
      theme === 'mati' 
        ? 'bg-zinc-900 text-white' 
        : 'bg-white text-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Monthly Summary</h2>
        
        <div className="flex items-center">
          <label htmlFor="salary" className={`text-sm font-medium mr-2 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Monthly Salary:
          </label>
          <input
            type="number"
            id="salary"
            value={monthlySalary || ''}
            onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
            className={`px-3 py-1 rounded-md focus:outline-none focus:ring-2 w-32 ${
              theme === 'mati'
                ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
            }`}
            placeholder="0.00"
            min="0"
            step="1000"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          theme === 'mati' ? 'bg-zinc-800' : 'bg-slate-50'
        }`}>
          <h3 className={`text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-400' : 'text-gray-500'
          }`}>Total Expenses</h3>
          <p className={`text-2xl font-bold ${
            theme === 'mati' ? 'text-white' : 'text-slate-900'
          }`}>{formatCurrency(totalExpenses)}</p>
          {monthlySalary > 0 && (
            <p className="text-sm mt-1">
              <span className={
                percentageSpent > 80 
                  ? 'text-red-500' 
                  : percentageSpent > 50 
                    ? 'text-orange-500' 
                    : theme === 'mati' 
                      ? 'text-green-400' 
                      : 'text-green-600'
              }>
                {percentageSpent.toFixed(1)}% 
              </span> 
              <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
                of monthly salary
              </span>
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'mati' ? 'bg-zinc-800' : 'bg-slate-50'
        }`}>
          <h3 className={`text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-400' : 'text-gray-500'
          }`}>Remaining</h3>
          <p className={`text-2xl font-bold ${
            remainingAmount < 0 
              ? 'text-red-500'
              : theme === 'mati'
                ? 'text-white'
                : 'text-slate-900'
          }`}>
            {formatCurrency(remainingAmount)}
          </p>
          {monthlySalary > 0 && (
            <p className="text-sm mt-1">
              <span className={
                remainingAmount < 0 
                  ? 'text-red-500' 
                  : theme === 'mati'
                    ? 'text-green-400'
                    : 'text-green-600'
              }>
                {Math.abs(100 - percentageSpent).toFixed(1)}% 
              </span> 
              <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
                {remainingAmount < 0 ? 'overspent' : 'remaining'}
              </span>
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${
          theme === 'mati' 
            ? 'bg-red-900/20' 
            : 'bg-blue-50'
        }`}>
          <h3 className={`text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-red-300' : 'text-blue-700'
          }`}>Necessary Expenses</h3>
          <p className={`text-xl font-bold ${
            theme === 'mati' ? 'text-white' : 'text-slate-900'
          }`}>{formatCurrency(necessaryExpenses)}</p>
          <p className="text-sm mt-1">
            <span className={theme === 'mati' ? 'text-red-400' : 'text-blue-600'}>
              {monthlySalary > 0 ? ((necessaryExpenses / monthlySalary) * 100).toFixed(1) : '0'}% 
            </span> 
            <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
              of monthly salary
            </span>
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'mati' 
            ? 'bg-amber-900/20' 
            : 'bg-orange-50'
        }`}>
          <h3 className={`text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-amber-300' : 'text-orange-700'
          }`}>Unnecessary Expenses</h3>
          <p className={`text-xl font-bold ${
            theme === 'mati' ? 'text-white' : 'text-slate-900'
          }`}>{formatCurrency(unnecessaryExpenses)}</p>
          <p className="text-sm mt-1">
            <span className={theme === 'mati' ? 'text-amber-400' : 'text-orange-600'}>
              {monthlySalary > 0 ? ((unnecessaryExpenses / monthlySalary) * 100).toFixed(1) : '0'}% 
            </span> 
            <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
              of monthly salary
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;