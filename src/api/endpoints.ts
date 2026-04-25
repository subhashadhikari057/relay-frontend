export const endpoints = {
  auth: {
    signup: "/api/mobile/auth/signup",
    login: "/api/mobile/auth/login",
    google: "/api/mobile/auth/google",
    me: "/api/mobile/auth/me",
    refresh: "/api/mobile/auth/refresh",
    session: "/api/mobile/auth/session",
    logout: "/api/mobile/auth/logout",
  },
  onboarding: {
    complete: "/api/mobile/onboarding/complete",
  },
  upload: {
    single: "/api/mobile/upload/single",
  },
  workspaces: {
    list: "/api/mobile/workspaces",
    byId: (workspaceId: string) => `/api/mobile/workspaces/${workspaceId}`,
    bySlug: (workspaceSlug: string) => `/api/mobile/workspaces/slug/${workspaceSlug}`,
    members: (workspaceId: string) => `/api/mobile/workspaces/${workspaceId}/members`,
  },
  channels: {
    list: (workspaceId: string) => `/api/mobile/workspaces/${workspaceId}/channels`,
    create: (workspaceId: string) => `/api/mobile/workspaces/${workspaceId}/channels`,
    byId: (workspaceId: string, channelId: string) =>
      `/api/mobile/workspaces/${workspaceId}/channels/${channelId}`,
    members: (workspaceId: string, channelId: string) =>
      `/api/mobile/workspaces/${workspaceId}/channels/${channelId}/members`,
    join: (workspaceId: string, channelId: string) =>
      `/api/mobile/workspaces/${workspaceId}/channels/${channelId}/join`,
  },
} as const;
