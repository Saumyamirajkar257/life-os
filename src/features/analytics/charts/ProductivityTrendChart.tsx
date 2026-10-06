/**
 * @file ProductivityTrendChart.tsx
 * @description Area/Line chart visualizing productivity, habits, and overall score velocity over time.
 * @module Features/Analytics/Charts
 */

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export const ProductivityTrendChart: React.FC = () => {
  const { trendSeries } = useAnalyticsData();

  return (
    <div className="w-full h-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Score Trend</h3>
      </div>

      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLifeScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" stroke="var(--color-text-tertiary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={[0, 100]} stroke="var(--color-text-tertiary)" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border)', borderRadius: '12px', fontSize: '12px', color: 'var(--color-text)' }}
              itemStyle={{ color: 'var(--color-text)' }}
            />
            <Area type="monotone" dataKey="lifeScore" name="Life Score" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#gradLifeScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
