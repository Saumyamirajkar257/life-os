/**
 * @file ReportsView.tsx
 * @description Advanced financial reporting, interactive charts, and income/expense breakdown matrix.
 * @module Features/Finance/Reports
 */

import React from 'react';
import { BarChart3, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { CashFlowChart } from '../charts/CashFlowChart';
import { CategorySpendingChart } from '../charts/CategorySpendingChart';
import { IncomeVsExpenseChart } from '../charts/IncomeVsExpenseChart';
import { NetWorthChart } from '../charts/NetWorthChart';
import { useFinanceAnalyticsStore } from '../stores/useFinanceAnalyticsStore';
import { formatCurrency } from '../utils/financeUtils';

export const ReportsView: React.FC = () => {
  const { monthlyCashFlow, categorySpending, cashFlowSeries } = useFinance();
  const { timeframe, setTimeframe } = useFinanceAnalyticsStore();

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Reports & Intelligence</h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze historical cash flow, spending distribution across categories, and savings velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow History */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Historical Cash Flow</span>
          </div>
          <CashFlowChart data={cashFlowSeries} />
        </div>

        {/* Category Spending Breakdown */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <span>Category Expense Distribution</span>
          </div>
          <CategorySpendingChart data={categorySpending} />
        </div>
      </div>

      {/* Secondary Metrics & Category Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Ratio */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Income vs Expense Ratio</span>
          </div>
          <IncomeVsExpenseChart income={monthlyCashFlow.income} expense={monthlyCashFlow.expense} />
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Total Income
              </span>
              <span className="font-bold text-white">{formatCurrency(monthlyCashFlow.income)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" /> Total Expenses
              </span>
              <span className="font-bold text-white">{formatCurrency(monthlyCashFlow.expense)}</span>
            </div>
          </div>
        </div>

        {/* Spending Table Breakdown */}
        <div className="lg:col-span-2 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Top Expense Categories
            </div>
          </div>

          <div className="space-y-2.5">
            {categorySpending.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No expenses in selected period.</div>
            ) : (
              categorySpending.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <div className="font-semibold text-slate-100">{cat.category}</div>
                      <div className="text-[11px] text-slate-400">{cat.count} Transactions</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-100">{formatCurrency(cat.totalAmount)}</div>
                    <div className="text-[10px] text-indigo-400 font-semibold">
                      {cat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
