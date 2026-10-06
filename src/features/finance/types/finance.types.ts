/**
 * @file finance.types.ts
 * @description Master TypeScript definitions for Milestone 17 — Finance & Wealth Management Module.
 * @module Features/Finance/Types
 */

export type AccountType =
  | 'cash'
  | 'bank'
  | 'credit_card'
  | 'savings'
  | 'investment'
  | 'digital_wallet'
  | 'crypto'
  | 'custom';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionStatus = 'completed' | 'pending' | 'cleared';

export type RecurrenceFrequency = 'one_time' | 'weekly' | 'monthly' | 'yearly';

export type BillStatus = 'unpaid' | 'paid' | 'overdue';

export interface TransactionSplit {
  category: string;
  subcategory?: string;
  amount: number;
  notes?: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  mimeType?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumberLast4?: string;
  institution?: string;
  color?: string;
  icon?: string;
  creditLimit?: number;
  interestRate?: number;
  isHidden?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  category: string;
  subcategory?: string;
  accountId: string;
  targetAccountId?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  merchant: string;
  paymentMethod: string;
  notes?: string;
  tags: string[];
  receiptUrl?: string;
  attachments?: AttachmentItem[];
  status: TransactionStatus;
  isFavorite?: boolean;
  isRecurring?: boolean;
  recurrenceFrequency?: RecurrenceFrequency;
  splitDetails?: TransactionSplit[];
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  amountLimit: number;
  period: 'monthly' | 'weekly';
  periodDate: string; // YYYY-MM
  alertThresholdPercent: number; // e.g. 80
  color?: string;
  icon?: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  userId: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  accountId?: string;
  payee: string;
  dueDate: string; // YYYY-MM-DD
  recurrence: RecurrenceFrequency;
  status: BillStatus;
  autoPay?: boolean;
  reminderDays?: number;
  lastPaidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  category: string;
  targetDate: string; // YYYY-MM-DD
  monthlyContribution?: number;
  color?: string;
  icon?: string;
  accountId?: string;
  isCompleted?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialHealth {
  score: number; // 0-100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  savingsRatePercent: number;
  debtToIncomePercent: number;
  budgetAdherencePercent: number;
  emergencyFundMonths: number;
  recommendations: string[];
}

export interface FinancialInsight {
  id: string;
  title: string;
  type: 'warning' | 'tip' | 'summary' | 'opportunity';
  message: string;
  category?: string;
  actionableText?: string;
  actionTab?: string;
  createdAt: string;
}

export interface FinanceFilterOptions {
  searchQuery: string;
  type: 'all' | TransactionType;
  category: string;
  subcategory: string;
  accountId: string;
  paymentMethod: string;
  dateRange: 'this_month' | 'last_month' | 'this_quarter' | 'ytd' | 'custom';
  startDate: string;
  endDate: string;
  minAmount?: number;
  maxAmount?: number;
  tag: string;
}

export interface CashFlowPoint {
  dateOrMonth: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategorySpendingSummary {
  category: string;
  totalAmount: number;
  percentage: number;
  color: string;
  icon: string;
  count: number;
}
