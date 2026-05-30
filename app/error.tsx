'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Global Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <GlassCard variant="strong" className="flex flex-col items-center text-center p-8 border-rose-500/30">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          
          <h1 className="text-2xl font-display font-bold text-white mb-2">System Anomaly Detected</h1>
          <p className="text-white/50 text-sm mb-8">
            The neural engine encountered an unexpected error. Your data is safe, but the current process was halted.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reboot Process
            </button>
            <button
              onClick={() => {
                reset();
                router.push('/');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 text-white/70 hover:text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 transition-all"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
