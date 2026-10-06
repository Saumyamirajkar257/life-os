/**
 * @file module.ts
 * @description SDK registration metadata for Milestone 17 — Finance & Wealth Management.
 * @module Features/Finance
 */

import { Wallet } from 'lucide-react';
import { financeRoutes } from './routes';

export const FinanceModule = {
  id: 'finance',
  name: 'Finance & Wealth',
  description: 'Complete personal finance system, net worth tracking, automated cash flow, category budgets, and financial health score.',
  icon: Wallet,
  category: 'Finance',
  version: '1.0.0',
  routes: financeRoutes,
};
