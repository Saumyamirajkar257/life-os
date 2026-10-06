/**
 * @file FinanceLayout.tsx
 * @description Master layout wrapper for the Finance Module, housing top bar tabs, viewports, and modals.
 * @module Features/Finance/Layouts
 */

import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  Calendar,
  Target,
  BarChart3,
  Plus,
} from 'lucide-react';
import { useFinanceUIStore, FinanceTab } from '../stores/useFinanceUIStore';
import { FinanceDashboard } from '../components/dashboard/FinanceDashboard';
import { TransactionList } from '../components/transactions/TransactionList';
import { AccountList } from '../components/accounts/AccountList';
import { BudgetList } from '../components/budgets/BudgetList';
import { BillList } from '../components/bills/BillList';
import { SavingsGoalList } from '../components/savings/SavingsGoalList';
import { ReportsView } from '../reports/ReportsView';

import { TransactionModal } from '../components/transactions/TransactionModal';
import { AccountModal } from '../components/accounts/AccountModal';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { BillModal } from '../components/bills/BillModal';
import { SavingsGoalModal } from '../components/savings/SavingsGoalModal';

export const FinanceLayout: React.FC = () => {
  const { activeTab, setActiveTab, openModal } = useFinanceUIStore();

  const tabs: Array<{ id: FinanceTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-4 h-4" /> },
    { id: 'accounts', label: 'Accounts', icon: <Wallet className="w-4 h-4" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-4 h-4" /> },
    { id: 'bills', label: 'Bills', icon: <Calendar className="w-4 h-4" /> },
    { id: 'savings', label: 'Savings Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col font-sans">
      {/* Module Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-white">Finance & Ledger</h1>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Personal net worth, cash flow, upcoming obligations, and budgeting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('transaction')}
            id="btn-quick-add-tx"
            className="px-3.5 py-2 bg-white text-black hover:bg-neutral-200 font-medium text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <nav className="bg-[var(--color-surface)]/50 border-b border-[var(--color-border)] px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-finance-${tab.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Viewport Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && <FinanceDashboard />}
        {activeTab === 'transactions' && <TransactionList />}
        {activeTab === 'accounts' && <AccountList />}
        {activeTab === 'budgets' && <BudgetList />}
        {activeTab === 'bills' && <BillList />}
        {activeTab === 'savings' && <SavingsGoalList />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Global Modals */}
      <TransactionModal />
      <AccountModal />
      <BudgetModal />
      <BillModal />
      <SavingsGoalModal />
    </div>
  );
};
