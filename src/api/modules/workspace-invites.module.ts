import { http } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AcceptWorkspaceInviteRequest,
  WorkspaceInviteAcceptResponse,
} from "@/types/api.types";

async function acceptInvite(inviteToken: string): Promise<WorkspaceInviteAcceptResponse> {
  const payload: AcceptWorkspaceInviteRequest = { token: inviteToken };
  return http.post<WorkspaceInviteAcceptResponse>(endpoints.workspaces.invitesAccept, payload);
}

export const workspaceInvitesModule = {
  acceptInvite,
};
