import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — Relay" },
      { name: "description", content: "What's new in Relay. Shipped weekly." },
      { property: "og:title", content: "Changelog — Relay" },
      { property: "og:description", content: "What's new in Relay. Shipped weekly." },
    ],
  }),
  component: ChangelogPage,
});

const entries = [
  {
    date: "April 22, 2026",
    version: "v1.18",
    tag: "New",
    title: "Channel browser",
    body: "Discover every channel in your workspace from one searchable grid. Filter by topic, member count, or recent activity.",
  },
  {
    date: "April 15, 2026",
    version: "v1.17",
    tag: "Improved",
    title: "Composer rewrite",
    body: "Faster typing, optimistic sends, and a brand-new mention autocomplete. We rewrote the composer from the ground up.",
  },
  {
    date: "April 08, 2026",
    version: "v1.16",
    tag: "New",
    title: "Workspace switcher",
    body: "Belong to multiple workspaces? The new switcher in the global sidebar gets you between them in a single keystroke.",
  },
  {
    date: "April 01, 2026",
    version: "v1.15",
    tag: "Fixed",
    title: "Safari composer caret",
    body: "Resolved a long-standing issue where the caret would jump to the start of the input after inserting an emoji on Safari.",
  },
  {
    date: "March 25, 2026",
    version: "v1.14",
    tag: "New",
    title: "Pinned-message bar",
    body: "Pinned messages now live in a slim bar at the top of every channel, with a click-through to the full pinned list.",
  },
  {
    date: "March 18, 2026",
    version: "v1.13",
    tag: "Improved",
    title: "Search filters",
    body: "Scope search by channel, person, date range, file type, and more — all from a single filter bar.",
  },
];

const tagStyles: Record<string, string> = {
  New: "border-[oklch(0.72_0.16_150)]/40 bg-[oklch(0.72_0.16_150)]/10 text-[oklch(0.85_0.16_150)]",
  Improved:
    "border-[oklch(0.7_0.15_250)]/40 bg-[oklch(0.7_0.15_250)]/10 text-[oklch(0.85_0.15_250)]",
  Fixed: "border-[oklch(0.78_0.15_75)]/40 bg-[oklch(0.78_0.15_75)]/10 text-[oklch(0.88_0.15_75)]",
};

function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
            <span className="ml-2 text-[12.5px] text-muted-foreground">Changelog</span>
          </Link>
          <Link to="/app" className="text-[13px] text-muted-foreground hover:text-foreground">
            Open app →
          </Link>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">Changelog</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            What&rsquo;s new
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Updates, improvements, and fixes — shipped weekly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ol className="relative ml-3 border-l border-border">
          {entries.map((e) => (
            <li key={e.version} className="relative pl-8 pb-12 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-foreground" />
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                <time>{e.date}</time>
                <span>·</span>
                <span className="font-mono">{e.version}</span>
                <span
                  className={`ml-1 rounded-full border px-1.5 py-px text-[10px] font-medium uppercase tracking-wider ${tagStyles[e.tag]}`}
                >
                  {e.tag}
                </span>
              </div>
              <h2 className="mt-2 text-[18px] font-semibold tracking-tight">{e.title}</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{e.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-3xl px-4 text-center text-[12px] text-muted-foreground sm:px-6">
          © 2026 Relay Labs ·{" "}
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          ·{" "}
          <Link to="/help" className="hover:text-foreground">
            Help
          </Link>{" "}
          ·{" "}
          <Link to="/status" className="hover:text-foreground">
            Status
          </Link>
        </div>
      </footer>
    </div>
  );
}
