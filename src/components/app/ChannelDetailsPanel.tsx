import { useEffect, useState } from "react";
import { X, Hash, Lock, Bell, Pin, FileText, Users, Star, Link2, ChevronRight } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { AddChannelMemberModal } from "./AddChannelMemberModal";
import { useChannelMembers } from "@/queries/modules/channels.queries";
import type { ChannelMemberSummary, ChannelSummary } from "@/types/api.types";
import { cn } from "@/lib/utils";

type Tab = "about" | "members" | "pinned" | "files";

interface ChannelDetailsPanelProps {
  workspaceId: string;
  channel: ChannelSummary;
  onClose: () => void;
  initialTab?: Tab;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "members", label: "Members" },
  { id: "pinned", label: "Pinned" },
  { id: "files", label: "Files" },
];

export function ChannelDetailsPanel({
  workspaceId,
  channel,
  onClose,
  initialTab,
}: ChannelDetailsPanelProps) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "about");

  useEffect(() => {
    setTab(initialTab ?? "about");
  }, [channel.id, initialTab]);

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Channel details</div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.05]">
            {channel.type === "private" ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Hash className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-base font-semibold">{channel.name}</h2>
              <button className="text-muted-foreground hover:text-foreground">
                <Star className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {channel.memberCount} members · {channel.type === "private" ? "Private" : "Public"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                tab === t.id
                  ? "bg-foreground/[0.08] text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {tab === "about" && <AboutTab channel={channel} />}
        {tab === "members" && (
          <MembersTab workspaceId={workspaceId} channelId={channel.id} channelType={channel.type} />
        )}
        {tab === "pinned" && <PinnedTab />}
        {tab === "files" && <FilesTab />}
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-4 py-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[13px] hover:bg-foreground/[0.04]">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="text-foreground">{label}</div>
        {value && <div className="truncate text-[11.5px] text-muted-foreground">{value}</div>}
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function AboutTab({ channel }: { channel: ChannelSummary }) {
  const createdAt = new Date(channel.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <Section title="Topic">
        <p className="text-[13px] text-foreground/90">{channel.topic ?? "No topic set"}</p>
        <button className="mt-2 text-[12px] text-muted-foreground hover:text-foreground">
          Edit topic
        </button>
      </Section>

      <Section title="Description">
        <p className="text-[13px] text-muted-foreground">
          {channel.description?.trim() || "No description set"}
        </p>
      </Section>

      <Section title="Settings">
        <Row icon={Bell} label="Notifications" value="All new messages" />
        <Row icon={Pin} label="Pinned items" value="2 pinned" />
        <Row icon={Link2} label="Get channel link" />
      </Section>

      <Section title="Created">
        <p className="text-[12.5px] text-muted-foreground">
          Created on <span className="text-foreground">{createdAt}</span>.
        </p>
      </Section>

      <div className="p-4">
        <button className="w-full rounded-md border border-destructive/30 bg-destructive/[0.08] px-3 py-2 text-[12.5px] font-medium text-destructive hover:bg-destructive/[0.14]">
          Leave channel
        </button>
      </div>
    </div>
  );
}

function MembersTab({
  workspaceId,
  channelId,
  channelType,
}: {
  workspaceId: string;
  channelId: string;
  channelType: ChannelSummary["type"];
}) {
  const membersQuery = useChannelMembers(workspaceId, channelId);
  const members = membersQuery.data?.members ?? [];
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="px-2 py-2">
      <button
        onClick={() => {
          if (channelType !== "private") return;
          setAddOpen(true);
        }}
        disabled={channelType !== "private"}
        className={cn(
          "mb-1 flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-foreground hover:bg-foreground/[0.04]",
          channelType !== "private" && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
        </div>
        {channelType === "private" ? "Add people" : "Public channel (join to participate)"}
      </button>
      <AddChannelMemberModal
        open={addOpen}
        workspaceId={workspaceId}
        channelId={channelId}
        onClose={() => setAddOpen(false)}
      />
      {membersQuery.isLoading && (
        <p className="px-2 py-2 text-[12px] text-muted-foreground">Loading members...</p>
      )}
      {membersQuery.isError && (
        <p className="px-2 py-2 text-[12px] text-destructive">
          {membersQuery.error.message || "Could not load members."}
        </p>
      )}
      {!membersQuery.isLoading && !membersQuery.isError && members.length === 0 && (
        <p className="px-2 py-2 text-[12px] text-muted-foreground">
          No members found in this channel.
        </p>
      )}
      {members.map((member) => (
        <MemberRow key={member.userId} member={member} />
      ))}
    </div>
  );
}

function PinnedTab() {
  return (
    <div className="px-4 py-4">
      <div className="rounded-md border border-border bg-foreground/[0.02] p-3 text-[12.5px] text-muted-foreground">
        Pinned messages will appear here once message pins are connected in this panel.
      </div>
    </div>
  );
}

function FilesTab() {
  return (
    <div className="px-4 py-4">
      <div className="rounded-md border border-border bg-foreground/[0.02] p-3 text-[12.5px] text-muted-foreground">
        Shared channel files will appear here once file listing is connected.
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: ChannelMemberSummary }) {
  const displayName = member.displayName?.trim() || member.fullName;
  const joinedOn = new Date(member.joinedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-foreground/[0.04]">
      <UserAvatar name={displayName} className="h-7 w-7" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{displayName}</span>
          <span className="rounded bg-foreground/[0.06] px-1 py-px text-[10px] uppercase tracking-wider text-muted-foreground">
            {member.role}
          </span>
        </div>
        <div className="truncate text-[11.5px] text-muted-foreground">
          {member.email} · Joined {joinedOn}
        </div>
      </div>
    </button>
  );
}
