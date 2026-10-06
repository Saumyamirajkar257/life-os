/**
 * @file CategorySpendingChart.tsx
 * @description Donut Pie chart showing category spending distribution with custom tooltips.
 * @module Features/Finance/Charts
 */

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategorySpendingSummary } from '../types/finance.types';
import { formatCurrency } from '../utils/financeUtils';

interface CategorySpendingChartProps {
  data: CategorySpendingSummary[];
}

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-slate-400 text-sm">
        No expense transactions logged for this period.
      </div>
    );
  }

  return (
    <div className="w-full h-64 select-none relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CategorySpendingSummary;
                return (
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-white space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-200">{item.category}</span>
                    </div>
                    <p className="font-bold text-sm text-indigo-300">{formatCurrency(item.totalAmount)}</p>
                    <p className="text-slate-400 text-[11px]">{item.percentage.toFixed(1)}% of expenses</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
