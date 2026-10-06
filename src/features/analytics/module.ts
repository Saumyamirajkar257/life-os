/**
 * @file module.ts
 * @description Module SDK definition for registering Analytics OS in Aura Core.
 * @module Features/Analytics/Module
 */

import { BarChart3 } from 'lucide-react';

export const AnalyticsModule = {
  id: 'analytics',
  name: 'Analytics & Life Score',
  version: '1.0.0',
  description: 'Cross-module analytics, Life Score engine, and personal executive dashboard.',
  icon: BarChart3,
  route: '/analytics',
  category: 'Intelligence',
};
