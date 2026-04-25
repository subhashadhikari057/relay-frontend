import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { channelMessagesModule } from "@/api/modules/channel-messages.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  CreateMessageRequest,
  ListMessagesParams,
  ListMessagesResponse,
  MessageItem,
} from "@/types/api.types";

type CreateChannelMessageInput = {
  workspaceId: string;
  channelId: string;
  payload: CreateMessageRequest;
};

const defaultListParams = {
  limit: 50,
} satisfies ListMessagesParams;

export function useChannelMessages(
  workspaceId?: string | null,
  channelId?: string | null,
  params: ListMessagesParams = defaultListParams,
) {
  return useQuery<ListMessagesResponse, ApiError>({
    queryKey:
      workspaceId && channelId
        ? queryKeys.channels.messagesList(workspaceId, channelId, params)
        : queryKeys.channels.messagesList("missing-workspace", "missing-channel", params),
    queryFn: () => channelMessagesModule.list(workspaceId as string, channelId as string, params),
    enabled: Boolean(workspaceId && channelId),
    staleTime: 15_000,
    gcTime: 10 * 60_000,
  });
}

export function useCreateChannelMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation<MessageItem, ApiError, CreateChannelMessageInput>({
    mutationFn: ({ workspaceId, channelId, payload }) =>
      channelMessagesModule.create(workspaceId, channelId, payload),
    onSuccess: (message, variables) => {
      queryClient.setQueryData<ListMessagesResponse>(
        queryKeys.channels.messagesList(
          variables.workspaceId,
          variables.channelId,
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
