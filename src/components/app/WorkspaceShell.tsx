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
  PanelRightClose,
  Pin,
  Sparkles,
  Menu,
  X,
  Info,
  Settings as SettingsIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlobalSidebar, type GlobalView } from "./GlobalSidebar";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { MessageItem } from "./MessageItem";
import { Composer } from "./Composer";
import { ThreadPanel } from "./ThreadPanel";
import { MemberAvatar } from "./MemberAvatar";
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
import { members, getMember, type Message } from "@/lib/sample-data";
import { useDensity, useStore, sendChannelMessage, markChannelRead } from "@/lib/store";
import { useChannelDetail, useWorkspaceChannels } from "@/queries/modules/channels.queries";
import { useWorkspaceDms } from "@/queries/modules/dms.queries";
import { useCurrentUser } from "@/queries/modules/auth.queries";
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
  const [thread, setThread] = useState<Message | null>(null);
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
    setThread(null);
    setDetails(false);
    setDetailsTab("about");
    setMobileNavOpen(false);
    markChannelRead(id);
  };
  const selectDm = (directConversationId: string) => {
    setView({ kind: "dm", directConversationId });
    setThread(null);
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
    setThread(null);
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
        <div className={cn("flex min-w-0 flex-1", thread || details ? "hidden lg:flex" : "")}>
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
              channelId={view.channelId}
              channels={sidebarChannels}
              thread={thread}
              details={details}
              onOpenThread={(m) => {
                setThread(m);
                setDetails(false);
              }}
              onToggleDetails={() => {
                setDetails((d) => !d);
                setDetailsTab("about");
                setThread(null);
              }}
              onAddMembers={() => {
                setDetails(true);
                setDetailsTab("members");
                setThread(null);
              }}
              onOpenSearch={() => setView({ kind: "search" })}
              onOpenNav={() => setMobileNavOpen(true)}
              onOpenPalette={() => setPaletteOpen(true)}
              onOpenActivity={() => setView({ kind: "activity" })}
              onOpenShortcuts={() => setShortcutsOpen(true)}
            />
          )}
        </div>

        {thread && (
          <div className="w-full shrink-0 lg:w-[420px]">
            <ThreadPanel message={thread} onClose={() => setThread(null)} />
          </div>
        )}

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
  channelId: string;
  channels: ChannelSummary[];
  thread: Message | null;
  details: boolean;
  onOpenThread: (m: Message) => void;
  onToggleDetails: () => void;
  onAddMembers: () => void;
  onOpenSearch: () => void;
  onOpenNav: () => void;
  onOpenPalette: () => void;
  onOpenActivity: () => void;
  onOpenShortcuts: () => void;
}

function ChannelView({
  channelId,
  channels,
  thread,
  details,
  onOpenThread,
  onToggleDetails,
  onAddMembers,
  onOpenSearch,
  onOpenNav,
  onOpenPalette,
  onOpenActivity,
  onOpenShortcuts,
}: ChannelViewProps) {
  const channelMessages = useStore((s) => s.channelMessages);
  const { density } = useDensity();
  const isCompact = density === "compact";
  const channel = useMemo(
    () => channels.find((item) => item.id === channelId) ?? channels[0],
    [channels, channelId],
  );
  const messages = channelMessages[channelId] ?? [];
  const threadTarget = messages.find((m) => m.replies) ?? messages[0] ?? null;

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

          <div className="ml-1 hidden -space-x-1.5 md:flex">
            {members.slice(0, 4).map((m) => (
              <div key={m.id} className="ring-2 ring-background rounded-md">
                <MemberAvatar member={m} size="sm" />
              </div>
            ))}
            <button className="flex h-7 items-center gap-1 rounded-md border border-border bg-surface-elevated px-2 text-[11px] text-muted-foreground hover:text-foreground ml-1">
              <Users className="h-3 w-3" />
              {members.length}
            </button>
          </div>

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
            onClick={() => {
              if (!threadTarget) return;
              onOpenThread(threadTarget);
            }}
            disabled={!threadTarget}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
              thread && "bg-foreground/[0.06] text-foreground",
            )}
            title="Toggle thread"
          >
            {thread ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "hidden items-center gap-2 border-b border-border bg-surface/40 px-5 text-[11.5px] text-muted-foreground sm:flex",
          isCompact ? "py-1" : "py-1.5",
        )}
      >
        <Pin className="h-3 w-3" />
        <span className="text-foreground font-medium">2 pinned</span>
        <span>·</span>
        <span className="truncate">Q2 roadmap doc — read before Friday's planning sync</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className={cn("mx-auto max-w-[920px]", isCompact ? "py-2" : "py-4")}>
          <ChannelIntro
            name={channel.name}
            topic={channel.topic}
            description={channel.description}
            onAddMembers={onAddMembers}
          />
          <DateSeparator label="Today" />
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const grouped =
              !!prev &&
              prev.authorId === m.authorId &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <MessageItem
                key={m.id}
                message={m}
                groupedWithPrev={grouped}
                onOpenThread={onOpenThread}
                compact={isCompact}
              />
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <Composer
          placeholder={`Message #${channel.name}`}
          compact={isCompact}
          onSend={(content) => sendChannelMessage(channelId, content)}
        />
      </div>
    </main>
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
