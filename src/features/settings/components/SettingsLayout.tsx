/**
 * @file SettingsLayout.tsx
 * @description Main Settings Framework container layout with tab navigation, quick search, and reactive section rendering.
 * @module Features/Settings/Components/SettingsLayout
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Palette,
  Sliders,
  Bell,
  Sparkles,
  Shield,
  CreditCard, // Using for Account
  Settings,
  CheckCircle2
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { SettingsTab } from '../types';
import { ProfileSettings } from './sections/ProfileSettings';
import { AppearanceSettings } from './sections/AppearanceSettings';
import { PersonalizationSettings } from './sections/PersonalizationSettings';
import { NotificationsSettings } from './sections/NotificationsSettings';
import { AuraAISettings } from './sections/AuraAISettings';
import { PrivacySecuritySettings } from './sections/PrivacySecuritySettings';
import { AccountSettings } from './sections/AccountSettings';

interface SettingsTabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const SETTINGS_TABS: SettingsTabConfig[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
  { id: 'personalization', label: 'Personalization', icon: <Sliders className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'ai', label: 'Aura AI', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
  { id: 'privacy', label: 'Privacy & Data', icon: <Shield className="w-4 h-4" /> },
  { id: 'account', label: 'Account', icon: <CreditCard className="w-4 h-4" /> },
];

export const SettingsLayout: React.FC = () => {
  const { activeTab, setActiveTab, lastSavedAt, playToggleSound } = useSettings();

  const handleTabChange = (tabId: SettingsTab) => {
    playToggleSound();
    setActiveTab(tabId);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'personalization':
        return <PersonalizationSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'ai':
        return <AuraAISettings />;
      case 'privacy':
        return <PrivacySecuritySettings />;
      case 'account':
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
              <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Settings</span>
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Make Aura work the way you want.
              </p>
            </div>
          </div>
        </div>

        {/* Sync & Auto-save Status */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-1.5 rounded-full self-start md:self-auto shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Synced</span>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (Desktop) / Horizontal Pills (Mobile) */}
        <div className="lg:col-span-3 space-y-2 relative">
          {/* Mobile Pills Bar */}
          <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 scrollbar-none sticky top-0 z-10 bg-[var(--color-bg)] py-2">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-elevated)] text-white shadow-sm border border-[var(--color-border)]'
                      : 'bg-transparent text-[var(--color-text-secondary)] hover:text-white border border-transparent hover:border-[var(--color-border)]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Vertical Desktop Sidebar */}
          <div className="hidden lg:flex flex-col space-y-1 p-2 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm sticky top-8">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-background)] text-white shadow-sm border border-[var(--color-border)]'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-background)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-[var(--color-text-tertiary)]'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section View Container */}
        <div className="lg:col-span-9 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
