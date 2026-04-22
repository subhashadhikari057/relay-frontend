import { useMemo, useState } from "react";
import { Hash, Lock, Search, Users } from "lucide-react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ChannelBrowserProps {
  open: boolean;
  onClose: () => void;
  onSelect: (channelId: string) => void;
  onCreate: () => void;
}

export function ChannelBrowser({ open, onClose, onSelect, onCreate }: ChannelBrowserProps) {
  const channels = useStore((s) => s.channels);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  const filtered = useMemo(() => {
    return channels.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q.toLowerCase()) &&
        !(c.topic ?? "").toLowerCase().includes(q.toLowerCase())
      )
        return false;
      if (filter === "public" && c.private) return false;
      if (filter === "private" && !c.private) return false;
      return true;
    });
  }, [channels, q, filter]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Browse channels"
      description={`Discover and join any of the ${channels.length} channels in Acme Inc.`}
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-border bg-background/40 px-3 text-[12.5px] hover:border-foreground/30"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onCreate();
            }}
            className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[12.5px] font-semibold text-background hover:opacity-90"
          >
            Create channel
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search channels…"
            className="h-9 w-full rounded-md border border-border bg-background/40 pl-9 pr-3 text-[13px] focus:border-foreground/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "public", "private"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-[12px] capitalize transition-colors",
                filter === f
                  ? "border-foreground/40 bg-foreground/[0.06] text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[420px] divide-y divide-border overflow-y-auto rounded-lg border border-border bg-background/30">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              onSelect(c.id);
              onClose();
            }}
            className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-foreground/[0.04]"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-muted-foreground">
              {c.private ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13.5px] font-semibold">{c.name}</span>
                {c.private && (
                  <span className="rounded-full border border-border bg-background/60 px-1.5 py-px text-[9.5px] uppercase tracking-wider text-muted-foreground">
                    Private
                  </span>
                )}
              </div>
              {c.topic && (
                <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{c.topic}</div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[11.5px] text-muted-foreground">
              <Users className="h-3 w-3" />
              {Math.floor(Math.random() * 40) + 4}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No channels match.
          </div>
        )}
      </div>
    </Modal>
  );
}
