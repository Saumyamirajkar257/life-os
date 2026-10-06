/**
 * @file useFinanceUIStore.ts
 * @description UI layout, active tab, modal dialogs, and filter states for the Finance module.
 * @module Features/Finance/Stores
 */

import { create } from 'zustand';
import { FinanceFilterOptions, Transaction, Account, Budget, Bill, SavingsGoal } from '../types/finance.types';

export type FinanceTab = 'dashboard' | 'transactions' | 'accounts' | 'budgets' | 'bills' | 'savings' | 'reports';

export type FinanceModalType =
  | 'transaction'
  | 'account'
  | 'budget'
  | 'bill'
  | 'savings_goal'
  | 'transfer'
  | 'receipt_preview'
  | null;

interface FinanceUIState {
  activeTab: FinanceTab;
  activeModal: FinanceModalType;
  editingTransaction: Transaction | null;
  editingAccount: Account | null;
  editingBudget: Budget | null;
  editingBill: Bill | null;
  editingSavingsGoal: SavingsGoal | null;
  previewReceiptUrl: string | null;

  filters: FinanceFilterOptions;
  isFilterDrawerOpen: boolean;

  setActiveTab: (tab: FinanceTab) => void;
  openModal: (
    type: FinanceModalType,
    editingItem?: {
      tx?: Transaction;
      acc?: Account;
      bgt?: Budget;
      bill?: Bill;
      goal?: SavingsGoal;
      receiptUrl?: string;
    }
  ) => void;
  closeModal: () => void;

  setFilter: <K extends keyof FinanceFilterOptions>(key: K, value: FinanceFilterOptions[K]) => void;
  resetFilters: () => void;
  toggleFilterDrawer: () => void;
}

const DEFAULT_FILTERS: FinanceFilterOptions = {
  searchQuery: '',
  type: 'all',
  category: 'all',
  subcategory: '',
  accountId: 'all',
  paymentMethod: 'all',
  dateRange: 'this_month',
  startDate: '',
  endDate: '',
  tag: '',
};

export const useFinanceUIStore = create<FinanceUIState>()((set) => ({
  activeTab: 'dashboard',
  activeModal: null,
  editingTransaction: null,
  editingAccount: null,
  editingBudget: null,
  editingBill: null,
  editingSavingsGoal: null,
  previewReceiptUrl: null,

  filters: DEFAULT_FILTERS,
  isFilterDrawerOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  openModal: (type, editingItem) =>
    set({
      activeModal: type,
      editingTransaction: editingItem?.tx || null,
      editingAccount: editingItem?.acc || null,
      editingBudget: editingItem?.bgt || null,
      editingBill: editingItem?.bill || null,
      editingSavingsGoal: editingItem?.goal || null,
      previewReceiptUrl: editingItem?.receiptUrl || null,
    }),

  closeModal: () =>
    set({
      activeModal: null,
      editingTransaction: null,
      editingAccount: null,
      editingBudget: null,
      editingBill: null,
      editingSavingsGoal: null,
      previewReceiptUrl: null,
    }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  toggleFilterDrawer: () => set((state) => ({ isFilterDrawerOpen: !state.isFilterDrawerOpen })),
}));
