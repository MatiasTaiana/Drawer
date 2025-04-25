export interface Expense {
  id: string;
  name: string;
  amount: number; // in ARS (Argentine Peso)
  isNecessary: boolean;
  dollarRate: number;
  date: string;
  archived?: boolean;
  monthClosed?: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UtilityConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

export interface DollarRate {
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface MonthSummary {
  id: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  necessaryExpenses: number;
  unnecessaryExpenses: number;
  totalInUSD: number;
  closedAt: string;
}