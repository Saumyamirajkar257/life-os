/**
 * @file App.tsx
 * @description Aura Core Foundation & Milestone 7 Desktop Application Shell.
 * Renders the Desktop Shell with Top Navigation, Collapsible Sidebar, Workspace, Dock, Footer, Command Palette, and Section Navigation.
 * @module AuraCore/App
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useCommandPaletteStore } from '@/stores/useCommandPaletteStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { detectPlatform } from '@/lib/utils/platform';
import { formatShortcutForOS } from '@/lib/utils/keyboard';
import { APP_CONFIG } from '@/config/app.config';
import { AppShell } from '@/components/shell/app-shell';
import { MetricCard } from '@/components/composite/metric-card';
import { StatsCard } from '@/components/composite/stats-card';
import { InfoCard } from '@/components/composite/info-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useAuth, ProtectedRoute } from '@/features/auth';

const CloudScreen = React.lazy(() => import('@/features/cloud/CloudScreen').then(m => ({ default: m.CloudScreen })));
const SettingsLayout = React.lazy(() => import('@/features/settings').then(m => ({ default: m.SettingsLayout })));
const TasksPage = React.lazy(() => import('@/features/tasks').then(m => ({ default: m.TasksPage })));
const HabitsPage = React.lazy(() => import('@/features/habits').then(m => ({ default: m.HabitsPage })));
const GoalsPage = React.lazy(() => import('@/features/goals').then(m => ({ default: m.GoalsPage })));
const CalendarPage = React.lazy(() => import('@/features/calendar').then(m => ({ default: m.CalendarPage })));
const JournalPage = React.lazy(() => import('@/features/journal').then(m => ({ default: m.JournalPage })));
const FinancePage = React.lazy(() => import('@/features/finance').then(m => ({ default: m.FinancePage })));
const AuraAIPage = React.lazy(() => import('@/features/ai').then(m => ({ default: m.AuraAIPage })));
const AnalyticsPage = React.lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const ProfilePage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.ProfilePage })));
const LoginPage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.ForgotPasswordPage })));
const VerifyEmailPage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.VerifyEmailPage })));
const UnauthorizedPage = React.lazy(() => import('@/features/auth').then(m => ({ default: m.UnauthorizedPage })));

import { startIdleRoutePrefetch } from '@/lib/router/prefetch';

const ViewFallback = () => (
  <div className="w-full space-y-6 animate-pulse p-4 sm:p-6 md:p-8">
    <div className="space-y-2">
      <div className="h-7 w-40 bg-white/[0.05] rounded-lg" />
      <div className="h-3.5 w-64 bg-white/[0.03] rounded-md" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
      <div className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.05]" />
      <div className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.05]" />
      <div className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.05]" />
    </div>
    <div className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05]" />
  </div>
);
import { CloudSyncProvider } from '@/features/cloud/providers/CloudSyncProvider';
import { GlobalErrorBoundary, ModuleIsolationBoundary } from '@/production';
import { AmbientBackground } from '@/components/ambient/AmbientBackground';
import { usePolishStore } from '@/stores/usePolishStore';
import {
  CommandPaletteModal,
  NotificationCenterDrawer,
  NotificationToast,
} from '@/features/productivity';
import {
  ShieldCheck,
  Bell,
  Moon,
  Sun,
  Command,
  Monitor,
  Zap,
  CheckCircle2,
  Sliders,
  FolderTree,
  UserCheck,
  Key,
  Lock,
} from 'lucide-react';

export default function App() {
  const { theme, resolvedTheme, currentTheme, isDarkTheme, toggleTheme } = useTheme();
  const { activeSectionId, setActiveSection } = useSidebarStore();
  const { addNotification, notifications } = useNotificationStore();
  const { toggleCommandPalette } = useCommandPaletteStore();
  const { currentPage, navigateToPage, user } = useAuth();

  const prefersReducedMotion = useReducedMotion();
  const [platform, setPlatform] = useState(() => detectPlatform());
  const activeSection = activeSectionId || 'analytics';

  // Minimal Routing Synchronization
  useEffect(() => {
    // 1. Sync initial load from URL (overrides localStorage if URL is specific)
    const path = window.location.pathname;
    if (path === '/' || path === '/overview') {
      setActiveSection('analytics');
      window.history.replaceState(null, '', '/overview');
    } else if (path.length > 1) {
      const section = path.replace(/^\//, '');
      setActiveSection(section);
    }
    
    // 2. Handle browser Back/Forward navigation
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/overview') {
        setActiveSection('analytics');
      } else if (currentPath.length > 1) {
        setActiveSection(currentPath.replace(/^\//, ''));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Sync URL when activeSection changes via App UI
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = activeSection === 'analytics' ? '/overview' : `/${activeSection}`;
    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activeSection]);

  useEffect(() => {
    setPlatform(detectPlatform());
    const stopPrefetch = startIdleRoutePrefetch();
    return () => stopPrefetch();
  }, []);

  // Keyboard shortcut listener tests
  useKeyboardShortcut('meta+k', () => {
    toggleCommandPalette();
    addNotification({
      title: 'Command Palette Triggered',
      message: `Hotkey ${formatShortcutForOS('meta+k')} dispatched successfully.`,
      type: 'info',
    });
  });

  useKeyboardShortcut('meta+j', () => {
    toggleTheme();
    addNotification({
      title: 'Theme Toggled via Hotkey',
      message: `Switched theme using ${formatShortcutForOS('meta+j')}.`,
      type: 'success',
    });
  });

  // Secondary Pane for Split Workspace View in Component Library view
  const secondaryPaneContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-[var(--color-accent)]" /> Shell Diagnostics Inspector
        </h3>
        <Badge variant="accent" size="sm">
          Live Split View
        </Badge>
      </div>

      <div className="space-y-4">
        <MetricCard
          label="Sidebar Width"
          value="Resizable"
          subvalue="Drag handle or ⌘B hotkey"
          status="success"
        />

        <StatsCard
          title="Milestone Progress"
          value="Milestone 7 Complete"
          progress={100}
        />

        <InfoCard
          title="Aura Core Architecture"
          description="Desktop Shell orchestration wrapper containing Sidebar, TopNav, Workspace, Dock, Footer, and Command Palette."
          variant="info"
        />
      </div>
    </div>
  );

  const { ambientMode, showParticles, intensity } = usePolishStore();

  const shellContent = (
    <>
      <AmbientBackground timeOverride={ambientMode} showParticles={showParticles} intensity={intensity} />
      <AppShell
      showDock={false}
      activeSectionId={activeSection}
      onSelectSectionId={(id) => setActiveSection(id)}
      title={
        activeSection === 'tasks' || activeSection === 'tasks-sidebar-main'
          ? 'Tasks'
          : activeSection === 'calendar' || activeSection === 'calendar-sidebar-main'
          ? 'Calendar'
          : activeSection === 'habits' || activeSection === 'habits-sidebar-main'
          ? 'Habits'
          : activeSection === 'journal' || activeSection === 'journal-sidebar-main'
          ? 'Journal'
          : activeSection === 'finance' || activeSection === 'finance-sidebar-main'
          ? 'Finance'
          : activeSection === 'ai' || activeSection === 'ai-sidebar-main'
          ? 'Aura AI'
          : activeSection === 'analytics' || activeSection === 'analytics-sidebar-main'
          ? 'Overview'
          : activeSection === 'goals' || activeSection === 'goals-sidebar-main'
          ? 'Goals'
          : activeSection === 'cloud' || activeSection === 'cloud-sidebar-main'
          ? 'Cloud'
          : activeSection === 'auth-portal'
          ? 'Account'
          : activeSection === 'user-profile' || activeSection === 'profile'
          ? 'Profile'
          : activeSection === 'aura-core-status'
          ? 'System Inspector'
          : activeSection === 'architecture'
          ? 'Architecture Tree'
          : activeSection === 'performance'
          ? 'Performance'
          : activeSection === 'components'
          ? 'Components'
          : activeSection === 'tokens'
          ? 'Tokens'
          : activeSection === 'notifications'
          ? 'Notifications'
          : activeSection === 'settings'
          ? 'Settings'
          : 'Aura Life OS'
      }
      breadcrumbs={[
        { id: '1', label: 'Aura', onClick: () => setActiveSection('analytics') },
        { id: '2', label: activeSection.toUpperCase().replace(/-/g, ' ') },
      ]}
      secondaryPaneContent={activeSection === 'components' ? secondaryPaneContent : undefined}
    >
      <React.Suspense fallback={<ViewFallback />}>
      {/* View 0A: Authentication Portal */}
      {activeSection === 'auth-portal' && (
        <div className="space-y-6">
          {/* View Switcher Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                Auth Route View:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['login', 'signup', 'forgot-password', 'verify-email', 'unauthorized', 'profile'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => navigateToPage(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    currentPage === mode
                      ? 'bg-[var(--color-accent)] text-white font-bold shadow-sm'
                      : 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Render Current Auth Page View */}
          <div>
            {currentPage === 'login' && <LoginPage />}
            {currentPage === 'signup' && <SignupPage />}
            {currentPage === 'forgot-password' && <ForgotPasswordPage />}
            {currentPage === 'verify-email' && <VerifyEmailPage />}
            {currentPage === 'unauthorized' && <UnauthorizedPage onLoginRedirect={() => navigateToPage('login')} />}
            {currentPage === 'profile' && (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          </div>
        </div>
      )}

      {/* View 0B: User Profile View */}
      {(activeSection === 'user-profile' || activeSection === 'profile') && <ProfilePage />}
      {activeSection === 'aura-core-status' && (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 text-xs font-semibold text-[var(--color-accent)] mb-3">
              <Zap className="w-3.5 h-3.5" /> Milestone 7 — Desktop Application Shell
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              The Desktop Workspace Shell is Live.
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
              Aura Life OS runs inside a responsive, token-driven desktop shell featuring a resizable sidebar, sticky top navigation, floating dock, status footer, and command palette integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="System Hydration"
              value="0.0 ms"
              subvalue="Zero-overhead cold start"
              status="success"
            />
            <MetricCard
              label="Platform OS"
              value={platform.os}
              subvalue="Traffic light inset support"
              status="info"
            />
            <MetricCard
              label="Active Theme"
              value={currentTheme.name}
              subvalue={`${theme} mode (${resolvedTheme})`}
              status="info"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Initialized Providers & Services
                </h3>
                <Badge variant="success" size="sm">
                  100% Operational
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  'Theme Registry & Token Engine',
                  'Sidebar Navigation Engine (⌘B)',
                  'System Notification Center',
                  'Command Palette Dispatcher (⌘K)',
                  'Fluid Motion & Animation Engine',
                  'Global Keyboard Shortcut Router',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                    <span className="font-medium">{item}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
                  <Command className="w-4 h-4 text-[var(--color-accent)]" /> Registered Desktop Hotkeys
                </h3>
                <Badge variant="accent" size="sm">
                  Active Listeners
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">Command Palette</span>
                  <kbd className="px-2 py-1 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-[10px] font-semibold text-[var(--color-accent)]">
                    {formatShortcutForOS('meta+k')}
                  </kbd>
                </div>
                <div className="p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">Toggle Sidebar</span>
                  <kbd className="px-2 py-1 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-[10px] font-semibold text-[var(--color-accent)]">
                    {formatShortcutForOS('meta+b')}
                  </kbd>
                </div>
                <div className="p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)] font-medium">Toggle Theme Mode</span>
                  <kbd className="px-2 py-1 rounded bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-[10px] font-semibold text-[var(--color-accent)]">
                    {formatShortcutForOS('meta+j')}
                  </kbd>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 2: Architecture Tree */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">Desktop Shell Architecture</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Complete implementation layout of <code className="font-mono text-[var(--color-accent)]">components/shell/</code> directory.
            </p>
          </div>

          <Card className="p-6 font-mono text-xs space-y-4">
            <div className="text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-widest">
              Directory Manifest
            </div>
            <pre className="p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] leading-relaxed overflow-x-auto">
{`components/shell/
├── app-shell/               [AppShell Orchestration]
├── sidebar/                 [Collapsible & Resizable Sidebar]
├── top-navigation/          [Sticky Top Header & Controls]
├── content-container/       [Scroll & MaxWidth Manager]
├── workspace/               [Multi-Pane Canvas & Switcher]
├── footer/                  [Desktop Status Bar]
├── dock/                    [Floating Bottom Dock]
├── command-trigger/         [Global Search Trigger (⌘K)]
├── notification-trigger/    [Unread Notification Bell]
└── profile-trigger/         [User Profile Status]`}</pre>
          </Card>
        </div>
      )}

      {/* View 3: Performance Stacks */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">Performance & Hydration</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Real-time runtime diagnostics for the desktop shell application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="FPS & Frame Stability"
              value="60 FPS"
              progress={100}
            />
            <StatsCard
              title="Motion Reduction"
              value={prefersReducedMotion ? 'Enabled' : 'Full Physics'}
              progress={prefersReducedMotion ? 50 : 100}
            />
          </div>
        </div>
      )}

      {/* View 4: Primitive Component Library */}
      {activeSection === 'components' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">Primitive Component Library</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Milestone 5 component library running inside Milestone 7 Desktop Shell.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Buttons & Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">
                  Primary Action
                </Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Badge variant="accent">Accent Badge</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Progress & Inputs
              </h4>
              <div className="space-y-3">
                <Progress value={75} size="sm" />
                <Input placeholder="Type something..." />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 5: Design Tokens */}
      {activeSection === 'tokens' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">Design Tokens</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Token-driven color palette, typography, and motion presets.
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Monochrome Token Swatches
            </h4>
            <div className="grid grid-cols-8 gap-3">
              <div className="h-12 bg-black rounded-xl border border-black" title="Black" />
              <div className="h-12 bg-[#222222] rounded-xl" title="#222222" />
              <div className="h-12 bg-[#444444] rounded-xl" title="#444444" />
              <div className="h-12 bg-[#666666] rounded-xl" title="#666666" />
              <div className="h-12 bg-[#999999] rounded-xl" title="#999999" />
              <div className="h-12 bg-[#CCCCCC] rounded-xl" title="#CCCCCC" />
              <div className="h-12 bg-[#EEEEEE] rounded-xl" title="#EEEEEE" />
              <div className="h-12 bg-white rounded-xl border border-[#E5E5E5]" title="White" />
            </div>
          </Card>
        </div>
      )}

      {/* View 6: Notifications Hub */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-2">Notification Hub</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {notifications.length} active notification{notifications.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  addNotification({
                    title: 'System Notice',
                    message: 'All application modules are operational and synced.',
                    type: 'info',
                  });
                }}
              >
                Send Test Alert
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSection('settings')}
              >
                Notification Settings
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]">
                <Bell className="w-8 h-8 text-[var(--color-text-tertiary)] mb-3" />
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">No notifications</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">You're all caught up.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Card key={n.id} className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--color-text-primary)]">{n.title}</div>
                    {n.message && <div className="text-xs text-[var(--color-text-muted)]">{n.message}</div>}
                  </div>
                  <Badge variant={n.type === 'error' ? 'error' : 'accent'}>{n.type}</Badge>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* View 7: System Settings Framework (Milestone 9) */}
      {activeSection === 'settings' && <SettingsLayout />}

      {/* View 8: Tasks Engine (Milestone 12) */}
      {(activeSection === 'tasks' || activeSection === 'tasks-sidebar-main') && <TasksPage />}

      {/* View 9: Habits Engine (Milestone 13) */}
      {(activeSection === 'habits' || activeSection === 'habits-sidebar-main') && <HabitsPage />}

      {/* View 10: Goals & Projects OS (Milestone 14) */}
      {(activeSection === 'goals' || activeSection === 'goals-sidebar-main') && <GoalsPage />}

      {/* View 11: Calendar & Planner OS (Milestone 15) */}
      {(activeSection === 'calendar' || activeSection === 'calendar-sidebar-main') && <CalendarPage />}

      {/* View 12: Journal, Notes & Second Brain (Milestone 16) */}
      {(activeSection === 'journal' || activeSection === 'journal-sidebar-main') && <JournalPage />}

      {/* View 13: Finance & Wealth OS (Milestone 17) */}
      {(activeSection === 'finance' || activeSection === 'finance-sidebar-main') && <FinancePage />}

      {/* View 14: Aura Intelligence AI OS (Milestone 19) */}
      {(activeSection === 'ai' || activeSection === 'ai-sidebar-main') && (
        <AuraAIPage onNavigateToSection={(section) => setActiveSection(section)} />
      )}

      {/* View 15: Aura Analytics & Life Score Engine (Milestone 20) */}
      {(activeSection === 'analytics' || activeSection === 'analytics-sidebar-main') && (
        <ModuleIsolationBoundary moduleName="Analytics">
          <AnalyticsPage />
        </ModuleIsolationBoundary>
      )}

      {/* View 16: Aura Cloud Infrastructure & Sync Engine (Milestone 21) */}
      {(activeSection === 'cloud' || activeSection === 'cloud-sidebar-main') && (
        <ModuleIsolationBoundary moduleName="Cloud Sync">
          <CloudScreen />
        </ModuleIsolationBoundary>
      )}

      </React.Suspense>

      {/* Milestone 11 — Global Search, Command Palette (⌘K), & Notification Center Modals */}
      <CommandPaletteModal onNavigate={(path) => setActiveSection(path.replace('/', ''))} />
      <NotificationCenterDrawer />
      <NotificationToast />
    </AppShell>
    </>
  );

  return (
    <GlobalErrorBoundary>
      <CloudSyncProvider>
        {shellContent}
      </CloudSyncProvider>
    </GlobalErrorBoundary>
  );
}

