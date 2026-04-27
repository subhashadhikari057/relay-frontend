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
  dms: {
    all: ["dms"] as const,
    workspace: (workspaceId: string) => [...queryKeys.dms.all, "workspace", workspaceId] as const,
    lists: (workspaceId: string) => [...queryKeys.dms.workspace(workspaceId), "list"] as const,
    list: (workspaceId: string, filters?: unknown) =>
      [...queryKeys.dms.lists(workspaceId), filters ?? {}] as const,
    details: (workspaceId: string) => [...queryKeys.dms.workspace(workspaceId), "detail"] as const,
    detail: (workspaceId: string, directConversationId: string) =>
      [...queryKeys.dms.details(workspaceId), directConversationId] as const,
    messages: (workspaceId: string, directConversationId: string) =>
      [...queryKeys.dms.workspace(workspaceId), "messages", directConversationId] as const,
    messagesList: (workspaceId: string, directConversationId: string, filters?: unknown) =>
      [...queryKeys.dms.messages(workspaceId, directConversationId), filters ?? {}] as const,
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
    messages: (workspaceId: string, channelId: string) =>
      [...queryKeys.channels.workspace(workspaceId), "messages", channelId] as const,
    messagesList: (workspaceId: string, channelId: string, filters?: unknown) =>
      [...queryKeys.channels.messages(workspaceId, channelId), filters ?? {}] as const,
    threads: (workspaceId: string, channelId: string, messageId: string) =>
      [...queryKeys.channels.workspace(workspaceId), "thread", channelId, messageId] as const,
    threadList: (workspaceId: string, channelId: string, messageId: string, filters?: unknown) =>
      [...queryKeys.channels.threads(workspaceId, channelId, messageId), filters ?? {}] as const,
  },
} as const;
