/**
 * @file NetWorthCard.tsx
 * @description Hero widget for Net Worth summary, total assets, total liabilities, and growth chart.
 * @module Features/Finance/Components/Dashboard
 */

import React from 'react';
import { ArrowUpRight, ShieldCheck, Wallet, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/financeUtils';
import { NetWorthChart } from '../../charts/NetWorthChart';

interface NetWorthCardProps {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  currency: string;
  healthScore?: number;
  onOpenAccountModal: () => void;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
  totalNetWorth,
  totalAssets,
  totalLiabilities,
  currency,
  healthScore,
  onOpenAccountModal,
}) => {
  return (
    <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-6 relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Total Net Worth</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
            {formatCurrency(totalNetWorth, currency)}
          </div>
        </div>

        <button
          onClick={onOpenAccountModal}
          id="btn-add-account-networth"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg transition-all"
        >
          <Wallet className="w-3.5 h-3.5" />
          Add Account
        </button>
      </div>

      {healthScore !== undefined && (
        <div className="text-[11px] font-medium text-slate-400 mt-2">
          Financial Health Score: <span className="text-white font-bold">{healthScore}/100</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)] mt-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Total Assets</div>
            <div className="text-sm font-bold text-slate-100">{formatCurrency(totalAssets, currency)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Liabilities</div>
            <div className="text-sm font-bold text-slate-100">{formatCurrency(totalLiabilities, currency)}</div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <NetWorthChart />
      </div>
    </div>
  );
};
