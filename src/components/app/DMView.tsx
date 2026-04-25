import { Phone, Video, Info, Star } from "lucide-react";
import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { Composer } from "./Composer";
import { useDensity } from "@/lib/store";
import { useCreateDmMessageMutation, useDmMessages } from "@/queries/modules/dm-messages.queries";
import { cn } from "@/lib/utils";
import type { DirectConversationSummary, MessageItem } from "@/types/api.types";

interface DMViewProps {
  workspaceId: string;
  conversation: DirectConversationSummary;
  currentUserId: string;
  currentUserAvatarColor?: string | null;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTimestamp(ts: string, variant: "header" | "grouped") {
  const d = new Date(ts);
  const now = new Date();
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isSameDay(d, now)) return time;

  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${date}, ${time}`;
}

function colorFromSeed(seed: string) {
  // Stable pastel-ish color for initials when backend doesn't provide avatarColor.
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) % 360;
  }
  return `hsl(${h} 65% 45%)`;
}

function getConversationTitle(conversation: DirectConversationSummary, currentUserId: string) {
  if (conversation.type === "group") {
    return conversation.title?.trim() || "Group message";
  }

  const other =
    conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0];
  return other?.displayName?.trim() || other?.fullName || "Direct message";
}

function getConversationSubtitle(conversation: DirectConversationSummary, currentUserId: string) {
  if (conversation.type === "group") {
    return `${conversation.memberCount} members`;
  }

  const other =
    conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0];
  return other?.email ? other.email : "Direct message";
}

export function DMView({
  workspaceId,
  conversation,
  currentUserId,
  currentUserAvatarColor,
}: DMViewProps) {
  const title = getConversationTitle(conversation, currentUserId);
  const subtitle = getConversationSubtitle(conversation, currentUserId);
  const avatarUrl =
    conversation.type === "one_to_one"
      ? ((conversation.members.find((m) => m.userId !== currentUserId) ?? conversation.members[0])
          ?.avatarUrl ?? null)
      : null;

  const messagesQuery = useDmMessages(workspaceId, conversation.id);
  const createMessageMutation = useCreateDmMessageMutation();
  const messages = messagesQuery.data?.messages ?? [];
  const timeline = [...messages].reverse(); // API returns newest-first
  const { density } = useDensity();
  const isCompact = density === "compact";

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header
        className={cn(
          "flex items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-4",
          isCompact ? "h-12" : "h-14",
        )}
      >
        <UserAvatar name={title} avatarUrl={avatarUrl} className="h-8 w-8 rounded-md" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-[15px] font-semibold">{title}</h1>
            <button className="text-muted-foreground hover:text-foreground">
              <Star className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          {[Phone, Video, Info].map((Icon, i) => (
            <button
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className={cn("mx-auto max-w-[820px]", isCompact ? "py-2" : "py-4")}>
          <DMIntro
            title={title}
            subtitle={subtitle}
            avatarUrl={avatarUrl}
            isGroup={conversation.type === "group"}
          />
          {messagesQuery.isLoading && (
            <div className="px-5 py-6 text-sm text-muted-foreground">Loading messages...</div>
          )}
          {messagesQuery.isError && (
            <div className="px-5 py-6 text-sm text-destructive">
              {messagesQuery.error.message || "Could not load messages."}
            </div>
          )}
          {timeline.map((m, i) => {
            const prev = timeline[i - 1];
            const grouped =
              !!prev &&
              prev.senderUserId === m.senderUserId &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <DmMessageItem
                key={m.id}
                message={m}
                groupedWithPrev={grouped}
                compact={isCompact}
                currentUserId={currentUserId}
                currentUserAvatarColor={currentUserAvatarColor}
              />
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <Composer
          placeholder={`Message ${title}`}
          compact={isCompact}
          onSend={(content) => {
            const next = content.trim();
            if (!next) return;
            if (createMessageMutation.isPending) return;
            createMessageMutation.mutate({
              workspaceId,
              directConversationId: conversation.id,
              payload: { content: next, type: "text" },
            });
          }}
        />
      </div>
    </main>
  );
}

function DMIntro({
  title,
  subtitle,
  avatarUrl,
  isGroup,
}: {
  title: string;
  subtitle: string;
  avatarUrl: string | null;
  isGroup: boolean;
}) {
  return (
    <div className="px-5 pb-2 pt-6">
      <UserAvatar name={title} avatarUrl={avatarUrl} className="h-16 w-16 rounded-md" />
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-[13px] text-muted-foreground">{subtitle}</p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        {isGroup
          ? "This is the very beginning of this group conversation."
          : "This is the very beginning of your direct message history."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
        <button className="rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-muted-foreground hover:border-foreground/30 hover:text-foreground">
          View profile
        </button>
        <button className="rounded-md border border-border bg-surface-elevated/60 px-2.5 py-1 text-muted-foreground hover:border-foreground/30 hover:text-foreground">
          Add to channel
        </button>
      </div>
    </div>
  );
}

function DmMessageItem({
  message,
  groupedWithPrev,
  compact,
  currentUserId,
  currentUserAvatarColor,
}: {
  message: MessageItem;
  groupedWithPrev?: boolean;
  compact?: boolean;
  currentUserId: string;
  currentUserAvatarColor?: string | null;
}) {
  const authorName = message.author.displayName?.trim() || message.author.fullName;
  const [hover, setHover] = useState(false);
  const isCurrentUser = message.senderUserId === currentUserId;
  const fallbackColor = isCurrentUser
    ? currentUserAvatarColor || colorFromSeed(message.author.id)
    : colorFromSeed(message.author.id);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative flex gap-3 px-5 transition-colors hover:bg-foreground/[0.02]",
        compact ? "gap-2 px-4" : "gap-3 px-5",
        groupedWithPrev ? (compact ? "py-0" : "py-0.5") : compact ? "pt-2 pb-0.5" : "pt-3 pb-1",
      )}
    >
      <div className={cn("shrink-0", compact ? "w-8" : "w-9")}>
        {!groupedWithPrev ? (
          <UserAvatar
            name={authorName}
            avatarUrl={message.author.avatarUrl}
            avatarColor={message.author.avatarUrl ? null : fallbackColor}
            className={cn("rounded-md", compact ? "h-7 w-7" : "h-9 w-9")}
          />
        ) : (
          <span
            className={cn(
              "mt-1 block whitespace-nowrap text-right pr-1 text-[10px] leading-none tabular-nums text-muted-foreground/0 transition-opacity",
              hover && "text-muted-foreground/70",
            )}
          >
            {formatTimestamp(message.createdAt, "grouped")}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!groupedWithPrev && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{authorName}</span>
            <span className="text-[11px] text-muted-foreground">
              {formatTimestamp(message.createdAt, "header")}
            </span>
          </div>
        )}
        <div
          className={cn("text-[14px] leading-relaxed text-foreground/90", compact && "text-[13px]")}
        >
          {message.content ?? ""}
        </div>
      </div>
    </div>
  );
}
