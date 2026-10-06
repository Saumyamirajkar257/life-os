/**
 * @file cn.ts
 * @description Class name utility combining clsx and tailwind-merge for conflict-free Tailwind styling.
 * @module AuraCore/Lib/Utils/cn
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional classnames and merges conflicting Tailwind classes.
 *
 * @param inputs - List of class values, expressions, or conditional objects
 * @returns Filtered, merged class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
