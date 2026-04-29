import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  InviteWorkspaceMemberRequest,
  WorkspaceListResponse,
  WorkspaceMembersResponse,
  WorkspaceInviteResponse,
  WorkspaceSummary,
} from "@/types/api.types";

async function listMine(): Promise<WorkspaceListResponse> {
  return http.get<WorkspaceListResponse>(endpoints.workspaces.list);
}

async function getById(workspaceId: string): Promise<WorkspaceSummary> {
  return http.get<WorkspaceSummary>(endpoints.workspaces.byId(workspaceId));
}

async function getBySlug(workspaceSlug: string): Promise<WorkspaceSummary> {
  return http.get<WorkspaceSummary>(endpoints.workspaces.bySlug(workspaceSlug));
}

async function listMembers(workspaceId: string): Promise<WorkspaceMembersResponse> {
  return http.get<WorkspaceMembersResponse>(endpoints.workspaces.members(workspaceId));
}

async function inviteMember(
  workspaceId: string,
  payload: InviteWorkspaceMemberRequest,
): Promise<WorkspaceInviteResponse> {
  return http.post<WorkspaceInviteResponse>(
    endpoints.workspaces.invitesCreate(workspaceId),
    payload,
  );
}

export const workspacesModule = {
  listMine,
  getById,
  getBySlug,
  listMembers,
  inviteMember,
};
