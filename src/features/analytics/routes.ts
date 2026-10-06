/**
 * @file routes.ts
 * @description Route definition for Milestone 20 — Analytics & Life Score Dashboard.
 * @module Features/Analytics/Routes
 */

import React from 'react';

const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));

export const ANALYTICS_ROUTES = [
  {
    path: '/analytics',
    component: AnalyticsPage,
    exact: true,
  },
];
