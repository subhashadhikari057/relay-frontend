import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authModule } from "@/api/modules/auth.module";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { getCurrentUser, rememberCurrentUser } from "@/lib/current-user";
import { rememberCurrentWorkspace } from "@/lib/current-workspace";
import { allowOnboardingAccess } from "@/lib/onboarding-access";
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

  if (redirectTo === "/onboarding") {
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
