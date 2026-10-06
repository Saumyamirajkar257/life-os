/**
 * @file useFinance.ts
 * @description Primary custom React hook for accessing finance state, actions, and calculations.
 * @module Features/Finance/Hooks
 */

import { useEffect } from 'react';
import { useFinanceStore } from '../stores/useFinanceStore';
import { useFinanceUIStore } from '../stores/useFinanceUIStore';
import { useFinanceCalculations } from './useFinanceCalculations';
import { generateInsights } from '../utils/financeUtils';

export function useFinance() {
  const {
    accounts,
    transactions,
    budgets,
    bills,
    savingsGoals,
    isLoading,
    error,
    loadModuleData,
    createAccount,
    updateAccount,
    deleteAccount,
    toggleHideAccount,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    toggleFavoriteTransaction,
    duplicateTransaction,
    createBudget,
    updateBudget,
    deleteBudget,
    createBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToSavingsGoal,
  } = useFinanceStore();

  const {
    activeTab,
    activeModal,
    editingTransaction,
    editingAccount,
    editingBudget,
    editingBill,
    editingSavingsGoal,
    openModal,
    closeModal,
    setActiveTab,
  } = useFinanceUIStore();
  const calculations = useFinanceCalculations();

  useEffect(() => {
    loadModuleData('default_user');
  }, [loadModuleData]);

  const insights = generateInsights(accounts, transactions, budgets, bills, savingsGoals);

  return {
    accounts,
    transactions,
    budgets,
    bills,
    savingsGoals,
    isLoading,
    error,
    activeTab,
    activeModal,
    editingTransaction,
    editingAccount,
    editingBudget,
    editingBill,
    editingSavingsGoal,
    setActiveTab,
    openModal,
    closeModal,
    insights,
    ...calculations,
    // Actions
    createAccount,
    updateAccount,
    deleteAccount,
    toggleHideAccount,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    toggleFavoriteTransaction,
    duplicateTransaction,
    createBudget,
    updateBudget,
    deleteBudget,
    createBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToSavingsGoal,
  };
}
