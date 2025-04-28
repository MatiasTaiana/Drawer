import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { DollarRate } from '../../types';
import { AlertCircle } from 'lucide-react';

const ExpenseForm: React.FC = () => {
  const { addExpense } = useAppContext();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isNecessary, setIsNecessary] = useState(true);
  const [dollarRate, setDollarRate] = useState('');
  const [apiRate, setApiRate] = useState<DollarRate | null>(null);
  const [error, setError] = useState('');
  const [rateWarning, setRateWarning] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDollarRate = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (!response.ok) throw new Error('Failed to fetch exchange rate');
        const data: DollarRate = await response.json();
        setApiRate(data);
        setDollarRate(data.venta.toString());
        localStorage.setItem('lastKnownRate', JSON.stringify(data));
      } catch (err) {
        const cachedRate = localStorage.getItem('lastKnownRate');
        if (cachedRate) {
          const parsedRate = JSON.parse(cachedRate);
          setApiRate(parsedRate);
          setDollarRate(parsedRate.venta.toString());
          setRateWarning('Using cached exchange rate. The rate might not be current.');
        } else {
          setError('Failed to fetch exchange rate. Please enter manually.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDollarRate();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !dollarRate) {
      setError('Please fill out all fields');
      return;
    }

    const amountNumber = parseFloat(amount);
    const dollarRateNumber = parseFloat(dollarRate);
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    if (isNaN(dollarRateNumber) || dollarRateNumber <= 0) {
      setError('Dollar rate must be a positive number');
      return;
    }

    addExpense({
      name,
      amount: amountNumber,
      isNecessary,
      dollarRate: dollarRateNumber,
    });

    setName('');
    setAmount('');
    setIsNecessary(true);
    setDollarRate(apiRate ? apiRate.venta.toString() : '');
    setError('');
    setRateWarning('');
  };

  return (
    <div className={`rounded-lg shadow-md p-6 mb-6 ${
      theme === 'mati' 
        ? 'bg-zinc-900 text-white' 
        : 'bg-white text-slate-800'
    }`}>
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
      
      {error && (
        <div className={`p-3 rounded-md mb-4 ${
          theme === 'mati' 
            ? 'bg-red-900/20 text-red-400' 
            : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {rateWarning && (
        <div className={`p-3 rounded-md mb-4 flex items-center gap-2 ${
          theme === 'mati' 
            ? 'bg-amber-900/20 text-amber-400' 
            : 'bg-amber-50 text-amber-600'
        }`}>
          <AlertCircle size={16} />
          {rateWarning}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Expense Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              theme === 'mati'
                ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
            }`}
            placeholder="Rent, Groceries, etc."
          />
        </div>
        
        <div>
          <label htmlFor="amount" className={`block text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Amount (ARS)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              theme === 'mati'
                ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
            }`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="dollarRate" className={`block text-sm font-medium mb-1 ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Current Dollar Rate (ARS to USD)
          </label>
          <div className="relative">
            <input
              type="number"
              id="dollarRate"
              value={dollarRate}
              onChange={(e) => {
                setDollarRate(e.target.value);
                if (apiRate && parseFloat(e.target.value) !== apiRate.venta) {
                  setRateWarning('Using custom rate instead of current market rate.');
                } else {
                  setRateWarning('');
                }
              }}
              className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                theme === 'mati'
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:ring-red-500'
                  : 'bg-white border-gray-300 text-slate-900 focus:ring-purple-500'
              } ${loading ? 'opacity-50' : ''}`}
              placeholder={loading ? 'Loading rate...' : 'Current exchange rate'}
              min="0"
              step="0.01"
              disabled={loading}
            />
            {apiRate && (
              <div className={`mt-1 text-xs ${
                theme === 'mati' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Current market rate: {apiRate.venta.toFixed(2)} ARS
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isNecessary"
            checked={isNecessary}
            onChange={(e) => setIsNecessary(e.target.checked)}
            className={`h-4 w-4 rounded focus:ring-offset-2 ${
              theme === 'mati'
                ? 'text-red-600 border-zinc-600 focus:ring-red-500'
                : 'text-purple-600 border-gray-300 focus:ring-purple-500'
            }`}
          />
          <label htmlFor="isNecessary" className={`ml-2 block text-sm ${
            theme === 'mati' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Is this a necessary expense?
          </label>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === 'mati'
              ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
              : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
          }`}
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;