import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";
import {
  SettingsHeader,
  settingsBtnPrimary,
  settingsBtnGhost,
} from "@/components/settings/SettingsShell";
import { MemberAvatar } from "@/components/app/MemberAvatar";
import { members } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/members")({
  component: MembersPage,
});

const ROLES = ["Owner", "Admin", "Member", "Guest"] as const;

function MembersPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof ROLES)[number] | "All">("All");

  const list = useMemo(() => {
    return members
      .map((m, i) => ({
        ...m,
        role: i === 0 ? "Owner" : i < 2 ? "Admin" : i > 4 ? "Guest" : "Member",
      }))
      .filter(
        (m) =>
          (filter === "All" || m.role === filter) &&
          (!q || m.name.toLowerCase().includes(q.toLowerCase())),
      );
  }, [q, filter]);

  return (
    <div>
      <SettingsHeader title="Members" description="Manage who can access this workspace." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members"
            className="h-9 w-full rounded-md border border-border bg-background/40 pl-9 pr-3 text-[13px] focus:border-foreground/30 focus:outline-none"
          />
        </div>
        <button className={cn(settingsBtnPrimary, "h-9 gap-1.5")}>
          <UserPlus className="h-3.5 w-3.5" /> Invite
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {(["All", ...ROLES] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] transition-colors",
              filter === r
                ? "border-foreground/40 bg-foreground/[0.08] text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {list.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 sm:px-5",
              i !== list.length - 1 && "border-b border-border",
            )}
          >
            <MemberAvatar member={m} size="md" showPresence />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13.5px] font-medium">{m.name}</span>
                <span className="hidden text-[11.5px] text-muted-foreground sm:inline">
                  @{m.handle}
                </span>
              </div>
              <div className="truncate text-[12px] text-muted-foreground">{m.title}</div>
            </div>
            <span className="hidden rounded-full border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
              {m.role}
            </span>
            <button className={cn(settingsBtnGhost, "h-8 w-8 px-0")}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <div className="px-5 py-10 text-center text-[13px] text-muted-foreground">
            No members match.
          </div>
        )}
      </div>

      <p className="mt-4 text-[11.5px] text-muted-foreground">
        {list.length} of {members.length} members shown.
      </p>
    </div>
  );
}
