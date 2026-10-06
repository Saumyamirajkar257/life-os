/**
 * @file module.ts
 * @description SDK registration metadata for Milestone 19 — Aura Intelligence (AI OS).
 * @module Features/AI
 */

import { Sparkles } from 'lucide-react';
import { aiRoutes } from './routes';

export const AIModule = {
  id: 'ai',
  name: 'Aura Intelligence',
  description: 'AI Operating System connecting tasks, habits, goals, calendar, journal, health, and finances.',
  icon: Sparkles,
  category: 'Intelligence',
  version: '1.0.0',
  routes: aiRoutes,
};
