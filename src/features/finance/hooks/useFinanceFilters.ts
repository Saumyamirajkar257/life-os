/**
 * @file useFinanceFilters.ts
 * @description Custom hook for filtering and searching transactions with multi-predicate support.
 * @module Features/Finance/Hooks
 */

import { useMemo } from 'react';
import { Transaction } from '../types/finance.types';
import { useFinanceUIStore } from '../stores/useFinanceUIStore';

export function useFinanceFilters(transactions: Transaction[]) {
  const { filters } = useFinanceUIStore();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Query (merchant, category, notes, tags)
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchMerchant = tx.merchant.toLowerCase().includes(query);
        const matchCategory = tx.category.toLowerCase().includes(query);
        const matchNotes = (tx.notes || '').toLowerCase().includes(query);
        const matchTag = tx.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchMerchant && !matchCategory && !matchNotes && !matchTag) return false;
      }

      // 2. Type Filter
      if (filters.type !== 'all' && tx.type !== filters.type) {
        return false;
      }

      // 3. Category Filter
      if (filters.category !== 'all' && tx.category !== filters.category) {
        return false;
      }

      // 4. Account Filter
      if (filters.accountId !== 'all' && tx.accountId !== filters.accountId && tx.targetAccountId !== filters.accountId) {
        return false;
      }

      // 5. Payment Method Filter
      if (filters.paymentMethod !== 'all' && tx.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // 6. Tag Filter
      if (filters.tag && !tx.tags.includes(filters.tag)) {
        return false;
      }

      // 7. Amount Min/Max Range
      if (filters.minAmount !== undefined && tx.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && tx.amount > filters.maxAmount) {
        return false;
      }

      // 8. Date Range
      if (filters.dateRange === 'this_month') {
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (!tx.date.startsWith(currentMonth)) return false;
      } else if (filters.dateRange === 'last_month') {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        const lastMonth = d.toISOString().slice(0, 7);
        if (!tx.date.startsWith(lastMonth)) return false;
      } else if (filters.dateRange === 'custom') {
        if (filters.startDate && tx.date < filters.startDate) return false;
        if (filters.endDate && tx.date > filters.endDate) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return {
    filteredTransactions,
    activeFiltersCount: Object.values(filters).filter(
      (v) => v !== '' && v !== 'all' && v !== 'this_month' && v !== undefined
    ).length,
  };
}
