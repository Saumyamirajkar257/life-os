/**
 * @file colors.ts
 * @description Design token system for color palettes, surface scales, and semantic tokens.
 * Uses <5% HSB saturation warm/cool neutral balances to avoid generic pure black/white.
 * @module AuraCore/Tokens/Colors
 */

export const COLOR_TOKENS = {
  // Neutral Base Scale (Cool Slate-Zinc Hue 220, <5% Saturation)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#080c14',
  },

  // Primary Accent Token Scale (Refined Indigo-Violet)
  accent: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Semantic System Colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Dark/Light Theme Mapping Variables
  lightTheme: {
    background: '#fafafa',
    surface: '#ffffff',
    surfaceElevated: '#f4f4f5',
    border: '#e4e4e7',
    borderSubtle: '#f4f4f5',
    textPrimary: '#09090b',
    textSecondary: '#71717a',
    textMuted: '#a1a1aa',
    accent: '#6366f1',
    accentFocus: '#4f46e5',
  },

  darkTheme: {
    background: '#09090b',
    surface: '#121215',
    surfaceElevated: '#18181b',
    border: '#27272a',
    borderSubtle: '#18181b',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    accent: '#818cf8',
    accentFocus: '#6366f1',
  },
} as const;

export type ColorTokens = typeof COLOR_TOKENS;
