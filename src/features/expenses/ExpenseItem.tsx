import React, { useState } from 'react';
import { Expense } from '../../types';
import { formatCurrency, convertARStoUSD } from '../../utils/currency';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteExpense } = useAppContext();
  const { theme } = useTheme();
  
  const formattedDate = new Date(expense.date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dollarAmount = convertARStoUSD(expense.amount, expense.dollarRate);
  
  return (
    <div className={`rounded-lg shadow-sm overflow-hidden mb-3 transition-all duration-200 hover:shadow-md ${
      theme === 'mati'
        ? 'bg-zinc-800 border-zinc-700'
        : 'bg-white border border-gray-100'
    }`}>
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            expense.isNecessary 
              ? theme === 'mati' ? 'bg-red-500' : 'bg-blue-500'
              : theme === 'mati' ? 'bg-amber-500' : 'bg-orange-500'
          }`} />
          <span className={`font-medium ${
            theme === 'mati' ? 'text-white' : 'text-slate-800'
          }`}>{expense.name}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${
            theme === 'mati' ? 'text-white' : 'text-slate-800'
          }`}>
            {formatCurrency(expense.amount)}
          </span>
          {expanded ? (
            <ChevronUp size={18} className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className={`px-4 py-3 border-t animate-fadeIn ${
          theme === 'mati'
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-slate-50 border-gray-100'
        }`}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className={theme === 'mati' ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>Added on</p>
              <p className={theme === 'mati' ? 'text-white' : 'text-slate-800'}>{formattedDate}</p>
            </div>
            <div>
              <p className={theme === 'mati' ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>Category</p>
              <p className={theme === 'mati' ? 'text-white' : 'text-slate-800'}>
                {expense.isNecessary ? 'Necessary' : 'Unnecessary'}
              </p>
            </div>
            <div>
              <p className={theme === 'mati' ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>Dollar Rate</p>
              <p className={theme === 'mati' ? 'text-white' : 'text-slate-800'}>
                {formatCurrency(expense.dollarRate, 'ARS', 2)}
              </p>
            </div>
            <div>
              <p className={theme === 'mati' ? 'text-sm text-gray-400' : 'text-sm text-gray-500'}>Amount in USD</p>
              <p className={theme === 'mati' ? 'text-white' : 'text-slate-800'}>
                {formatCurrency(dollarAmount, 'USD')}
              </p>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteExpense(expense.id);
            }}
            className={`flex items-center text-sm transition-colors ${
              theme === 'mati'
                ? 'text-red-400 hover:text-red-300'
                : 'text-red-600 hover:text-red-700'
            }`}
          >
            <Trash2 size={14} className="mr-1" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseItem;