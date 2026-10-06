/**
 * @file types.ts
 * @description Type definitions for Aura UI Card component.
 * @module AuraUI/Card/Types
 */

import { ReactNode, HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'elevated' | 'glass' | 'borderless';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  isInteractive?: boolean;
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
