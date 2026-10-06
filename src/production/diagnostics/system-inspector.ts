/**
 * Aura System Inspector & Diagnostics Control Center Engine
 */

import { logger, LogEntry } from '../logging/logger';
import { healthMonitor, SystemHealthStatus } from '../monitoring/health-monitor';
import { crashReporter, CrashReport } from '../monitoring/crash-reporter';
import { SecurityAuditor, SecurityAuditResult } from '../security/security-audit';
import { Benchmarker, BenchmarkSuiteResult } from '../performance/benchmarker';
import { WcagChecker, AccessibilityAuditResult } from '../accessibility/wcag-checker';

export interface DiagnosticsSnapshot {
  systemVersion: string;
  environment: 'development' | 'production';
  health: SystemHealthStatus;
  security: SecurityAuditResult;
  benchmark: BenchmarkSuiteResult;
  accessibility: AccessibilityAuditResult;
  crashReports: CrashReport[];
  recentLogs: LogEntry[];
  timestamp: string;
}

export class SystemInspector {
  public static async captureDiagnostics(): Promise<DiagnosticsSnapshot> {
    const health = await healthMonitor.evaluateHealth();
    const security = SecurityAuditor.runAudit();
    const benchmark = Benchmarker.runFullBenchmark();
    const accessibility = WcagChecker.runAudit();
    const crashReports = crashReporter.getReports();
    const recentLogs = logger.getLogs().slice(0, 50);

    return {
      systemVersion: '1.0.0-prod.hardening',
      environment: import.meta.env.PROD ? 'production' : 'development',
      health,
      security,
      benchmark,
      accessibility,
      crashReports,
      recentLogs,
      timestamp: new Date().toISOString(),
    };
  }
}
