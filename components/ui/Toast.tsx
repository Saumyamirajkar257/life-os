'use client';

import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

// ─── Toast Store ──────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  variant: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  toast: (message: string, variant?: ToastItem['variant'], duration?: number) => void;
  dismiss: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  toast: (message, variant = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant, duration }],
    }));
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// ─── Individual Toast ─────────────────────────────────────────

const variantConfig = {
  success: {
    icon: CheckCircle2,
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    iconColor: 'text-emerald-400',
    progressColor: 'bg-emerald-400',
  },
  info: {
    icon: Info,
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    iconColor: 'text-indigo-400',
    progressColor: 'bg-indigo-400',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    iconColor: 'text-amber-400',
    progressColor: 'bg-amber-400',
  },
  error: {
    icon: XCircle,
    borderColor: 'border-rose-500/30',
    glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    iconColor: 'text-rose-400',
    progressColor: 'bg-rose-400',
  },
};

function SingleToast({ toast: t }: { toast: ToastItem }) {
  const { dismiss } = useToast();
  const config = variantConfig[t.variant];
  const Icon = config.icon;
  const duration = t.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => dismiss(t.id), duration);
    return () => clearTimeout(timer);
  }, [t.id, duration, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl backdrop-blur-xl bg-black/70 border ${config.borderColor} ${config.glowColor} min-w-[300px] max-w-[420px] overflow-hidden`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className="text-sm text-white/90 font-medium flex-1 leading-snug">{t.message}</p>
      <button
        onClick={() => dismiss(t.id)}
        className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Auto-dismiss progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-[2px] ${config.progressColor}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}

// ─── Toast Container (mount once at root) ─────────────────────

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-20 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SingleToast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
