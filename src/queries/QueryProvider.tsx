import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { authModule } from "@/api/modules/auth.module";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { setAuthSessionState } from "@/lib/auth-session";
import { clearCurrentUser, rememberCurrentUser } from "@/lib/current-user";
import { clearCurrentWorkspace, rememberCurrentWorkspace } from "@/lib/current-workspace";
import { createQueryClient } from "@/queries/client";
import { queryKeys } from "@/queries/keys";
import { useCurrentUser } from "@/queries/modules/auth.queries";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <AuthStateSync />
      {children}
    </QueryClientProvider>
  );
}

function AuthBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setAuthSessionState({ status: "pending" });

      try {
        const auth = await authModule.refresh();
        if (cancelled) return;

        authModule.rememberAccessToken(auth.accessToken);
        rememberCurrentUser(auth.user);
        queryClient.setQueryData(queryKeys.auth.me(), auth.user);

        if (auth.activeWorkspaceId) {
          const workspace = await workspacesModule.getById(auth.activeWorkspaceId);
          if (cancelled) return;
          rememberCurrentWorkspace(workspace);
        } else {
          clearCurrentWorkspace();
        }

        setAuthSessionState({ status: "authenticated" });
      } catch {
        if (cancelled) return;

        authModule.rememberAccessToken(null);
        clearCurrentUser();
        clearCurrentWorkspace();
        queryClient.setQueryData(queryKeys.auth.me(), null);
        setAuthSessionState({ status: "unauthenticated" });
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  return null;
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
