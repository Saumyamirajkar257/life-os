/**
 * @file IncomeVsExpenseChart.tsx
 * @description Comparison donut/bar chart for total monthly Income vs Expense ratio.
 * @module Features/Finance/Charts
 */

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/financeUtils';

interface IncomeVsExpenseChartProps {
  income: number;
  expense: number;
}

export const IncomeVsExpenseChart: React.FC<IncomeVsExpenseChartProps> = ({ income, expense }) => {
  const data = [
    { name: 'Income', value: income, color: '#10B981' },
    { name: 'Expense', value: expense, color: '#EF4444' },
  ];

  return (
    <div className="w-full h-52 select-none flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={5}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs text-white">
                    <p className="font-semibold" style={{ color: item.color }}>
                      {item.name}: {formatCurrency(item.value)}
                    </p>
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
