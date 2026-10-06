/**
 * @file FinanceHealthBarChart.tsx
 * @description Bar chart evaluating health recovery vs financial budget status across intervals.
 * @module Features/Analytics/Charts
 */

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export const FinanceHealthBarChart: React.FC = () => {
  const { trendSeries } = useAnalyticsData();

  return (
    <div className="w-full h-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Health & Financial Metrics Comparison</h3>
          <p className="text-[11px] text-slate-400">Side-by-side score correlation of physical vitality vs financial balance</p>
        </div>
      </div>

      <div className="w-full flex-1 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="label" stroke="#64748B" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="health" name="Health Score" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="finance" name="Finance Score" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
