import { create } from 'zustand';
import { type DashboardState } from '@/types';

export const useDashboardStore = create<DashboardState>((set) => ({
  layouts: [],
  updateLayout: (layouts) => set({ layouts }),
}));
