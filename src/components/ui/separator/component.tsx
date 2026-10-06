/**
 * @file component.tsx
 * @description Accessible semantic Separator primitive component.
 * @module AuraUI/Separator/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { SeparatorProps } from './types';

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  decorative = true,
  className,
}) => {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'shrink-0 bg-[var(--color-border)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  );
};
