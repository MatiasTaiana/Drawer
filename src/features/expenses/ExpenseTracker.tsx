import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

const ExpenseTracker: React.FC = () => {
  const { theme } = useTheme();
  const { closeMonth, monthSummaries, expenses } = useAppContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summary, setShowSummary] = useState<{ success: boolean; data?: any }>({ success: false });
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [monthToClose, setMonthToClose] = useState(() => new Date().toISOString().slice(0, 7));

  const handleCloseMonth = async () => {
    setProcessing(true);
    try {
      const result = await closeMonth(monthToClose);
      setShowSummary({ success: true, data: result });
    } catch (error) {
      setShowSummary({ success: false });
    }
    setProcessing(false);
    setShowConfirmDialog(false);
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getAvailableMonths = () => {
    const currentYear = new Date().getFullYear();
    const months = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month);
      const monthStr = date.toISOString().slice(0, 7);
      const expenseCount = expenses.filter(e => e.date.startsWith(monthStr)).length;
      months.push({ value: monthStr, label: formatMonthYear(monthStr), count: expenseCount });
    }
    return months;
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'mati' ? 'text-white' : 'text-slate-900'}`}>
          Expense Tracker
        </h1>
        <button
          onClick={() => setShowConfirmDialog(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === 'mati'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Close Month
        </button>
      </div>

      <ExpenseSummary />
      <ExpenseForm />
      <ExpenseList selectedMonth={new Date().toISOString().slice(0, 7)} />

      {monthSummaries.length > 0 && (
        <div className={`rounded-lg shadow-md p-6 mt-6 ${
          theme === 'mati'
            ? 'bg-zinc-900 text-white'
            : 'bg-white text-slate-800'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Monthly Summaries</h2>
          <div className="space-y-3">
            {monthSummaries.map((summary) => (
              <button
                key={summary.id}
                onClick={() => setSelectedSummary(summary.id)}
                className={`w-full p-4 rounded-lg transition-colors ${
                  theme === 'mati'
                    ? 'bg-zinc-800 hover:bg-zinc-700'
                    : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{formatMonthYear(summary.month)}</span>
                  <span className={
                    summary.netSavings < 0
                      ? theme === 'mati' ? 'text-red-400' : 'text-red-600'
                      : theme === 'mati' ? 'text-green-400' : 'text-green-600'
                  }>{formatCurrency(summary.netSavings)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
            theme === 'mati'
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-slate-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className={theme === 'mati' ? 'text-red-500' : 'text-purple-500'} />
                <h2 className="text-xl font-semibold">Close Month</h2>
              </div>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className={theme === 'mati' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Select Month to Close
              </label>
              <div className="relative">
                <select
                  value={monthToClose}
                  onChange={(e) => setMonthToClose(e.target.value)}
                  className={`w-full appearance-none px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === 'mati'
                      ? 'bg-zinc-800 text-white focus:ring-red-500'
                      : 'bg-purple-50 text-slate-900 focus:ring-purple-500'
                  }`}
                >
                  {getAvailableMonths().map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label} {month.count > 0 ? `(${month.count})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  theme === 'mati' ? 'text-gray-400' : 'text-gray-500'
                }`} size={16} />
              </div>
            </div>
            
            <p className={theme === 'mati' ? 'text-gray-300 mb-4' : 'text-gray-600 mb-4'}>
              This action will archive all expenses for {formatMonthYear(monthToClose)} and create a summary report.
              This cannot be undone. Are you sure you want to continue?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'mati'
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleCloseMonth}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'mati'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Close Month'}
              </button>
            </div>
          </div>
        </div>
      )}

      {(summary.data || selectedSummary) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
            theme === 'mati'
              ? 'bg-zinc-900 text-white'
              : 'bg-white text-slate-800'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={theme === 'mati' ? 'text-green-400' : 'text-green-600'} />
                <h2 className="text-xl font-semibold">
                  {selectedSummary ? 'Monthly Summary' : 'Month Closed Successfully'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowSummary({ success: false });
                  setSelectedSummary(null);
                }}
                className={theme === 'mati' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className={`text-sm font-medium mb-1 ${
                  theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
                }`}>Monthly Summary</h3>
                <div className={`p-4 rounded-lg ${
                  theme === 'mati' ? 'bg-zinc-800' : 'bg-purple-50'
                }`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Total Income</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.totalIncome || 0
                            : summary.data.totalIncome
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Total Expenses</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.totalExpenses || 0
                            : summary.data.totalExpenses
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Net Savings</p>
                      <p className={`text-lg font-semibold ${
                        (selectedSummary
                          ? monthSummaries.find(s => s.id === selectedSummary)?.netSavings
                          : summary.data.netSavings) < 0
                          ? theme === 'mati' ? 'text-red-400' : 'text-red-600'
                          : theme === 'mati' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.netSavings || 0
                            : summary.data.netSavings
                        )}
                      </p>
                    </div>
                    <div>
                      <p className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Total in USD</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.totalInUSD || 0
                            : summary.data.totalInUSD,
                          'USD'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-medium mb-1 ${
                  theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
                }`}>Expense Breakdown</h3>
                <div className={`p-4 rounded-lg ${
                  theme === 'mati' ? 'bg-zinc-800' : 'bg-purple-50'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Necessary Expenses</span>
                      <span>
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.necessaryExpenses || 0
                            : summary.data.necessaryExpenses
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'mati' ? 'text-gray-400' : 'text-gray-600'}>Unnecessary Expenses</span>
                      <span>
                        {formatCurrency(
                          selectedSummary
                            ? monthSummaries.find(s => s.id === selectedSummary)?.unnecessaryExpenses || 0
                            : summary.data.unnecessaryExpenses
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSummary({ success: false });
                setSelectedSummary(null);
              }}
              className={`w-full mt-6 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'mati'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;