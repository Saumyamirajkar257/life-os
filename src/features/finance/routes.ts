/**
 * @file routes.ts
 * @description Route definitions for the Finance & Wealth Management module.
 * @module Features/Finance
 */

import React from 'react';
import { FinancePage } from './pages/FinancePage';

export const financeRoutes = [
  {
    path: '/finance',
    component: FinancePage,
  },
];
