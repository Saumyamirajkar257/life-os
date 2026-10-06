/**
 * @file index.ts
 * @description Central export file for Milestone 11 Global Search & Productivity Framework.
 * @module Features/Productivity
 */

export * from './types';
export * from './stores/useProductivityStore';
export * from './services/searchEngine';
export * from './components/command-palette/CommandPaletteModal';
export * from './components/notification-center/NotificationCenterDrawer';
export * from './components/notification-center/NotificationToast';
export * from './components/quick-actions/QuickActionsBar';
export * from './hooks/useProductivity';
