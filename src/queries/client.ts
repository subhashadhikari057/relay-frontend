import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/api/client";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          const apiError = error as Partial<ApiError>;
          if ([400, 401, 403, 404, 422].includes(apiError.statusCode ?? 0)) {
            return false;
          }

          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
