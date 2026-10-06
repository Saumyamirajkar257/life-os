/**
 * @file colors.ts
 * @description Three-Layer Color Design Token System for Aura Core.
 * - Layer 1: Primitive Scales (Raw HSL / Hex values)
 * - Layer 2: Semantic Tokens (Functional dark/light theme roles)
 * - Layer 3: Component Tokens (Context-specific control tokens)
 * @module AuraCore/DesignSystem/Tokens/Colors
 */

// -----------------------------------------------------------------------------
// LAYER 1: PRIMITIVE TOKENS
// -----------------------------------------------------------------------------
export const primitiveColors = {
  // Neutral Scale (Cool Slate-Zinc Hue 220, <5% Saturation)
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
  // Pure Monochrome Scale
  mono: {
    black: '#000000',
    darkest: '#09090b',
    dark: '#121215',
    mediumDark: '#18181b',
    borderDark: '#27272a',
    gray: '#666666',
    grayMuted: '#999999',
    grayLight: '#cccccc',
    borderLight: '#eeeeee',
    light: '#f5f5f5',
    lightest: '#fdfdfd',
    white: '#ffffff',
  },
  // Accent Indigo/Violet Scale
  indigo: {
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
  // Status Colors
  emerald: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },
  amber: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  rose: {
    50: '#fff1f2',
    500: '#f43f5e',
    600: '#e11d48',
  },
  sky: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    600: '#0284c7',
  },
} as const;

// -----------------------------------------------------------------------------
// LAYER 2: SEMANTIC TOKENS
// -----------------------------------------------------------------------------
export const semanticColors = {
  light: {
    bg: primitiveColors.mono.lightest,
    surface: primitiveColors.mono.white,
    surfaceElevated: primitiveColors.mono.light,
    border: primitiveColors.mono.borderLight,
    borderSubtle: '#f0f0f0',

    textPrimary: primitiveColors.mono.black,
    textSecondary: primitiveColors.mono.gray,
    textMuted: primitiveColors.mono.grayMuted,

    accent: primitiveColors.mono.black,
    accentHover: '#333333',
    accentForeground: primitiveColors.mono.white,

    success: primitiveColors.emerald[500],
    successBg: primitiveColors.emerald[50],
    warning: primitiveColors.amber[500],
    warningBg: primitiveColors.amber[50],
    error: primitiveColors.rose[500],
    errorBg: primitiveColors.rose[50],
    info: primitiveColors.sky[500],
    infoBg: primitiveColors.sky[50],

    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    bg: primitiveColors.mono.darkest,
    surface: primitiveColors.mono.dark,
    surfaceElevated: primitiveColors.mono.mediumDark,
    border: primitiveColors.mono.borderDark,
    borderSubtle: '#1f1f23',

    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: primitiveColors.mono.grayMuted,

    accent: primitiveColors.mono.white,
    accentHover: '#e4e4e7',
    accentForeground: primitiveColors.mono.black,

    success: '#34d399',
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#fbbf24',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    error: '#f87171',
    errorBg: 'rgba(244, 63, 94, 0.1)',
    info: '#38bdf8',
    infoBg: 'rgba(14, 165, 233, 0.1)',

    overlay: 'rgba(0, 0, 0, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

// -----------------------------------------------------------------------------
// LAYER 3: COMPONENT TOKENS
// -----------------------------------------------------------------------------
export const componentColors = {
  button: {
    primaryBg: 'var(--color-accent)',
    primaryText: 'var(--color-accent-foreground)',
    secondaryBg: 'var(--color-surface-elevated)',
    secondaryText: 'var(--color-text-primary)',
    secondaryBorder: 'var(--color-border)',
  },
  sidebar: {
    bg: 'var(--color-surface-elevated)',
    border: 'var(--color-border)',
    activeItemBg: 'var(--color-surface)',
    activeItemText: 'var(--color-text-primary)',
    inactiveItemText: 'var(--color-text-secondary)',
  },
  input: {
    bg: 'var(--color-surface)',
    border: 'var(--color-border)',
    borderFocus: 'var(--color-text-primary)',
    placeholderText: 'var(--color-text-muted)',
  },
  card: {
    bg: 'var(--color-surface)',
    border: 'var(--color-border)',
  },
  modal: {
    bg: 'var(--color-surface)',
    border: 'var(--color-border)',
    overlayBg: 'var(--color-overlay)',
  },
  tooltip: {
    bg: 'var(--color-text-primary)',
    text: 'var(--color-bg)',
  },
  navigation: {
    headerBg: 'var(--color-surface)',
    headerBorder: 'var(--color-border)',
  },
  commandPalette: {
    bg: 'var(--color-surface)',
    border: 'var(--color-border)',
    itemHoverBg: 'var(--color-surface-elevated)',
  },
} as const;

export const colorTokens = {
  primitives: primitiveColors,
  semantics: semanticColors,
  components: componentColors,
} as const;

export type ColorTokens = typeof colorTokens;
