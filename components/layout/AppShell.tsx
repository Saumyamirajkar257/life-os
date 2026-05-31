'use client';

import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AnimatedBackground } from '../AnimatedBackground';
import { PageTransition } from '../animations/PageTransition';
import { CommandPalette } from '../CommandPalette';
import { GlobalCompanion } from '../companion/GlobalCompanion';
import { ToastContainer } from '../ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarExpanded, isMobile, setMobile, setTablet, setSidebarExpanded } = useAppStore();

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setMobile(width < 768);
      setTablet(width >= 768 && width < 1024);
      if (width < 1024) {
        setSidebarExpanded(false);
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [setMobile, setTablet, setSidebarExpanded]);

  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <TopBar />
      <CommandPalette />
      <GlobalCompanion />
      <ToastContainer />

      <motion.main
        className="min-h-screen transition-all duration-300 ease-in-out flex flex-col"
        style={{
          paddingLeft: isMobile ? '0px' : sidebarExpanded ? '240px' : '72px',
          paddingTop: '80px',
          paddingRight: '0px',
          paddingBottom: isMobile ? '100px' : '24px',
        }}
      >
        <div className="flex-1 flex flex-col justify-between px-6 md:px-8 max-w-[1400px] mx-auto w-full">
          <div className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          
          {/* Premium animated footer watermark */}
          <footer className="w-full pt-12 pb-6 mt-16 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] tracking-widest select-none">
            <span className="text-white/20 hover:text-white/30 transition-colors">LIFE OS v2.0-ALPHA</span>
            <span className="flex items-center gap-1.5 group">
              <Sparkles className="w-3 h-3 text-white/15 group-hover:text-white/30 transition-colors animate-pulse" style={{ animationDuration: '3s' }} />
              <span className="shimmer-text uppercase text-[10px] tracking-[0.2em]">CREATED BY SAM_257</span>
            </span>
          </footer>
        </div>
      </motion.main>
    </>
  );
}
