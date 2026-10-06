/**
 * @file NotificationToast.tsx
 * @description Floating popup toast notification banner with auto-dismiss timer and action triggers.
 * @module Features/Productivity/Components/NotificationCenter/NotificationToast
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Loader2, X } from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';
import { NotificationType } from '../../types';

export const NotificationToast: React.FC = () => {
  const { activeToast, setActiveToast } = useProductivityStore();

  useEffect(() => {
    if (!activeToast) return;

    // Auto dismiss toast after 4.5 seconds unless loading
    if (activeToast.type !== 'loading') {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToast, setActiveToast]);

  if (!activeToast) return null;

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-neutral-900/95 border border-neutral-700/80 rounded-xl shadow-2xl p-4 backdrop-blur-md text-neutral-100 flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-200"
      id="notification-toast-popup"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 shrink-0">{getIconForType(activeToast.type)}</div>
        <div>
          <h4 className="text-sm font-semibold text-neutral-100">{activeToast.title}</h4>
          <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{activeToast.message}</p>

          {activeToast.actionButtons && activeToast.actionButtons.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {activeToast.actionButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    btn.action();
                    setActiveToast(null);
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setActiveToast(null)}
        className="text-neutral-400 hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-800 shrink-0"
        id="notification-toast-close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
