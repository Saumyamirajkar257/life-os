/**
 * Aura Cloud & Synchronization Infrastructure Types
 * Milestone 21 — Cloud Infrastructure, Sync Engine & Offline Experience
 */

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline' | 'conflict';

export type SyncMode = 'auto' | 'manual' | 'background' | 'incremental' | 'delta';

export type ConflictResolutionStrategy = 'last_write_wins' | 'server_wins' | 'client_wins' | 'manual';

export interface SyncEntityChange {
  id: string;
  collection: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  timestamp: string; // ISO String
  version: number;
  deviceId: string;
}

export interface SyncConflict {
  id: string;
  collection: string;
  entityId: string;
  localData: Record<string, any>;
  remoteData: Record<string, any>;
  localTimestamp: string;
  remoteTimestamp: string;
  resolved: boolean;
  resolvedData?: Record<string, any>;
  resolutionStrategy?: ConflictResolutionStrategy;
}

export interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  type: 'auto' | 'manual' | 'background' | 'delta';
  status: 'completed' | 'failed' | 'partial';
  itemsSynced: number;
  conflictsCount: number;
  durationMs: number;
  errorMessage?: string;
  bytesTransferred: number;
}

export interface OfflineQueueItem {
  id: string;
  collection: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'processing' | 'failed';
  error?: string;
}

export interface CloudDeviceInfo {
  id: string;
  name: string;
  platform: 'windows' | 'macOS' | 'web' | 'android' | 'iOS' | 'iPad';
  browser?: string;
  ipAddress?: string;
  lastActive: string;
  isCurrentDevice: boolean;
  syncStatus: 'synced' | 'pending' | 'offline';
  appVersion: string;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  createdAt: string; // ISO string
  sizeBytes: number;
  version: string;
  type: 'auto_daily' | 'manual' | 'pre_migration';
  domainsIncluded: string[]; // e.g. ['tasks', 'habits', 'finance', 'journal']
  itemCount: number;
  encrypted: boolean;
  checksum: string;
  data: Record<string, any>; // Master JSON payload
}

export interface ImportPayload {
  source: 'json' | 'csv' | 'markdown' | 'txt' | 'notion' | 'apple_reminders' | 'todoist' | 'google_calendar';
  rawContent: string;
  targetDomain: string; // 'tasks' | 'journal' | 'finance' etc.
  options?: {
    overwriteExisting?: boolean;
    defaultCategory?: string;
    dateFormat?: string;
  };
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  errors: string[];
  warnings: string[];
  records: Record<string, any>[];
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown' | 'pdf_report' | 'zip_backup';
  domains: string[]; // ['tasks', 'habits', 'goals', 'finance', 'journal', etc.]
  includeAttachments?: boolean;
  encrypt?: boolean;
  password?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface SchemaMigrationStep {
  version: string;
  description: string;
  up: (data: Record<string, any>) => Record<string, any>;
  down: (data: Record<string, any>) => Record<string, any>;
}

export interface StorageUsageBreakdown {
  totalBytesUsed: number;
  quotaBytes: number; // e.g. 5GB or Unlimited local
  byDomain: {
    domain: string;
    label: string;
    bytes: number;
    count: number;
    color: string;
  }[];
}

export interface FirebaseServicesStatus {
  firestore: boolean;
  auth: boolean;
  storage: boolean;
  cloudFunctions: boolean; // placeholder status
  remoteConfig: boolean;   // placeholder status
  appCheck: boolean;       // placeholder status
}
