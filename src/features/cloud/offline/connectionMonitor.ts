/**
 * Network Connection & Latency Monitor
 */

export interface ConnectionState {
  isOnline: boolean;
  effectiveType?: string; // '4g', '3g', 'wifi', etc.
  roundTripTimeMs?: number;
  lastChecked: string;
}

type ConnectionListener = (state: ConnectionState) => void;

export class ConnectionMonitor {
  private static listeners: Set<ConnectionListener> = new Set();
  private static currentState: ConnectionState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChecked: new Date().toISOString(),
  };

  public static init(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => this.handleStatusChange(true));
    window.addEventListener('offline', () => this.handleStatusChange(false));

    // Periodic network check
    setInterval(() => {
      this.checkConnectionQuality();
    }, 15000);
  }

  private static handleStatusChange(isOnline: boolean): void {
    this.currentState = {
      ...this.currentState,
      isOnline,
      lastChecked: new Date().toISOString(),
    };
    this.notifyListeners();
  }

  private static async checkConnectionQuality(): Promise<void> {
    if (!navigator.onLine) {
      this.handleStatusChange(false);
      return;
    }
    const start = performance.now();
    try {
      // Ping head request to test live connectivity
      const res = await fetch('/api/health', { method: 'HEAD', cache: 'no-store' }).catch(() => null);
      const latency = Math.round(performance.now() - start);
      const isOnline = res ? res.ok : true;

      this.currentState = {
        isOnline,
        roundTripTimeMs: latency,
        lastChecked: new Date().toISOString(),
      };
      this.notifyListeners();
    } catch {
      this.currentState = {
        isOnline: navigator.onLine,
        lastChecked: new Date().toISOString(),
      };
      this.notifyListeners();
    }
  }

  public static subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  public static getState(): ConnectionState {
    return { ...this.currentState };
  }

  private static notifyListeners(): void {
    this.listeners.forEach((fn) => fn(this.currentState));
  }
}
