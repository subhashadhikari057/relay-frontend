import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { members } from "@/lib/sample-data";
import { MemberAvatar } from "@/components/app/MemberAvatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people")({
  head: () => ({
    meta: [
      { title: "People — Relay" },
      { name: "description", content: "Everyone in your Relay workspace." },
    ],
  }),
  component: PeoplePage,
});

const filters = ["All", "Online", "Admins", "Members"] as const;
type Filter = (typeof filters)[number];

function PeoplePage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (q && !`${m.name} ${m.handle} ${m.title ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (filter === "Online" && m.presence !== "online") return false;
      if (filter === "Admins" && m.role !== "Admin") return false;
      if (filter === "Members" && m.role === "Admin") return false;
      return true;
    });
  }, [q, filter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to workspace
          </Link>
          <span className="text-[13px] text-muted-foreground">
            {filtered.length} of {members.length}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">People</h1>
        <p className="mt-2 text-muted-foreground">Everyone in Acme Inc.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, handle, or role…"
              className="h-10 w-full rounded-md border border-border bg-surface/60 pl-9 pr-3 text-[13.5px] focus:border-foreground/30 focus:outline-none"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-[12.5px] transition-colors",
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-surface/40 p-4 transition-colors hover:border-foreground/20 hover:bg-surface"
            >
              <div className="flex items-start gap-3">
                <MemberAvatar member={m} size="lg" showPresence />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-semibold">{m.name}</span>
                    {m.role && (
                      <span className="rounded-full border border-border bg-background/60 px-1.5 py-px text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.role}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-muted-foreground">@{m.handle}</div>
                  {m.title && (
                    <div className="mt-0.5 text-[12.5px] text-foreground/80">{m.title}</div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-md border border-border bg-background/40 px-2 py-1.5 text-[12px] text-foreground hover:border-foreground/30">
                  Message
                </button>
                <button className="flex-1 rounded-md border border-border bg-background/40 px-2 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/30">
                  View profile
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border bg-surface/30 p-12 text-center text-sm text-muted-foreground">
              No people match those filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
