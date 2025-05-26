
import type { User as FirebaseUser } from 'firebase/auth';

export interface Transaction {
  id: string; // Firestore document ID
  userId?: string; // To associate with Firebase User UID
  date: string; // ISO string
  description: string;
  amount: number;
  category: string; // e.g., "Food", "Transport", "Entertainment"
  type: 'income' | 'expense';
}

export interface Budget {
  id: string; // Firestore document ID
  userId?: string;
  category: string;
  limit: number;
  spent: number; // This might be calculated on the fly or stored and updated
  period: 'weekly' | 'monthly' | 'yearly';
  startDate?: string; // ISO string, for tracking specific periods
  endDate?: string; // ISO string
}

export interface FinancialGoal {
  id: string; // Firestore document ID
  userId?: string;
  description: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string | null; // ISO string or null if not set
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

// Re-export Firebase User type for convenience if needed elsewhere
export type User = FirebaseUser;
