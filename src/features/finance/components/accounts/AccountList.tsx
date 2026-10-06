/**
 * @file AccountList.tsx
 * @description List view of all user financial accounts categorized by account type.
 * @module Features/Finance/Components/Accounts
 */

import React from 'react';
import { PlusCircle, Wallet } from 'lucide-react';
import { AccountCard } from './AccountCard';
import { useFinance } from '../../hooks/useFinance';

export const AccountList: React.FC = () => {
  const { accounts, deleteAccount, toggleHideAccount, openModal } = useFinance();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Financial Accounts & Vaults</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage checking, high-yield savings, credit cards, and investments.
          </p>
        </div>

        <button
          onClick={() => openModal('account')}
          id="btn-add-account-page"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Wallet className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No financial accounts connected yet.</p>
          <p className="text-xs text-slate-500">
            Click "Add Account" to add your first bank account or wallet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onEdit={(account) => openModal('account', { acc: account })}
              onDelete={deleteAccount}
              onToggleHide={toggleHideAccount}
            />
          ))}
        </div>
      )}
    </div>
  );
};
