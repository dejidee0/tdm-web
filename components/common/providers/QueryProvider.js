"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 2 minutes — no refetch within this window
            staleTime: 2 * 60 * 1000,
            // Keep unused cache for 20 minutes — avoids cold fetches on page navigation
            gcTime: 20 * 60 * 1000,
            // Only retry network/server errors, not 4xx (client errors are final)
            retry: (failureCount, error) => {
              if (error?.status >= 400 && error?.status < 500) return false;
              return failureCount < 2;
            },
            // Window focus refetches cause visible lag when switching tabs — disable
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 0,
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
