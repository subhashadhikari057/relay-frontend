import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { MessageReactionSummary } from "@/types/api.types";

export type ToggleMessageReactionRequest = {
  emoji: string;
};

export type ToggleMessageReactionResponse = {
  action: "added" | "removed" | "replaced";
  messageId: string;
  myReaction: string | null;
  reactionSummary: MessageReactionSummary[];
};

async function toggle(
  workspaceId: string,
  channelId: string,
  messageId: string,
  payload: ToggleMessageReactionRequest,
): Promise<ToggleMessageReactionResponse> {
  return http.post<ToggleMessageReactionResponse>(
    endpoints.channels.messageReactionToggle(workspaceId, channelId, messageId),
    payload,
  );
}

export const messageReactionsModule = {
  toggle,
};
