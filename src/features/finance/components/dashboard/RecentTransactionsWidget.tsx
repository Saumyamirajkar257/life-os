/**
 * @file RecentTransactionsWidget.tsx
 * @description Mini list of latest transactions with quick options to filter or launch transaction modal.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { ArrowRight, PlusCircle, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';
import { Transaction } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
  onOpenTransactionModal: () => void;
  onNavigateTransactionsTab: () => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({
  transactions,
  onOpenTransactionModal,
  onNavigateTransactionsTab,
}) => {
  const recent = transactions.slice(0, 5);

  const getTypeIcon = (type: Transaction['type']) => {
    if (type === 'income') return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
    if (type === 'expense') return <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />;
    return <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <span>Recent Transactions</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTransactionModal}
            id="btn-add-tx-recent"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Tx</span>
          </button>
          <button
            onClick={onNavigateTransactionsTab}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">No transactions recorded yet.</div>
      ) : (
        <div className="space-y-2">
          {recent.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2.5 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">{getTypeIcon(tx.type)}</div>
                <div>
                  <div className="font-semibold text-slate-100">{tx.merchant}</div>
                  <div className="text-[11px] text-slate-400">
                    {tx.category} • {tx.date}
                  </div>
                </div>
              </div>

              <div
                className={`font-bold ${
                  tx.type === 'income'
                    ? 'text-emerald-400'
                    : tx.type === 'expense'
                    ? 'text-slate-100'
                    : 'text-indigo-300'
                }`}
              >
                {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                {formatCurrency(tx.amount, tx.currency)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
