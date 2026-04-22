import { Modal } from "./Modal";

const SECTIONS: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "Navigation",
    items: [
      { keys: ["⌘", "K"], label: "Open quick switcher" },
      { keys: ["⌘", "/"], label: "Show keyboard shortcuts" },
      { keys: ["⌘", "⇧", "F"], label: "Search messages" },
      { keys: ["⌘", "⇧", "A"], label: "Open activity / mentions" },
      { keys: ["⌘", "."], label: "Toggle right panel" },
    ],
  },
  {
    title: "Channels",
    items: [
      { keys: ["⌘", "⇧", "L"], label: "Mark channel as read" },
      { keys: ["Alt", "↑"], label: "Previous channel" },
      { keys: ["Alt", "↓"], label: "Next channel" },
      { keys: ["⌘", "⇧", "K"], label: "Browse channels" },
    ],
  },
  {
    title: "Composing",
    items: [
      { keys: ["⏎"], label: "Send message" },
      { keys: ["⇧", "⏎"], label: "New line" },
      { keys: ["⌘", "B"], label: "Bold" },
      { keys: ["⌘", "I"], label: "Italic" },
      { keys: ["⌘", "U"], label: "Upload file" },
    ],
  },
];

export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Keyboard shortcuts"
      description="Move faster across Relay."
      size="lg"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.title}
            </h3>
            <div className="flex flex-col">
              {s.items.map((it) => (
                <div
                  key={it.label}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-[13px] last:border-b-0"
                >
                  <span className="text-foreground/90">{it.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {it.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="rounded border border-border bg-surface-elevated px-1.5 py-0.5 font-sans text-[10.5px] text-muted-foreground"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
