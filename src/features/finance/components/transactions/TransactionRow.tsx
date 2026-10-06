/**
 * @file TransactionRow.tsx
 * @description Single transaction row displaying merchant, category, amount, tags, receipt preview, and actions.
 * @module Features/Finance/Components/Transactions
 */

import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Star,
  Receipt,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
} from 'lucide-react';
import { Transaction, Account } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';

interface TransactionRowProps {
  transaction: Transaction;
  accounts: Account[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPreviewReceipt?: (url: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  accounts,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDuplicate,
  onPreviewReceipt,
}) => {
  const account = accounts.find((a) => a.id === transaction.accountId);
  const targetAccount = accounts.find((a) => a.id === transaction.targetAccountId);

  const getTypeIcon = (type: Transaction['type']) => {
    if (type === 'income') return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (type === 'expense') return <ArrowDownRight className="w-4 h-4 text-rose-400" />;
    return <ArrowLeftRight className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl gap-3 transition-all group">
      {/* Icon + Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="p-2.5 bg-slate-800 border border-slate-700/50 rounded-xl flex-shrink-0">
          {getTypeIcon(transaction.type)}
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-100 truncate">{transaction.merchant}</span>
            <button
              onClick={() => onToggleFavorite(transaction.id)}
              className={`p-0.5 rounded transition-colors ${
                transaction.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
            {transaction.receiptUrl && (
              <button
                onClick={() => onPreviewReceipt?.(transaction.receiptUrl!)}
                title="View Receipt"
                className="text-indigo-400 hover:text-indigo-300"
              >
                <Receipt className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>{transaction.category}</span>
            <span>•</span>
            <span className="text-slate-300">{account?.name || 'Account'}</span>
            {targetAccount && <span>→ {targetAccount.name}</span>}
            <span>•</span>
            <span>{transaction.date}</span>
          </div>

          {transaction.tags.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {transaction.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/50 text-[10px] font-medium rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
        <div className="text-right">
          <div
            className={`font-bold text-sm sm:text-base ${
              transaction.type === 'income'
                ? 'text-emerald-400'
                : transaction.type === 'expense'
                ? 'text-slate-100'
                : 'text-indigo-300'
            }`}
          >
            {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
            {formatCurrency(transaction.amount)}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            {transaction.paymentMethod}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDuplicate(transaction.id)}
            title="Duplicate"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            title="Edit"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            title="Delete"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
