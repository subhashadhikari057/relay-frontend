import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { onboardingModule } from "@/api/modules/onboarding.module";
import { uploadModule } from "@/api/modules/upload.module";
import { authModule } from "@/api/modules/auth.module";
import { rememberCurrentUser } from "@/lib/current-user";
import { rememberCurrentWorkspace } from "@/lib/current-workspace";
import { clearOnboardingAccess } from "@/lib/onboarding-access";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type { CompleteOnboardingRequest, CompleteOnboardingResponse } from "@/types/api.types";

type CompleteOnboardingInput = {
  payload: CompleteOnboardingRequest;
  userAvatarFile?: File | null;
  workspaceAvatarFile?: File | null;
};

async function maybeUpload(file?: File | null) {
  if (!file) return undefined;
  const uploaded = await uploadModule.uploadSingle(file);
  return uploaded.file.url;
}

export function useCompleteOnboardingMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<CompleteOnboardingResponse, ApiError, CompleteOnboardingInput>({
    mutationFn: async ({ payload, userAvatarFile, workspaceAvatarFile }) => {
      const [userAvatarUrl, workspaceAvatarUrl] = await Promise.all([
        maybeUpload(userAvatarFile),
        maybeUpload(workspaceAvatarFile),
      ]);

      return onboardingModule.complete({
        ...payload,
        workspace: {
          ...payload.workspace,
          ...(workspaceAvatarUrl ? { avatarUrl: workspaceAvatarUrl } : {}),
        },
        userProfile: payload.userProfile
          ? {
              ...payload.userProfile,
              ...(userAvatarUrl ? { avatarUrl: userAvatarUrl } : {}),
            }
          : userAvatarUrl
            ? { avatarUrl: userAvatarUrl }
            : undefined,
      });
    },
    onSuccess: (data) => {
      authModule.rememberAccessToken(data.accessToken);
      rememberCurrentUser(data.user);
      rememberCurrentWorkspace(data.workspace);
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      clearOnboardingAccess();
      void navigate({
        to: "/app/$workspaceSlug",
        params: { workspaceSlug: data.workspace.slug },
      });
    },
  });
}
