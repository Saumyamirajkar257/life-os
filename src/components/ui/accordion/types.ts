/**
 * @file types.ts
 * @description Type definitions for Aura UI Accordion component.
 * @module AuraUI/Accordion/Types
 */

import { ReactNode } from 'react';

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  type?: 'single' | 'multiple';
  defaultExpandedIds?: string[];
  className?: string;
}
