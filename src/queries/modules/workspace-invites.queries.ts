import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceInvitesModule } from "@/api/modules/workspace-invites.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type { WorkspaceInviteAcceptResponse } from "@/types/api.types";

export function useAcceptWorkspaceInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation<WorkspaceInviteAcceptResponse, ApiError, { inviteToken: string }>({
    mutationFn: ({ inviteToken }) => workspaceInvitesModule.acceptInvite(inviteToken),
    onSuccess: () => {
      // Membership changes can affect "my workspaces" and workspace member lists.
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.mine() });
    },
  });
}
