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

type CreateThreadReplyInput = {
  workspaceId: string;
  channelId: string;
  messageId: string;
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
  const hasValidChannelId = Boolean(channelId && channelId !== "pending");

  return useQuery<ListMessagesResponse, ApiError>({
    queryKey:
      workspaceId && hasValidChannelId
        ? queryKeys.channels.messagesList(workspaceId, channelId, params)
        : queryKeys.channels.messagesList("missing-workspace", "missing-channel", params),
    queryFn: () => channelMessagesModule.list(workspaceId as string, channelId as string, params),
    enabled: Boolean(workspaceId && hasValidChannelId),
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

export function useThreadReplies(
  workspaceId?: string | null,
  channelId?: string | null,
  messageId?: string | null,
  params: ListMessagesParams = defaultListParams,
) {
  return useQuery<ListMessagesResponse, ApiError>({
    queryKey:
      workspaceId && channelId && messageId
        ? queryKeys.channels.threadList(workspaceId, channelId, messageId, params)
        : queryKeys.channels.threadList(
            "missing-workspace",
            "missing-channel",
            "missing-message",
            params,
          ),
    queryFn: () =>
      channelMessagesModule.listThreadReplies(
        workspaceId as string,
        channelId as string,
        messageId as string,
        params,
      ),
    enabled: Boolean(workspaceId && channelId && messageId),
    staleTime: 15_000,
    gcTime: 10 * 60_000,
  });
}

export function useCreateThreadReplyMutation() {
  const queryClient = useQueryClient();

  return useMutation<MessageItem, ApiError, CreateThreadReplyInput>({
    mutationFn: ({ workspaceId, channelId, messageId, payload }) =>
      channelMessagesModule.createThreadReply(workspaceId, channelId, messageId, payload),
    onSuccess: (message, variables) => {
      queryClient.setQueryData<ListMessagesResponse>(
        queryKeys.channels.threadList(
          variables.workspaceId,
          variables.channelId,
          variables.messageId,
          defaultListParams,
        ),
        (current) => {
          if (!current) return { count: 1, messages: [message] };
          if (current.messages.some((m) => m.id === message.id)) return current;
          return { ...current, count: current.count + 1, messages: [message, ...current.messages] };
        },
      );

      // Bump reply count on the parent message in the channel timeline cache.
      queryClient.setQueryData<ListMessagesResponse>(
        queryKeys.channels.messagesList(
          variables.workspaceId,
          variables.channelId,
          defaultListParams,
        ),
        (current) => {
          if (!current) return current;
          return {
            ...current,
            messages: current.messages.map((m) =>
              m.id === variables.messageId
                ? { ...m, threadReplyCount: (m.threadReplyCount ?? 0) + 1 }
                : m,
            ),
          };
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Could not send thread reply.");
    },
  });
}
