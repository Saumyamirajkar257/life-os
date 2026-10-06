/**
 * Migration Service Façade
 */

import { MigrationRunner } from '../migration/migrationRunner';
import { RollbackEngine } from '../migration/rollbackEngine';

export class MigrationService {
  public static migrate(data: Record<string, any>) {
    return MigrationRunner.runMigrations(data);
  }

  public static rollback(data: Record<string, any>, targetVersion: string) {
    return RollbackEngine.rollbackToVersion(data, targetVersion);
  }
}
