import { UserAvatar } from "./UserAvatar";
import { cn } from "@/lib/utils";
import type { DirectConversationSummary } from "@/types/api.types";

interface DMRowProps {
  conversation: DirectConversationSummary;
  currentUserId: string;
  active?: boolean;
  unread?: number;
  compact?: boolean;
  onClick?: () => void;
}

function getConversationLabel(conversation: DirectConversationSummary, currentUserId: string) {
  if (conversation.type === "group") {
    return conversation.title?.trim() || "Group message";
  }

  const other =
    conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0];
  return other?.displayName?.trim() || other?.fullName || "Direct message";
}

function colorFromSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) % 360;
  }
  return `hsl(${h} 65% 45%)`;
}

function getConversationAvatar(conversation: DirectConversationSummary, currentUserId: string) {
  if (conversation.type === "group") return null;
  const other =
    conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0];
  return other?.avatarUrl ?? null;
}

export function DMRow({
  conversation,
  currentUserId,
  active,
  unread,
  compact,
  onClick,
}: DMRowProps) {
  const label = getConversationLabel(conversation, currentUserId);
  const avatarUrl = getConversationAvatar(conversation, currentUserId);
  const avatarColor = avatarUrl
    ? null
    : conversation.type === "group"
      ? colorFromSeed(conversation.id)
      : colorFromSeed(
          (conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0])
            ?.userId ?? conversation.id,
        );

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        compact && "py-1 text-[13px]",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
      )}
    >
      <UserAvatar
        name={label}
        avatarUrl={avatarUrl}
        avatarColor={avatarColor}
        className="h-5 w-5 rounded-md"
      />
      <span className="truncate">{label}</span>
      {unread ? (
        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {unread}
        </span>
      ) : null}
    </button>
  );
}
