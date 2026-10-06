/**
 * @file elevation.ts
 * @description Theme-aware elevation and shadow design tokens for Aura Core.
 * Provides optical depth across surfaces with explicit light/dark elevation profiles.
 * @module AuraCore/DesignSystem/Tokens/Elevation
 */

export interface ElevationLevel {
  shadow: string;
  blur: string;
  spread: string;
  opacity: number;
  cssValue: string;
}

export interface ElevationToken {
  light: ElevationLevel;
  dark: ElevationLevel;
}

export const elevationTokens: Record<string, ElevationToken> = {
  flat: {
    light: { shadow: '0 0 0', blur: '0px', spread: '0px', opacity: 0, cssValue: 'none' },
    dark: { shadow: '0 0 0', blur: '0px', spread: '0px', opacity: 0, cssValue: 'none' },
  },
  low: {
    light: {
      shadow: '0 1px 2px',
      blur: '2px',
      spread: '0px',
      opacity: 0.05,
      cssValue: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    dark: {
      shadow: '0 1px 2px',
      blur: '2px',
      spread: '0px',
      opacity: 0.3,
      cssValue: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    },
  },
  medium: {
    light: {
      shadow: '0 4px 6px -1px',
      blur: '6px',
      spread: '-1px',
      opacity: 0.08,
      cssValue: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    },
    dark: {
      shadow: '0 4px 6px -1px',
      blur: '6px',
      spread: '-1px',
      opacity: 0.4,
      cssValue: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    },
  },
  high: {
    light: {
      shadow: '0 10px 15px -3px',
      blur: '15px',
      spread: '-3px',
      opacity: 0.1,
      cssValue: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    },
    dark: {
      shadow: '0 10px 15px -3px',
      blur: '15px',
      spread: '-3px',
      opacity: 0.5,
      cssValue: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    },
  },
  floating: {
    light: {
      shadow: '0 20px 25px -5px',
      blur: '25px',
      spread: '-5px',
      opacity: 0.12,
      cssValue: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    },
    dark: {
      shadow: '0 20px 25px -5px',
      blur: '25px',
      spread: '-5px',
      opacity: 0.6,
      cssValue: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    },
  },
  modal: {
    light: {
      shadow: '0 25px 50px -12px',
      blur: '50px',
      spread: '-12px',
      opacity: 0.25,
      cssValue: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    dark: {
      shadow: '0 25px 50px -12px',
      blur: '50px',
      spread: '-12px',
      opacity: 0.7,
      cssValue: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    },
  },
} as const;

export type ElevationTokenKey = keyof typeof elevationTokens;
