/**
 * @file AccountsListWidget.tsx
 * @description Compact widget showing accounts and their balances.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';
import { Account } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';
import { getFinanceIcon } from '../../utils/financeIcons';

interface AccountsListWidgetProps {
  accounts: Account[];
  onOpenAccount: () => void;
}

export const AccountsListWidget: React.FC<AccountsListWidgetProps> = ({ accounts, onOpenAccount }) => {
  if (accounts.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Accounts</h3>
      </div>

      <div className="flex flex-col gap-3">
        {accounts.slice(0, 5).map((acc) => {
          const IconComp = getFinanceIcon(acc.icon, Wallet);
          return (
            <div key={acc.id} className="flex items-center justify-between group cursor-pointer" onClick={onOpenAccount}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${acc.color || '#3B82F6'}20` }}>
                  <IconComp className="w-4 h-4" style={{ color: acc.color || '#3B82F6' }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">{acc.name}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] capitalize">{acc.type.replace('_', ' ')} {acc.institution ? `• ${acc.institution}` : ''}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {formatCurrency(acc.balance, acc.currency)}
                <ChevronRight className="w-3 h-3 text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
