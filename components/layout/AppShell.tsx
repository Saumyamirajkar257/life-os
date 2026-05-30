'use client';

import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AnimatedBackground } from '../AnimatedBackground';
import { CommandPalette } from '../CommandPalette';
import { GlobalCompanion } from '../companion/GlobalCompanion';
import { ToastContainer } from '../ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

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
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          paddingLeft: isMobile ? '0px' : sidebarExpanded ? '240px' : '72px',
          paddingTop: '80px',
          paddingRight: '0px',
          paddingBottom: isMobile ? '100px' : '24px',
        }}
      >
        <div className="px-6 md:px-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </motion.main>
    </>
  );
}
