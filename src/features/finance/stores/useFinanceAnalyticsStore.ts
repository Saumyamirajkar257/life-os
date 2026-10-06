/**
 * @file useFinanceAnalyticsStore.ts
 * @description State store for custom report parameters, comparison periods, and chart viewing settings.
 * @module Features/Finance/Stores
 */

import { create } from 'zustand';

export type ReportTimeframe = 'this_month' | 'last_month' | 'last_3_months' | 'ytd' | 'custom';

interface FinanceAnalyticsState {
  timeframe: ReportTimeframe;
  customStartDate: string;
  customEndDate: string;
  comparePreviousPeriod: boolean;
  selectedChartType: 'bar' | 'line' | 'pie' | 'area';

  setTimeframe: (tf: ReportTimeframe) => void;
  setCustomRange: (start: string, end: string) => void;
  setComparePreviousPeriod: (compare: boolean) => void;
  setSelectedChartType: (type: 'bar' | 'line' | 'pie' | 'area') => void;
}

export const useFinanceAnalyticsStore = create<FinanceAnalyticsState>()((set) => ({
  timeframe: 'this_month',
  customStartDate: '',
  customEndDate: '',
  comparePreviousPeriod: false,
  selectedChartType: 'area',

  setTimeframe: (timeframe) => set({ timeframe }),
  setCustomRange: (customStartDate, customEndDate) => set({ customStartDate, customEndDate }),
  setComparePreviousPeriod: (comparePreviousPeriod) => set({ comparePreviousPeriod }),
  setSelectedChartType: (selectedChartType) => set({ selectedChartType }),
}));
