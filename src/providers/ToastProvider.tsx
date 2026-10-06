/**
 * @file ToastProvider.tsx
 * @description Notification toast portal renderer integrated with useNotificationStore and motion animations.
 * @module AuraCore/Providers/Toast
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { toastVariants } from '@/animations/presets';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ToastProviderProps {
  children: React.ReactNode;
}

const iconMap = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <>
      {children}
      {/* Toast Notification Container Portal */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-colors',
                'bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 border-zinc-200/80 dark:border-zinc-800/80'
              )}
            >
              {iconMap[notif.type]}
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-xs font-semibold tracking-tight">{notif.title}</h4>
                {notif.message && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeNotification(notif.id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-md"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
