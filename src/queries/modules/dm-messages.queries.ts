import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dmMessagesModule } from "@/api/modules/dm-messages.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  CreateMessageRequest,
  ListMessagesParams,
  ListMessagesResponse,
  MessageItem,
} from "@/types/api.types";

type CreateDmMessageInput = {
  workspaceId: string;
  directConversationId: string;
  payload: CreateMessageRequest;
};

const defaultListParams = {
  limit: 50,
} satisfies ListMessagesParams;

export function useDmMessages(
  workspaceId?: string | null,
  directConversationId?: string | null,
  params: ListMessagesParams = defaultListParams,
) {
  return useQuery<ListMessagesResponse, ApiError>({
    queryKey:
      workspaceId && directConversationId
        ? queryKeys.dms.messagesList(workspaceId, directConversationId, params)
        : queryKeys.dms.messagesList("missing-workspace", "missing-dm", params),
    queryFn: () =>
      dmMessagesModule.list(workspaceId as string, directConversationId as string, params),
    enabled: Boolean(workspaceId && directConversationId),
    staleTime: 15_000,
    gcTime: 10 * 60_000,
  });
}

export function useCreateDmMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation<MessageItem, ApiError, CreateDmMessageInput>({
    mutationFn: ({ workspaceId, directConversationId, payload }) =>
      dmMessagesModule.create(workspaceId, directConversationId, payload),
    onSuccess: (message, variables) => {
      queryClient.setQueryData<ListMessagesResponse>(
        queryKeys.dms.messagesList(
          variables.workspaceId,
          variables.directConversationId,
          defaultListParams,
        ),
        (current) => {
          if (!current) return { count: 1, messages: [message] };
          if (current.messages.some((m) => m.id === message.id)) return current;
          return { ...current, count: current.count + 1, messages: [message, ...current.messages] };
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Could not send message.");
    },
  });
}
