/**
 * Migration Rollback Engine
 */

import { SCHEMA_MIGRATIONS } from './schemaVersions';

export class RollbackEngine {
  public static rollbackToVersion(currentData: Record<string, any>, targetVersion: string): Record<string, any> {
    let state = { ...currentData };
    const sorted = [...SCHEMA_MIGRATIONS].reverse();

    for (const step of sorted) {
      if (step.version > targetVersion) {
        try {
          state = step.down(state);
        } catch (err) {
          console.error(`[RollbackEngine] Rollback failed for version ${step.version}:`, err);
        }
      }
    }

    state.schemaVersion = targetVersion;
    return state;
  }
}
