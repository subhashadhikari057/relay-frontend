import { cn } from "@/lib/utils";
import type { Member, Presence } from "@/lib/sample-data";

const presenceColor: Record<Presence, string> = {
  online: "bg-[oklch(0.72_0.16_150)]",
  away: "bg-[oklch(0.78_0.15_75)]",
  offline: "bg-muted-foreground/40",
};

interface AvatarProps {
  member: Member;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showPresence?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
  xl: "h-16 w-16 text-base",
};

const dotMap = {
  xs: "h-1.5 w-1.5 -right-0 -bottom-0",
  sm: "h-2 w-2 -right-0 -bottom-0",
  md: "h-2.5 w-2.5 -right-0.5 -bottom-0.5",
  lg: "h-3 w-3 -right-0.5 -bottom-0.5",
  xl: "h-3.5 w-3.5 -right-1 -bottom-1",
};

export function MemberAvatar({ member, size = "md", showPresence, className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-md font-semibold text-background",
          sizeMap[size],
        )}
        style={{ background: member.color }}
        aria-label={member.name}
      >
        {member.initials}
      </div>
      {showPresence && (
        <span
          className={cn(
            "absolute rounded-full ring-2 ring-sidebar",
            dotMap[size],
            presenceColor[member.presence],
            member.presence === "online" && "animate-pulse-dot",
          )}
        />
      )}
    </div>
  );
}
