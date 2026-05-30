'use client';

import { motion } from 'framer-motion';
import { Search, Bell, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { fadeInDown } from '@/animations';
import { cn } from '@/lib/utils';

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function capitalizeFirst(str: string): string {
  if (!str) return 'Dashboard';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TopBar() {
  const {
    activePage,
    sidebarExpanded,
    isMobile,
    toggleCommandPalette,
    toggleSidebar,
    userHandle
  } = useAppStore();

  const pageTitle = capitalizeFirst(activePage || 'dashboard');

  return (
    <motion.header
      variants={fadeInDown}
      initial="initial"
      animate="animate"
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-4 md:px-6"
      style={{
        left: isMobile ? 0 : sidebarExpanded ? 240 : 72,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-display font-semibold text-white/90 tracking-tight">
            {pageTitle}
          </h2>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-sm text-white/30 hidden sm:block">
            {formatDate()}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Search / Command Palette button */}
        <button
          onClick={toggleCommandPalette}
          className={cn(
            'glass-panel-subtle flex items-center gap-2 rounded-xl px-3 py-2 text-white/30 hover:text-white/50 hover:bg-white/5 transition-all duration-200',
            'hidden sm:flex'
          )}
        >
          <Search className="w-4 h-4" />
          <span className="text-xs">Search...</span>
          <div className="flex items-center gap-0.5 ml-2">
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/30">
              ⌘K
            </kbd>
          </div>
        </button>

        {/* Mobile search icon */}
        <button
          onClick={toggleCommandPalette}
          className="sm:hidden p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200">
          <Bell className="w-5 h-5" />
          {/* Pulsing green dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-black/50" />
          </span>
        </button>

        {/* User avatar & Handle */}
        <Link href="/settings" className="p-1.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-medium hidden md:block mr-1">
            {userHandle}
          </span>
        </Link>
      </div>
    </motion.header>
  );
}
