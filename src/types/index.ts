export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  category: string; // e.g., "Food", "Transport", "Entertainment"
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number; // Calculated from transactions
  period: 'weekly' | 'monthly' | 'yearly';
  startDate?: string; // ISO string, for tracking specific periods
  endDate?: string; // ISO string
}

export interface FinancialGoal {
  id: string;
  description: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string; // ISO string
}

export type SpendingData = {
  date: string; // YYYY-MM-DD
  category: string;
  amount: number;
}[];

export type ChartDataPoint = {
  name: string;
  value: number;
  fill?: string;
};
