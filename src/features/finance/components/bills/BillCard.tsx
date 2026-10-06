/**
 * @file BillCard.tsx
 * @description Card rendering bill details, payee, due date, status, and one-click payment.
 * @module Features/Finance/Components/Bills
 */

import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Bill } from '../../types/finance.types';
import { formatCurrency } from '../../utils/financeUtils';

interface BillCardProps {
  bill: Bill;
  onMarkAsPaid: (id: string) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
}

export const BillCard: React.FC<BillCardProps> = ({ bill, onMarkAsPaid, onEdit, onDelete }) => {
  const isPaid = bill.status === 'paid';
  const isOverdue = bill.status === 'overdue';

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4 relative group">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-white">{bill.title}</h4>
          <span className="text-[11px] text-slate-400">{bill.payee} • {bill.category}</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(bill)}
            title="Edit"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(bill.id)}
            title="Delete"
            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Amount Due</span>
          <div className="text-xl font-extrabold text-white">{formatCurrency(bill.amount)}</div>
        </div>

        <div>
          {isPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" /> Paid
            </span>
          ) : isOverdue ? (
            <button
              onClick={() => onMarkAsPaid(bill.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Pay Overdue
            </button>
          ) : (
            <button
              onClick={() => onMarkAsPaid(bill.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow transition-all"
            >
              <Clock className="w-3.5 h-3.5" /> Mark Paid
            </button>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between">
        <span>Due Date: {bill.dueDate}</span>
        {bill.autoPay && <span className="text-indigo-400 font-medium">AutoPay Enabled</span>}
      </div>
    </div>
  );
};
