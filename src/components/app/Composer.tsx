import { useState, useRef, type KeyboardEvent } from "react";
import { Paperclip, Smile, AtSign, Bold, Send, Mic, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposerProps {
  placeholder?: string;
  compact?: boolean;
  onSend?: (content: string) => void;
}

const REACTIONS = ["🔥", "🚀", "❤️", "👀", "👋", "🎉", "✅", "🙌"];

export function Composer({ placeholder = "Message", compact, onSend }: ComposerProps) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onSend?.(v);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const insertEmoji = (emoji: string) => {
    setValue((v) => v + emoji);
    setShowEmoji(false);
    ref.current?.focus();
  };

  return (
    <div className={cn("px-4 pb-4", compact && "px-3 pb-3")}>
      <div className="relative rounded-xl border border-border bg-surface-elevated/70 shadow-elegant focus-within:border-foreground/30 focus-within:ring-1 focus-within:ring-foreground/10 transition-colors">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={2}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "block w-full resize-none bg-transparent px-3.5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none",
            compact ? "pt-2 pb-0.5 text-[13px]" : "pt-3 pb-1 text-[14px]",
          )}
        />
        <div className={cn("flex items-center justify-between px-2", compact ? "pb-1" : "pb-1.5")}>
          <div className="flex items-center gap-0.5 text-muted-foreground">
            {[
              { Icon: Plus, label: "Attach" },
              { Icon: Bold, label: "Bold" },
              { Icon: AtSign, label: "Mention" },
              { Icon: Smile, label: "Emoji", onClick: () => setShowEmoji((s) => !s) },
              { Icon: Paperclip, label: "Upload" },
              { Icon: Mic, label: "Record voice clip" },
            ].map(({ Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                aria-label={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-foreground/[0.06] hover:text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send message"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              value.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-foreground/[0.04] text-muted-foreground/60 cursor-not-allowed",
            )}
          >
            <Send className="h-3 w-3" />
            Send
          </button>
        </div>
        {showEmoji && (
          <div className="absolute bottom-full right-2 mb-2 flex gap-1 rounded-lg border border-border bg-popover p-1.5 shadow-elegant">
            {REACTIONS.map((e) => (
              <button
                key={e}
                onClick={() => insertEmoji(e)}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-foreground/[0.06]"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground/60">
        <span>
          <kbd className="rounded border border-border bg-surface-elevated px-1 py-px font-sans text-[10px]">
            ⏎
          </kbd>{" "}
          to send
          <span className="mx-1.5">·</span>
          <kbd className="rounded border border-border bg-surface-elevated px-1 py-px font-sans text-[10px]">
            ⇧⏎
          </kbd>{" "}
          for newline
        </span>
        {focused ? (
          <span className="text-muted-foreground/80">You&rsquo;re typing…</span>
        ) : (
          <TypingIndicator names={["Priya", "Alex"]} />
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ names }: { names: string[] }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-muted-foreground/70 animate-typing"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      <span>{names.join(" & ")} are typing</span>
    </span>
  );
}
