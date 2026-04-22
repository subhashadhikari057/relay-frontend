import { useState } from "react";
import { X, Hash, Lock, Bell, Pin, FileText, Users, Star, Link2, ChevronRight } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { members, type Channel } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

type Tab = "about" | "members" | "pinned" | "files";

interface ChannelDetailsPanelProps {
  channel: Channel;
  onClose: () => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "members", label: "Members" },
  { id: "pinned", label: "Pinned" },
  { id: "files", label: "Files" },
];

export function ChannelDetailsPanel({ channel, onClose }: ChannelDetailsPanelProps) {
  const [tab, setTab] = useState<Tab>("about");

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
            {channel.private ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-base font-semibold">{channel.name}</h2>
              <button className="text-muted-foreground hover:text-foreground">
                <Star className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {members.length} members · {channel.private ? "Private" : "Public"}
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
        {tab === "members" && <MembersTab />}
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

function AboutTab({ channel }: { channel: Channel }) {
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
          A space for the team to share updates, decisions, and collaborate in the open.
        </p>
        <button className="mt-2 text-[12px] text-muted-foreground hover:text-foreground">
          Edit description
        </button>
      </Section>

      <Section title="Settings">
        <Row icon={Bell} label="Notifications" value="All new messages" />
        <Row icon={Pin} label="Pinned items" value="2 pinned" />
        <Row icon={Link2} label="Get channel link" />
      </Section>

      <Section title="Created">
        <p className="text-[12.5px] text-muted-foreground">
          Created by <span className="text-foreground">Marcus Chen</span> on Jan 12, 2026.
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

function MembersTab() {
  return (
    <div className="px-2 py-2">
      <button className="mb-1 flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-foreground hover:bg-foreground/[0.04]">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
        </div>
        Add people
      </button>
      {members.map((m) => (
        <button
          key={m.id}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-foreground/[0.04]"
        >
          <MemberAvatar member={m} size="sm" showPresence />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="truncate text-[13px] font-medium text-foreground">{m.name}</span>
              {m.role && (
                <span className="rounded bg-foreground/[0.06] px-1 py-px text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.role}
                </span>
              )}
            </div>
            <div className="truncate text-[11.5px] text-muted-foreground">
              @{m.handle} · {m.title}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function PinnedTab() {
  const items = [
    { title: "Q2 roadmap doc", meta: "Pinned by Marcus · 3 days ago" },
    { title: "Incident response playbook", meta: "Pinned by Alex · 2 weeks ago" },
  ];
  return (
    <div className="px-2 py-2">
      {items.map((p, i) => (
        <button
          key={i}
          className="flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left hover:bg-foreground/[0.04]"
        >
          <Pin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-foreground">{p.title}</div>
            <div className="text-[11.5px] text-muted-foreground">{p.meta}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function FilesTab() {
  const files = [
    { name: "presence-bench.pdf", meta: "PDF · 412 KB · Alex Mercer" },
    { name: "thread-v3-mocks.fig", meta: "Figma · shared by Priya Nair" },
    { name: "incident-2026-04-18.md", meta: "Markdown · shared by Jonas" },
  ];
  return (
    <div className="px-2 py-2">
      {files.map((f, i) => (
        <button
          key={i}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-foreground/[0.04]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.05]">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-foreground">{f.name}</div>
            <div className="truncate text-[11.5px] text-muted-foreground">{f.meta}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
