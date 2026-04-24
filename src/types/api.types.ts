export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  displayName: string | null;
  avatarUrl: string | null;
  avatarColor: string | null;
  status: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  isEmailVerified: boolean;
  platformRole: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  user: AuthUser;
  activeWorkspaceId?: string | null;
};

export type GoogleLoginRequest = {
  idToken: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  fullName: string;
  displayName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type WorkspaceRole = "owner" | "admin" | "member" | "guest";
export type ChannelType = "public" | "private";

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  avatarColor: string | null;
  role: WorkspaceRole;
};

export type WorkspaceListResponse = {
  count: number;
  workspaces: WorkspaceSummary[];
};

export type ChannelSummary = {
  id: string;
  workspaceId: string;
  name: string;
  topic: string | null;
  description: string | null;
  type: ChannelType;
  isArchived: boolean;
  createdById: string;
  memberCount: number;
  isMember: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceInviteResponse = {
  inviteId: string;
  inviteToken: string;
  expiresAt: string;
};

export type UploadFileItem = {
  path: string;
  url: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  optimized: boolean;
  context: {
    workspaceId?: string;
    channelId?: string;
    messageId?: string;
  };
};

export type UploadSingleResponse = {
  file: UploadFileItem;
};

export type OnboardingInviteInput = {
  email: string;
  role?: Exclude<WorkspaceRole, "owner">;
};

export type CompleteOnboardingRequest = {
  workspace: {
    name: string;
    description?: string;
    avatarUrl?: string;
    avatarColor?: string;
  };
  userProfile?: {
    displayName?: string;
    avatarUrl?: string;
    avatarColor?: string;
  };
  invites?: OnboardingInviteInput[];
  firstChannel?: {
    name: string;
    topic?: string;
    description?: string;
    type?: ChannelType;
  };
};

export type CompleteOnboardingResponse = AuthTokenResponse & {
  workspace: WorkspaceSummary;
  firstChannel: ChannelSummary;
  invites: WorkspaceInviteResponse[];
  activeWorkspaceId: string;
};
