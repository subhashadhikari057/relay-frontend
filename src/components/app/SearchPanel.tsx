import { useMemo, useState } from "react";
import { Search, X, Hash, Lock, FileText, Calendar, User, SlidersHorizontal } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import {
  channels,
  members,
  messagesByChannel,
  getMember,
  formatTime,
  type Message,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";

type Tab = "messages" | "channels" | "people" | "files";

interface SearchPanelProps {
  initialQuery?: string;
  onClose: () => void;
  onJumpChannel: (id: string) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "messages", label: "Messages" },
  { id: "channels", label: "Channels" },
  { id: "people", label: "People" },
  { id: "files", label: "Files" },
];

export function SearchPanel({ initialQuery = "", onClose, onJumpChannel }: SearchPanelProps) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<Tab>("messages");
  const [fromUser, setFromUser] = useState<string | "any">("any");
  const [inChannel, setInChannel] = useState<string | "any">("any");
  const [when, setWhen] = useState<"any" | "today" | "week" | "month">("any");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allMessages = useMemo(() => {
    return Object.entries(messagesByChannel).flatMap(([cid, msgs]) =>
      msgs.map((m) => ({ ...m, channelId: cid })),
    );
  }, []);

  const q = query.trim().toLowerCase();

  const messageHits = useMemo(() => {
    return allMessages.filter((m) => {
      if (q && !m.content.toLowerCase().includes(q)) return false;
      if (fromUser !== "any" && m.authorId !== fromUser) return false;
      if (inChannel !== "any" && m.channelId !== inChannel) return false;
      if (when !== "any") {
        const days = (Date.now() - new Date(m.createdAt).getTime()) / 86_400_000;
        if (when === "today" && days > 1) return false;
        if (when === "week" && days > 7) return false;
        if (when === "month" && days > 31) return false;
      }
      return true;
    });
  }, [allMessages, q, fromUser, inChannel, when]);

  const channelHits = useMemo(
    () => channels.filter((c) => !q || c.name.includes(q) || c.topic?.toLowerCase().includes(q)),
    [q],
  );
  const peopleHits = useMemo(
    () =>
      members.filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.handle.includes(q) ||
          m.title?.toLowerCase().includes(q),
      ),
    [q],
  );
  const fileHits = useMemo(
    () =>
      allMessages
        .flatMap((m) => (m.attachments ?? []).map((a) => ({ ...a, msg: m })))
        .filter((f) => !q || f.name.toLowerCase().includes(q)),
    [allMessages, q],
  );

  const counts = {
    messages: messageHits.length,
    channels: channelHits.length,
    people: peopleHits.length,
    files: fileHits.length,
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[15px] font-semibold">Search</h1>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, files, people, channels…"
            className="h-10 w-full rounded-lg border border-border bg-surface-elevated/60 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

        {/* Tabs */}
        <div className="mt-3 flex items-center justify-between gap-2 border-b border-border -mb-4">
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 px-3 py-2.5 text-[13px] font-medium transition-colors",
                  tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-1.5 rounded px-1.5 py-px text-[10px] tabular-nums",
                    tab === t.id
                      ? "bg-foreground/[0.08] text-foreground"
                      : "bg-foreground/[0.04] text-muted-foreground",
                  )}
                >
                  {counts[t.id]}
                </span>
                {tab === t.id && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFiltersOpen(true)}
            className="mb-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-[12px] text-muted-foreground hover:border-foreground/30 hover:text-foreground md:hidden"
          >
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </button>
        </div>
      </header>

      {/* Mobile filters sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border bg-popover p-5 animate-in slide-in-from-bottom">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-[12px] text-muted-foreground hover:text-foreground"
              >
                Done
              </button>
            </div>
            <FilterGroup label="From" icon={User}>
              <Select value={fromUser} onChange={setFromUser}>
                <option value="any">Anyone</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup label="In channel" icon={Hash}>
              <Select value={inChannel} onChange={setInChannel}>
                <option value="any">Any channel</option>
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <FilterGroup label="Date" icon={Calendar}>
              <Select value={when} onChange={(v) => setWhen(v as typeof when)}>
                <option value="any">Anytime</option>
                <option value="today">Today</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
              </Select>
            </FilterGroup>
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Filters */}
        <aside className="hidden w-64 shrink-0 border-r border-border p-4 md:block">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </div>

          <FilterGroup label="From" icon={User}>
            <Select value={fromUser} onChange={setFromUser}>
              <option value="any">Anyone</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup label="In channel" icon={Hash}>
            <Select value={inChannel} onChange={setInChannel}>
              <option value="any">Any channel</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup label="Date" icon={Calendar}>
            <Select value={when} onChange={(v) => setWhen(v as typeof when)}>
              <option value="any">Anytime</option>
              <option value="today">Today</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </Select>
          </FilterGroup>

          <button
            onClick={() => {
              setFromUser("any");
              setInChannel("any");
              setWhen("any");
            }}
            className="mt-2 w-full rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1.5 text-[12px] text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            Reset filters
          </button>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[820px] px-5 py-4">
            {tab === "messages" && (
              <ResultList empty={!messageHits.length} query={q}>
                {messageHits.map((m) => {
                  const author = getMember(m.authorId);
                  const ch = channels.find((c) => c.id === m.channelId);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        if (ch) onJumpChannel(ch.id);
                        onClose();
                      }}
                      className="block w-full rounded-lg border border-border bg-surface-elevated/40 p-3.5 text-left transition-colors hover:border-foreground/20 hover:bg-surface-elevated/70"
                    >
                      <div className="flex items-baseline gap-2">
                        <MemberAvatar member={author} size="xs" />
                        <span className="text-[13px] font-semibold">{author.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatTime(m.createdAt)}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          {ch?.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/90">
                        <Highlight text={m.content} query={q} />
                      </p>
                    </button>
                  );
                })}
              </ResultList>
            )}

            {tab === "channels" && (
              <ResultList empty={!channelHits.length} query={q}>
                {channelHits.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onJumpChannel(c.id);
                      onClose();
                    }}
                    className="flex w-full items-start gap-3 rounded-lg border border-border bg-surface-elevated/40 p-3.5 text-left hover:border-foreground/20 hover:bg-surface-elevated/70"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground/[0.05]">
                      {c.private ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-foreground">#{c.name}</div>
                      <div className="truncate text-[12.5px] text-muted-foreground">
                        {c.topic ?? "No topic set"}
                      </div>
                    </div>
                  </button>
                ))}
              </ResultList>
            )}

            {tab === "people" && (
              <ResultList empty={!peopleHits.length} query={q}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {peopleHits.map((m) => (
                    <button
                      key={m.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated/40 p-3 text-left hover:border-foreground/20 hover:bg-surface-elevated/70"
                    >
                      <MemberAvatar member={m} size="md" showPresence />
                      <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-semibold">{m.name}</div>
                        <div className="truncate text-[11.5px] text-muted-foreground">
                          @{m.handle} · {m.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ResultList>
            )}

            {tab === "files" && (
              <ResultList empty={!fileHits.length} query={q}>
                {fileHits.map((f, i) => {
                  const author = getMember((f.msg as Message).authorId);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated/40 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground/[0.05]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-semibold">{f.name}</div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {f.meta} · shared by {author.name}
                        </div>
                      </div>
                      <button className="rounded-md border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground hover:border-foreground/30 hover:text-foreground">
                        Download
                      </button>
                    </div>
                  );
                })}
              </ResultList>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-md border border-border bg-surface-elevated/60 px-2 text-[12.5px] text-foreground focus:border-foreground/30 focus:outline-none"
    >
      {children}
    </select>
  );
}

function ResultList({
  empty,
  query,
  children,
}: {
  empty: boolean;
  query: string;
  children: React.ReactNode;
}) {
  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.04]">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-[14px] font-semibold">No results{query && ` for "${query}"`}</h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Try different keywords or remove a filter.
        </p>
      </div>
    );
  }
  return <div className="flex flex-col gap-2">{children}</div>;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-foreground/[0.12] px-0.5 text-foreground">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
