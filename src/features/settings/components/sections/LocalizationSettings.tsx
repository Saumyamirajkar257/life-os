/**
 * @file LocalizationSettings.tsx
 * @description Regional preferences, language, timezone, date & time formatting.
 * @module Features/Settings/Components/Sections/LocalizationSettings
 */

import React from 'react';
import { Globe, Clock, Calendar, Languages, Check } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../../constants';
import { SupportedLanguage, DateFormatOption, TimeFormatOption, FirstDayOfWeek } from '../../types';

export const LocalizationSettings: React.FC = () => {
  const { localization, updateLocalization, playToggleSound } = useSettings();

  return (
    <div className="space-y-8">
      {/* 1. Language Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Languages className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Language & Region</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Select system display language and regional locale presets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = localization.language === lang.value;

            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => {
                  playToggleSound();
                  updateLocalization({ language: lang.value });
                }}
                className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-elevated)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)]/60'
                }`}
              >
                <div>
                  <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">
                    {lang.label}
                  </h4>
                  <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                    {lang.nativeName}
                  </p>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Timezone Settings */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Timezone & Time System</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Configure system clock, offset standards, and timezone resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezone Selector */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              Active Timezone
            </label>
            <select
              value={localization.timezone}
              onChange={(e) => {
                playToggleSound();
                updateLocalization({ timezone: e.target.value });
              }}
              className="w-full h-10 px-3 text-xs font-mono rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none cursor-pointer"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Format Toggle (12h vs 24h) */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              Clock Display Format
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  playToggleSound();
                  updateLocalization({ timeFormat: '12h' });
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  localization.timeFormat === '12h'
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                12-Hour (10:30 PM)
              </button>
              <button
                type="button"
                onClick={() => {
                  playToggleSound();
                  updateLocalization({ timeFormat: '24h' });
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  localization.timeFormat === '24h'
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                24-Hour (22:30)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Date Formatting */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Date & Calendar Formatting</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Define date representation strings and calendar starting weekday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Format Options */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              Date Representation
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(
                [
                  'YYYY-MM-DD',
                  'MM/DD/YYYY',
                  'DD/MM/YYYY',
                  'MMMM D, YYYY',
                ] as DateFormatOption[]
              ).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => {
                    playToggleSound();
                    updateLocalization({ dateFormat: fmt });
                  }}
                  className={`p-2.5 rounded-lg border transition-colors text-center cursor-pointer ${
                    localization.dateFormat === fmt
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-elevated)] text-[var(--color-accent)] font-semibold'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* First Day of Week */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              First Day of the Week
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  playToggleSound();
                  updateLocalization({ firstDayOfWeek: 'monday' });
                }}
                className={`py-2 rounded-md transition-colors cursor-pointer ${
                  localization.firstDayOfWeek === 'monday'
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Monday (ISO)
              </button>
              <button
                type="button"
                onClick={() => {
                  playToggleSound();
                  updateLocalization({ firstDayOfWeek: 'sunday' });
                }}
                className={`py-2 rounded-md transition-colors cursor-pointer ${
                  localization.firstDayOfWeek === 'sunday'
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Sunday
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
