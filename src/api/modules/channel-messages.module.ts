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

async function listThreadReplies(
  workspaceId: string,
  channelId: string,
  messageId: string,
  params?: ListMessagesParams,
): Promise<ListMessagesResponse> {
  return http.get<ListMessagesResponse>(
    endpoints.channels.thread(workspaceId, channelId, messageId),
    {
      params,
    },
  );
}

async function createThreadReply(
  workspaceId: string,
  channelId: string,
  messageId: string,
  payload: CreateMessageRequest,
): Promise<MessageItem> {
  return http.post<MessageItem>(
    endpoints.channels.thread(workspaceId, channelId, messageId),
    payload,
  );
}

export const channelMessagesModule = {
  list,
  create,
  listThreadReplies,
  createThreadReply,
};
