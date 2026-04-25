import { Link } from "@tanstack/react-router";
import { Home, MessageSquare, Bell, Bookmark, Search, Plus, Settings, LogOut } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, useStoredCurrentUser } from "@/lib/current-user";
import { useDensity } from "@/lib/store";
import { useCurrentUser, useLogoutMutation } from "@/queries/modules/auth.queries";
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

export function GlobalSidebar({ activeView = "home", onSelectView }: GlobalSidebarProps) {
  const { data: currentUser } = useCurrentUser();
  const { density } = useDensity();
  const logout = useLogoutMutation();
  const { user: storedUser, isHydrated } = useStoredCurrentUser();
  const resolvedUser = isHydrated ? (currentUser ?? storedUser ?? getCurrentUser()) : null;
  const profileName =
    resolvedUser?.displayName || resolvedUser?.fullName || resolvedUser?.email || "You";
  const isCompact = density === "compact";

  return (
    <div
      className={cn(
        "flex h-full shrink-0 flex-col items-center justify-between border-r border-sidebar-border bg-sidebar",
        isCompact ? "w-[56px] py-2" : "w-[64px] py-3",
      )}
    >
      <div className={cn("flex flex-col items-center", isCompact ? "gap-1.5" : "gap-2")}>
        <Link
          to="/"
          className={cn(
            "group flex items-center justify-center rounded-lg border border-sidebar-border bg-foreground text-sm font-bold text-background shadow-elegant transition-transform hover:scale-[1.03]",
            isCompact ? "h-9 w-9" : "h-10 w-10",
          )}
          title="Relay home"
        >
          R
        </Link>
        <button
          className={cn(
            "flex items-center justify-center rounded-lg border border-dashed border-sidebar-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground",
            isCompact ? "h-9 w-9" : "h-10 w-10",
          )}
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
                  "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                  isCompact ? "h-9 w-9" : "h-10 w-10",
                  active && "bg-sidebar-accent text-foreground",
                )}
              >
                <Icon
                  className={cn(isCompact ? "h-4 w-4" : "h-[18px] w-[18px]")}
                  strokeWidth={1.75}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className={cn("flex flex-col items-center", isCompact ? "gap-1.5" : "gap-2")}>
        <Link
          to="/settings"
          className={cn(
            "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            isCompact ? "h-8 w-8" : "h-9 w-9",
          )}
          title="Settings"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title={profileName}
              className="rounded-md ring-1 ring-sidebar-border transition hover:ring-foreground/30"
            >
              {isHydrated ? (
                <UserAvatar
                  name={profileName}
                  avatarUrl={resolvedUser?.avatarUrl}
                  avatarColor={resolvedUser?.avatarColor}
                  className={cn(isCompact ? "h-8 w-8" : "h-9 w-9")}
                  showPresence
                />
              ) : (
                <div
                  className={cn(
                    "rounded-md bg-sidebar-accent/60",
                    isCompact ? "h-8 w-8" : "h-9 w-9",
                  )}
                />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={10}
            className="w-60 border-sidebar-border bg-sidebar text-foreground"
          >
            <DropdownMenuLabel className="min-w-0">
              <div className="truncate text-sm font-medium">{profileName}</div>
              {resolvedUser?.email && (
                <div className="truncate text-xs font-normal text-muted-foreground">
                  {resolvedUser.email}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings/profile" className="cursor-pointer">
                Profile settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logout.isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
