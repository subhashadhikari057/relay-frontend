import { useMemo, useState } from "react";
import { X, AtSign, MessageSquare, Smile, Hash, Bell, Check } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { notifications, getMember, formatTime, type Notification } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread" | "mentions" | "reactions";

const KIND_ICON: Record<Notification["kind"], React.ComponentType<{ className?: string }>> = {
  mention: AtSign,
  reply: MessageSquare,
  reaction: Smile,
  dm: MessageSquare,
  channel: Hash,
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "unread") return n.unread;
      if (filter === "mentions") return n.kind === "mention";
      if (filter === "reactions") return n.kind === "reaction";
      return true;
    });
  }, [filter]);

  const grouped = useMemo(() => {
    const now = new Date("2026-04-20T12:00:00Z").getTime();
    const groups: Record<string, Notification[]> = { Today: [], Yesterday: [], Earlier: [] };
    for (const n of filtered) {
      const days = (now - new Date(n.createdAt).getTime()) / 86_400_000;
      if (days < 1) groups.Today.push(n);
      else if (days < 2) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    }
    return groups;
  }, [filtered]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold">Activity</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground">
              <Check className="h-3.5 w-3.5" /> Mark all read
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {(["all", "unread", "mentions", "reactions"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-medium capitalize transition-colors",
                filter === f
                  ? "bg-foreground/[0.08] text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-2 py-2">
            {Object.entries(grouped).map(([label, items]) =>
              items.length === 0 ? null : (
                <section key={label} className="mb-4">
                  <h3 className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </h3>
                  <ul className="flex flex-col gap-px">
                    {items.map((n) => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </ul>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationRow({ n }: { n: Notification }) {
  const author = getMember(n.authorId);
  const Icon = KIND_ICON[n.kind];
  return (
    <li>
      <button
        className={cn(
          "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.04]",
          n.unread && "bg-foreground/[0.02]",
        )}
      >
        <div className="relative">
          <MemberAvatar member={author} size="sm" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-surface-elevated">
            <Icon className="h-2.5 w-2.5 text-foreground" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-semibold">{author.name}</span>
            <span className="text-[11px] text-muted-foreground">{n.context}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {formatTime(n.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[12.5px] text-muted-foreground">{n.preview}</p>
        </div>
        {n.unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />}
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.04]">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-[14px] font-semibold">You're all caught up</h3>
      <p className="mt-1 max-w-xs text-[12.5px] text-muted-foreground">
        New mentions, replies, and reactions will appear here.
      </p>
    </div>
  );
}
