import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Hash,
  Lock,
  Search,
  Bell,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Zap,
  Users,
  Layers,
} from "lucide-react";
import { MemberAvatar } from "@/components/app/MemberAvatar";
import { members, formatTime } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relay — Where focused teams ship together" },
      {
        name: "description",
        content:
          "Relay is a premium team communication platform for product teams who care about craft. Channels, threads, search — built for speed.",
      },
      { property: "og:title", content: "Relay — Where focused teams ship together" },
      {
        property: "og:description",
        content: "Premium team communication for teams who care about craft.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <LogoCloud />
      <Features />
      <ProductPreview />
      <Testimonials />
      <Comparison />
      <Pricing />
      <Newsletter />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <Link to="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Customers
            </a>
            <Link to="/changelog" className="hover:text-foreground transition-colors">
              Changelog
            </Link>
            <Link to="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/sign-in"
            className="hidden text-[13px] text-muted-foreground hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow" />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated/60 px-3 py-1 text-[11.5px] text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Now in public beta · Free for teams under 10
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight md:text-6xl">
          Where focused teams
          <br className="hidden md:block" /> ship together.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-[16px] leading-relaxed text-muted-foreground">
          Relay is the calm, fast, beautifully restrained team chat for product teams who care about
          craft. Channels, threads, search — done right.
        </p>
        <div className="mt-7 flex items-center justify-center gap-2">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated/60 px-4 py-2 text-sm font-medium text-foreground hover:border-foreground/30 transition"
          >
            Book a demo
          </a>
        </div>

        {/* Hero preview card */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-xl border border-border bg-surface shadow-elegant overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-elevated/60 px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/10" />
              <span className="ml-3 text-[11px] text-muted-foreground">
                relay.app/acme/engineering
              </span>
            </div>
            <div className="grid grid-cols-[180px_1fr] text-left">
              <div className="border-r border-border bg-sidebar p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Channels
                </div>
                <div className="space-y-1 text-[12.5px]">
                  {[
                    { n: "general", a: false },
                    { n: "engineering", a: true },
                    { n: "design", a: false },
                    { n: "product", a: false },
                    { n: "founders", a: false, p: true },
                  ].map((c) => (
                    <div
                      key={c.n}
                      className={`flex items-center gap-1.5 rounded px-1.5 py-1 ${c.a ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"}`}
                    >
                      {c.p ? <Lock className="h-3 w-3" /> : <Hash className="h-3 w-3" />}
                      <span>{c.n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-3">
                {members.slice(0, 3).map((m, i) => (
                  <div key={m.id} className="flex gap-2.5">
                    <MemberAvatar member={m} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12.5px] font-semibold">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(`2026-04-20T09:${10 + i * 7}:00Z`)}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-foreground/85">
                        {
                          [
                            "Shipped the new presence system to staging — websocket latency down 38%.",
                            "New thread mocks in Figma. Page → Workspace / Thread v3.",
                            "Anyone seeing slow cold-start on edge functions in eu-west? p95 ~900ms.",
                          ][i]
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCloud() {
  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Trusted by product teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-foreground/40">
          {["Linear", "Stripe", "Vercel", "Supabase", "Notion", "Cursor", "Anthropic"].map((b) => (
            <span key={b} className="text-base font-semibold tracking-tight">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Threads that actually flow",
      desc: "Side-by-side threads keep deep conversations from drowning out the channel.",
    },
    {
      icon: Search,
      title: "Instant, scoped search",
      desc: "Find a message, file, or person in milliseconds. Filters that respect your context.",
    },
    {
      icon: Bell,
      title: "Notifications you trust",
      desc: "Smart muting and grouped activity. Quiet by default, loud when it matters.",
    },
    {
      icon: Zap,
      title: "Fast like a desktop app",
      desc: "Optimistic everything. Keyboard-first. No spinners between you and your team.",
    },
    {
      icon: Users,
      title: "Presence done right",
      desc: "Subtle indicators, focus mode, and typing signals that don't feel like surveillance.",
    },
    {
      icon: Layers,
      title: "Workspaces, not silos",
      desc: "Switch contexts without losing state. Threads stay where you left them.",
    },
  ];
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
            Why teams use Relay
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
            A calmer surface for the work that matters.
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            Relay removes the noise of legacy chat tools so your team can think clearly, decide
            quickly, and ship more often.
          </p>
        </div>

        <div className="mt-12 grid gap-px bg-border rounded-xl border border-border overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-background p-6 transition-colors hover:bg-surface">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border">
                <Icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <div className="absolute inset-x-0 top-1/2 h-[400px] -translate-y-1/2 bg-hero-glow opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
              Built for craft
            </p>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
              Every interaction, considered.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From the way messages group together, to the typing indicator that knows when to
              disappear, to the keyboard shortcuts you'll never have to look up — Relay is a chat
              tool engineered like a product, not a feature dump.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Sub-50ms message delivery",
                "End-to-end encryption on private channels",
                "Native command palette — ⌘K",
                "Dark mode that's actually dark",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-[14px]">
                  <Check className="h-4 w-4 text-[oklch(0.72_0.16_150)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface shadow-elegant p-4">
            <div className="text-[11px] text-muted-foreground mb-2 px-1"># product · Thread</div>
            <div className="space-y-3 rounded-lg bg-background p-4 border border-border">
              {members.slice(2, 5).map((m, i) => (
                <div key={m.id} className="flex gap-2.5">
                  <MemberAvatar member={m} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[12.5px] font-semibold">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(`2026-04-20T11:${10 + i * 4}:00Z`)}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-foreground/85">
                      {
                        [
                          "Pulled the v3 designs into the spec doc.",
                          'Love the new spacing — feels less cramped on 13" screens.',
                          "Approved. Let's ship behind the flag tomorrow.",
                        ][i]
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      quote:
        "Relay finally got chat right. Threads stay where you left them and the keyboard shortcuts are addictive.",
      name: "Maya Chen",
      role: "Head of Product, Linear",
    },
    {
      quote:
        "We replaced two tools with Relay in a week. The thing actually feels fast — like, desktop-app fast.",
      name: "Adrian Rossi",
      role: "Engineering Manager, Vercel",
    },
    {
      quote:
        "Calm by default, loud when it matters. The notification model is exactly what a busy team needs.",
      name: "Yui Tanaka",
      role: "VP Eng, Supabase",
    },
  ];
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
            Loved by teams
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
            Quiet by default. Loud when it counts.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-xl border border-border bg-surface/40 p-6">
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-[12px] font-semibold">
                  {q.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <div>
                  <div className="text-[13px] font-semibold">{q.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { f: "Calm-by-default notifications", relay: true, slack: false, discord: false },
    { f: "Threads in side-panel (no context loss)", relay: true, slack: false, discord: false },
    { f: "Sub-50ms message delivery", relay: true, slack: true, discord: true },
    { f: "Native command palette (⌘K)", relay: true, slack: false, discord: false },
    { f: "Unlimited message history (Pro)", relay: true, slack: false, discord: true },
    { f: "End-to-end encrypted private channels", relay: true, slack: false, discord: false },
    { f: "Built-in workspace switcher", relay: true, slack: true, discord: false },
  ];
  const Cell = ({ ok }: { ok: boolean }) =>
    ok ? (
      <Check className="mx-auto h-4 w-4 text-[oklch(0.72_0.16_150)]" />
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
            How Relay compares
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
            Built for teams that value craft.
          </h2>
        </div>
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface/40">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-foreground/[0.02] text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Relay</th>
                <th className="px-4 py-3 text-center font-medium">Slack</th>
                <th className="px-4 py-3 text-center font-medium">Discord</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.f}>
                  <td className="px-4 py-3 text-foreground/90">{r.f}</td>
                  <td className="px-4 py-3 text-center">
                    <Cell ok={r.relay} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell ok={r.slack} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Cell ok={r.discord} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
          Stay in the loop
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Get the Relay changelog by email.
        </h2>
        <p className="mt-3 text-muted-foreground">
          One short email, every Friday. No spam — promise.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            placeholder="you@company.com"
            className="h-10 flex-1 rounded-md border border-border bg-surface-elevated/60 px-3 text-[13.5px] focus:border-foreground/30 focus:outline-none"
          />
          <button
            type="submit"
            className="h-10 rounded-md bg-primary px-4 text-[13.5px] font-medium text-primary-foreground hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "For small teams getting started.",
      features: ["Up to 10 members", "10K messages history", "Channels & DMs", "Basic search"],
      cta: "Start free",
    },
    {
      name: "Pro",
      price: "$8",
      recommended: true,
      desc: "For growing teams that need more.",
      features: [
        "Unlimited members",
        "Unlimited history",
        "Threads & reactions",
        "Advanced search & filters",
        "Guest access",
      ],
      cta: "Start 14-day trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For organizations with scale.",
      features: ["SSO & SCIM", "Audit logs", "Dedicated support", "Custom retention", "99.99% SLA"],
      cta: "Contact sales",
    },
  ];
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">Pricing</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight">
            Simple plans for every team size.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-xl border p-6 ${p.recommended ? "border-foreground/40 bg-surface shadow-elegant" : "border-border bg-surface/50"}`}
            >
              {p.recommended && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                  Recommended
                </span>
              )}
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{p.price}</span>
                {p.price !== "Custom" && (
                  <span className="text-xs text-muted-foreground">/user/mo</span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">{p.desc}</p>
              <Link
                to="/app"
                className={`mt-5 flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition ${
                  p.recommended
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-surface-elevated hover:border-foreground/30"
                }`}
              >
                {p.cta}
              </Link>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-foreground/70" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight">
          Bring your team to a calmer surface.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Free for teams under 10. No credit card. No setup call.
        </p>
        <div className="mt-7 flex items-center justify-center gap-2">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated/60 px-4 py-2 text-sm font-medium text-foreground hover:border-foreground/30 transition"
          >
            Book a demo
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              R
            </span>
            <span className="text-sm font-semibold tracking-tight">Relay</span>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            © 2026 Relay Labs. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-12 text-[13px]">
          {[
            { h: "Product", l: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { h: "Company", l: ["About", "Customers", "Careers", "Blog"] },
            { h: "Resources", l: ["Docs", "API", "Support", "Status"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {c.h}
              </div>
              <ul className="mt-3 space-y-2">
                {c.l.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {[Github, Twitter, Linkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:text-foreground hover:border-foreground/30 transition"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
