import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  DirectConversationListResponse,
  DirectConversationSummary,
  ListDirectConversationsParams,
  OpenDirectConversationRequest,
} from "@/types/api.types";

async function list(
  workspaceId: string,
  params?: ListDirectConversationsParams,
): Promise<DirectConversationListResponse> {
  return http.get<DirectConversationListResponse>(endpoints.dms.list(workspaceId), { params });
}

async function open(
  workspaceId: string,
  payload: OpenDirectConversationRequest,
): Promise<DirectConversationSummary> {
  return http.post<DirectConversationSummary>(endpoints.dms.open(workspaceId), payload);
}

async function getById(
  workspaceId: string,
  directConversationId: string,
): Promise<DirectConversationSummary> {
  return http.get<DirectConversationSummary>(endpoints.dms.byId(workspaceId, directConversationId));
}

export const dmsModule = {
  list,
  open,
  getById,
};
