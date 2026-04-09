// lib/react-query/providers.tsx
'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
// Optional: Remove DevTools if not installed
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error('Query error:', error);
        if (query.meta?.errorMessage) {
          toast.error(query.meta.errorMessage as string);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        console.error('Mutation error:', error);
        if (mutation.meta?.errorMessage) {
          toast.error(mutation.meta.errorMessage as string);
        }
      },
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          toast.success(mutation.meta.successMessage as string);
        }
      },
    }),
  });
};

let clientQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return createQueryClient();
  }
  
  // Browser: reuse existing client
  if (!clientQueryClient) {
    clientQueryClient = createQueryClient();
  }
  
  return clientQueryClient;
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Remove ReactQueryDevtools if not installed */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}