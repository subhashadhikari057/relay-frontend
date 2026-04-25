import { useEffect, useMemo, useState } from "react";
import {
  Hash,
  Lock,
  Search,
  MessageSquare,
  Plus,
  Settings,
  UserPlus,
  Bell,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { dms, getMember } from "@/lib/sample-data";
import { MemberAvatar } from "./MemberAvatar";
import { cn } from "@/lib/utils";
import type { ChannelSummary } from "@/types/api.types";

interface CommandPaletteProps {
  open: boolean;
  channels: ChannelSummary[];
  onClose: () => void;
  onJumpChannel?: (id: string) => void;
}

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "Channels" | "Direct messages" | "Actions";
  icon: React.ReactNode;
  onSelect: () => void;
};

export function CommandPalette({ open, channels, onClose, onJumpChannel }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const items: Item[] = useMemo(() => {
    const channelItems: Item[] = channels.map((c) => ({
      id: `c:${c.id}`,
      label: c.name,
      hint: c.topic ?? undefined,
      group: "Channels",
      icon:
        c.type === "private" ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />,
      onSelect: () => {
        onJumpChannel?.(c.id);
        onClose();
      },
    }));
    const dmItems: Item[] = dms.map((d) => {
      const m = getMember(d.userId);
      return {
        id: `d:${d.id}`,
        label: m.name,
        hint: m.title,
        group: "Direct messages",
        icon: <MemberAvatar member={m} size="xs" showPresence />,
        onSelect: onClose,
      };
    });
    const actions: Item[] = [
      {
        id: "a:create",
        label: "Create new channel",
        group: "Actions",
        icon: <Plus className="h-3.5 w-3.5" />,
        onSelect: onClose,
        hint: "⌘ N",
      },
      {
        id: "a:invite",
        label: "Invite people to workspace",
        group: "Actions",
        icon: <UserPlus className="h-3.5 w-3.5" />,
        onSelect: onClose,
      },
      {
        id: "a:settings",
        label: "Open workspace settings",
        group: "Actions",
        icon: <Settings className="h-3.5 w-3.5" />,
        onSelect: onClose,
        hint: "⌘ ,",
      },
      {
        id: "a:notif",
        label: "View all notifications",
        group: "Actions",
        icon: <Bell className="h-3.5 w-3.5" />,
        onSelect: onClose,
      },
      {
        id: "a:dm",
        label: "Start a new direct message",
        group: "Actions",
        icon: <MessageSquare className="h-3.5 w-3.5" />,
        onSelect: onClose,
      },
    ];
    return [...channelItems, ...dmItems, ...actions];
  }, [channels, onClose, onJumpChannel]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => setActiveIdx(0), [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        filtered[activeIdx]?.onSelect();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, onClose]);

  if (!open) return null;

  // Group rendering
  const groups: Record<string, Item[]> = {};
  filtered.forEach((i) => {
    (groups[i.group] ??= []).push(i);
  });

  let runningIdx = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-elegant animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2 border-b border-border px-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a channel, DM, or run a command…"
            className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="hidden rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
              <Sparkles className="h-5 w-5 text-muted-foreground/60" />
              <div className="mt-2 text-sm font-medium">No results</div>
              <div className="text-xs text-muted-foreground">Try a different search term.</div>
            </div>
          ) : (
            Object.entries(groups).map(([group, list]) => (
              <div key={group} className="mb-1">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </div>
                <div className="px-1.5">
                  {list.map((item) => {
                    runningIdx += 1;
                    const isActive = runningIdx === activeIdx;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveIdx(filtered.indexOf(item))}
                        onClick={() => item.onSelect()}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-foreground/[0.06] text-foreground"
                            : "text-foreground/85 hover:bg-foreground/[0.04]",
                        )}
                      >
                        <span className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                        {item.hint && (
                          <span className="ml-auto truncate text-[11px] text-muted-foreground">
                            {item.hint}
                          </span>
                        )}
                        {isActive && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface-elevated px-1 py-px text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-surface-elevated px-1 py-px text-[10px]">
                ↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface-elevated px-1 py-px text-[10px]">
                ↵
              </kbd>
              select
            </span>
          </div>
          <span>Relay command palette</span>
        </div>
      </div>
    </div>
  );
}
