import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { DollarRate } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { ArrowUpRight, CheckCircle2, Clock4, RefreshCw } from 'lucide-react';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const { monthlySalary, expenses, todos, setCurrentUtility } = useAppContext();
  const [dollarRate, setDollarRate] = useState<DollarRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDollarRate = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
      if (!response.ok) throw new Error('Failed to fetch exchange rate');
      const data = await response.json();
      setDollarRate(data);
      setError(null);
    } catch (err) {
      setError('Could not load exchange rate data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDollarRate();
    const interval = setInterval(fetchDollarRate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = monthlySalary - totalExpenses;
  const spendingPercentage = (totalExpenses / monthlySalary) * 100;

  const priorityTodos = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Exchange Rate Section */}
      <div className={`rounded-lg shadow-md p-6 mb-6 ${
        theme === 'mati' 
          ? 'bg-zinc-900 text-white' 
          : 'bg-white text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">USD/ARS Exchange Rate</h2>
              <button
                onClick={fetchDollarRate}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'mati'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } ${refreshing ? 'opacity-50' : ''}`}
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
            {loading ? (
              <div className={`h-8 w-48 rounded animate-pulse ${
                theme === 'mati' ? 'bg-zinc-800' : 'bg-slate-200'
              }`} />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : dollarRate && (
              <div className="flex gap-6">
                <div>
                  <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Buy</p>
                  <p className="text-2xl font-bold">{formatCurrency(dollarRate.compra, 'ARS')}</p>
                </div>
                <div>
                  <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Sell</p>
                  <p className="text-2xl font-bold">{formatCurrency(dollarRate.venta, 'ARS')}</p>
                </div>
              </div>
            )}
          </div>
          {dollarRate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock4 size={16} className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'} />
              <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
                Last updated: {new Date(dollarRate.fechaActualizacion).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview Section */}
      <div className={`rounded-lg shadow-md p-6 mb-6 ${
        theme === 'mati' 
          ? 'bg-zinc-900 text-white' 
          : 'bg-white text-slate-800'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${
            theme === 'mati' ? 'bg-zinc-800' : 'bg-purple-50'
          }`}>
            <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Monthly Budget</p>
            <p className="text-2xl font-bold">{formatCurrency(monthlySalary)}</p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'mati' ? 'bg-red-900/20' : 'bg-blue-50'
          }`}>
            <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'mati' 
              ? remainingBalance < 0 ? 'bg-red-900/30' : 'bg-green-900/20'
              : remainingBalance < 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Remaining Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(remainingBalance)}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
              Spending Progress
            </span>
            <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>
              {spendingPercentage.toFixed(1)}%
            </span>
          </div>
          <div className={`h-2 rounded-full ${
            theme === 'mati' ? 'bg-zinc-800' : 'bg-gray-200'
          }`}>
            <div
              className={`h-full rounded-full transition-all ${
                theme === 'mati'
                  ? spendingPercentage > 90 ? 'bg-red-600' : 'bg-red-500'
                  : spendingPercentage > 90 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Priority Tasks Section */}
      <div className={`rounded-lg shadow-md p-6 ${
        theme === 'mati' 
          ? 'bg-zinc-900 text-white' 
          : 'bg-white text-slate-800'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Priority Tasks</h2>
          <button
            onClick={() => setCurrentUtility('todos')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm transition-colors ${
              theme === 'mati'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            View All <ArrowUpRight size={16} />
          </button>
        </div>
        
        {priorityTodos.length === 0 ? (
          <p className={`text-center py-4 ${
            theme === 'mati' ? 'text-gray-400' : 'text-gray-600'
          }`}>No pending tasks</p>
        ) : (
          <div className="space-y-3">
            {priorityTodos.map(todo => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg flex items-start justify-between ${
                  theme === 'mati' ? 'bg-zinc-800' : 'bg-slate-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-medium">{todo.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'mati'
                        ? todo.priority === 'high'
                          ? 'bg-red-900/30 text-red-300'
                          : todo.priority === 'medium'
                            ? 'bg-amber-900/30 text-amber-300'
                            : 'bg-green-900/30 text-green-300'
                        : todo.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {todo.priority}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    theme === 'mati' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Due: {new Date(todo.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => todo.id}
                  className={`p-2 rounded-full transition-colors ${
                    theme === 'mati'
                      ? 'text-gray-400 hover:text-green-400 hover:bg-zinc-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;