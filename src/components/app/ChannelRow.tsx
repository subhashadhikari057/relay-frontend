import { Hash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Channel } from "@/lib/sample-data";

interface ChannelRowProps {
  channel: Channel;
  active?: boolean;
  onClick?: () => void;
}

export function ChannelRow({ channel, active, onClick }: ChannelRowProps) {
  const Icon = channel.private ? Lock : Hash;
  const hasUnread = (channel.unread ?? 0) > 0;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        hasUnread && !active && "text-foreground font-medium",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={2} />
      <span className="truncate">{channel.name}</span>
      {channel.mentions ? (
        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
          {channel.mentions}
        </span>
      ) : hasUnread ? (
        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {channel.unread}
        </span>
      ) : null}
    </button>
  );
}
