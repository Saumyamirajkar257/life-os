/**
 * Schema Migration Runner
 */

import { SCHEMA_MIGRATIONS } from './schemaVersions';
import { CLOUD_CONSTANTS } from '../constants/cloudConstants';

export interface MigrationLog {
  fromVersion: string;
  toVersion: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

export class MigrationRunner {
  public static runMigrations(data: Record<string, any>): {
    migratedData: Record<string, any>;
    logs: MigrationLog[];
  } {
    const logs: MigrationLog[] = [];
    let currentData = { ...data };
    const currentVersion = currentData.schemaVersion || '1.0.0';
    const targetVersion = CLOUD_CONSTANTS.SCHEMA_VERSION;

    if (currentVersion === targetVersion) {
      return { migratedData: currentData, logs };
    }

    const stepsToApply = SCHEMA_MIGRATIONS.filter(
      (m) => m.version > currentVersion && m.version <= targetVersion
    );

    for (const step of stepsToApply) {
      const fromVer = currentData.schemaVersion || '1.0.0';
      try {
        currentData = step.up(currentData);
        currentData.schemaVersion = step.version;
        logs.push({
          fromVersion: fromVer,
          toVersion: step.version,
          timestamp: new Date().toISOString(),
          success: true,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logs.push({
          fromVersion: fromVer,
          toVersion: step.version,
          timestamp: new Date().toISOString(),
          success: false,
          error: errorMsg,
        });
        break;
      }
    }

    return { migratedData: currentData, logs };
  }
}
