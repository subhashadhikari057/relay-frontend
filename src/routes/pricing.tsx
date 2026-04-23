import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Relay" },
      {
        name: "description",
        content:
          "Simple, predictable pricing. Free for small teams. Pro for growing teams. Enterprise for the rest.",
      },
      { property: "og:title", content: "Pricing — Relay" },
      { property: "og:description", content: "Simple, predictable pricing for focused teams." },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  price: { monthly: number; yearly: number } | null;
  tagline: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    tagline: "For small teams getting started.",
    features: [
      "Up to 10 members",
      "10K message history",
      "5 GB storage",
      "1:1 voice calls",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: { monthly: 8, yearly: 7 },
    tagline: "For growing teams that need more.",
    features: [
      "Unlimited members",
      "Unlimited message history",
      "100 GB storage",
      "Group voice & screen share",
      "Guest accounts",
      "Priority email support",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: null,
    tagline: "Security, compliance, and scale.",
    features: [
      "SAML SSO + SCIM",
      "Custom data retention",
      "Audit logs",
      "Dedicated support",
      "99.99% uptime SLA",
      "Custom contracts",
    ],
    cta: "Talk to sales",
  },
];

const FAQ = [
  {
    q: "Can I switch plans later?",
    a: "Yes — upgrade or downgrade anytime. We prorate the difference automatically.",
  },
  {
    q: "Do you offer discounts for non-profits?",
    a: "We offer 50% off Pro for verified non-profits and educational institutions.",
  },
  {
    q: "How does billing work?",
    a: "We charge per active member each month. Guests and inactive accounts are free.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your workspace stays in read-only mode for 30 days. Export anytime, no lock-in.",
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Pricing that scales with your team
          </h1>
          <p className="mt-4 text-balance text-[15px] text-muted-foreground sm:text-base">
            Start free. Upgrade when you outgrow it. No surprise fees.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated/50 p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setYearly(b === "yearly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors",
                  (b === "yearly") === yearly
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {b === "yearly" ? "Yearly · save 15%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-surface-elevated/40 p-6",
                p.featured ? "border-foreground/30 shadow-elegant" : "border-border",
              )}
            >
              {p.featured && (
                <span className="absolute right-4 top-4 rounded-full border border-foreground/30 bg-foreground/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  Popular
                </span>
              )}
              <h3 className="text-[15px] font-semibold">{p.name}</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{p.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1">
                {p.price === null ? (
                  <span className="text-[28px] font-semibold tracking-tight">Custom</span>
                ) : (
                  <>
                    <span className="text-[36px] font-semibold tracking-tight">
                      ${yearly ? p.price.yearly : p.price.monthly}
                    </span>
                    <span className="text-[12px] text-muted-foreground">/ user / month</span>
                  </>
                )}
              </div>

              <Link
                to={p.name === "Enterprise" ? "/sign-up" : "/sign-up"}
                className={cn(
                  "mt-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-[13px] font-medium transition-colors",
                  p.featured
                    ? "bg-foreground text-background hover:opacity-90"
                    : "border border-border text-foreground hover:border-foreground/30",
                )}
              >
                {p.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <ul className="mt-6 space-y-2.5 text-[13px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-elevated/40">
            {FAQ.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[14px] font-medium hover:bg-foreground/[0.02]">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-[13px] leading-relaxed text-muted-foreground">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 text-center text-[12px] text-muted-foreground">
        © 2026 Relay Labs ·{" "}
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
      </footer>
    </div>
  );
}
