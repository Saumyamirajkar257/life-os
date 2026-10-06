/**
 * Database Schema Migration Versions & Transformations
 */

import { SchemaMigrationStep } from '../types/cloudTypes';

export const SCHEMA_MIGRATIONS: SchemaMigrationStep[] = [
  {
    version: '1.0.0',
    description: 'Base Aura OS Local Data Initialization',
    up: (data) => data,
    down: (data) => data,
  },
  {
    version: '2.0.0',
    description: 'Aura Intelligence & Finance OS Integration',
    up: (data) => {
      // Ensure all tasks have status and priority fallback
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks = data.tasks.map((t: any) => ({
          ...t,
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          version: 2,
        }));
      }
      return data;
    },
    down: (data) => data,
  },
  {
    version: '2.1.0',
    description: 'Aura Cloud Sync Engine & Multi-Device Compatibility Fields',
    up: (data) => {
      // Add cloud metadata tags to all domain items if missing
      const domains = ['tasks', 'habits', 'goals', 'events', 'journals', 'notes', 'transactions'];
      domains.forEach((dom) => {
        if (data[dom] && Array.isArray(data[dom])) {
          data[dom] = data[dom].map((item: any) => ({
            ...item,
            updatedAt: item.updatedAt || new Date().toISOString(),
            version: item.version || 1,
            syncStatus: item.syncStatus || 'synced',
          }));
        }
      });
      return data;
    },
    down: (data) => data,
  },
];
