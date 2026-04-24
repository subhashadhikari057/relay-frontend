import { Link } from "@tanstack/react-router";
import { Home, MessageSquare, Bell, Bookmark, Search, Plus, Settings } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { WorkspaceAvatar } from "./WorkspaceAvatar";
import { getCurrentUser, useStoredCurrentUser } from "@/lib/current-user";
import { getWorkspaceHomePath } from "@/lib/current-workspace";
import { useCurrentUser } from "@/queries/modules/auth.queries";
import type { WorkspaceSummary } from "@/types/api.types";
import { cn } from "@/lib/utils";

export type GlobalView = "home" | "dms" | "activity" | "saved" | "search";

interface GlobalSidebarProps {
  activeView?: GlobalView;
  onSelectView?: (view: GlobalView) => void;
  workspace?: WorkspaceSummary | null;
}

const navItems: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  view: GlobalView;
}[] = [
  { icon: Home, label: "Home", view: "home" },
  { icon: MessageSquare, label: "DMs", view: "dms" },
  { icon: Bell, label: "Activity", view: "activity" },
  { icon: Bookmark, label: "Saved", view: "saved" },
  { icon: Search, label: "Search", view: "search" },
];

export function GlobalSidebar({
  activeView = "home",
  onSelectView,
  workspace,
}: GlobalSidebarProps) {
  const { data: currentUser } = useCurrentUser();
  const { user: storedUser, isHydrated } = useStoredCurrentUser();
  const resolvedUser = isHydrated ? (currentUser ?? storedUser ?? getCurrentUser()) : null;
  const profileName =
    resolvedUser?.displayName || resolvedUser?.fullName || resolvedUser?.email || "You";

  return (
    <div className="flex h-full w-[64px] shrink-0 flex-col items-center justify-between border-r border-sidebar-border bg-sidebar py-3">
      <div className="flex flex-col items-center gap-2">
        <Link
          to={getWorkspaceHomePath(workspace)}
          className="group flex h-10 w-10 items-center justify-center rounded-lg shadow-elegant hover:scale-[1.03] transition-transform"
          title={workspace?.name || "Relay workspace"}
        >
          <WorkspaceAvatar
            name={workspace?.name || "Relay"}
            avatarUrl={workspace?.avatarUrl}
            avatarColor={workspace?.avatarColor}
            className="h-10 w-10 rounded-lg"
          />
        </Link>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-sidebar-border text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
          title="Add workspace"
        >
          <Plus className="h-4 w-4" />
        </button>

        <div className="my-2 h-px w-6 bg-sidebar-border" />

        <nav className="flex flex-col items-center gap-1">
          {navItems.map(({ icon: Icon, label, view }) => {
            const active = activeView === view;
            return (
              <button
                key={label}
                title={label}
                onClick={() => onSelectView?.(view)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                  active && "bg-sidebar-accent text-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Link
          to="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </Link>
        <button
          title={profileName}
          className="rounded-md ring-1 ring-sidebar-border hover:ring-foreground/30 transition"
        >
          {isHydrated ? (
            <UserAvatar
              name={profileName}
              avatarUrl={resolvedUser?.avatarUrl}
              avatarColor={resolvedUser?.avatarColor}
              className="h-9 w-9"
              showPresence
            />
          ) : (
            <div className="h-9 w-9 rounded-md bg-sidebar-accent/60" />
          )}
        </button>
      </div>
    </div>
  );
}
