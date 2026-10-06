/**
 * @file UpcomingBillsWidget.tsx
 * @description Dashboard widget displaying upcoming & overdue bills with one-click payment.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { Calendar, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Bill } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';

interface UpcomingBillsWidgetProps {
  bills: Bill[];
  onMarkAsPaid: (id: string) => void;
  onNavigateBillsTab: () => void;
}

export const UpcomingBillsWidget: React.FC<UpcomingBillsWidgetProps> = ({
  bills,
  onMarkAsPaid,
  onNavigateBillsTab,
}) => {
  const upcoming = bills.slice(0, 4);

  return (
    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Upcoming Bills</span>
        </div>
        <button
          onClick={onNavigateBillsTab}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {upcoming.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">No bills due in the upcoming cycle.</div>
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((bill) => {
            const isOverdue = bill.status === 'overdue';
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-xs hover:border-slate-700 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                    <span>{bill.title}</span>
                    {isOverdue && (
                      <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded">
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Due: {bill.dueDate} • {bill.payee}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100">{formatCurrency(bill.amount, bill.currency)}</span>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => onMarkAsPaid(bill.id)}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-semibold transition-all"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
