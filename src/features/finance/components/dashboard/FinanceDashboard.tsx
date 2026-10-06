/**
 * @file FinanceDashboard.tsx
 * @description Primary master view for the Finance & Wealth Management Module.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Plus, ArrowRightLeft, Wallet, MoreHorizontal, TrendingUp } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import { useFinanceStore } from '../../stores/useFinanceStore';
import { formatCurrency } from '../../utils/financeUtils';
import { NetWorthCard } from './NetWorthCard';
import { CashFlowSummaryCard } from './CashFlowSummaryCard';
import { UpcomingBillsWidget } from './UpcomingBillsWidget';
import { BudgetOverviewWidget } from './BudgetOverviewWidget';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';

// Custom compact widgets for the new layout
import { SpendingBreakdownWidget } from './SpendingBreakdownWidget';
import { SavingsGoalsWidget } from './SavingsGoalsWidget';
import { AccountsListWidget } from './AccountsListWidget';

export const FinanceDashboard: React.FC = () => {
  const {
    accounts,
    netWorthSummary,
    monthlyCashFlow,
    healthScore,
    bills,
    transactions,
    budgets,
    savingsGoals,
    insights,
    openModal,
    setActiveTab,
    markBillAsPaid,
  } = useFinance();

  const clearLedger = useFinanceStore((state) => state.clearLedger);
  const loadSeedData = useFinanceStore((state) => state.loadSeedData);

  // Detect whether current data is simulated demo data
  const isDemoData = accounts.some(
    (a) => a.id.startsWith('acc_chk_') || a.id.startsWith('acc_sav_') || a.id.startsWith('acc_inv_')
  );

  // Use the primary account's currency or fallback to USD
  const baseCurrency = accounts.length > 0 ? accounts[0].currency : 'USD';

  if (accounts.length === 0 && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center gap-4 h-[60vh] max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
          <Wallet className="w-8 h-8 text-[var(--color-text-secondary)]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight mb-1.5">Personal Finance Ledger</h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
            Connect your accounts or add your first transaction to begin tracking net worth, cash flow, and budgets.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={() => openModal('account')}
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Add First Account
          </button>
          <button
            onClick={() => openModal('transaction')}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-medium transition-colors cursor-pointer"
          >
            Record Transaction
          </button>
          <button
            onClick={() => loadSeedData()}
            className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            Preview Demo Ledger
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* DEMO SANDBOX BANNER */}
      {isDemoData && (
        <div className="p-3 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 border border-neutral-700 font-semibold tracking-wider">
              DEMO PREVIEW
            </span>
            <span className="text-[var(--color-text-secondary)]">
              Displaying simulated sandbox ledger. Start your clean personal ledger anytime.
            </span>
          </div>
          <button
            onClick={() => clearLedger()}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-neutral-800 text-white text-xs font-medium border border-[var(--color-border)] transition-colors cursor-pointer shrink-0"
          >
            Start Clean Ledger
          </button>
        </div>
      )}
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FINANCE</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">Understand your money at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal('transaction')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs font-bold transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Transfer</span>
          </button>
          <button 
            onClick={() => openModal('account')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs font-bold transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Accounts</span>
          </button>
          <button 
            onClick={() => openModal('transaction')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 2. AURA MONEY INSIGHT (If insights exist) */}
      {insights.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-accent)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Aura Money Insight</div>
              <div className="text-sm font-medium text-white">{insights[0].message}</div>
            </div>
          </div>
          {insights[0].actionableText && (
            <button onClick={() => setActiveTab((insights[0].actionTab as any) || 'reports')} className="text-xs font-bold text-[var(--color-accent)] shrink-0">
              {insights[0].actionableText} &rarr;
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Primary Hierarchy */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* 3. TOTAL NET WORTH (Overview) */}
          <NetWorthCard
            totalNetWorth={netWorthSummary.totalNetWorth}
            totalAssets={netWorthSummary.totalAssets}
            totalLiabilities={netWorthSummary.totalLiabilities}
            currency={baseCurrency}
            healthScore={healthScore.score}
            onOpenAccountModal={() => openModal('account')}
          />

          {/* 4. CASH FLOW */}
          <CashFlowSummaryCard
            income={monthlyCashFlow.income}
            expense={monthlyCashFlow.expense}
            netSavings={monthlyCashFlow.netSavings}
            currency={baseCurrency}
          />

          {/* 5. SPENDING BREAKDOWN */}
          <SpendingBreakdownWidget transactions={transactions} currency={baseCurrency} />

          {/* 8. TRANSACTIONS */}
          <RecentTransactionsWidget
            transactions={transactions}
            onOpenTransactionModal={() => openModal('transaction')}
            onNavigateTransactionsTab={() => setActiveTab('transactions')}
          />
        </div>

        {/* RIGHT COLUMN: Planning & Organization */}
        <div className="flex flex-col gap-8">
          
          {/* 6. UPCOMING BILLS */}
          <UpcomingBillsWidget
            bills={bills}
            onMarkAsPaid={markBillAsPaid}
            onNavigateBillsTab={() => setActiveTab('bills')}
          />

          {/* 7. BUDGETS */}
          <BudgetOverviewWidget
            budgets={budgets}
            transactions={transactions}
            onOpenBudgetModal={() => openModal('budget')}
            onNavigateBudgetsTab={() => setActiveTab('budgets')}
            currency={baseCurrency}
          />

          {/* 9. SAVINGS GOALS */}
          <SavingsGoalsWidget goals={savingsGoals} currency={baseCurrency} />

          {/* 10. ACCOUNTS */}
          <AccountsListWidget accounts={accounts} onOpenAccount={() => openModal('account')} />

        </div>
      </div>
    </div>
  );
};
