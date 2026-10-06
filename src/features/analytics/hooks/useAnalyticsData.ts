/**
 * @file useAnalyticsData.ts
 * @description Hook providing filtered trend data series based on time range selection.
 * @module Features/Analytics/Hooks
 */

import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { AnalyticsDataAggregator } from '../services/analyticsDataAggregator';

export function useAnalyticsData() {
  const { timeRange, setTimeRange } = useAnalyticsStore();
  const trendSeries = AnalyticsDataAggregator.getTrendSeries(timeRange === 'custom' ? 'weekly' : timeRange);
  const habitHeatmap = AnalyticsDataAggregator.getHabitHeatmapData();

  return {
    timeRange,
    setTimeRange,
    trendSeries,
    habitHeatmap,
  };
}
