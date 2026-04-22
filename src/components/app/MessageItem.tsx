import { useState } from "react";
import { MemberAvatar } from "./MemberAvatar";
import { getMember, formatTime, type Message } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  SmilePlus,
  Bookmark,
  MoreHorizontal,
  Link2,
  Pencil,
  FileText,
} from "lucide-react";

interface MessageItemProps {
  message: Message;
  groupedWithPrev?: boolean;
  onOpenThread?: (msg: Message) => void;
  compact?: boolean;
}

export function MessageItem({ message, groupedWithPrev, onOpenThread, compact }: MessageItemProps) {
  const author = getMember(message.authorId);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative flex gap-3 px-5 transition-colors hover:bg-foreground/[0.02]",
        groupedWithPrev ? "py-0.5" : "pt-3 pb-1",
      )}
    >
      <div className="w-9 shrink-0">
        {!groupedWithPrev ? (
          <MemberAvatar member={author} size="md" />
        ) : (
          <span
            className={cn(
              "mt-1 block text-right pr-1 text-[10px] tabular-nums text-muted-foreground/0 transition-opacity",
              hover && "text-muted-foreground/70",
            )}
          >
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!groupedWithPrev && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">{author.name}</span>
            {author.title && (
              <span className="text-[11px] text-muted-foreground/70">{author.title}</span>
            )}
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}
        <div
          className={cn("text-[14px] leading-relaxed text-foreground/90", compact && "text-[13px]")}
        >
          <RichText content={message.content} />
          {message.edited && (
            <span className="ml-1 text-[11px] text-muted-foreground/70">(edited)</span>
          )}
        </div>

        {message.attachments?.map((att, i) => (
          <div
            key={i}
            className="mt-2 inline-flex max-w-md items-center gap-3 rounded-lg border border-border bg-surface-elevated/60 px-3 py-2.5 text-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground/[0.04]">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">{att.name}</div>
              <div className="text-[11px] text-muted-foreground">{att.meta}</div>
            </div>
          </div>
        ))}

        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.reactions.map((r, i) => (
              <button
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                  r.mine
                    ? "border-foreground/30 bg-foreground/[0.06] text-foreground"
                    : "border-border bg-surface-elevated/60 text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                <span>{r.emoji}</span>
                <span className="tabular-nums">{r.count}</span>
              </button>
            ))}
            <button className="inline-flex items-center justify-center rounded-full border border-border bg-surface-elevated/60 px-2 py-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
              <SmilePlus className="h-3 w-3" />
            </button>
          </div>
        )}

        {message.replies && message.replies > 0 && (
          <button
            onClick={() => onOpenThread?.(message)}
            className="mt-1.5 inline-flex items-center gap-2 rounded-md px-2 py-1 -ml-2 text-xs font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <div className="flex -space-x-1">
              {message.threadParticipants?.slice(0, 3).map((id) => (
                <MemberAvatar key={id} member={getMember(id)} size="xs" />
              ))}
            </div>
            <span className="text-foreground">{message.replies} replies</span>
            <span className="text-muted-foreground/70">View thread</span>
          </button>
        )}
      </div>

      {/* Hover actions */}
      <div
        className={cn(
          "absolute -top-3 right-6 flex items-center gap-0 rounded-lg border border-border bg-popover shadow-elegant transition-opacity",
          hover ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {[
          { icon: SmilePlus, label: "React" },
          { icon: MessageSquare, label: "Reply in thread", action: () => onOpenThread?.(message) },
          { icon: Bookmark, label: "Save" },
          { icon: Link2, label: "Copy link" },
          { icon: Pencil, label: "Edit" },
          { icon: MoreHorizontal, label: "More" },
        ].map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            title={label}
            onClick={action}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground first:rounded-l-lg last:rounded-r-lg"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RichText({ content }: { content: string }) {
  // Tiny inline markdown: **bold**, `code`, @mentions, #channels
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|@\w+|#\w+|🧵|🚀|🔥|🙌|❤️|👋|🎉|✅|👀)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^\*\*[^*]+\*\*$/.test(p))
          return (
            <strong key={i} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        if (/^`[^`]+`$/.test(p))
          return (
            <code
              key={i}
              className="rounded bg-foreground/[0.08] px-1.5 py-0.5 font-mono text-[12px]"
            >
              {p.slice(1, -1)}
            </code>
          );
        if (/^@\w+$/.test(p))
          return (
            <span key={i} className="rounded bg-foreground/[0.08] px-1 font-medium text-foreground">
              {p}
            </span>
          );
        if (/^#\w+$/.test(p))
          return (
            <span key={i} className="text-foreground hover:underline cursor-pointer">
              {p}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
