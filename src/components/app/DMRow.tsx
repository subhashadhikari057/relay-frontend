import { MemberAvatar } from "./MemberAvatar";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/sample-data";

interface DMRowProps {
  member: Member;
  active?: boolean;
  unread?: number;
  onClick?: () => void;
}

export function DMRow({ member, active, unread, onClick }: DMRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
      )}
    >
      <MemberAvatar member={member} size="xs" showPresence />
      <span className="truncate">{member.name}</span>
      {unread ? (
        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {unread}
        </span>
      ) : null}
    </button>
  );
}
