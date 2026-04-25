import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AddChannelMemberRequest,
  ChannelMembersListParams,
  ChannelMembersResponse,
  ChannelListParams,
  ChannelListResponse,
  ChannelSummary,
  CreateChannelRequest,
} from "@/types/api.types";

async function list(workspaceId: string, params?: ChannelListParams): Promise<ChannelListResponse> {
  return http.get<ChannelListResponse>(endpoints.channels.list(workspaceId), { params });
}

async function create(workspaceId: string, payload: CreateChannelRequest): Promise<ChannelSummary> {
  return http.post<ChannelSummary>(endpoints.channels.create(workspaceId), payload);
}

async function getById(workspaceId: string, channelId: string): Promise<ChannelSummary> {
  return http.get<ChannelSummary>(endpoints.channels.byId(workspaceId, channelId));
}

async function listMembers(
  workspaceId: string,
  channelId: string,
  params?: ChannelMembersListParams,
): Promise<ChannelMembersResponse> {
  return http.get<ChannelMembersResponse>(endpoints.channels.members(workspaceId, channelId), {
    params,
  });
}

async function addMember(workspaceId: string, channelId: string, payload: AddChannelMemberRequest) {
  return http.post(endpoints.channels.members(workspaceId, channelId), payload);
}

export const channelsModule = {
  list,
  create,
  getById,
  listMembers,
  addMember,
};
