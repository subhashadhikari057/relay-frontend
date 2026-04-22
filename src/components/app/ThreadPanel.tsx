import { X, Users } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { Composer } from "./Composer";
import { getMember, type Message, formatTime } from "@/lib/sample-data";
import { MessageItem } from "./MessageItem";
import { useStore, sendThreadReply } from "@/lib/store";

interface ThreadPanelProps {
  message: Message;
  onClose: () => void;
}

export function ThreadPanel({ message, onClose }: ThreadPanelProps) {
  const replies = useStore((s) => s.threads[message.id]) ?? [];
  const author = getMember(message.authorId);

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-foreground">Thread</div>
          <div className="text-[11px] text-muted-foreground"># engineering</div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Parent */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-baseline gap-2">
            <MemberAvatar member={author} size="sm" />
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">{author.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
          <div className="mt-1.5 pl-9 text-[14px] text-foreground/90">{message.content}</div>
        </div>

        {/* Reply meta */}
        <div className="flex items-center gap-2 px-5 py-2 text-[11px] text-muted-foreground">
          <Users className="h-3 w-3" />
          {replies.length} {replies.length === 1 ? "reply" : "replies"}
          <span className="ml-2 h-px flex-1 bg-border" />
        </div>

        <div className="pb-3">
          {replies.map((r, i) => (
            <MessageItem
              key={r.id}
              message={r}
              groupedWithPrev={i > 0 && replies[i - 1].authorId === r.authorId}
              compact
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <Composer
          placeholder="Reply in thread"
          compact
          onSend={(content) => sendThreadReply(message.id, content)}
        />
      </div>
    </aside>
  );
}
