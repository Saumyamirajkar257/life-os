/**
 * Aura Performance Profiler & Memory Profiling Engine
 */

import { logger } from '../logging/logger';

export interface PerformanceMetric {
  name: string;
  category: string;
  startTime: number;
  durationMs: number;
}

class AuraPerformanceProfiler {
  private metrics: PerformanceMetric[] = [];
  private activeTimers: Map<string, number> = new Map();

  public startTimer(timerId: string) {
    this.activeTimers.set(timerId, performance.now());
  }

  public endTimer(timerId: string, category = 'General'): number {
    const start = this.activeTimers.get(timerId);
    if (!start) {
      logger.warn('Profiler', `Timer [${timerId}] was ended without being started.`);
      return 0;
    }

    const duration = performance.now() - start;
    this.activeTimers.delete(timerId);

    const metric: PerformanceMetric = {
      name: timerId,
      category,
      startTime: start,
      durationMs: duration,
    };

    this.metrics.push(metric);
    logger.perf(category, timerId, duration);
    return duration;
  }

  public measure<T>(name: string, fn: () => T, category = 'Execution'): T {
    this.startTimer(name);
    try {
      const result = fn();
      this.endTimer(name, category);
      return result;
    } catch (err) {
      this.activeTimers.delete(name);
      throw err;
    }
  }

  public async measureAsync<T>(name: string, fn: () => Promise<T>, category = 'AsyncExecution'): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      this.endTimer(name, category);
      return result;
    } catch (err) {
      this.activeTimers.delete(name);
      throw err;
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }
}

export const profiler = new AuraPerformanceProfiler();
