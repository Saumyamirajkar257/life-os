/**
 * @file AppearanceSettings.tsx
 * @description Theme selector, accent color picker, animation controls, and reduced motion settings.
 * @module Features/Settings/Components/Sections/AppearanceSettings
 */

import React, { useState } from 'react';
import { Palette, Sparkles, Monitor, Sun, Moon, Eye, Zap, Type, Check } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { ACCENT_COLOR_PRESETS } from '../../constants';
import { ThemeId, ThemeMode } from '@/types/theme';
import { AccentColorId, AnimationSpeed, ReducedMotionPreference, FontScaleOption } from '../../types';

interface ThemeCardOption {
  id: ThemeMode;
  name: string;
  description: string;
  category: 'dark' | 'light' | 'system';
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
}

const THEME_CARDS: ThemeCardOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Deep navy canvas with subtle blue glass highlights.',
    category: 'dark',
    previewBg: '#0b1120',
    previewBorder: '#1f293d',
    previewAccent: '#3b82f6',
  },
  {
    id: 'light',
    name: 'Aura Light',
    description: 'Clean high-clarity white canvas with subtle slate borders.',
    category: 'light',
    previewBg: '#f8fafc',
    previewBorder: '#e2e8f0',
    previewAccent: '#2563eb',
  },
  {
    id: 'amoled',
    name: 'OLED Pure Black',
    description: 'True #000000 black canvas for maximum contrast.',
    category: 'dark',
    previewBg: '#000000',
    previewBorder: '#262626',
    previewAccent: '#38bdf8',
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Cosmic teal canvas with emerald and purple glow accents.',
    category: 'dark',
    previewBg: '#09181d',
    previewBorder: '#163842',
    previewAccent: '#10b981',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Ultra accessible high-contrast stark border aesthetics.',
    category: 'dark',
    previewBg: '#000000',
    previewBorder: '#ffffff',
    previewAccent: '#fbbf24',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    description: 'Futuristic electric cyan & magenta over deep violet.',
    category: 'dark',
    previewBg: '#090814',
    previewBorder: '#2e265c',
    previewAccent: '#06b6d4',
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    description: 'Abyssal space black canvas with icy starlight blue.',
    category: 'dark',
    previewBg: '#030712',
    previewBorder: '#1f2937',
    previewAccent: '#60a5fa',
  },
  {
    id: 'warm-twilight',
    name: 'Warm Twilight',
    description: 'Soft eye-friendly warm charcoal canvas with amber copper accents.',
    category: 'dark',
    previewBg: '#141113',
    previewBorder: '#362f33',
    previewAccent: '#f59e0b',
  },
  {
    id: 'system',
    name: 'System Auto-Detect',
    description: 'Synchronize dynamically with operating system preference.',
    category: 'system',
    previewBg: 'linear-gradient(135deg, #0b1120 50%, #f8fafc 50%)',
    previewBorder: '#64748b',
    previewAccent: '#8b5cf6',
  },
];

export const AppearanceSettings: React.FC = () => {
  const { appearance, updateAppearance, playToggleSound } = useSettings();
  const [customHex, setCustomHex] = useState(appearance.customAccentHex || '');

  const handleThemeSelect = (mode: ThemeMode) => {
    playToggleSound();
    updateAppearance({ themeMode: mode });
  };

  const handleAccentSelect = (colorId: AccentColorId) => {
    playToggleSound();
    updateAppearance({ accentColor: colorId, customAccentHex: undefined });
  };

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      updateAppearance({ customAccentHex: val });
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Theme Canvas Mode</span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Select your primary color scheme and visual canvas theme.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--color-accent)] px-2.5 py-0.5 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
            Active: {appearance.themeMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_CARDS.map((card) => {
            const isSelected = appearance.themeMode === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleThemeSelect(card.id)}
                className={`group text-left p-4 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-elevated)] shadow-lg ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-elevated)]/60'
                }`}
              >
                {/* Visual Swatch Strip */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-6 rounded-md border flex items-center justify-center shadow-sm"
                    style={{
                      background: card.previewBg,
                      borderColor: card.previewBorder,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: card.previewAccent }}
                    />
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {card.name}
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Accent Color Palette Picker */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Accent Color Palette</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Choose a vibrant primary color to highlight interactive elements, buttons, and badges.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {ACCENT_COLOR_PRESETS.map((preset) => {
            const isSelected =
              appearance.accentColor === preset.id && !appearance.customAccentHex;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAccentSelect(preset.id)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-elevated)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)]/60'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full shadow-md flex items-center justify-center border border-white/20"
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                </div>
                <span className="text-[10px] font-mono font-medium text-[var(--color-text-primary)] text-center">
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Color Picker */}
        <div className="pt-2 flex items-center gap-3">
          <div className="text-xs font-medium text-[var(--color-text-secondary)] shrink-0">
            Custom Accent:
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customHex || '#3B82F6'}
              onChange={handleCustomHexChange}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              title="Choose custom accent color"
            />
            <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] uppercase">
              {customHex || 'Default'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Animations & Reduced Motion */}
      <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Animations & Reduced Motion</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Configure UI transition speeds, spring physics, and accessibility reduced motion behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Animations Toggle */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-medium text-[var(--color-text-primary)] cursor-pointer">
                Enable Smooth UI Motion
              </label>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                Toggles micro-interactions and spring animations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateAppearance({ animationsEnabled: !appearance.animationsEnabled });
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                appearance.animationsEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  appearance.animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Animation Speed Selector */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              Animation Speed Multiplier
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-mono">
              {(['slow', 'normal', 'fast', 'off'] as AnimationSpeed[]).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => {
                    playToggleSound();
                    updateAppearance({ animationSpeed: speed });
                  }}
                  className={`py-1.5 rounded-md capitalize transition-colors cursor-pointer ${
                    appearance.animationSpeed === speed
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Accessibility Option */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              Reduced Motion Preference
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-mono">
              {(['system', 'always', 'never'] as ReducedMotionPreference[]).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => {
                    playToggleSound();
                    updateAppearance({ reducedMotion: pref });
                  }}
                  className={`py-1.5 rounded-md capitalize transition-colors cursor-pointer ${
                    appearance.reducedMotion === pref
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Font Density Scale */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-primary)]">
              UI Font Scaling & Density
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs font-mono">
              {(['compact', 'normal', 'spacious'] as FontScaleOption[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => {
                    playToggleSound();
                    updateAppearance({ fontScale: scale });
                  }}
                  className={`py-1.5 rounded-md capitalize transition-colors cursor-pointer ${
                    appearance.fontScale === scale
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {scale}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
