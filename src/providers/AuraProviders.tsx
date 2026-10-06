/**
 * @file AuraProviders.tsx
 * @description Master Provider Composition component wrapping all Aura Core infrastructure providers including AuthProvider.
 * @module AuraCore/Providers/AuraProviders
 */

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { ToastProvider } from './ToastProvider';
import { AuthProvider } from '@/features/auth';

export interface AuraProvidersProps {
  children: React.ReactNode;
}

/**
 * Root provider tree combining Query, Theme, Toast, and Firebase Auth contexts.
 */
export const AuraProviders: React.FC<AuraProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
