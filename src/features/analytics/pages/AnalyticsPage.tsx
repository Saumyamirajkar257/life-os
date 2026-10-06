/**
 * @file AnalyticsPage.tsx
 * @description Top-level page container for Analytics & Life Score.
 * @module Features/Analytics/Pages
 */

import React from 'react';
import { LifeScoreOverviewWidget } from '../widgets/LifeScoreOverviewWidget';
import { WhyScoreChangedWidget } from '../widgets/WhyScoreChangedWidget';
import { ProductivityTrendChart } from '../charts/ProductivityTrendChart';
import { DomainScoreCards } from '../widgets/DomainScoreCards';
import { NextBestMovesWidget } from '../widgets/NextBestMovesWidget';
import { WhatsGoingWellWidget } from '../widgets/WhatsGoingWellWidget';
import { ReportsManager } from '../reports/ReportsManager';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] pb-24">
      {/* 
        Visual Hierarchy requested:
        1. Life Score
        2. Why it changed
        3. Trend
        4. Life Areas
        5. Next Best Moves
        6. What's Going Well
        7. Reports
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
    </div>
  );
};

export default AnalyticsPage;
