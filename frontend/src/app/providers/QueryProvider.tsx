import React from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { notify } from "@/services/notifications";
import { getApiErrorMessage } from "@/utils/apiError";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.silentError) notify.error(getApiErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silentError) return;
      const fallback =
        typeof mutation.meta?.errorMessage === "string"
          ? mutation.meta.errorMessage
          : undefined;
      notify.error(getApiErrorMessage(error, fallback));
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      if (typeof mutation.meta?.successMessage === "string")
        notify.success(mutation.meta.successMessage);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      gcTime: 1000 * 60 * 15, // 15 phút (thay thế cacheTime trong v5)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
