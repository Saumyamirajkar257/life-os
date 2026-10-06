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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Module Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-md">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-white">Finance & Wealth OS</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified personal ledger, automated cash flow tracking, and financial health intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('transaction')}
            id="btn-quick-add-tx"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Transaction</span>
          </button>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <nav className="bg-slate-900/60 border-b border-slate-800 px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-finance-${tab.id}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
