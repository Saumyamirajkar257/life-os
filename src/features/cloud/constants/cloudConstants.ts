/**
 * Aura Cloud Constants & Configuration Values
 */

export const CLOUD_CONSTANTS = {
  APP_VERSION: '2.1.0',
  SCHEMA_VERSION: '2.1.0',
  MAX_OFFLINE_QUEUE_RETRY: 5,
  AUTO_SYNC_INTERVAL_MS: 30000, // 30 seconds
  BACKGROUND_SYNC_INTERVAL_MS: 120000, // 2 minutes
  AUTO_BACKUP_INTERVAL_MS: 86400000, // 24 hours
  PING_INTERVAL_MS: 15000, // 15 seconds network check
  MAX_BACKUP_HISTORY: 20,
  DEFAULT_QUOTA_BYTES: 10737418240, // 10 GB
};

export const DOMAIN_METADATA: Record<string, { label: string; color: string; icon: string }> = {
  tasks: { label: 'Tasks & Productivity', color: '#3B82F6', icon: 'CheckSquare' },
  habits: { label: 'Habits & Routines', color: '#10B981', icon: 'Flame' },
  goals: { label: 'Goals & Projects', color: '#F59E0B', icon: 'Target' },
  calendar: { label: 'Calendar & Planner', color: '#8B5CF6', icon: 'Calendar' },
  journal: { label: 'Journal & Notes', color: '#EC4899', icon: 'BookOpen' },
  finance: { label: 'Finance & Wealth OS', color: '#10B981', icon: 'Wallet' },
  ai: { label: 'Aura Intelligence AI', color: '#06B6D4', icon: 'Sparkles' },
  analytics: { label: 'Analytics & Life Score', color: '#6366F1', icon: 'BarChart3' },
  settings: { label: 'Preferences & System Settings', color: '#64748B', icon: 'Settings' },
};

export const PLATFORM_SUPPORT = [
  { id: 'windows', label: 'Windows PC', icon: 'Monitor', status: 'supported' },
  { id: 'macOS', label: 'macOS Desktop', icon: 'Laptop', status: 'supported' },
  { id: 'web', label: 'Web Application', icon: 'Globe', status: 'supported' },
  { id: 'android', label: 'Android Mobile', icon: 'Smartphone', status: 'coming_soon' },
  { id: 'iOS', label: 'iPhone (iOS)', icon: 'Smartphone', status: 'coming_soon' },
  { id: 'iPad', label: 'iPadOS Tablet', icon: 'Tablet', status: 'coming_soon' },
];
