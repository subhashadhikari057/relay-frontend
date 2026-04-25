import { useQuery } from "@tanstack/react-query";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type { WorkspaceMembersResponse } from "@/types/api.types";

export function useWorkspaceMembers(workspaceId?: string | null) {
  return useQuery<WorkspaceMembersResponse, ApiError>({
    queryKey: workspaceId
      ? queryKeys.workspaces.members(workspaceId)
      : queryKeys.workspaces.members("missing-workspace"),
    queryFn: () => workspacesModule.listMembers(workspaceId as string),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}
