import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authModule } from "@/api/modules/auth.module";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { workspaceInvitesModule } from "@/api/modules/workspace-invites.module";
import { setAuthSessionState } from "@/lib/auth-session";
import { clearCurrentUser, getCurrentUser, rememberCurrentUser } from "@/lib/current-user";
import { clearCurrentWorkspace, rememberCurrentWorkspace } from "@/lib/current-workspace";
import { allowOnboardingAccess } from "@/lib/onboarding-access";
import { clearPendingInviteToken, getPendingInviteToken } from "@/lib/pending-invite";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  AuthTokenResponse,
  AuthUser,
  GoogleLoginRequest,
  LoginRequest,
  SignupRequest,
} from "@/types/api.types";

async function resolveWorkspaceAfterAuth(activeWorkspaceId?: string | null) {
  try {
    if (activeWorkspaceId) {
      const workspace = await workspacesModule.getById(activeWorkspaceId);
      rememberCurrentWorkspace(workspace);
      return workspace;
    }

    const fallback = await workspacesModule.listMine();
    const workspace = fallback.workspaces[0] ?? null;
    if (workspace) {
      rememberCurrentWorkspace(workspace);
    }

    return workspace;
  } catch {
    return null;
  }
}

async function handleAuthSuccess(
  data: AuthTokenResponse,
  redirectTo: "/app" | "/onboarding",
  queryClient: ReturnType<typeof useQueryClient>,
  navigate: ReturnType<typeof useNavigate>,
) {
  authModule.rememberAccessToken(data.accessToken);
  rememberCurrentUser(data.user);
  queryClient.setQueryData(queryKeys.auth.me(), data.user);

  // If user arrived via invite link while logged out, we store the invite token locally.
  // After auth succeeds, accept the invite first and redirect to the invited workspace.
  const pendingInviteToken = getPendingInviteToken();
  if (pendingInviteToken) {
    try {
      const accepted = await workspaceInvitesModule.acceptInvite(pendingInviteToken);
      clearPendingInviteToken();

      if (accepted.accessToken) {
        authModule.rememberAccessToken(accepted.accessToken);
      }
      if (accepted.user) {
        rememberCurrentUser(accepted.user);
        queryClient.setQueryData(queryKeys.auth.me(), accepted.user);
      }

      if (accepted?.workspaceId) {
        const invitedWorkspace =
          accepted.activeWorkspace && accepted.activeWorkspace.id === accepted.workspaceId
            ? accepted.activeWorkspace
            : await workspacesModule.getById(accepted.workspaceId);
        rememberCurrentWorkspace(invitedWorkspace);

        if (typeof window !== "undefined") {
          window.location.assign(`/app/${invitedWorkspace.slug}`);
          return;
        }

        void navigate({
          to: "/app/$workspaceSlug",
          params: { workspaceSlug: invitedWorkspace.slug },
        });
        return;
      }
    } catch {
      // Token may be expired/invalid or already accepted. Clear it and continue normal flow.
      clearPendingInviteToken();
    }
  }

  const workspace =
    data.activeWorkspace ?? (await resolveWorkspaceAfterAuth(data.activeWorkspaceId));

  if (workspace) {
    rememberCurrentWorkspace(workspace);
  }

  if (workspace?.slug) {
    if (typeof window !== "undefined") {
      window.location.assign(`/app/${workspace.slug}`);
      return;
    }

    void navigate({
      to: "/app/$workspaceSlug",
      params: { workspaceSlug: workspace.slug },
    });
    return;
  }

  if (data.requiresOnboarding || redirectTo === "/onboarding") {
    allowOnboardingAccess();
    if (typeof window !== "undefined") {
      window.location.assign("/onboarding");
      return;
    }

    void navigate({ to: "/onboarding" });
    return;
  }

  if (typeof window !== "undefined") {
    window.location.assign("/sign-in");
    return;
  }

  void navigate({ to: "/sign-in" });
}

export function useGoogleLoginMutation(redirectTo: "/app" | "/onboarding" = "/app") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthTokenResponse, ApiError, GoogleLoginRequest>({
    mutationFn: (payload) => authModule.loginWithGoogle(payload),
    onSuccess: (data) => handleAuthSuccess(data, redirectTo, queryClient, navigate),
  });
}

export function useLoginMutation(redirectTo: "/app" | "/onboarding" = "/app") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthTokenResponse, ApiError, LoginRequest>({
    mutationFn: (payload) => authModule.login(payload),
    onSuccess: (data) => handleAuthSuccess(data, redirectTo, queryClient, navigate),
  });
}

export function useSignupMutation(redirectTo: "/app" | "/onboarding" = "/onboarding") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthTokenResponse, ApiError, SignupRequest>({
    mutationFn: (payload) => authModule.signup(payload),
    onSuccess: (data) => handleAuthSuccess(data, redirectTo, queryClient, navigate),
  });
}

export function useCurrentUser() {
  const queryClient = useQueryClient();

  return useQuery<AuthUser | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      return queryClient.getQueryData<AuthUser>(queryKeys.auth.me()) ?? getCurrentUser();
    },
    initialData: () => queryClient.getQueryData<AuthUser>(queryKeys.auth.me()) ?? getCurrentUser(),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: () => authModule.logout(),
    onSettled: () => {
      authModule.rememberAccessToken(null);
      clearCurrentUser();
      clearCurrentWorkspace();
      queryClient.clear();
      setAuthSessionState({ status: "unauthenticated" });

      if (typeof window !== "undefined") {
        window.location.assign("/sign-in");
        return;
      }

      void navigate({ to: "/sign-in", replace: true });
    },
  });
}
