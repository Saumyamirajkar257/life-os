'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BookOpen,
  BarChart3,
  Wallet,
  BrainCircuit,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  History,
  Brain,
  Zap,
  FileText,
  GraduationCap,
  Trophy,
  Compass,
  Telescope,
  User,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { DigitalPet } from '@/components/companion/DigitalPet';

interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: SidebarNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Study OS', icon: GraduationCap, href: '/study' },
  { label: 'Student Hub', icon: Trophy, href: '/student-hub' },
  { label: 'AI Features', icon: Sparkles, href: '/ai-features' },
  { label: 'Life Intelligence', icon: Brain, href: '/life-intelligence' },
  { label: 'Life Vision', icon: Telescope, href: '/life-vision' },
  { label: 'Life Profile', icon: User, href: '/life-profile' },
  { label: 'Timeline', icon: History, href: '/timeline' },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { label: 'Habits', icon: Target, href: '/habits' },
  { label: 'Journal', icon: BookOpen, href: '/journal' },
  { label: 'Second Brain', icon: Compass, href: '/brain' },
  { label: 'Resource Vault', icon: Database, href: '/vault' },
  { label: 'PDF Editor', icon: FileText, href: '/pdf-editor' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Finance', icon: Wallet, href: '/finance' },
  { label: 'Focus', icon: BrainCircuit, href: '/focus' },
  { label: 'Automations', icon: Zap, href: '/automations' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

function NavTooltip({ label, show }: { label: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 text-white text-xs font-medium whitespace-nowrap z-[100] pointer-events-none"
        >
          {label}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-white/10 border-l border-b border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const { sidebarExpanded, toggleSidebar, setActivePage } = useAppStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.nav
      className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col glass-panel rounded-none rounded-r-2xl border-l-0"
      animate={{ width: sidebarExpanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b border-white/5">
        <motion.div
          className="flex items-center gap-3 overflow-hidden"
          animate={{ justifyContent: sidebarExpanded ? 'flex-start' : 'center' }}
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white/80" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black/80" />
          </div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-sm font-display font-bold tracking-wider text-white/90">
                  LIFE OS
                </h1>
                <p className="text-[10px] text-white/30 font-mono">v2.0-alpha</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                onClick={() => setActivePage(item.label.toLowerCase())}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl transition-colors duration-200',
                  sidebarExpanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center',
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                    style={{
                      boxShadow: '0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 relative z-10 transition-all duration-200',
                    isActive && 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  )}
                />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium relative z-10 overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Tooltip when collapsed */}
              {!sidebarExpanded && (
                <NavTooltip
                  label={item.label}
                  show={hoveredItem === item.href}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Pet Component */}
      <AnimatePresence>
        {sidebarExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-4"
          >
            <DigitalPet />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={() => {
            localStorage.removeItem('life-os-bypass-auth');
            import('@/lib/firebase').then(({ auth }) => auth.signOut());
          }}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-200',
            !sidebarExpanded && 'justify-center px-0'
          )}
        >
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium overflow-hidden whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200',
            !sidebarExpanded && 'justify-center px-0'
          )}
        >
          <motion.div
            animate={{ rotate: sidebarExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </motion.div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium overflow-hidden whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}

function MobileBottomDock() {
  const pathname = usePathname();
  const { setActivePage, compactDock } = useAppStore();
  const [moreOpen, setMoreOpen] = useState(false);

  // Show 4 items, plus "More"
  const mobileItems = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);

  return (
    <>
      {/* Full screen overlay for more items */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-display font-bold text-white">All Modules</h2>
              <button onClick={() => setMoreOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 custom-scrollbar content-start">
              {moreItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setActivePage(item.label.toLowerCase());
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                      isActive ? "bg-indigo-500/20 border-indigo-500/50" : "bg-white/5 border-white/10 active:bg-white/10"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive ? "text-indigo-400" : "text-white/60")} />
                    <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-white/70")}>{item.label}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={() => {
                  localStorage.removeItem('life-os-bypass-auth');
                  import('@/lib/firebase').then(({ auth }) => auth.signOut());
                }}
                className="flex items-center gap-3 p-4 rounded-2xl border bg-rose-500/10 border-rose-500/20 active:bg-rose-500/20 col-span-2 mt-4 transition-all"
              >
                <div className="text-rose-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
                <span className="text-sm font-medium text-rose-400">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
        className={cn(
          "fixed left-4 right-4 z-40 md:hidden transition-all duration-300",
          compactDock ? "bottom-2" : "bottom-4"
        )}
      >
        <div className={cn(
          "glass-panel rounded-2xl flex items-center justify-around transition-all duration-300",
          compactDock ? "px-1 py-1.5" : "px-2 py-2"
        )}>
          {mobileItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActivePage(item.label.toLowerCase())}
                className="relative flex flex-col items-center gap-1 p-2 rounded-xl"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-dock-active"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    'w-5 h-5 relative z-10 transition-colors duration-200',
                    isActive
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                      : 'text-white/40'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium relative z-10 transition-colors duration-200',
                    isActive ? 'text-white/90' : 'text-white/30'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className="relative flex flex-col items-center gap-1 p-2 rounded-xl"
          >
            {moreOpen && (
              <motion.div
                layoutId="mobile-dock-active"
                className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Menu
              className={cn(
                'w-5 h-5 relative z-10 transition-colors duration-200',
                moreOpen ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-white/40'
              )}
            />
            <span className={cn('text-[10px] font-medium relative z-10 transition-colors duration-200', moreOpen ? 'text-white/90' : 'text-white/30')}>
              More
            </span>
          </button>
        </div>
      </motion.nav>
    </>
  );
}

export function Sidebar() {
  const { isMobile } = useAppStore();

  return (
    <>
      <DesktopSidebar />
      <MobileBottomDock />
    </>
  );
}
