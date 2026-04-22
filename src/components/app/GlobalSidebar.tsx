import { Link } from "@tanstack/react-router";
import { Home, MessageSquare, Bell, Bookmark, Search, Plus, Settings } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { me } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export type GlobalView = "home" | "dms" | "activity" | "saved" | "search";

interface GlobalSidebarProps {
  activeView?: GlobalView;
  onSelectView?: (view: GlobalView) => void;
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
  return (
    <div className="flex h-full w-[64px] shrink-0 flex-col items-center justify-between border-r border-sidebar-border bg-sidebar py-3">
      <div className="flex flex-col items-center gap-2">
        <Link
          to="/app"
          className="group flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm shadow-elegant hover:scale-[1.03] transition-transform"
          title="Acme Inc."
        >
          A
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
          title="Profile"
          className="rounded-md ring-1 ring-sidebar-border hover:ring-foreground/30 transition"
        >
          <MemberAvatar member={me} size="md" showPresence />
        </button>
      </div>
    </div>
  );
}
