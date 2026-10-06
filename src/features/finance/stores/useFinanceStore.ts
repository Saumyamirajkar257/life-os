/**
 * @file useFinanceStore.ts
 * @description Primary Zustand store for financial state (accounts, transactions, budgets, bills, savings goals).
 * @module Features/Finance/Stores
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Account, Transaction, Budget, Bill, SavingsGoal } from '../types/finance.types';
import {
  SEED_ACCOUNTS,
  SEED_TRANSACTIONS,
  SEED_BUDGETS,
  SEED_BILLS,
  SEED_SAVINGS_GOALS,
} from '../constants/financeConstants';
import { financeFirestoreService } from '../services/financeFirestore.service';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;

  // Sync / Init
  loadModuleData: (userId?: string) => Promise<void>;

  // --- ACCOUNT ACTIONS ---
  createAccount: (payload: Partial<Account>) => Account;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  toggleHideAccount: (id: string) => void;

  // --- TRANSACTION ACTIONS ---
  createTransaction: (payload: Partial<Transaction>) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleFavoriteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => Transaction | null;

  // --- BUDGET ACTIONS ---
  createBudget: (payload: Partial<Budget>) => Budget;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // --- BILL ACTIONS ---
  createBill: (payload: Partial<Bill>) => Bill;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillAsPaid: (billId: string, createExpenseTx?: boolean) => void;

  // --- SAVINGS GOAL ACTIONS ---
  createSavingsGoal: (payload: Partial<SavingsGoal>) => SavingsGoal;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToSavingsGoal: (goalId: string, amount: number) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      accounts: SEED_ACCOUNTS,
      transactions: SEED_TRANSACTIONS,
      budgets: SEED_BUDGETS,
      bills: SEED_BILLS,
      savingsGoals: SEED_SAVINGS_GOALS,
      isLoading: false,
      error: null,

      loadModuleData: async (userId = 'default_user') => {
        set({ isLoading: true, error: null });
        try {
          const [fetchedAccounts, fetchedTx, fetchedBudgets, fetchedBills, fetchedGoals] =
            await Promise.all([
              financeFirestoreService.fetchAccounts(userId),
              financeFirestoreService.fetchTransactions(userId),
              financeFirestoreService.fetchBudgets(userId),
              financeFirestoreService.fetchBills(userId),
              financeFirestoreService.fetchSavingsGoals(userId),
            ]);

          // Merge or use remote if non-empty
          set({
            accounts: fetchedAccounts.length > 0 ? fetchedAccounts : get().accounts,
            transactions: fetchedTx.length > 0 ? fetchedTx : get().transactions,
            budgets: fetchedBudgets.length > 0 ? fetchedBudgets : get().budgets,
            bills: fetchedBills.length > 0 ? fetchedBills : get().bills,
            savingsGoals: fetchedGoals.length > 0 ? fetchedGoals : get().savingsGoals,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false, error: 'Firestore offline; using cached state.' });
        }
      },

      // --- ACCOUNTS ---
      createAccount: (payload) => {
        const id = `acc_${Date.now()}`;
        const now = new Date().toISOString();
        const newAcc: Account = {
          id,
          userId: payload.userId || 'default_user',
          name: payload.name || 'New Account',
          type: payload.type || 'bank',
          balance: payload.balance ?? 0,
          currency: payload.currency || 'USD',
          accountNumberLast4: payload.accountNumberLast4 || '',
          institution: payload.institution || 'Bank',
          color: payload.color || '#3B82F6',
          icon: payload.icon || 'Building2',
          creditLimit: payload.creditLimit,
          interestRate: payload.interestRate,
          isHidden: false,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ accounts: [newAcc, ...state.accounts] }));
        financeFirestoreService.saveAccount(newAcc);
        return newAcc;
      },

      updateAccount: (id, updates) => {
        const now = new Date().toISOString();
        let updated: Account | undefined;
        set((state) => ({
          accounts: state.accounts.map((a) => {
            if (a.id === id) {
              updated = { ...a, ...updates, updatedAt: now };
              return updated;
            }
            return a;
          }),
        }));
        if (updated) financeFirestoreService.saveAccount(updated);
      },

      deleteAccount: (id) => {
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
        financeFirestoreService.deleteAccount(id);
      },

      toggleHideAccount: (id) => {
        const acc = get().accounts.find((a) => a.id === id);
        if (acc) {
          get().updateAccount(id, { isHidden: !acc.isHidden });
        }
      },

      // --- TRANSACTIONS ---
      createTransaction: (payload) => {
        const id = `tx_${Date.now()}`;
        const now = new Date();
        const dateStr = payload.date || now.toISOString().slice(0, 10);
        const timeStr = payload.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newTx: Transaction = {
          id,
          userId: payload.userId || 'default_user',
          amount: payload.amount ?? 0,
          currency: payload.currency || 'USD',
          type: payload.type || 'expense',
          category: payload.category || 'Miscellaneous',
          subcategory: payload.subcategory || '',
          accountId: payload.accountId || get().accounts[0]?.id || 'acc_chase_main',
          targetAccountId: payload.targetAccountId || undefined,
          date: dateStr,
          time: timeStr,
          merchant: payload.merchant || 'Payee Merchant',
          paymentMethod: payload.paymentMethod || 'Credit Card',
          notes: payload.notes || '',
          tags: payload.tags || [],
          receiptUrl: payload.receiptUrl,
          attachments: payload.attachments || [],
          status: payload.status || 'completed',
          isFavorite: payload.isFavorite || false,
          isRecurring: payload.isRecurring || false,
          recurrenceFrequency: payload.recurrenceFrequency || 'one_time',
          splitDetails: payload.splitDetails || [],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };

        // Update Account Balance(s)
        const accounts = [...get().accounts];
        const primaryAcc = accounts.find((a) => a.id === newTx.accountId);
        if (primaryAcc) {
          if (newTx.type === 'income') primaryAcc.balance += newTx.amount;
          else if (newTx.type === 'expense') primaryAcc.balance -= newTx.amount;
          else if (newTx.type === 'transfer') {
            primaryAcc.balance -= newTx.amount;
            if (newTx.targetAccountId) {
              const targetAcc = accounts.find((a) => a.id === newTx.targetAccountId);
              if (targetAcc) targetAcc.balance += newTx.amount;
            }
          }
          primaryAcc.updatedAt = now.toISOString();
        }

        set({
          transactions: [newTx, ...get().transactions],
          accounts,
        });

        financeFirestoreService.saveTransaction(newTx);
        if (primaryAcc) financeFirestoreService.saveAccount(primaryAcc);
        return newTx;
      },

      updateTransaction: (id, updates) => {
        const now = new Date().toISOString();
        let updated: Transaction | undefined;
        set((state) => ({
          transactions: state.transactions.map((tx) => {
            if (tx.id === id) {
              updated = { ...tx, ...updates, updatedAt: now };
              return updated;
            }
            return tx;
          }),
        }));
        if (updated) financeFirestoreService.saveTransaction(updated);
      },

      deleteTransaction: (id) => {
        const target = get().transactions.find((tx) => tx.id === id);
        if (target) {
          // Revert balance adjustments
          const accounts = [...get().accounts];
          const primaryAcc = accounts.find((a) => a.id === target.accountId);
          if (primaryAcc) {
            if (target.type === 'income') primaryAcc.balance -= target.amount;
            else if (target.type === 'expense') primaryAcc.balance += target.amount;
            else if (target.type === 'transfer') {
              primaryAcc.balance += target.amount;
              if (target.targetAccountId) {
                const targetAcc = accounts.find((a) => a.id === target.targetAccountId);
                if (targetAcc) targetAcc.balance -= target.amount;
              }
            }
            primaryAcc.updatedAt = new Date().toISOString();
            financeFirestoreService.saveAccount(primaryAcc);
          }

          set({
            transactions: get().transactions.filter((tx) => tx.id !== id),
            accounts,
          });
          financeFirestoreService.deleteTransaction(id);
        }
      },

      toggleFavoriteTransaction: (id) => {
        const tx = get().transactions.find((t) => t.id === id);
        if (tx) {
          get().updateTransaction(id, { isFavorite: !tx.isFavorite });
        }
      },

      duplicateTransaction: (id) => {
        const tx = get().transactions.find((t) => t.id === id);
        if (!tx) return null;
        return get().createTransaction({
          ...tx,
          date: new Date().toISOString().slice(0, 10),
          merchant: `${tx.merchant} (Copy)`,
        });
      },

      // --- BUDGETS ---
      createBudget: (payload) => {
        const id = `bgt_${Date.now()}`;
        const now = new Date().toISOString();
        const newBgt: Budget = {
          id,
          userId: payload.userId || 'default_user',
          name: payload.name || 'Category Budget',
          category: payload.category || 'Food & Dining',
          amountLimit: payload.amountLimit ?? 500,
          period: payload.period || 'monthly',
          periodDate: payload.periodDate || now.slice(0, 7),
          alertThresholdPercent: payload.alertThresholdPercent ?? 80,
          color: payload.color || '#3B82F6',
          icon: payload.icon || 'PieChart',
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ budgets: [newBgt, ...state.budgets] }));
        financeFirestoreService.saveBudget(newBgt);
        return newBgt;
      },

      updateBudget: (id, updates) => {
        const now = new Date().toISOString();
        let updated: Budget | undefined;
        set((state) => ({
          budgets: state.budgets.map((b) => {
            if (b.id === id) {
              updated = { ...b, ...updates, updatedAt: now };
              return updated;
            }
            return b;
          }),
        }));
        if (updated) financeFirestoreService.saveBudget(updated);
      },

      deleteBudget: (id) => {
        set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
        financeFirestoreService.deleteBudget(id);
      },

      // --- BILLS ---
      createBill: (payload) => {
        const id = `bill_${Date.now()}`;
        const now = new Date().toISOString();
        const newBill: Bill = {
          id,
          userId: payload.userId || 'default_user',
          title: payload.title || 'Subscription Bill',
          amount: payload.amount ?? 50,
          currency: payload.currency || 'USD',
          category: payload.category || 'Utilities & Bills',
          accountId: payload.accountId || get().accounts[0]?.id || 'acc_chase_main',
          payee: payload.payee || 'Billed Vendor',
          dueDate: payload.dueDate || now.slice(0, 10),
          recurrence: payload.recurrence || 'monthly',
          status: payload.status || 'unpaid',
          autoPay: payload.autoPay || false,
          reminderDays: payload.reminderDays || 3,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ bills: [newBill, ...state.bills] }));
        financeFirestoreService.saveBill(newBill);
        return newBill;
      },

      updateBill: (id, updates) => {
        const now = new Date().toISOString();
        let updated: Bill | undefined;
        set((state) => ({
          bills: state.bills.map((b) => {
            if (b.id === id) {
              updated = { ...b, ...updates, updatedAt: now };
              return updated;
            }
            return b;
          }),
        }));
        if (updated) financeFirestoreService.saveBill(updated);
      },

      deleteBill: (id) => {
        set((state) => ({ bills: state.bills.filter((b) => b.id !== id) }));
        financeFirestoreService.deleteBill(id);
      },

      markBillAsPaid: (billId, createExpenseTx = true) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill) return;

        const today = new Date().toISOString().slice(0, 10);
        get().updateBill(billId, { status: 'paid', lastPaidDate: today });

        if (createExpenseTx) {
          get().createTransaction({
            amount: bill.amount,
            currency: bill.currency,
            type: 'expense',
            category: bill.category,
            merchant: bill.payee,
            accountId: bill.accountId || get().accounts[0]?.id || 'acc_chase_main',
            date: today,
            notes: `Paid recurring bill: ${bill.title}`,
            tags: ['Bill', 'Paid'],
          });
        }
      },

      // --- SAVINGS GOALS ---
      createSavingsGoal: (payload) => {
        const id = `goal_${Date.now()}`;
        const now = new Date().toISOString();
        const newGoal: SavingsGoal = {
          id,
          userId: payload.userId || 'default_user',
          name: payload.name || 'New Savings Goal',
          targetAmount: payload.targetAmount ?? 5000,
          currentAmount: payload.currentAmount ?? 0,
          currency: payload.currency || 'USD',
          category: payload.category || 'Custom Savings',
          targetDate: payload.targetDate || '2027-12-31',
          monthlyContribution: payload.monthlyContribution || 200,
          color: payload.color || '#10B981',
          icon: payload.icon || 'Target',
          accountId: payload.accountId || get().accounts[0]?.id,
          isCompleted: false,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ savingsGoals: [newGoal, ...state.savingsGoals] }));
        financeFirestoreService.saveSavingsGoal(newGoal);
        return newGoal;
      },

      updateSavingsGoal: (id, updates) => {
        const now = new Date().toISOString();
        let updated: SavingsGoal | undefined;
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) => {
            if (g.id === id) {
              const currentAmount = updates.currentAmount !== undefined ? updates.currentAmount : g.currentAmount;
              const targetAmount = updates.targetAmount !== undefined ? updates.targetAmount : g.targetAmount;
              const isCompleted = currentAmount >= targetAmount;

              updated = { ...g, ...updates, currentAmount, isCompleted, updatedAt: now };
              return updated;
            }
            return g;
          }),
        }));
        if (updated) financeFirestoreService.saveSavingsGoal(updated);
      },

      deleteSavingsGoal: (id) => {
        set((state) => ({ savingsGoals: state.savingsGoals.filter((g) => g.id !== id) }));
        financeFirestoreService.deleteSavingsGoal(id);
      },

      contributeToSavingsGoal: (goalId, amount) => {
        const goal = get().savingsGoals.find((g) => g.id === goalId);
        if (goal) {
          const newCurrent = goal.currentAmount + amount;
          get().updateSavingsGoal(goalId, { currentAmount: newCurrent });
        }
      },
    }),
    {
      name: 'aura-finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
