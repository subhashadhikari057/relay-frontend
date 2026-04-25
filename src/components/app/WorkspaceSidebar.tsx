import {
  ChevronDown,
  Plus,
  UserPlus,
  Edit3,
  AtSign,
  Bookmark,
  ChevronRight,
  Hash,
  Compass,
} from "lucide-react";
import { useState } from "react";
import { ChannelRow } from "./ChannelRow";
import { DMRow } from "./DMRow";
import { WorkspaceAvatar } from "./WorkspaceAvatar";
import { useDensity } from "@/lib/store";
import type {
  ChannelSummary,
  DirectConversationSummary,
  WorkspaceSummary,
} from "@/types/api.types";
import { cn } from "@/lib/utils";

interface WorkspaceSidebarProps {
  workspace?: WorkspaceSummary | null;
  channels: ChannelSummary[];
  dms: DirectConversationSummary[];
  currentUserId: string;
  channelsLoading?: boolean;
  channelsError?: string;
  activeChannelId?: string;
  activeDmId?: string;
  onSelectChannel: (id: string) => void;
  onSelectDm?: (directConversationId: string) => void;
  onNewDm?: () => void;
  onCreateChannel?: () => void;
  onInvite?: () => void;
  onOpenSaved?: () => void;
  onBrowseChannels?: () => void;
}

export function WorkspaceSidebar({
  workspace,
  channels,
  dms,
  currentUserId,
  channelsLoading,
  channelsError,
  activeChannelId,
  activeDmId,
  onSelectChannel,
  onSelectDm,
  onNewDm,
  onCreateChannel,
  onInvite,
  onOpenSaved,
  onBrowseChannels,
}: WorkspaceSidebarProps) {
  const { density } = useDensity();
  const isCompact = density === "compact";
  const [openChannels, setOpenChannels] = useState(true);
  const [openDms, setOpenDms] = useState(true);

  return (
    <div
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
        isCompact ? "w-[224px]" : "w-[260px]",
      )}
    >
      {/* Workspace header */}
      <button
        className={cn(
          "group flex items-center justify-between border-b border-sidebar-border px-3 transition-colors hover:bg-sidebar-accent/50",
          isCompact ? "gap-2 py-2" : "gap-3 py-3",
        )}
      >
        <div className={cn("flex min-w-0 items-center", isCompact ? "gap-2" : "gap-3")}>
          <WorkspaceAvatar
            name={workspace?.name || "Relay"}
            avatarUrl={workspace?.avatarUrl}
            avatarColor={workspace?.avatarColor}
            className={cn("rounded-md text-xs", isCompact ? "h-8 w-8" : "h-9 w-9")}
          />
          <div className="flex min-w-0 flex-col items-start">
            <span className="truncate text-sm font-semibold text-foreground">
              {workspace?.name || "Relay"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_150)]" />
              12 online
            </span>
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {/* Quick actions */}
      <div className={cn("flex flex-col gap-0.5 px-2 text-sm", isCompact ? "py-1.5" : "py-2")}>
        {[
          { icon: Edit3, label: "New message", onClick: onNewDm },
          {
            icon: AtSign,
            label: "Mentions & reactions",
            onClick: undefined as (() => void) | undefined,
          },
          { icon: Bookmark, label: "Saved", onClick: onOpenSaved },
        ].map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 text-left text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground",
              isCompact ? "py-1 text-[13px]" : "py-1.5",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-sidebar-border mx-2" />

      <div className={cn("flex-1 overflow-y-auto px-2", isCompact ? "py-1.5" : "py-2")}>
        {/* Channels */}
        <Section
          label="Channels"
          open={openChannels}
          onToggle={() => setOpenChannels((v) => !v)}
          action={{ icon: Plus, label: "Add channel", onClick: onCreateChannel }}
        >
          {channelsLoading && channels.length === 0 && (
            <div className="px-2 py-1.5 text-[12px] text-muted-foreground">Loading channels...</div>
          )}
          {channelsError && channels.length === 0 && (
            <div className="px-2 py-1.5 text-[12px] text-destructive">{channelsError}</div>
          )}
          {channels.map((c) => {
            return (
              <ChannelRow
                key={c.id}
                channel={c}
                active={c.id === activeChannelId}
                compact={isCompact}
                onClick={() => onSelectChannel(c.id)}
              />
            );
          })}
          <button
            onClick={onBrowseChannels}
            className={cn(
              "mt-1 flex w-full items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground",
              isCompact ? "py-1 text-[13px]" : "py-1.5",
            )}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Browse channels</span>
          </button>
          <button
            onClick={onCreateChannel}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground",
              isCompact ? "py-1 text-[13px]" : "py-1.5",
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create channel</span>
          </button>
        </Section>

        {/* DMs */}
        <div className="mt-3">
          <Section
            label="Direct messages"
            open={openDms}
            onToggle={() => setOpenDms((v) => !v)}
            action={{ icon: Plus, label: "New DM", onClick: onNewDm }}
          >
            {dms.map((conversation) => (
              <DMRow
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                active={activeDmId === conversation.id}
                compact={isCompact}
                onClick={() => onSelectDm?.(conversation.id)}
              />
            ))}
          </Section>
        </div>

        {/* Invite */}
        <button
          onClick={onInvite}
          className={cn(
            "mt-4 flex w-full items-center gap-2 rounded-md border border-dashed border-sidebar-border px-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground",
            isCompact ? "py-1.5 text-[13px]" : "py-2",
          )}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite teammates</span>
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  open,
  onToggle,
  action,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  action?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
  };
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="group flex items-center justify-between pr-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
          {label}
        </button>
        {action && (
          <button
            title={action.label}
            onClick={action.onClick}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground opacity-0 hover:bg-sidebar-accent hover:text-foreground group-hover:opacity-100 transition-opacity"
          >
            <action.icon className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && <div className="mt-0.5 flex flex-col gap-px">{children}</div>}
    </div>
  );
}
