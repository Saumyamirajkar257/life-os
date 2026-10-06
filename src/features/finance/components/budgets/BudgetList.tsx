/**
 * @file BudgetList.tsx
 * @description List view of all category budgets with CRUD actions.
 * @module Features/Finance/Components/Budgets
 */

import React from 'react';
import { PlusCircle, PieChart } from 'lucide-react';
import { BudgetCard } from './BudgetCard';
import { useFinance } from '../../hooks/useFinance';

export const BudgetList: React.FC = () => {
  const { budgets, transactions, deleteBudget, openModal } = useFinance();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Category Budgets</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track category spending limits and prevent overspending with automated alert thresholds.
          </p>
        </div>

        <button
          onClick={() => openModal('budget')}
          id="btn-add-budget-page"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Budget</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <PieChart className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No active category budgets created.</p>
          <p className="text-xs text-slate-500">
            Click "New Budget" to create monthly spending targets for dining, groceries, or entertainment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((bgt) => (
            <BudgetCard
              key={bgt.id}
              budget={bgt}
              transactions={transactions}
              onEdit={(b) => openModal('budget', { bgt: b })}
              onDelete={deleteBudget}
            />
          ))}
        </div>
      )}
    </div>
  );
};
