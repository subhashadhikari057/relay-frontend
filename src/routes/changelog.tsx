import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Code2,
  GitBranch,
  Hash,
  Layers,
  MessageSquareText,
  PanelRightOpen,
  Pin,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog - Relay" },
      {
        name: "description",
        content: "What's new in Relay. Product updates, fixes, and improvements.",
      },
      { property: "og:title", content: "Changelog - Relay" },
      { property: "og:description", content: "What's new in Relay. Shipped weekly." },
    ],
  }),
  component: ChangelogPage,
});

const highlights = [
  { label: "Latest release", value: "v1.18" },
  { label: "Shipping cadence", value: "Weekly" },
  { label: "Current focus", value: "Workspace flow" },
];

const entries = [
  {
    date: "April 22, 2026",
    version: "v1.18",
    tag: "New",
    icon: Hash,
    title: "Channel browser",
    body: "Discover every channel in a searchable workspace directory with topic previews, privacy state, unread counts, and fast channel creation.",
    details: [
      "Search by channel name or topic",
      "Browse public and private spaces",
      "Jump directly into any channel",
    ],
  },
  {
    date: "April 15, 2026",
    version: "v1.17",
    tag: "Improved",
    icon: MessageSquareText,
    title: "Composer rewrite",
    body: "The message composer now feels faster and more resilient, with cleaner attachment handling and better keyboard behavior.",
    details: ["Optimistic send states", "Attachment-ready input model", "Smoother mobile layout"],
  },
  {
    date: "April 8, 2026",
    version: "v1.16",
    tag: "New",
    icon: Layers,
    title: "Workspace switcher",
    body: "Teams with multiple spaces can move between workspaces from the global sidebar without losing their place.",
    details: ["Pinned workspace shortcuts", "Recent workspace memory", "Cleaner sidebar hierarchy"],
  },
  {
    date: "April 1, 2026",
    version: "v1.15",
    tag: "Fixed",
    icon: CheckCircle2,
    title: "Safari composer caret",
    body: "Fixed a Safari-specific issue where the caret could jump after emoji insertion or mention selection.",
    details: ["Stable caret position", "Improved IME handling", "Reduced input layout shift"],
  },
  {
    date: "March 25, 2026",
    version: "v1.14",
    tag: "New",
    icon: Pin,
    title: "Pinned-message bar",
    body: "Important messages now sit in a slim channel bar, making docs, decisions, and announcements easier to find.",
    details: [
      "Channel-level pinned summary",
      "Quick access to pinned list",
      "Thread-aware jump behavior",
    ],
  },
  {
    date: "March 18, 2026",
    version: "v1.13",
    tag: "Improved",
    icon: Search,
    title: "Search filters",
    body: "Search now supports tighter filtering across channels, people, date ranges, and file types.",
    details: ["Scoped results", "Faster result grouping", "Better empty states"],
  },
];

const roadmap = [
  {
    icon: ShieldCheck,
    title: "Admin controls",
    body: "Role policies, permission previews, and audit-ready workspace settings.",
  },
  {
    icon: Bell,
    title: "Notification tuning",
    body: "Per-channel delivery rules, better digest controls, and smarter quiet hours.",
  },
  {
    icon: PanelRightOpen,
    title: "Thread upgrades",
    body: "Thread summaries, unread grouping, and faster context switching.",
  },
  {
    icon: Code2,
    title: "Integration layer",
    body: "Production API wiring with TanStack Query and native fetch.",
  },
];

const tagStyles: Record<string, string> = {
  New: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Improved: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Fixed: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]" />
          <div className="absolute inset-x-0 top-0 h-[420px] bg-hero-glow" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-3 py-1 text-[11.5px] text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Product updates
              </div>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                See what shipped in Relay.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Follow the newest workspace improvements, message upgrades, reliability fixes, and
                integration work as Relay moves from polished prototype into production.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  to="/sign-up"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Start free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/help"
                  className="inline-flex h-9 items-center rounded-md border border-border bg-surface-elevated/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/30"
                >
                  Visit help center
                </Link>
              </div>
            </div>

            <div className="grid gap-3 rounded-xl border border-border bg-surface/50 p-4 shadow-elegant">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-lg bg-background/50 px-3 py-2.5"
                >
                  <span className="text-[12px] text-muted-foreground">{item.label}</span>
                  <span className="text-[13px] font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
              Release log
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Each release groups user-facing updates with the quality fixes that keep the workspace
              fast and predictable.
            </p>
          </aside>

          <ol className="relative border-l border-border">
            {entries.map((entry) => {
              const Icon = entry.icon;
              return (
                <li key={entry.version} className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[18px] top-0 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                    <Icon className="h-4 w-4" />
                  </span>
                  <article className="rounded-xl border border-border bg-surface/40 p-5 transition-colors hover:border-foreground/20 hover:bg-surface/70">
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                      <time>{entry.date}</time>
                      <span>/</span>
                      <span className="font-mono">{entry.version}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          tagStyles[entry.tag],
                        )}
                      >
                        {entry.tag}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight">{entry.title}</h2>
                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                      {entry.body}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                      {entry.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-[12.5px] text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="border-y border-border bg-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
                  Coming next
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  The next stretch of product work
                </h2>
              </div>
              <Link
                to="/status"
                className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
              >
                System status <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {roadmap.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated/60">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-semibold">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Relay Labs</span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <Link to="/help" className="hover:text-foreground">
              Help
            </Link>
            <Link to="/status" className="hover:text-foreground">
              Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
