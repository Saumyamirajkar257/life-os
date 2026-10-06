/**
 * @file component.tsx
 * @description Custom scrollable container with theme-integrated scrollbars.
 * @module AuraUI/ScrollArea/Component
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ScrollAreaProps } from './types';

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ maxHeight, children, className, orientation = 'vertical', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ maxHeight: maxHeight, ...style }}
        className={cn(
          'relative overflow-auto custom-scrollbar',
          orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
          orientation === 'horizontal' && 'overflow-y-hidden overflow-x-auto',
          orientation === 'both' && 'overflow-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';
