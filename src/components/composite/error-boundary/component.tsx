/**
 * @file component.tsx
 * @description Composite ErrorBoundary catching uncaught JS exceptions with stack traces and reset handlers.
 * @module AuraComposite/ErrorBoundary/Component
 */

import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallbackUI: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  className?: string;
}> = ({ error, errorInfo, onReset, className }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `${error?.toString()}\n${errorInfo?.componentStack}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('p-6 max-w-xl mx-auto my-8', className)}>
      <Card className="p-6 space-y-4 border-rose-500/20 bg-rose-500/5">
        <div className="flex items-center gap-3 text-rose-500">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Application Error Caught
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              An unexpected exception was safely intercepted.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1 font-mono text-xs overflow-x-auto text-rose-500">
            <p className="font-bold">{error.toString()}</p>
            {errorInfo && (
              <pre className="text-[10px] text-[var(--color-text-muted)] mt-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button variant="primary" size="sm" onClick={onReset} className="gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> Reload Component
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Stack Trace'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
