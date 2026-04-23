import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Command,
  Hash,
  LifeBuoy,
  MessageSquare,
  Search,
  Settings,
  Shield,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center - Relay" },
      { name: "description", content: "Guides, answers, and support resources for Relay." },
      { property: "og:title", content: "Help Center - Relay" },
      {
        property: "og:description",
        content: "Guides, answers, and support resources for Relay.",
      },
    ],
  }),
  component: HelpPage,
});

const categories = [
  {
    icon: Zap,
    title: "Getting started",
    desc: "Create a workspace, invite teammates, and get oriented.",
    count: 12,
  },
  {
    icon: Hash,
    title: "Channels and DMs",
    desc: "Organize team conversations without losing context.",
    count: 18,
  },
  {
    icon: MessageSquare,
    title: "Messages and threads",
    desc: "Send, reply, react, pin, save, and follow discussions.",
    count: 24,
  },
  {
    icon: Users,
    title: "Members and roles",
    desc: "Manage people, access levels, guests, and permissions.",
    count: 9,
  },
  {
    icon: Settings,
    title: "Workspace settings",
    desc: "Tune notifications, appearance, billing, and integrations.",
    count: 15,
  },
  {
    icon: Shield,
    title: "Security and privacy",
    desc: "Understand sessions, data controls, and account safety.",
    count: 11,
  },
];

const featuredGuides = [
  "Set up your first Relay workspace",
  "Create channels that stay useful",
  "Invite teammates and assign roles",
  "Use threads without fragmenting context",
];

const faqs = [
  {
    q: "How do I create a new channel?",
    a: "Open the workspace sidebar and choose the create channel action, or open the command palette and search for channel creation.",
    topic: "Channels and DMs",
  },
  {
    q: "Can I edit a message after sending?",
    a: "Message editing belongs in the message action menu. For now, the prototype UI focuses on sending, replying, reactions, pins, and saved items.",
    topic: "Messages and threads",
  },
  {
    q: "How do I mute a channel?",
    a: "Open channel details from the channel header. Notification controls live with the rest of the channel settings.",
    topic: "Workspace settings",
  },
  {
    q: "What is the keyboard shortcut for search?",
    a: "Use Command+K on macOS or Ctrl+K on Windows and Linux to open the command palette.",
    topic: "Getting started",
  },
  {
    q: "How do I switch between workspaces?",
    a: "Use the global sidebar workspace area. Workspace switching is part of the active product roadmap.",
    topic: "Getting started",
  },
  {
    q: "Does Relay support dark mode?",
    a: "Yes. Relay is dark-first, and light mode is available from appearance settings or the navbar theme toggle.",
    topic: "Workspace settings",
  },
  {
    q: "Where do pinned messages appear?",
    a: "Pinned messages appear in channel context and saved/pinned surfaces so important decisions stay easy to recover.",
    topic: "Messages and threads",
  },
  {
    q: "How should I report an issue?",
    a: "Use the support section on this page with workspace details, browser, and the steps needed to reproduce the issue.",
    topic: "Security and privacy",
  },
];

const supportOptions = [
  {
    icon: LifeBuoy,
    title: "Contact support",
    body: "Send a concise report with workspace name, browser, and expected behavior.",
    action: "Open ticket",
  },
  {
    icon: BookOpen,
    title: "Read product guides",
    body: "Work through focused guides for setup, channels, roles, and notifications.",
    action: "Browse guides",
  },
  {
    icon: Bell,
    title: "Check status",
    body: "See current service health before debugging local network or browser issues.",
    action: "View status",
  },
];

function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faqs;

    return faqs.filter((item) =>
      `${item.q} ${item.a} ${item.topic}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]" />
          <div className="absolute inset-x-0 top-0 h-[460px] bg-hero-glow" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-elevated/70 shadow-elegant">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              How can we help?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Find answers for workspace setup, channels, messages, roles, security, and the small
              workflow details that keep Relay calm.
            </p>

            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides, questions, shortcuts..."
                className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-[14px] shadow-elegant transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/50 px-2.5 py-1">
                <Command className="h-3 w-3" /> Command+K
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/50 px-2.5 py-1">
                <UserPlus className="h-3 w-3" /> Invite teammates
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/50 px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3" /> Manage roles
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
                Browse by topic
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Start with the area you are working in
              </h2>
            </div>
            <Link
              to="/changelog"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
            >
              See latest changes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ icon: Icon, title, desc, count }) => (
              <button
                key={title}
                type="button"
                className="group rounded-xl border border-border bg-surface/50 p-5 text-left transition-colors hover:border-foreground/30 hover:bg-surface"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-foreground/[0.04]">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[14.5px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                  {count} articles
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface/30">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
                Featured guides
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Useful paths for new teams
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                These guides cover the first decisions that shape a healthy workspace: where work
                happens, who can access it, and how conversations stay easy to follow.
              </p>
            </div>

            <div className="grid gap-3">
              {featuredGuides.map((guide, index) => (
                <button
                  key={guide}
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:border-foreground/30 hover:bg-background"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated/60 text-[12px] font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-[13.5px] font-medium">{guide}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
              Frequently asked
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Search filters this list instantly. If the answer is missing, contact support with the
              workflow you were trying to complete.
            </p>
          </aside>

          <div className="overflow-hidden rounded-xl border border-border bg-surface/30">
            {filteredFaqs.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No results for &quot;{query}&quot;.
              </div>
            )}
            {filteredFaqs.map((item, index) => (
              <details
                key={item.q}
                className={cn(
                  "group px-5 py-4",
                  index !== filteredFaqs.length - 1 && "border-b border-border",
                )}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-medium">
                  <span>
                    {item.q}
                    <span className="ml-2 hidden text-[11.5px] font-normal text-muted-foreground sm:inline">
                      {item.topic}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="grid gap-3 lg:grid-cols-3">
              {supportOptions.map(({ icon: Icon, title, body, action }) => (
                <div key={title} className="rounded-xl border border-border bg-surface/50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-foreground/[0.04]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                  <button className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[12.5px] font-medium text-foreground transition-colors hover:border-foreground/30">
                    {action} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
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
            <Link to="/changelog" className="hover:text-foreground">
              Changelog
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
