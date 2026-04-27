import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { messageReactionsModule } from "@/api/modules/message-reactions.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type { ListMessagesResponse, MessageItem } from "@/types/api.types";

type ToggleReactionInput = {
  workspaceId: string;
  channelId: string;
  messageId: string;
  emoji: string;
};

const defaultListParams = { limit: 50 } as const;

export function useToggleChannelMessageReactionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    {
      messageId: string;
      myReaction: string | null;
      reactionSummary: MessageItem["reactionSummary"];
    },
    ApiError,
    ToggleReactionInput
  >({
    mutationFn: async ({ workspaceId, channelId, messageId, emoji }) => {
      const res = await messageReactionsModule.toggle(workspaceId, channelId, messageId, { emoji });
      return {
        messageId: res.messageId,
        myReaction: res.myReaction,
        reactionSummary: res.reactionSummary,
      };
    },
    onSuccess: (data, variables) => {
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
              m.id === data.messageId
                ? { ...m, myReaction: data.myReaction, reactionSummary: data.reactionSummary }
                : m,
            ),
          };
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Could not update reaction.");
    },
  });
}
