/**
 * @file CashFlowChart.tsx
 * @description Bar chart showing side-by-side Monthly Income vs Expenses with Net cash flow overlays.
 * @module Features/Finance/Charts
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CashFlowPoint } from '../types/finance.types';
import { formatCurrency } from '../utils/financeUtils';

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
          <XAxis dataKey="dateOrMonth" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length >= 2) {
                const inc = payload[0].value as number;
                const exp = payload[1].value as number;
                const net = inc - exp;
                return (
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white space-y-1">
                    <p className="font-semibold text-slate-300">{label}</p>
                    <div className="flex justify-between gap-4 text-emerald-400">
                      <span>Income:</span>
                      <span className="font-semibold">{formatCurrency(inc)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-rose-400">
                      <span>Expense:</span>
                      <span className="font-semibold">{formatCurrency(exp)}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-1 flex justify-between gap-4 font-bold text-indigo-300">
                      <span>Net Savings:</span>
                      <span>{formatCurrency(net)}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
