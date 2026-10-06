/**
 * @file NetWorthChart.tsx
 * @description Interactive area chart displaying historical Net Worth trajectory.
 * @module Features/Finance/Charts
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/financeUtils';

interface NetWorthChartProps {
  data?: Array<{ month: string; netWorth: number; assets: number; liabilities: number }>;
}

const DEFAULT_NET_WORTH_DATA = [
  { month: 'Mar', netWorth: 92000, assets: 98000, liabilities: 6000 },
  { month: 'Apr', netWorth: 96500, assets: 102000, liabilities: 5500 },
  { month: 'May', netWorth: 101200, assets: 106000, liabilities: 4800 },
  { month: 'Jun', netWorth: 108400, assets: 112500, liabilities: 4100 },
  { month: 'Jul', netWorth: 114100, assets: 117500, liabilities: 3400 },
  { month: 'Aug', netWorth: 115080, assets: 115500, liabilities: 1420 },
];

export const NetWorthChart: React.FC<NetWorthChartProps> = ({ data = DEFAULT_NET_WORTH_DATA }) => {
  return (
    <div className="w-full h-64 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value as number;
                return (
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white space-y-1">
                    <p className="font-semibold text-slate-300">{label} Trajectory</p>
                    <p className="text-base font-bold text-indigo-400">
                      Net Worth: {formatCurrency(val)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#6366F1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#netWorthGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
