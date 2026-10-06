/**
 * @file TransactionFilterToolbar.tsx
 * @description Real-time search, category dropdown, type pills, date ranges, and filter drawer toggle.
 * @module Features/Finance/Components/Transactions
 */

import React from 'react';
import { Search, Filter, RefreshCw, X, PlusCircle } from 'lucide-react';
import { useFinanceUIStore } from '../../stores/useFinanceUIStore';
import { TRANSACTION_CATEGORIES } from '../../constants/financeConstants';
import { Account } from '../../types/finance.types';

interface TransactionFilterToolbarProps {
  accounts: Account[];
  onOpenTransactionModal: () => void;
}

export const TransactionFilterToolbar: React.FC<TransactionFilterToolbarProps> = ({
  accounts,
  onOpenTransactionModal,
}) => {
  const { filters, setFilter, resetFilters, isFilterDrawerOpen, toggleFilterDrawer } =
    useFinanceUIStore();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            placeholder="Search merchant, category, notes, or tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value as any)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
            <option value="transfer">Transfers Only</option>
          </select>

          {/* Account Filter */}
          <select
            value={filters.accountId}
            onChange={(e) => setFilter('accountId', e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>

          {/* Filter Drawer Toggle */}
          <button
            onClick={toggleFilterDrawer}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isFilterDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Filters</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="p-2.5 bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* New Transaction Button */}
          <button
            onClick={onOpenTransactionModal}
            id="btn-add-transaction-toolbar"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Expanded Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            >
              <option value="all">All Categories</option>
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Timeframe</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilter('dateRange', e.target.value as any)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Tag</label>
            <input
              type="text"
              value={filters.tag}
              onChange={(e) => setFilter('tag', e.target.value)}
              placeholder="e.g. Payroll, Tax..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
