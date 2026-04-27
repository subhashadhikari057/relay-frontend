import { useEffect, useMemo, useState } from "react";
import {
  Hash,
  Lock,
  Star,
  Bell,
  Users,
  Search,
  HelpCircle,
  PanelRightOpen,
  Sparkles,
  Menu,
  X,
  Info,
  Settings as SettingsIcon,
  SmilePlus,
  MessageSquare,
  Bookmark,
  Pencil,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlobalSidebar, type GlobalView } from "./GlobalSidebar";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { Composer } from "./Composer";
import { CommandPalette } from "./CommandPalette";
import { SearchPanel } from "./SearchPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { DMView } from "./DMView";
import { ChannelDetailsPanel } from "./ChannelDetailsPanel";
import { SavedPanel } from "./SavedPanel";
import { CreateChannelModal } from "./CreateChannelModal";
import { InviteModal } from "./InviteModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { ChannelBrowser } from "./ChannelBrowser";
import { NewDmModal } from "./NewDmModal";
import { useDensity, markChannelRead } from "@/lib/store";
import {
  useChannelDetail,
  useJoinChannelMutation,
  useWorkspaceChannels,
} from "@/queries/modules/channels.queries";
import { useWorkspaceDms } from "@/queries/modules/dms.queries";
import { useCurrentUser } from "@/queries/modules/auth.queries";
import {
  useChannelMessages,
  useCreateChannelMessageMutation,
  useCreateThreadReplyMutation,
  useThreadReplies,
} from "@/queries/modules/channel-messages.queries";
import { useToggleChannelMessageReactionMutation } from "@/queries/modules/message-reactions.queries";
import { UserAvatar } from "./UserAvatar";
import type { ChannelSummary, WorkspaceSummary } from "@/types/api.types";
import { cn } from "@/lib/utils";

type View =
  | { kind: "channel"; channelId: string }
  | { kind: "dm"; directConversationId: string }
  | { kind: "search" }
  | { kind: "saved" }
  | { kind: "activity" };

interface WorkspaceShellProps {
  workspace?: WorkspaceSummary | null;
}

export function WorkspaceShell({ workspace }: WorkspaceShellProps) {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.id ?? "";
  const currentUserAvatarColor = currentUser?.avatarColor ?? null;
  const [view, setView] = useState<View>({ kind: "channel", channelId: "pending" });
  const [details, setDetails] = useState(false);
  const [detailsTab, setDetailsTab] = useState<"about" | "members" | "pinned" | "files">("about");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [newDmOpen, setNewDmOpen] = useState(false);
  const channelsQuery = useWorkspaceChannels(workspace?.id);
  const dmsQuery = useWorkspaceDms(workspace?.id);
  const channels = useMemo(
    () => channelsQuery.data?.channels ?? [],
    [channelsQuery.data?.channels],
  );
  const sidebarChannels = channels;
  const activeChannelId = view.kind === "channel" ? view.channelId : null;
  const activeDmId = view.kind === "dm" ? view.directConversationId : null;
  const selectedChannel = activeChannelId
    ? sidebarChannels.find((channel) => channel.id === activeChannelId)
    : null;
  const dmConversations = dmsQuery.data?.conversations ?? [];
  const selectedDm = activeDmId ? (dmConversations.find((d) => d.id === activeDmId) ?? null) : null;
  const channelDetailQuery = useChannelDetail(
    workspace?.id,
    details ? activeChannelId : null,
    selectedChannel,
  );
  const channelDetail = channelDetailQuery.data ?? selectedChannel;

  useEffect(() => {
    if (!activeChannelId) return;
    if (sidebarChannels.some((channel) => channel.id === activeChannelId)) return;

    const firstChannel = sidebarChannels[0];
    if (firstChannel) {
      setView({ kind: "channel", channelId: firstChannel.id });
    }
  }, [activeChannelId, sidebarChannels]);

  const jumpToDefaultChannel = () => {
    const target = sidebarChannels[0]?.id;
    if (!target) return;
    selectChannel(target);
  };

  // Cmd+K, Cmd+/
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (mod && e.key === "/") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectChannel = (id: string) => {
    setView({ kind: "channel", channelId: id });
    setDetails(false);
    setDetailsTab("about");
    setMobileNavOpen(false);
    markChannelRead(id);
  };
  const selectDm = (directConversationId: string) => {
    setView({ kind: "dm", directConversationId });
    setDetails(false);
    setMobileNavOpen(false);
  };
  const selectGlobalView = (v: GlobalView) => {
    if (v === "home") jumpToDefaultChannel();
    else if (v === "dms") {
      const firstDm = dmConversations[0];
      if (firstDm) setView({ kind: "dm", directConversationId: firstDm.id });
    } else if (v === "activity") setView({ kind: "activity" });
    else if (v === "search") setView({ kind: "search" });
    else if (v === "saved") setView({ kind: "saved" });
    setDetails(false);
  };

  const activeView: GlobalView =
    view.kind === "search"
      ? "search"
      : view.kind === "activity"
        ? "activity"
        : view.kind === "saved"
          ? "saved"
          : view.kind === "dm"
            ? "dms"
            : "home";

  const sidebarProps = {
    onCreateChannel: () => setCreateChannelOpen(true),
    onInvite: () => setInviteOpen(true),
    onOpenSaved: () => setView({ kind: "saved" }),
    onBrowseChannels: () => setBrowseOpen(true),
    onNewDm: () => setNewDmOpen(true),
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="hidden md:flex">
        <GlobalSidebar
          activeView={activeView}
          onSelectView={selectGlobalView}
          workspace={workspace}
        />
      </div>
      <div className="hidden md:flex">
        <WorkspaceSidebar
          workspace={workspace}
          channels={sidebarChannels}
          dms={dmConversations}
          currentUserId={currentUserId}
          channelsLoading={channelsQuery.isLoading}
          channelsError={channelsQuery.error?.message}
          activeChannelId={view.kind === "channel" ? view.channelId : undefined}
          activeDmId={view.kind === "dm" ? view.directConversationId : undefined}
          onSelectChannel={selectChannel}
          onSelectDm={selectDm}
          {...sidebarProps}
        />
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex h-full animate-in slide-in-from-left">
            <GlobalSidebar
              activeView={activeView}
              onSelectView={(v) => {
                selectGlobalView(v);
                setMobileNavOpen(false);
              }}
              workspace={workspace}
            />
            <WorkspaceSidebar
              workspace={workspace}
              channels={sidebarChannels}
              dms={dmConversations}
              currentUserId={currentUserId}
              channelsLoading={channelsQuery.isLoading}
              channelsError={channelsQuery.error?.message}
              activeChannelId={view.kind === "channel" ? view.channelId : undefined}
              activeDmId={view.kind === "dm" ? view.directConversationId : undefined}
              onSelectChannel={selectChannel}
              onSelectDm={selectDm}
              {...sidebarProps}
            />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute -right-10 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1">
        <div className={cn("flex min-w-0 flex-1", details ? "hidden lg:flex" : "")}>
          {view.kind === "search" && (
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileTopBar onOpenNav={() => setMobileNavOpen(true)} title="Search" />
              <SearchPanel
                channels={sidebarChannels}
                onClose={jumpToDefaultChannel}
                onJumpChannel={selectChannel}
              />
            </div>
          )}

          {view.kind === "activity" && (
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileTopBar onOpenNav={() => setMobileNavOpen(true)} title="Activity" />
              <NotificationsPanel onClose={jumpToDefaultChannel} />
            </div>
          )}

          {view.kind === "saved" && (
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileTopBar onOpenNav={() => setMobileNavOpen(true)} title="Saved" />
              <SavedPanel
                channels={sidebarChannels}
                onClose={jumpToDefaultChannel}
                onJumpChannel={selectChannel}
              />
            </div>
          )}

          {view.kind === "dm" && (
            <div className="relative flex min-w-0 flex-1 flex-col">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="absolute left-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              {workspace?.id && selectedDm && currentUserId && (
                <DMView
                  workspaceId={workspace.id}
                  conversation={selectedDm}
                  currentUserId={currentUserId}
                  currentUserAvatarColor={currentUserAvatarColor}
                />
              )}
            </div>
          )}

          {view.kind === "channel" && (
            <ChannelView
              workspaceId={workspace?.id ?? null}
              channelId={view.channelId}
              channels={sidebarChannels}
              currentUserId={currentUserId}
              currentUserAvatarColor={currentUserAvatarColor}
              details={details}
              onToggleDetails={() => {
                setDetails((d) => !d);
                setDetailsTab("about");
              }}
              onAddMembers={() => {
                setDetails(true);
                setDetailsTab("members");
              }}
              onOpenSearch={() => setView({ kind: "search" })}
              onOpenNav={() => setMobileNavOpen(true)}
              onOpenPalette={() => setPaletteOpen(true)}
              onOpenActivity={() => setView({ kind: "activity" })}
              onOpenShortcuts={() => setShortcutsOpen(true)}
            />
          )}
        </div>

        {details && view.kind === "channel" && (
          <div className="w-full shrink-0 lg:w-[360px]">
            {workspace?.id && channelDetail && (
              <ChannelDetailsPanel
                workspaceId={workspace.id}
                channel={channelDetail}
                initialTab={detailsTab}
                onClose={() => setDetails(false)}
              />
            )}
          </div>
        )}
      </div>

      <CommandPalette
        open={paletteOpen}
        channels={sidebarChannels}
        onClose={() => setPaletteOpen(false)}
        onJumpChannel={selectChannel}
      />
      {workspace?.id && currentUserId && (
        <NewDmModal
          open={newDmOpen}
          workspaceId={workspace.id}
          currentUserId={currentUserId}
          onClose={() => setNewDmOpen(false)}
          onOpenConversation={(directConversationId) => selectDm(directConversationId)}
        />
      )}
      <CreateChannelModal
        open={createChannelOpen}
        workspaceId={workspace?.id}
        onClose={() => setCreateChannelOpen(false)}
        onCreate={(channel) => setView({ kind: "channel", channelId: channel.id })}
      />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ChannelBrowser
        open={browseOpen}
        channels={sidebarChannels}
        onClose={() => setBrowseOpen(false)}
        onSelect={selectChannel}
        onCreate={() => setCreateChannelOpen(true)}
      />
    </div>
  );
}

function MobileTopBar({ onOpenNav, title }: { onOpenNav: () => void; title: string }) {
  return (
    <div className="flex h-12 items-center gap-2 border-b border-border bg-background px-3 md:hidden">
      <button
        onClick={onOpenNav}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <Menu className="h-4 w-4" />
      </button>
      <span className="text-[14px] font-semibold">{title}</span>
    </div>
  );
}

interface ChannelViewProps {
  workspaceId?: string | null;
  channelId: string;
  channels: ChannelSummary[];
  currentUserId: string;
  currentUserAvatarColor: string | null;
  details: boolean;
  onToggleDetails: () => void;
  onAddMembers: () => void;
  onOpenSearch: () => void;
  onOpenNav: () => void;
  onOpenPalette: () => void;
  onOpenActivity: () => void;
  onOpenShortcuts: () => void;
}

function ChannelView({
  workspaceId,
  channelId,
  channels,
  currentUserId,
  currentUserAvatarColor,
  details,
  onToggleDetails,
  onAddMembers,
  onOpenSearch,
  onOpenNav,
  onOpenPalette,
  onOpenActivity,
  onOpenShortcuts,
}: ChannelViewProps) {
  const { density } = useDensity();
  const isCompact = density === "compact";
  const channel = useMemo(
    () => channels.find((item) => item.id === channelId) ?? channels[0],
    [channels, channelId],
  );
  const channelMessagesQuery = useChannelMessages(workspaceId, channelId);
  const createChannelMessageMutation = useCreateChannelMessageMutation();
  const joinChannelMutation = useJoinChannelMutation();
  const toggleReactionMutation = useToggleChannelMessageReactionMutation();
  const [threadParent, setThreadParent] = useState<import("@/types/api.types").MessageItem | null>(
    null,
  );
  const messages = channelMessagesQuery.data?.messages ?? [];
  const timeline = [...messages].reverse(); // API returns newest-first
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  if (!channel) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center text-sm text-muted-foreground">
        No channel selected.
      </main>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header
        className={cn(
          "flex items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md md:gap-3 md:px-4",
          isCompact ? "h-12" : "h-14",
        )}
      >
        <button
          onClick={onOpenNav}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          onClick={onToggleDetails}
          className="flex min-w-0 items-center gap-2 rounded-md px-1 py-1 -mx-1 hover:bg-foreground/[0.04]"
        >
          <span className="hidden h-7 w-7 items-center justify-center rounded-md bg-foreground/[0.04] sm:flex">
            {channel.type === "private" ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Hash className="h-3.5 w-3.5" />
            )}
          </span>
          <h1 className="truncate text-[15px] font-semibold">{channel.name}</h1>
          <Star className="ml-1 hidden h-3.5 w-3.5 text-muted-foreground hover:text-foreground sm:inline" />
          {channel.topic && (
            <>
              <span className="mx-2 hidden h-4 w-px bg-border lg:inline" />
              <span className="hidden truncate text-[12.5px] text-muted-foreground lg:inline">
                {channel.topic}
              </span>
            </>
          )}
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="relative mr-1 hidden h-8 w-[260px] items-center rounded-md border border-border bg-surface-elevated/60 pl-8 pr-2 text-left text-[12.5px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground md:flex"
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <span className="min-w-0 flex-1 truncate leading-none">
              Search messages, files, people…
            </span>
            <kbd className="ml-2 inline-flex h-5 shrink-0 items-center rounded border border-border bg-background px-1.5 text-[10px] leading-none">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenPalette}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          {typeof channel.memberCount === "number" && (
            <div className="ml-1 hidden md:flex">
              <button
                onClick={onAddMembers}
                className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-elevated/60 px-2.5 text-[11px] text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                title="Members"
              >
                <Users className="h-3.5 w-3.5" />
                {channel.memberCount}
              </button>
            </div>
          )}

          <button
            onClick={onOpenActivity}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground sm:flex"
            title="Activity"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenShortcuts}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground sm:flex"
            title="Keyboard shortcuts (⌘/)"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <Link
            to="/settings"
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground sm:flex"
            title="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>

          <button
            onClick={onToggleDetails}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
              details && "bg-foreground/[0.06] text-foreground",
            )}
            title="Channel details"
          >
            <Info className="h-4 w-4" />
          </button>

          <button
            disabled
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
            )}
            title="Toggle thread"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-w-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className={cn("mx-auto max-w-[920px]", isCompact ? "py-2" : "py-4")}>
            <ChannelIntro
              name={channel.name}
              topic={channel.topic}
              description={channel.description}
              onAddMembers={onAddMembers}
            />
            {!channel.isMember && channel.type === "public" && (
              <div className="px-5 pb-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-elevated/60 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground">
                      You haven't joined this channel
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      Join <span className="font-medium text-foreground">#{channel.name}</span> to
                      post messages.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!workspaceId) return;
                      if (joinChannelMutation.isPending) return;
                      joinChannelMutation.mutate({ workspaceId, channelId: channel.id });
                    }}
                    className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!workspaceId || joinChannelMutation.isPending}
                  >
                    Join
                  </button>
                </div>
              </div>
            )}
            {channelMessagesQuery.isLoading && (
              <div className="px-5 py-6 text-sm text-muted-foreground">Loading messages...</div>
            )}
            {channelMessagesQuery.isError && (
              <div className="px-5 py-6 text-sm text-destructive">
                {channelMessagesQuery.error.message || "Could not load messages."}
              </div>
            )}
            {timeline.map((m, i) => {
              const prev = timeline[i - 1];
              const grouped =
                !!prev &&
                prev.type !== "system" &&
                m.type !== "system" &&
                prev.senderUserId === m.senderUserId &&
                new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() <
                  5 * 60 * 1000;
              return (
                <ChannelMessageItem
                  key={m.id}
                  message={m}
                  groupedWithPrev={grouped}
                  compact={isCompact}
                  isHovered={hoveredMessageId === m.id}
                  onHoverChange={(hovered) => setHoveredMessageId(hovered ? m.id : null)}
                  currentUserId={currentUserId}
                  currentUserAvatarColor={currentUserAvatarColor}
                  workspaceId={workspaceId ?? null}
                  channelId={channel.id}
                  onToggleReaction={(emoji) => {
                    if (!workspaceId) return;
                    toggleReactionMutation.mutate({
                      workspaceId,
                      channelId: channel.id,
                      messageId: m.id,
                      emoji,
                    });
                  }}
                  onOpenThread={() => setThreadParent(m)}
                />
              );
            })}
          </div>
        </div>

        {workspaceId && threadParent && (
          <ChannelThreadPanel
            workspaceId={workspaceId}
            channel={channel}
            parentMessage={threadParent}
            currentUserId={currentUserId}
            currentUserAvatarColor={currentUserAvatarColor}
            onClose={() => setThreadParent(null)}
          />
        )}
      </div>

      <div className="border-t border-border bg-background">
        <div
          className={cn(
            !channel.isMember && channel.type === "public" ? "pointer-events-none opacity-60" : "",
          )}
        >
          <Composer
            placeholder={
              !channel.isMember && channel.type === "public"
                ? `Join #${channel.name} to send messages`
                : `Message #${channel.name}`
            }
            compact={isCompact}
            onSend={(content) => {
              const next = content.trim();
              if (!workspaceId) return;
              if (!next) return;
              if (createChannelMessageMutation.isPending) return;
              createChannelMessageMutation.mutate({
                workspaceId,
                channelId: channel.id,
                payload: { content: next, type: "text" },
              });
            }}
          />
        </div>
      </div>
    </main>
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMessageTimestamp(ts: string, variant: "header" | "grouped") {
  const d = new Date(ts);
  const now = new Date();
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (variant === "grouped") return time;
  if (isSameDay(d, now)) return time;
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${date}, ${time}`;
}

function colorFromSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) % 360;
  }
  return `hsl(${h} 65% 45%)`;
}

function ChannelMessageItem({
  message,
  groupedWithPrev,
  compact,
  isHovered,
  onHoverChange,
  currentUserId,
  currentUserAvatarColor,
  workspaceId,
  channelId,
  onToggleReaction,
  onOpenThread,
}: {
  message: import("@/types/api.types").MessageItem;
  groupedWithPrev?: boolean;
  compact?: boolean;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  currentUserId: string;
  currentUserAvatarColor: string | null;
  workspaceId: string | null;
  channelId: string;
  onToggleReaction: (emoji: string) => void;
  onOpenThread: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  // Keep this in sync with backend ALLOWED_MESSAGE_REACTIONS.
  const reactionOptions = ["👍", "❤️", "😂", "🎉", "🔥"] as const;

  if (message.type === "system") {
    return (
      <div className={cn("px-5", compact ? "py-1.5" : "py-2")}>
        <div className="flex items-center justify-center">
          <div className="rounded-full border border-border bg-surface-elevated/70 px-3 py-1 text-[12px] text-muted-foreground">
            {message.content?.trim() || "System event"}
          </div>
        </div>
      </div>
    );
  }

  const authorName = message.author.displayName?.trim() || message.author.fullName;
  const isCurrentUser = message.senderUserId === currentUserId;
  const fallbackColor = isCurrentUser
    ? currentUserAvatarColor || colorFromSeed(message.author.id)
    : colorFromSeed(message.author.id);

  const reactions = message.reactionSummary ?? [];
  const replyCount = message.threadReplyCount ?? 0;
  const selectedReaction = message.myReaction;

  return (
    <div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => {
        setPickerOpen(false);
        onHoverChange(false);
      }}
      className={cn(
        "group relative flex gap-3 px-5 transition-colors hover:bg-foreground/[0.02]",
        compact ? "gap-2 px-4" : "gap-3 px-5",
        groupedWithPrev ? (compact ? "py-0" : "py-0.5") : compact ? "pt-2 pb-0.5" : "pt-3 pb-1",
      )}
    >
      <div className={cn("shrink-0", compact ? "w-8" : "w-9")}>
        {!groupedWithPrev ? (
          <UserAvatar
            name={authorName}
            avatarUrl={message.author.avatarUrl}
            avatarColor={message.author.avatarUrl ? null : fallbackColor}
            className={cn("rounded-md", compact ? "h-7 w-7" : "h-9 w-9")}
          />
        ) : (
          <span
            className={cn(
              "mt-1 block whitespace-nowrap text-right pr-1 text-[10px] leading-none tabular-nums text-muted-foreground/0 transition-opacity",
              isHovered && "text-muted-foreground/70",
            )}
          >
            {formatMessageTimestamp(message.createdAt, "grouped")}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!groupedWithPrev && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{authorName}</span>
            <span className="text-[11px] text-muted-foreground">
              {formatMessageTimestamp(message.createdAt, "header")}
            </span>
          </div>
        )}
        <div
          className={cn("text-[14px] leading-relaxed text-foreground/90", compact && "text-[13px]")}
        >
          {message.content ?? ""}
        </div>

        {reactions.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {reactions.map((r) => {
              const mine = message.myReaction === r.emoji;
              return (
                <button
                  key={r.emoji}
                  type="button"
                  onClick={() => onToggleReaction(r.emoji)}
                  title={mine ? "Remove reaction" : "React"}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors disabled:cursor-not-allowed",
                    mine
                      ? "border-foreground/30 bg-foreground/[0.06] text-foreground"
                      : "border-border bg-surface-elevated/60 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                  )}
                >
                  <span>{r.emoji}</span>
                  <span className="tabular-nums">{r.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {replyCount > 0 && (
          <button
            type="button"
            onClick={onOpenThread}
            className={cn(
              "mt-1.5 inline-flex items-center gap-2 rounded-md px-2 py-1 -ml-2 text-xs font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              reactions.length === 0 && "mt-2",
            )}
          >
            <span className="text-foreground">{replyCount} replies</span>
            <span className="text-muted-foreground/70">View thread</span>
          </button>
        )}
      </div>

      {/* Hover actions (UI first, wiring next) */}
      <div
        className={cn(
          "absolute -top-3 right-6 flex items-center gap-0 rounded-lg border border-border bg-popover shadow-elegant transition-opacity",
          isHovered ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {[
          { icon: SmilePlus, label: "React" },
          { icon: MessageSquare, label: "Reply in thread" },
          { icon: Bookmark, label: "Save" },
          { icon: Pencil, label: "Edit" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (label === "React") setPickerOpen(true);
              if (label === "Reply in thread") onOpenThread();
            }}
            disabled={label === "Save" || label === "Edit"}
            title={label === "Save" || label === "Edit" ? `${label} (wiring next)` : label}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground first:rounded-l-lg last:rounded-r-lg disabled:cursor-not-allowed"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      {pickerOpen && (
        <div className="absolute right-6 top-10 z-30 flex gap-1 rounded-lg border border-border bg-popover p-1.5 shadow-elegant">
          {reactionOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setPickerOpen(false);
                onToggleReaction(emoji);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                selectedReaction === emoji
                  ? "bg-foreground/[0.08] ring-1 ring-foreground/30"
                  : "hover:bg-foreground/[0.06]",
              )}
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelThreadPanel({
  workspaceId,
  channel,
  parentMessage,
  currentUserId,
  currentUserAvatarColor,
  onClose,
}: {
  workspaceId: string;
  channel: ChannelSummary;
  parentMessage: import("@/types/api.types").MessageItem;
  currentUserId: string;
  currentUserAvatarColor: string | null;
  onClose: () => void;
}) {
  const { density } = useDensity();
  const isCompact = density === "compact";
  const repliesQuery = useThreadReplies(workspaceId, channel.id, parentMessage.id);
  const createReplyMutation = useCreateThreadReplyMutation();
  const replies = repliesQuery.data?.messages ?? [];
  const timeline = [...replies].reverse(); // newest-first -> oldest-first

  return (
    <aside className="hidden w-[360px] shrink-0 border-l border-border bg-background lg:flex lg:flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-foreground">Thread</div>
          <div className="text-[11px] text-muted-foreground">#{channel.name}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={parentMessage.author.displayName?.trim() || parentMessage.author.fullName}
              avatarUrl={parentMessage.author.avatarUrl}
              className="h-8 w-8 rounded-md"
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {parentMessage.author.displayName?.trim() || parentMessage.author.fullName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {formatMessageTimestamp(parentMessage.createdAt, "header")}
                </span>
              </div>
              <div className="mt-1 text-[14px] leading-relaxed text-foreground/90">
                {parentMessage.content ?? ""}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-2 text-[11px] text-muted-foreground">
          {repliesQuery.isLoading ? "Loading replies..." : `${timeline.length} replies`}
        </div>

        {repliesQuery.isError && (
          <div className="px-5 pb-3 text-sm text-destructive">
            {repliesQuery.error.message || "Could not load thread replies."}
          </div>
        )}

        <div className="pb-3">
          {timeline.map((m, i) => {
            const prev = timeline[i - 1];
            const grouped =
              !!prev &&
              prev.type !== "system" &&
              m.type !== "system" &&
              prev.senderUserId === m.senderUserId &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <ChannelMessageItem
                key={m.id}
                message={m}
                groupedWithPrev={grouped}
                compact={isCompact}
                isHovered={false}
                onHoverChange={() => {}}
                currentUserId={currentUserId}
                currentUserAvatarColor={currentUserAvatarColor}
                workspaceId={workspaceId}
                channelId={channel.id}
                onToggleReaction={() => {}}
                onOpenThread={() => {}}
              />
            );
          })}
        </div>
      </div>

      <div className="border-t border-border">
        <Composer
          placeholder="Reply in thread"
          compact
          onSend={(content) => {
            const next = content.trim();
            if (!next) return;
            if (createReplyMutation.isPending) return;
            createReplyMutation.mutate({
              workspaceId,
              channelId: channel.id,
              messageId: parentMessage.id,
              payload: { content: next, type: "text" },
            });
          }}
        />
      </div>
    </aside>
  );
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="relative my-3 flex items-center px-5">
      <div className="h-px flex-1 bg-border" />
      <span className="mx-3 rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ChannelIntro({
  name,
  topic,
  description,
  onAddMembers,
}: {
  name: string;
  topic?: string | null;
  description?: string | null;
  onAddMembers?: () => void;
}) {
  const introText =
    description?.trim() ||
    topic?.trim() ||
    "No description yet. Add one to give this channel context.";

  return (
    <div className="px-5 pb-2 pt-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.04] mb-3">
        <Sparkles className="h-5 w-5 text-foreground/70" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome to <span className="text-foreground">#{name}</span>
      </h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{introText}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
        <button
          onClick={onAddMembers}
          className="rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-foreground/30"
        >
          + Add members
        </button>
      </div>
    </div>
  );
}
