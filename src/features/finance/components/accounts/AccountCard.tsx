/**
 * @file AccountCard.tsx
 * @description Card rendering an individual account with institution icon, balance, and quick actions.
 * @module Features/Finance/Components/Accounts
 */

import React from 'react';
import { Wallet, Building2, CreditCard, PiggyBank, TrendingUp, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { Account } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';
import { ACCOUNT_TYPE_CONFIG } from '../../constants/financeConstants';

interface AccountCardProps {
  account: Account;
  onEdit: (acc: Account) => void;
  onDelete: (id: string) => void;
  onToggleHide: (id: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onToggleHide,
}) => {
  const meta = ACCOUNT_TYPE_CONFIG[account.type] || ACCOUNT_TYPE_CONFIG.bank;

  const getAccountIcon = (type: Account['type']) => {
    if (type === 'credit_card') return <CreditCard className="w-5 h-5 text-rose-400" />;
    if (type === 'savings') return <PiggyBank className="w-5 h-5 text-purple-400" />;
    if (type === 'investment') return <TrendingUp className="w-5 h-5 text-indigo-400" />;
    if (type === 'cash') return <Wallet className="w-5 h-5 text-emerald-400" />;
    return <Building2 className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div
      className={`p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4 transition-all relative group ${
        account.isHidden ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 rounded-xl">{getAccountIcon(account.type)}</div>
          <div>
            <h4 className="font-bold text-sm text-white">{account.name}</h4>
            <span className="text-[11px] text-slate-400">
              {account.institution || meta.label}{' '}
              {account.accountNumberLast4 && `(••• ${account.accountNumberLast4})`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleHide(account.id)}
            title={account.isHidden ? 'Unhide' : 'Hide'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {account.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onEdit(account)}
            title="Edit"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(account.id)}
            title="Delete"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Balance</span>
          <div
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              account.type === 'credit_card' ? 'text-rose-300' : 'text-slate-100'
            }`}
          >
            {formatCurrency(account.balance)}
          </div>
        </div>

        {account.creditLimit && (
          <div className="text-right text-[11px] text-slate-400">
            <span>Limit: {formatCurrency(account.creditLimit)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
