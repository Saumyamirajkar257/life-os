/**
 * @file routes.ts
 * @description Route declarations for Habits module in Aura Life OS.
 * @module Features/Habits/Routes
 */

import React from 'react';
import HabitsPage from './pages/HabitsPage';

export const HABITS_ROUTES = [
  {
    path: '/habits',
    component: HabitsPage,
    exact: true,
  },
];
