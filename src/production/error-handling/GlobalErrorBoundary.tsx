import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { crashReporter } from '../monitoring/crash-reporter';
import { logger } from '../logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    logger.error('GlobalErrorBoundary', 'Uncaught runtime UI error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
    });
    crashReporter.captureException(error, errorInfo.componentStack || undefined, 'fatal');
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-100">Something went wrong</h1>
                <p className="text-xs text-red-400/80 mt-0.5">Application Error</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              We encountered an unexpected problem while loading this view. Your data is safely stored on your device.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-medium text-sm hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Restart Aura
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-sm transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-400" /> Security Isolated
              </span>
              <span>Aura Production v1.0.0</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
