import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  CreateMessageRequest,
  ListMessagesParams,
  ListMessagesResponse,
  MessageItem,
} from "@/types/api.types";

async function list(
  workspaceId: string,
  channelId: string,
  params?: ListMessagesParams,
): Promise<ListMessagesResponse> {
  return http.get<ListMessagesResponse>(endpoints.channels.messages(workspaceId, channelId), {
    params,
  });
}

async function create(
  workspaceId: string,
  channelId: string,
  payload: CreateMessageRequest,
): Promise<MessageItem> {
  return http.post<MessageItem>(endpoints.channels.messages(workspaceId, channelId), payload);
}

export const channelMessagesModule = {
  list,
  create,
};
