import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { crashReporter } from '../monitoring/crash-reporter';
import { logger } from '../logging/logger';

interface Props {
  moduleName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ModuleIsolationBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ModuleIsolation', `Module [${this.props.moduleName}] crashed`, error, {
      componentStack: errorInfo.componentStack,
    });
    crashReporter.captureException(error, errorInfo.componentStack || undefined, 'error');
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl shadow-lg space-y-4 text-slate-200">
          <div className="flex items-center space-x-3 text-amber-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                This section could not be loaded
              </h3>
              <p className="text-xs text-amber-400/80 mt-0.5">
                We're having trouble displaying this part of the app.
              </p>
            </div>
          </div>

          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            Reload Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
