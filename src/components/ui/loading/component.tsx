/**
 * @file component.tsx
 * @description Accessible Loading screen and overlay component.
 * @module AuraUI/Loading/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Spinner } from '../spinner';
import { LoadingProps } from './types';

export const Loading: React.FC<LoadingProps> = ({
  label = 'Loading...',
  isOverlay = false,
  blurBackdrop = true,
  size = 'lg',
  className,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3 text-center select-none', className)}>
      <Spinner size={size} color="accent" />
      {label && <p className="text-xs font-mono font-medium text-[var(--color-text-muted)] tracking-wider uppercase">{label}</p>}
    </div>
  );

  if (isOverlay) {
    return (
      <div
        className={cn(
          'absolute inset-0 z-40 flex items-center justify-center bg-[var(--color-bg)]/80',
          blurBackdrop && 'backdrop-blur-xs'
        )}
      >
        {content}
      </div>
    );
  }

  return content;
};
