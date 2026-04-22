import { Bookmark, Hash, X } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { messagesByChannel, channels, getMember, formatTime } from "@/lib/sample-data";

interface SavedPanelProps {
  onClose: () => void;
  onJumpChannel: (id: string) => void;
}

export function SavedPanel({ onClose, onJumpChannel }: SavedPanelProps) {
  // Pick a few "saved" messages for demo
  const saved = [
    { ...messagesByChannel.c2[0], channelId: "c2" },
    { ...messagesByChannel.c2[2], channelId: "c2" },
    { ...messagesByChannel.c1[0], channelId: "c1" },
  ].filter(Boolean);

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h1 className="text-[15px] font-semibold">Saved</h1>
          <p className="text-[11.5px] text-muted-foreground">
            Messages and files you've bookmarked.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {saved.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[820px] flex flex-col gap-2 px-4 py-4 sm:px-5">
            {saved.map((m) => {
              const author = getMember(m.authorId);
              const ch = channels.find((c) => c.id === m.channelId);
              return (
                <button
                  key={m.id}
                  onClick={() => ch && onJumpChannel(ch.id)}
                  className="block w-full rounded-lg border border-border bg-surface-elevated/40 p-3.5 text-left transition-colors hover:border-foreground/20 hover:bg-surface-elevated/70"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {ch?.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="h-3 w-3 fill-foreground/60 text-foreground/60" /> Saved
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <MemberAvatar member={author} size="xs" />
                    <span className="text-[13px] font-semibold">{author.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/90">
                    {m.content}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04]">
        <Bookmark className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-[15px] font-semibold">Nothing saved yet</h2>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
        Hover any message and click the bookmark icon to save it for later. Saved items show up
        here.
      </p>
    </div>
  );
}
