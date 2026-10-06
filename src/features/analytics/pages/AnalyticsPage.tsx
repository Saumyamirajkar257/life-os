/**
 * @file AnalyticsPage.tsx
 * @description Top-level page container for Overview (Today Command Center & Life Intelligence).
 * @module Features/Analytics/Pages
 */

import React, { useState } from 'react';
import { PersonalDashboardView } from '../dashboard/PersonalDashboardView';
import { LifeScoreOverviewWidget } from '../widgets/LifeScoreOverviewWidget';
import { WhyScoreChangedWidget } from '../widgets/WhyScoreChangedWidget';
import { ProductivityTrendChart } from '../charts/ProductivityTrendChart';
import { DomainScoreCards } from '../widgets/DomainScoreCards';
import { NextBestMovesWidget } from '../widgets/NextBestMovesWidget';
import { WhatsGoingWellWidget } from '../widgets/WhatsGoingWellWidget';
import { ReportsManager } from '../reports/ReportsManager';

export const AnalyticsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'today' | 'trends'>('today');

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* VIEW MODE SWITCHER */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)]/60 py-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <button
              onClick={() => setViewMode('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'today'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'trends'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              Intelligence & Trends
            </button>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] hidden sm:block">
            {viewMode === 'today' ? 'Command Center' : 'Deep Analytics'}
          </div>
        </div>

        {/* PRIMARY VIEW: TODAY COMMAND CENTER */}
        {viewMode === 'today' ? (
          <PersonalDashboardView />
        ) : (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Section 1: Life Score Overview */}
            <section>
              <LifeScoreOverviewWidget />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Section 2: Why it changed */}
              <div className="lg:col-span-5">
                <WhyScoreChangedWidget />
              </div>

              {/* Section 3: Trend */}
              <div className="lg:col-span-7">
                <ProductivityTrendChart />
              </div>
            </div>

            {/* Section 4: Life Areas */}
            <section>
              <DomainScoreCards />
            </section>

            {/* Section 5 & 6: Actionable Intelligence */}
            <div className="grid grid-cols-1 gap-12">
              <section>
                <NextBestMovesWidget />
              </section>

              <section>
                <WhatsGoingWellWidget />
              </section>
            </div>

            {/* Section 7: Reports */}
            <section>
              <ReportsManager />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
