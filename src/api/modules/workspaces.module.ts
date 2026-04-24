import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { WorkspaceListResponse, WorkspaceSummary } from "@/types/api.types";

async function listMine(): Promise<WorkspaceListResponse> {
  return http.get<WorkspaceListResponse>(endpoints.workspaces.list);
}

async function getById(workspaceId: string): Promise<WorkspaceSummary> {
  return http.get<WorkspaceSummary>(endpoints.workspaces.byId(workspaceId));
}

async function getBySlug(workspaceSlug: string): Promise<WorkspaceSummary> {
  return http.get<WorkspaceSummary>(endpoints.workspaces.bySlug(workspaceSlug));
}

export const workspacesModule = {
  listMine,
  getById,
  getBySlug,
};
