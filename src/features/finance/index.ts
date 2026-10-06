/**
 * @file index.ts
 * @description Public exports for Milestone 17 — Finance & Wealth Management Module.
 * @module Features/Finance
 */

export * from './types/finance.types';
export * from './stores/useFinanceStore';
export * from './stores/useFinanceUIStore';
export * from './stores/useFinanceAnalyticsStore';
export * from './hooks/useFinance';
export * from './hooks/useFinanceFilters';
export * from './hooks/useFinanceCalculations';
export * from './services/financeFirestore.service';
export * from './pages/FinancePage';
export * from './layouts/FinanceLayout';
export * from './routes';
export * from './module';
