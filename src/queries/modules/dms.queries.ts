import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dmsModule } from "@/api/modules/dms.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  DirectConversationListResponse,
  DirectConversationSummary,
  ListDirectConversationsParams,
  OpenDirectConversationRequest,
} from "@/types/api.types";

const defaultListParams = {
  limit: 50,
} satisfies ListDirectConversationsParams;

export function useWorkspaceDms(
  workspaceId?: string | null,
  params: ListDirectConversationsParams = defaultListParams,
) {
  return useQuery<DirectConversationListResponse, ApiError>({
    queryKey: workspaceId
      ? queryKeys.dms.list(workspaceId, params)
      : queryKeys.dms.list("missing-workspace", params),
    queryFn: () => dmsModule.list(workspaceId as string, params),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useDmDetail(workspaceId?: string | null, directConversationId?: string | null) {
  return useQuery<DirectConversationSummary, ApiError>({
    queryKey:
      workspaceId && directConversationId
        ? queryKeys.dms.detail(workspaceId, directConversationId)
        : queryKeys.dms.detail("missing-workspace", "missing-dm"),
    queryFn: () => dmsModule.getById(workspaceId as string, directConversationId as string),
    enabled: Boolean(workspaceId && directConversationId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

type OpenDmInput = {
  workspaceId: string;
  payload: OpenDirectConversationRequest;
};

export function useOpenDmMutation() {
  const queryClient = useQueryClient();

  return useMutation<DirectConversationSummary, ApiError, OpenDmInput>({
    mutationFn: ({ workspaceId, payload }) => dmsModule.open(workspaceId, payload),
    onSuccess: (conversation, variables) => {
      queryClient.setQueryData<DirectConversationListResponse>(
        queryKeys.dms.list(variables.workspaceId, defaultListParams),
        (current) => {
          if (!current) {
            return { count: 1, conversations: [conversation] };
          }

          const exists = current.conversations.some((c) => c.id === conversation.id);
          if (exists) return current;

          return {
            ...current,
            count: current.count + 1,
            conversations: [conversation, ...current.conversations],
          };
        },
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.dms.lists(variables.workspaceId) });
      toast.success("DM ready", { description: "Conversation opened." });
    },
    onError: (error) => {
      toast.error(error.message || "Could not open DM.");
    },
  });
}
