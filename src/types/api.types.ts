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
  activeWorkspace?: WorkspaceSummary | null;
  requiresOnboarding: boolean;
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
export type DirectConversationType = "one_to_one" | "group";
export type MessageType = "text" | "file" | "system";

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

export type WorkspaceMemberSummary = {
  membershipId: string;
  userId: string;
  email: string;
  fullName: string;
  displayName: string | null;
  role: WorkspaceRole;
  joinedAt: string;
  invitedById: string | null;
  isActive: boolean;
};

export type WorkspaceMembersResponse = {
  count: number;
  members: WorkspaceMemberSummary[];
};

export type DirectConversationMemberSummary = {
  userId: string;
  email: string;
  fullName: string;
  displayName: string | null;
  avatarUrl: string | null;
  joinedAt: string;
};

export type DirectConversationSummary = {
  id: string;
  workspaceId: string;
  type: DirectConversationType;
  title: string | null;
  createdById: string;
  memberCount: number;
  members: DirectConversationMemberSummary[];
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DirectConversationListResponse = {
  count: number;
  nextCursor?: string;
  conversations: DirectConversationSummary[];
};

export type ListDirectConversationsParams = {
  limit?: number;
  cursor?: string;
};

export type OpenDirectConversationRequest = {
  participantUserIds: string[];
  title?: string;
};

export type MessageAuthorSummary = {
  id: string;
  fullName: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type MessageReactionSummary = {
  emoji: string;
  count: number;
};

export type MessageItem = {
  id: string;
  workspaceId: string;
  channelId: string | null;
  directConversationId: string | null;
  senderUserId: string;
  type: MessageType;
  content?: string | null;
  metadata?: Record<string, unknown> | null;
  parentMessageId?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: MessageAuthorSummary;
  attachments: unknown[];
  threadReplyCount: number;
  canEdit: boolean;
  canDelete: boolean;
  reactionSummary: MessageReactionSummary[];
  myReaction: string | null;
  isPinned: boolean;
  pinnedAt: string | null;
  pinnedByUserId: string | null;
};

export type ListMessagesResponse = {
  count: number;
  nextCursor?: string;
  messages: MessageItem[];
};

export type CreateMessageRequest = {
  type?: MessageType;
  content?: string;
  metadata?: Record<string, unknown>;
  attachments?: unknown[];
};

export type ListMessagesParams = {
  limit?: number;
  cursor?: string;
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

export type ChannelListParams = {
  limit?: number;
  cursor?: string;
  includeArchived?: boolean;
};

export type ChannelListResponse = {
  count: number;
  nextCursor?: string;
  channels: ChannelSummary[];
};

export type CreateChannelRequest = {
  name: string;
  topic?: string;
  description?: string;
  type?: ChannelType;
};

export type ChannelMemberRole = "admin" | "member";

export type ChannelMemberSummary = {
  userId: string;
  email: string;
  fullName: string;
  displayName: string | null;
  role: ChannelMemberRole;
  joinedAt: string;
};

export type ChannelMembersListParams = {
  limit?: number;
  cursor?: string;
  includeArchived?: boolean;
};

export type ChannelMembersResponse = {
  count: number;
  nextCursor?: string;
  members: ChannelMemberSummary[];
};

export type AddChannelMemberRequest = {
  userId: string;
  role?: ChannelMemberRole;
};

export type WorkspaceInviteResponse = {
  inviteId: string;
  inviteToken: string;
  expiresAt: string;
};

export type AcceptWorkspaceInviteRequest = {
  token: string;
};

export type WorkspaceInviteAcceptResponse = {
  success: boolean;
  workspaceId: string;
  role: WorkspaceRole;
  accessToken?: string;
  user?: AuthUser;
  activeWorkspaceId?: string | null;
  activeWorkspace?: WorkspaceSummary | null;
  requiresOnboarding?: boolean;
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
