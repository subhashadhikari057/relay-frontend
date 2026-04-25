import { Phone, Video, Info, Star } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";
import { MessageItem } from "./MessageItem";
import { Composer } from "./Composer";
import { type Member } from "@/lib/sample-data";
import { useDensity, useStore, sendDMMessage } from "@/lib/store";
import { cn } from "@/lib/utils";

interface DMViewProps {
  member: Member;
}

export function DMView({ member }: DMViewProps) {
  const messages = useStore((s) => s.dmMessages[member.id]) ?? [];
  const { density } = useDensity();
  const isCompact = density === "compact";
  const presenceLabel =
    member.presence === "online" ? "Active now" : member.presence === "away" ? "Away" : "Offline";

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header
        className={cn(
          "flex items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-4",
          isCompact ? "h-12" : "h-14",
        )}
      >
        <MemberAvatar member={member} size="sm" showPresence />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-[15px] font-semibold">{member.name}</h1>
            <button className="text-muted-foreground hover:text-foreground">
              <Star className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-muted-foreground">
            @{member.handle} · {presenceLabel}
          </div>
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
          <DMIntro member={member} />
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const grouped =
              !!prev &&
              prev.authorId === m.authorId &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <MessageItem key={m.id} message={m} groupedWithPrev={grouped} compact={isCompact} />
            );
          })}
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <Composer
          placeholder={`Message ${member.name}`}
          compact={isCompact}
          onSend={(content) => sendDMMessage(member.id, content)}
        />
      </div>
    </main>
  );
}

function DMIntro({ member }: { member: Member }) {
  return (
    <div className="px-5 pb-2 pt-6">
      <MemberAvatar member={member} size="xl" showPresence />
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{member.name}</h2>
      <p className="text-[13px] text-muted-foreground">
        @{member.handle} · {member.title}
      </p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        This is the very beginning of your direct message history with{" "}
        <span className="text-foreground">{member.name}</span>. Only the two of you can see these
        messages.
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
