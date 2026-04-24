import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { rememberCurrentUser } from "@/lib/current-user";
import { createQueryClient } from "@/queries/client";
import { useCurrentUser } from "@/queries/modules/auth.queries";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateSync />
      {children}
    </QueryClientProvider>
  );
}

function AuthStateSync() {
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      rememberCurrentUser(currentUser);
    }
  }, [currentUser]);

  return null;
}
