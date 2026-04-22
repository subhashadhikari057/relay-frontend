import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Users,
  ImagePlus,
  Hash,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started — Relay" }] }),
  component: Onboarding,
});

const steps = [
  {
    key: "workspace",
    title: "Create your workspace",
    subtitle: "Give your team a home in Relay.",
    icon: Building2,
  },
  {
    key: "invite",
    title: "Invite your teammates",
    subtitle: "Relay is better with the people you work with.",
    icon: Users,
  },
  {
    key: "avatar",
    title: "Choose a profile avatar",
    subtitle: "Help your team recognize you.",
    icon: ImagePlus,
  },
  {
    key: "channel",
    title: "Create your first channel",
    subtitle: "Channels organize conversation by topic.",
    icon: Hash,
  },
] as const;

const avatarColors = [
  "oklch(0.7 0.13 250)",
  "oklch(0.72 0.16 150)",
  "oklch(0.78 0.15 75)",
  "oklch(0.7 0.13 305)",
  "oklch(0.62 0.21 25)",
  "oklch(0.65 0.18 200)",
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState("");
  const [slug, setSlug] = useState("");
  const [emails, setEmails] = useState<string[]>(["sam@acme.com"]);
  const [emailInput, setEmailInput] = useState("");
  const [avatar, setAvatar] = useState(0);
  const [channel, setChannel] = useState("general");
  const navigate = useNavigate();

  const current = steps[step];
  const Icon = current.icon;
  const last = step === steps.length - 1;

  const next = () => (last ? navigate({ to: "/app" }) : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background font-bold text-sm">
              H
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>
          <Link to="/app" className="text-[12.5px] text-muted-foreground hover:text-foreground">
            Skip for now
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 pt-4 pb-16 sm:items-center sm:pt-0">
          <div className="w-full max-w-[460px]">
            {/* Steps indicator */}
            <div className="mb-6 flex items-center justify-center gap-1.5">
              {steps.map((s, i) => (
                <div
                  key={s.key}
                  className={cn(
                    "h-1 w-8 rounded-full transition-colors",
                    i < step ? "bg-foreground" : i === step ? "bg-foreground" : "bg-border",
                  )}
                />
              ))}
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-elevated/60">
                <Icon className="h-4.5 w-4.5 text-foreground" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{current.title}</h1>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">{current.subtitle}</p>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-surface/80 p-6 shadow-elegant backdrop-blur-sm">
              {step === 0 && (
                <div className="space-y-3">
                  <Labeled label="Workspace name">
                    <Inp value={workspace} onChange={setWorkspace} placeholder="Acme Inc." />
                  </Labeled>
                  <Labeled label="Workspace URL" hint="You can change this later in settings.">
                    <div className="flex h-10 items-stretch overflow-hidden rounded-md border border-border bg-surface-elevated/60 focus-within:border-foreground/40">
                      <span className="flex items-center bg-foreground/[0.04] px-3 text-[12.5px] text-muted-foreground border-r border-border">
                        relay.app/
                      </span>
                      <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        placeholder="acme"
                        className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                      />
                    </div>
                  </Labeled>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Labeled label="Invite by email" hint="We'll send each person a join link.">
                    <div className="flex gap-2">
                      <input
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && emailInput.trim()) {
                            e.preventDefault();
                            setEmails((es) => [...es, emailInput.trim()]);
                            setEmailInput("");
                          }
                        }}
                        placeholder="teammate@company.com"
                        className="block h-10 flex-1 rounded-md border border-border bg-surface-elevated/60 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (emailInput.trim()) {
                            setEmails((es) => [...es, emailInput.trim()]);
                            setEmailInput("");
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-elevated/60 px-3 text-[13px] hover:border-foreground/30"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </button>
                    </div>
                  </Labeled>
                  {emails.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {emails.map((e, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated/60 py-1 pl-2.5 pr-1 text-[12px]"
                        >
                          {e}
                          <button
                            onClick={() => setEmails((es) => es.filter((_, j) => j !== i))}
                            className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="mt-2 text-[12.5px] text-muted-foreground hover:text-foreground">
                    Or copy invite link
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-semibold text-background"
                      style={{ background: avatarColors[avatar] }}
                    >
                      YO
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[12px] font-medium text-foreground/90">
                      Pick a color
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avatarColors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setAvatar(i)}
                          className={cn(
                            "h-9 w-9 rounded-lg border-2 transition",
                            avatar === i
                              ? "border-foreground"
                              : "border-transparent hover:border-foreground/40",
                          )}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-[12.5px] text-muted-foreground hover:text-foreground hover:border-foreground/30">
                    <ImagePlus className="h-3.5 w-3.5" /> Or upload an image
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <Labeled label="Channel name" hint="Lowercase, no spaces. Use hyphens.">
                    <div className="flex h-10 items-stretch overflow-hidden rounded-md border border-border bg-surface-elevated/60 focus-within:border-foreground/40">
                      <span className="flex items-center px-3 text-muted-foreground border-r border-border">
                        <Hash className="h-3.5 w-3.5" />
                      </span>
                      <input
                        value={channel}
                        onChange={(e) =>
                          setChannel(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                        }
                        className="flex-1 bg-transparent px-3 text-sm focus:outline-none"
                      />
                    </div>
                  </Labeled>
                  <div className="rounded-md border border-border bg-surface-elevated/40 p-3 text-[12.5px] text-muted-foreground">
                    <div className="mb-1.5 flex items-center gap-1.5 text-foreground">
                      <Sparkles className="h-3 w-3" /> Suggestion
                    </div>
                    Channels like <code className="rounded bg-foreground/[0.06] px-1">general</code>
                    , <code className="rounded bg-foreground/[0.06] px-1">engineering</code>, and{" "}
                    <code className="rounded bg-foreground/[0.06] px-1">design</code> are great
                    defaults.
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] transition",
                  step === 0
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition"
              >
                {last ? (
                  <>
                    Enter workspace <Check className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-medium text-foreground/90">{label}</div>
      {children}
      {hint && <div className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</div>}
    </label>
  );
}

function Inp({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block h-10 w-full rounded-md border border-border bg-surface-elevated/60 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
    />
  );
}
