/**
 * @file AnalyticsView.tsx
 * @description Master schedule analytics dashboard computing focus hours, category allocation, and peak density.
 * @module Features/Calendar/Components
 */

import React from 'react';
import { BarChart2, Clock, PieChart, Zap, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarAnalytics } from '../analytics/useCalendarAnalytics';

export const AnalyticsView: React.FC = () => {
  const analytics = useCalendarAnalytics();

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Total Events Scheduled</span>
            <span className="text-2xl font-black text-slate-100 mt-1">{analytics.totalEventsCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">{analytics.completedEventsCount} completed</span>
          </div>
          <CalendarIcon className="w-8 h-8 text-blue-400/80 stroke-[1.5]" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Total Focus Time</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{analytics.totalFocusHours} hrs</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Across all categories</span>
          </div>
          <Clock className="w-8 h-8 text-emerald-400/80 stroke-[1.5]" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Peak Focus Window</span>
            <span className="text-sm font-bold text-amber-400 mt-2">{analytics.peakProductivityTime}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Busiest Day: {analytics.busiestDayOfWeek}</span>
          </div>
          <Zap className="w-8 h-8 text-amber-400/80 stroke-[1.5]" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400">Schedule Execution Rate</span>
            <span className="text-2xl font-black text-purple-400 mt-1">{analytics.dailyScheduleDensity}%</span>
            <span className="text-[11px] text-slate-500 mt-0.5">On-time completion</span>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-400/80 stroke-[1.5]" />
        </div>
      </div>

      {/* Category Time Allocation Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <PieChart className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">Category Time Allocation (Hours)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(analytics.categoryTimeAllocation).map(([cat, hours]) => {
            const percentage = analytics.totalFocusHours > 0
              ? Math.round((hours / analytics.totalFocusHours) * 100)
              : 0;

            return (
              <div key={cat} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>{cat}</span>
                  <span className="text-amber-400">{hours} hrs ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
