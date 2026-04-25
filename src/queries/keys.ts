export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  onboarding: {
    all: ["onboarding"] as const,
  },
  workspaces: {
    all: ["workspaces"] as const,
    members: (workspaceId: string) =>
      [...queryKeys.workspaces.all, "members", workspaceId] as const,
  },
  channels: {
    all: ["channels"] as const,
    workspace: (workspaceId: string) =>
      [...queryKeys.channels.all, "workspace", workspaceId] as const,
    lists: (workspaceId: string) => [...queryKeys.channels.workspace(workspaceId), "list"] as const,
    list: (workspaceId: string, filters?: unknown) =>
      [...queryKeys.channels.lists(workspaceId), filters ?? {}] as const,
    details: (workspaceId: string) =>
      [...queryKeys.channels.workspace(workspaceId), "detail"] as const,
    detail: (workspaceId: string, channelId: string) =>
      [...queryKeys.channels.details(workspaceId), channelId] as const,
    members: (workspaceId: string, channelId: string) =>
      [...queryKeys.channels.workspace(workspaceId), "members", channelId] as const,
    membersList: (workspaceId: string, channelId: string, filters?: unknown) =>
      [...queryKeys.channels.members(workspaceId, channelId), filters ?? {}] as const,
  },
} as const;
