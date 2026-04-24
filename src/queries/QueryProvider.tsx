import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { authModule } from "@/api/modules/auth.module";
import type { InitialAuthSession } from "@/lib/auth-bootstrap.functions";
import { setAuthSessionState } from "@/lib/auth-session";
import { clearCurrentUser, rememberCurrentUser } from "@/lib/current-user";
import { clearCurrentWorkspace, rememberCurrentWorkspace } from "@/lib/current-workspace";
import { createQueryClient } from "@/queries/client";
import { queryKeys } from "@/queries/keys";
import { useCurrentUser } from "@/queries/modules/auth.queries";

export function QueryProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: InitialAuthSession;
}) {
  const [queryClient] = useState(() => {
    const client = createQueryClient();

    if (initialSession.user) {
      client.setQueryData(queryKeys.auth.me(), initialSession.user);
    } else {
      client.setQueryData(queryKeys.auth.me(), null);
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap initialSession={initialSession} />
      <AuthStateSync />
      {children}
    </QueryClientProvider>
  );
}

function AuthBootstrap({ initialSession }: { initialSession: InitialAuthSession }) {
  const queryClient = useQueryClient();
  const initialUserId = initialSession.user?.id ?? null;
  const initialWorkspaceId = initialSession.workspace?.id ?? null;
  const initialAccessToken = initialSession.accessToken ?? null;
  const initialStatus = initialSession.status;
  const initialUserRef = useRef(initialSession.user);
  const initialWorkspaceRef = useRef(initialSession.workspace);

  initialUserRef.current = initialSession.user;
  initialWorkspaceRef.current = initialSession.workspace;

  useEffect(() => {
    if (initialStatus === "authenticated" && initialUserRef.current) {
      authModule.rememberAccessToken(initialAccessToken);
      rememberCurrentUser(initialUserRef.current);
      queryClient.setQueryData(queryKeys.auth.me(), initialUserRef.current);

      if (initialWorkspaceRef.current) {
        rememberCurrentWorkspace(initialWorkspaceRef.current);
      } else {
        clearCurrentWorkspace();
      }

      setAuthSessionState({ status: "authenticated" });
    } else {
      authModule.rememberAccessToken(null);
      clearCurrentUser();
      clearCurrentWorkspace();
      queryClient.setQueryData(queryKeys.auth.me(), null);
      setAuthSessionState({ status: "unauthenticated" });
    }
  }, [initialAccessToken, initialStatus, initialUserId, initialWorkspaceId, queryClient]);

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
