/**
 * @file useFinanceCalculations.ts
 * @description React hook that memoizes high-level financial health scores, net worth, and cash flows.
 * @module Features/Finance/Hooks
 */

import { useMemo } from 'react';
import { useFinanceStore } from '../stores/useFinanceStore';
import {
  calculateNetWorth,
  calculateMonthlyIncomeAndExpense,
  calculateFinancialHealthScore,
  calculateCategoryTotals,
  generateCashFlowSeries,
} from '../utils/financeUtils';

export function useFinanceCalculations() {
  const { accounts, transactions, budgets, bills, savingsGoals } = useFinanceStore();

  const netWorthSummary = useMemo(() => calculateNetWorth(accounts), [accounts]);

  const monthlyCashFlow = useMemo(() => calculateMonthlyIncomeAndExpense(transactions), [transactions]);

  const categorySpending = useMemo(() => calculateCategoryTotals(transactions, 'expense'), [transactions]);

  const cashFlowSeries = useMemo(() => generateCashFlowSeries(transactions, 6), [transactions]);

  const healthScore = useMemo(
    () => calculateFinancialHealthScore(accounts, transactions, budgets, bills, savingsGoals),
    [accounts, transactions, budgets, bills, savingsGoals]
  );

  return {
    netWorthSummary,
    monthlyCashFlow,
    categorySpending,
    cashFlowSeries,
    healthScore,
  };
}
