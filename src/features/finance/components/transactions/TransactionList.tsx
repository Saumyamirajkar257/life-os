/**
 * @file TransactionList.tsx
 * @description Master list table/view for searching, filtering, and performing CRUD on transactions.
 * @module Features/Finance/Components/Transactions
 */

import React from 'react';
import { TransactionFilterToolbar } from './TransactionFilterToolbar';
import { TransactionRow } from './TransactionRow';
import { useFinance } from '../../hooks/useFinance';
import { useFinanceFilters } from '../../hooks/useFinanceFilters';

export const TransactionList: React.FC = () => {
  const {
    transactions,
    accounts,
    deleteTransaction,
    toggleFavoriteTransaction,
    duplicateTransaction,
    openModal,
  } = useFinance();

  const { filteredTransactions, activeFiltersCount } = useFinanceFilters(transactions);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Transactions & Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredTransactions.length} of {transactions.length} records.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilterToolbar
        accounts={accounts}
        onOpenTransactionModal={() => openModal('transaction')}
      />

      {/* Rows Container */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-slate-300">No transactions match your criteria.</p>
          <p className="text-xs text-slate-500">
            Try resetting your filters or creating a new transaction.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              accounts={accounts}
              onEdit={(t) => openModal('transaction', { tx: t })}
              onDelete={deleteTransaction}
              onToggleFavorite={toggleFavoriteTransaction}
              onDuplicate={duplicateTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};
