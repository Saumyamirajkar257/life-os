/**
 * Aura Production Logger Service
 * Comprehensive multi-channel logger for Development, Production, Error, Performance, and Analytics tracking.
 */

export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, unknown>;
  stack?: string;
}

class AuraLoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private listeners: ((entry: LogEntry) => void)[] = [];
  private isProduction = import.meta.env.PROD;

  private createEntry(level: LogLevel, category: string, message: string, data?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stack: error?.stack,
    };
  }

  private dispatch(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (!this.isProduction || entry.level === 'error' || entry.level === 'warning') {
      const color =
        entry.level === 'error'
          ? 'color: #f87171; font-weight: bold;'
          : entry.level === 'warning'
          ? 'color: #fbbf24; font-weight: bold;'
          : entry.level === 'info'
          ? 'color: #38bdf8;'
          : 'color: #9ca3af;';

      console.groupCollapsed(`%c[Aura ${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`, color);
      if (entry.data) console.log('Data:', entry.data);
      if (entry.stack) console.error('Stack:', entry.stack);
      console.log('Timestamp:', entry.timestamp);
      console.groupEnd();
    }

    this.listeners.forEach((listener) => listener(entry));
  }

  public debug(category: string, message: string, data?: Record<string, unknown>) {
    this.dispatch(this.createEntry('debug', category, message, data));
  }

  public info(category: string, message: string, data?: Record<string, unknown>) {
    this.dispatch(this.createEntry('info', category, message, data));
  }

  public warn(category: string, message: string, data?: Record<string, unknown>) {
    this.dispatch(this.createEntry('warning', category, message, data));
  }

  public error(category: string, message: string, error?: Error, data?: Record<string, unknown>) {
    this.dispatch(this.createEntry('error', category, message, data, error));
  }

  public perf(category: string, metricName: string, durationMs: number, data?: Record<string, unknown>) {
    this.info(`Perf:${category}`, `${metricName} completed in ${durationMs.toFixed(2)}ms`, {
      metricName,
      durationMs,
      ...data,
    });
  }

  public analytics(eventName: string, properties?: Record<string, unknown>) {
    this.info('Analytics', `Event Tracked: ${eventName}`, properties);
  }

  public getLogs(filterLevel?: LogLevel, category?: string): LogEntry[] {
    return this.logs.filter((log) => {
      if (filterLevel && log.level !== filterLevel) return false;
      if (category && log.category !== category) return false;
      return true;
    });
  }

  public subscribe(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = new AuraLoggerService();
