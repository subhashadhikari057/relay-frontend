import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MessageSquare,
  Hash,
  Settings,
  Zap,
  Users,
  Shield,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — Relay" },
      { name: "description", content: "Find answers to common questions about using Relay." },
      { property: "og:title", content: "Help Center — Relay" },
      {
        property: "og:description",
        content: "Find answers to common questions about using Relay.",
      },
    ],
  }),
  component: HelpPage,
});

const categories = [
  {
    icon: Zap,
    title: "Getting started",
    desc: "Set up your workspace and invite your team",
    count: 12,
  },
  { icon: Hash, title: "Channels & DMs", desc: "Organize conversations the right way", count: 18 },
  {
    icon: MessageSquare,
    title: "Messages & threads",
    desc: "Send, edit, react, and reply",
    count: 24,
  },
  { icon: Users, title: "Members & roles", desc: "Manage permissions and access", count: 9 },
  {
    icon: Settings,
    title: "Workspace settings",
    desc: "Branding, integrations, and admin",
    count: 15,
  },
  {
    icon: Shield,
    title: "Security & privacy",
    desc: "2FA, sessions, and data controls",
    count: 11,
  },
];

const faqs = [
  {
    q: "How do I create a new channel?",
    a: "Click the + icon next to Channels in the sidebar, or use ⌘K and type 'create channel'.",
  },
  {
    q: "Can I edit a message after sending?",
    a: "Yes — hover any message you sent and click the pencil icon to edit inline.",
  },
  {
    q: "How do I mute a channel?",
    a: "Open the channel, click the channel name to open details, and toggle 'Mute notifications'.",
  },
  {
    q: "What's the keyboard shortcut for search?",
    a: "⌘K opens the command palette which doubles as global search.",
  },
  {
    q: "How do I switch between workspaces?",
    a: "Click the workspace icon at the top of the global sidebar to open the switcher.",
  },
  {
    q: "Does Relay support dark mode?",
    a: "Relay is dark-first. Light and System modes are available in Settings → Appearance.",
  },
];

function HelpPage() {
  const [query, setQuery] = useState("");
  const filtered = faqs.filter(
    (f) =>
      !query ||
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
            <span className="ml-2 text-[12.5px] text-muted-foreground">Help</span>
          </Link>
          <Link to="/app" className="text-[13px] text-muted-foreground hover:text-foreground">
            Open app →
          </Link>
        </div>
      </header>

      <section className="border-b border-border bg-hero-glow">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            How can we help?
          </h1>
          <div className="relative mx-auto mt-7 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, guides, shortcuts…"
              className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-[14px] shadow-elegant focus:border-foreground/30 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Browse by topic
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, title, desc, count }) => (
            <button
              key={title}
              className="group rounded-xl border border-border bg-surface/50 p-5 text-left transition-colors hover:border-foreground/30 hover:bg-surface"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[14.5px] font-semibold">{title}</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                {count} articles{" "}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>

        <h2 className="mt-14 text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Frequently asked
        </h2>
        <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface/30">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </div>
          )}
          {filtered.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-medium">
                {f.q}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-[12px] text-muted-foreground sm:px-6">
          © 2026 Relay Labs ·{" "}
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          ·{" "}
          <Link to="/changelog" className="hover:text-foreground">
            Changelog
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
