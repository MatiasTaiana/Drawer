import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Todo, MonthSummary } from '../types';
import { toast } from 'sonner';

interface AppContextType {
  currentUtility: string;
  setCurrentUtility: (id: string) => void;
  monthlySalary: number;
  setMonthlySalary: (salary: number) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'date'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  closeMonth: () => Promise<MonthSummary>;
  monthSummaries: MonthSummary[];
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUtility, setCurrentUtility] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState(() => {
    const saved = localStorage.getItem('monthlySalary');
    return saved ? parseFloat(saved) : 0;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [monthSummaries, setMonthSummaries] = useState<MonthSummary[]>(() => {
    const saved = localStorage.getItem('monthSummaries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('monthlySalary', monthlySalary.toString());
  }, [monthlySalary]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('monthSummaries', JSON.stringify(monthSummaries));
  }, [monthSummaries]);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    toast.success('Expense added successfully');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast.success('Expense deleted successfully');
  };

  const addTodo = (todo: Omit<Todo, 'id' | 'date'>) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
    toast.success('Task added successfully');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    toast.success('Task status updated');
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success('Task deleted successfully');
  };

  const closeMonth = async (selectedMonth?: string): Promise<MonthSummary> => {
    const monthToClose = selectedMonth || new Date().toISOString().slice(0, 7);
    
    // Calculate monthly totals for the selected month
    const monthExpenses = expenses.filter(
      expense => expense.date.startsWith(monthToClose)
    );
    
    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const necessaryExpenses = monthExpenses
      .filter(expense => expense.isNecessary)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const unnecessaryExpenses = monthExpenses
      .filter(expense => !expense.isNecessary)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalInUSD = monthExpenses.reduce((sum, expense) => 
      sum + (expense.amount / expense.dollarRate), 0);

    // Create monthly summary
    const summary: MonthSummary = {
      id: crypto.randomUUID(),
      month: monthToClose,
      totalIncome: monthlySalary,
      totalExpenses,
      netSavings: monthlySalary - totalExpenses,
      necessaryExpenses,
      unnecessaryExpenses,
      totalInUSD,
      closedAt: new Date().toISOString(),
    };

    // Remove the expenses for the closed month
    setExpenses(prev => prev.filter(expense => !expense.date.startsWith(monthToClose)));

    // Save summary
    setMonthSummaries(prev => [...prev, summary]);
    toast.success(`Month ${monthToClose} closed successfully`);

    return summary;
  };

  return (
    <AppContext.Provider
      value={{
        currentUtility,
        setCurrentUtility,
        monthlySalary,
        setMonthlySalary,
        expenses,
        addExpense,
        deleteExpense,
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        isSidebarOpen,
        setIsSidebarOpen,
        closeMonth,
        monthSummaries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};