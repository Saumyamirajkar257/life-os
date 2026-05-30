export interface Transaction {
  id: string;
  name: string;
  amount: number; // positive for income, negative for expense
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface SavingsGoal {
  id: string;
  name: string;
  saved: number;
  target: number;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}
