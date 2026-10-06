/**
 * @file InsightsExplorerView.tsx
 * @description Explorer view containing the automated insights feed and report manager.
 * @module Features/Analytics/Insights
 */

import React from 'react';
import { InsightsFeedWidget } from '../widgets/InsightsFeedWidget';
import { ReportsManager } from '../reports/ReportsManager';

export const InsightsExplorerView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <InsightsFeedWidget />
      <ReportsManager />
    </div>
  );
};
