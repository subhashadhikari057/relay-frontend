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
  directConversationId: string,
  params?: ListMessagesParams,
): Promise<ListMessagesResponse> {
  return http.get<ListMessagesResponse>(endpoints.dms.messages(workspaceId, directConversationId), {
    params,
  });
}

async function create(
  workspaceId: string,
  directConversationId: string,
  payload: CreateMessageRequest,
): Promise<MessageItem> {
  return http.post<MessageItem>(endpoints.dms.messages(workspaceId, directConversationId), payload);
}

export const dmMessagesModule = {
  list,
  create,
};
