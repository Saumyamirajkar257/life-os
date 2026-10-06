/**
 * @file BillList.tsx
 * @description Master view for recurring bills, subscription reminders, and automated expense logging.
 * @module Features/Finance/Components/Bills
 */

import React from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { BillCard } from './BillCard';
import { useFinance } from '../../hooks/useFinance';

export const BillList: React.FC = () => {
  const { bills, markBillAsPaid, deleteBill, openModal } = useFinance();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Bills & Subscriptions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track recurring utility bills, memberships, and automated payment deadlines.
          </p>
        </div>

        <button
          onClick={() => openModal('bill')}
          id="btn-add-bill-page"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Bill</span>
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No recurring bills added.</p>
          <p className="text-xs text-slate-500">
            Click "Add Bill" to schedule recurring reminders for rent, utilities, or SaaS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onMarkAsPaid={markBillAsPaid}
              onEdit={(b) => openModal('bill', { bill: b })}
              onDelete={deleteBill}
            />
          ))}
        </div>
      )}
    </div>
  );
};
