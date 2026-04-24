import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authModule } from "@/api/modules/auth.module";
import { getCurrentUser, rememberCurrentUser } from "@/lib/current-user";
import { allowOnboardingAccess } from "@/lib/onboarding-access";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  AuthTokenResponse,
  AuthUser,
  GoogleLoginRequest,
  SignupRequest,
} from "@/types/api.types";

function handleAuthSuccess(
  data: AuthTokenResponse,
  redirectTo: "/app" | "/onboarding",
  queryClient: ReturnType<typeof useQueryClient>,
  navigate: ReturnType<typeof useNavigate>,
) {
  authModule.rememberAccessToken(data.accessToken);
  rememberCurrentUser(data.user);
  queryClient.setQueryData(queryKeys.auth.me(), data.user);
  const nextRoute =
    redirectTo === "/onboarding" && data.activeWorkspaceId ? "/app" : redirectTo;

  if (nextRoute === "/onboarding") {
    allowOnboardingAccess();
  }
  void navigate({ to: nextRoute });
}

export function useGoogleLoginMutation(redirectTo: "/app" | "/onboarding" = "/app") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<AuthTokenResponse, ApiError, GoogleLoginRequest>({
    mutationFn: (payload) => authModule.loginWithGoogle(payload),
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
