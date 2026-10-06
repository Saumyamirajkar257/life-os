import type { ReactNode } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'destructive';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface WithLoadingState {
  isLoading?: boolean;
  loadingText?: string;
}

export interface WithDisabledState {
  disabled?: boolean;
}

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';
