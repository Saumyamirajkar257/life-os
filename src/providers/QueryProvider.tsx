/**
 * @file QueryProvider.tsx
 * @description TanStack Query client setup and provider wrapper for server state management.
 * @module AuraCore/Providers/Query
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_CONFIG } from '@/config/app.config';

export interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: APP_CONFIG.defaults.queryStaleTimeMs,
            gcTime: APP_CONFIG.defaults.queryGcTimeMs,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
