import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Hash,
  ImagePlus,
  LoaderCircle,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthSessionState } from "@/lib/auth-session";
import { useCompleteOnboardingMutation } from "@/queries/modules/onboarding.queries";
import { Route as RootRoute } from "@/routes/__root";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get Started - Relay" }] }),
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
    subtitle: "Relay gets useful the moment your team is in.",
    icon: Users,
  },
  {
    key: "avatar",
    title: "Choose your avatar",
    subtitle: "Pick a color or upload an image for your profile.",
    icon: ImagePlus,
  },
  {
    key: "channel",
    title: "Add another channel",
    subtitle: "Relay always creates #general. Optionally add one more channel now.",
    icon: Hash,
  },
] as const;

const avatarColors = ["#5B5BD6", "#14B8A6", "#F59E0B", "#E879F9", "#F97316", "#0EA5E9"];
const DEFAULT_ADDITIONAL_CHANNEL_NAME = "engineering";
const DEFAULT_ADDITIONAL_CHANNEL_TOPIC = "";
const DEFAULT_ADDITIONAL_CHANNEL_DESCRIPTION = "";

function Onboarding() {
  const navigate = useNavigate();
  const initialSession = RootRoute.useLoaderData();
  const { status } = useAuthSessionState();
  const completeOnboarding = useCompleteOnboardingMutation();
  const [step, setStep] = useState(0);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [createFirstChannel, setCreateFirstChannel] = useState(true);
  const [channelName, setChannelName] = useState(DEFAULT_ADDITIONAL_CHANNEL_NAME);
  const [channelTopic, setChannelTopic] = useState(DEFAULT_ADDITIONAL_CHANNEL_TOPIC);
  const [channelDescription, setChannelDescription] = useState(
    DEFAULT_ADDITIONAL_CHANNEL_DESCRIPTION,
  );
  const [userAvatarFile, setUserAvatarFile] = useState<File | null>(null);
  const [workspaceAvatarFile, setWorkspaceAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canViewOnboarding, setCanViewOnboarding] = useState(false);

  const current = steps[step];
  const Icon = current.icon;
  const isLastStep = step === steps.length - 1;
  const selectedColor = avatarColors[avatarIndex];
  const userInitials = useMemo(() => {
    const source = displayName.trim() || "You";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [displayName]);

  useEffect(() => {
    if (status === "pending") {
      return;
    }

    if (!initialSession.requiresOnboarding && initialSession.workspace?.slug) {
      void navigate({
        to: "/app/$workspaceSlug",
        params: { workspaceSlug: initialSession.workspace.slug },
        replace: true,
      });
      return;
    }

    if (status !== "authenticated") {
      void navigate({ to: "/sign-up", replace: true });
      return;
    }

    setCanViewOnboarding(true);
  }, [initialSession.requiresOnboarding, initialSession.workspace, navigate, status]);

  function addInvite() {
    const email = inviteInput.trim().toLowerCase();
    if (!email) return;
    if (invites.includes(email)) {
      toast.error("That teammate is already in the invite list.");
      return;
    }
    setInvites((currentInvites) => [...currentInvites, email]);
    setInviteInput("");
  }

  function validateStep(index: number) {
    if (index === 0 && workspaceName.trim().length < 2) {
      toast.error("Workspace name needs at least 2 characters.");
      return false;
    }

    if (index === 3 && createFirstChannel && channelName.trim().length < 2) {
      toast.error("Channel name needs at least 2 characters.");
      return false;
    }

    return true;
  }

  async function next() {
    if (!validateStep(step)) return;

    if (!isLastStep) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        workspace: {
          name: workspaceName.trim(),
          description: workspaceDescription.trim() || undefined,
          avatarColor: selectedColor,
        },
        userProfile: {
          displayName: displayName.trim() || undefined,
          avatarColor: selectedColor,
        },
        invites: invites.map((email) => ({ email, role: "member" as const })),
        firstChannel: createFirstChannel
          ? {
              name: channelName.trim().toLowerCase().replace(/\s+/g, "-"),
              topic: channelTopic.trim() || undefined,
              description: channelDescription.trim() || undefined,
            }
          : undefined,
      };

      const result = await completeOnboarding.mutateAsync({
        payload,
        userAvatarFile,
        workspaceAvatarFile,
      });

      toast.success("Workspace is ready.", {
        description: `Jumping into ${result.workspace.name}.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not finish onboarding right now.";

      if (message.toLowerCase().includes("already completed")) {
        toast.error("Onboarding is already done. Please sign in.");
        void navigate({ to: "/sign-in" });
        return;
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    setStep((currentStep) => Math.max(0, currentStep - 1));
  }

  function onFileSelect(event: ChangeEvent<HTMLInputElement>, target: "user" | "workspace") {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (target === "user") {
      setUserAvatarFile(file);
      return;
    }

    setWorkspaceAvatarFile(file);
  }

  if (!canViewOnboarding) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-grid opacity-25 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
              R
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Relay</span>
          </Link>
          <Link to="/sign-in" className="text-[12.5px] text-muted-foreground hover:text-foreground">
            Sign in instead
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-4 sm:items-center sm:pt-0">
          <div className="w-full max-w-[460px]">
            <div className="mb-6 flex items-center justify-center gap-1.5">
              {steps.map((item, index) => (
                <div
                  key={item.key}
                  className={cn(
                    "h-1 w-8 rounded-full transition-colors",
                    index <= step ? "bg-foreground" : "bg-border",
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
                <div className="space-y-4">
                  <Labeled label="Workspace name">
                    <Inp
                      value={workspaceName}
                      onChange={setWorkspaceName}
                      placeholder="Acme Inc."
                    />
                  </Labeled>
                  <Labeled label="Description" hint="Optional, but helpful for larger teams.">
                    <textarea
                      value={workspaceDescription}
                      onChange={(event) => setWorkspaceDescription(event.target.value)}
                      rows={3}
                      placeholder="Product, engineering, and design in one place."
                      className="block w-full rounded-md border border-border bg-surface-elevated/60 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                    />
                  </Labeled>
                  <Labeled
                    label="Workspace avatar"
                    hint={workspaceAvatarFile ? workspaceAvatarFile.name : "Optional image upload."}
                  >
                    <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border text-[12.5px] text-muted-foreground transition hover:border-foreground/30 hover:text-foreground">
                      <ImagePlus className="h-3.5 w-3.5" />
                      Upload workspace image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => onFileSelect(event, "workspace")}
                      />
                    </label>
                  </Labeled>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Labeled
                    label="Invite by email"
                    hint="You can leave this empty and invite later."
                  >
                    <div className="flex gap-2">
                      <input
                        value={inviteInput}
                        onChange={(event) => setInviteInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addInvite();
                          }
                        }}
                        placeholder="teammate@company.com"
                        className="block h-10 flex-1 rounded-md border border-border bg-surface-elevated/60 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addInvite}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-elevated/60 px-3 text-[13px] transition hover:border-foreground/30"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </button>
                    </div>
                  </Labeled>
                  {invites.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {invites.map((email, index) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated/60 py-1 pl-2.5 pr-1 text-[12px]"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() =>
                              setInvites((currentInvites) =>
                                currentInvites.filter((_, itemIndex) => itemIndex !== index),
                              )
                            }
                            className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div
                      className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-2xl font-semibold text-background"
                      style={{ background: selectedColor }}
                    >
                      {userAvatarFile ? (
                        <img
                          src={URL.createObjectURL(userAvatarFile)}
                          alt="Selected avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        userInitials
                      )}
                    </div>
                  </div>
                  <Labeled
                    label="Display name"
                    hint="Optional. This is what your teammates will see."
                  >
                    <Inp value={displayName} onChange={setDisplayName} placeholder="Alex" />
                  </Labeled>
                  <div>
                    <div className="mb-2 text-[12px] font-medium text-foreground/90">
                      Pick a color
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avatarColors.map((color, index) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setAvatarIndex(index)}
                          className={cn(
                            "h-9 w-9 rounded-lg border-2 transition",
                            avatarIndex === index
                              ? "border-foreground"
                              : "border-transparent hover:border-foreground/40",
                          )}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-[12.5px] text-muted-foreground transition hover:border-foreground/30 hover:text-foreground">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {userAvatarFile ? userAvatarFile.name : "Upload profile image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => onFileSelect(event, "user")}
                    />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <label className="flex items-start gap-3 rounded-md border border-border bg-surface-elevated/40 p-3 text-[13px]">
                    <input
                      type="checkbox"
                      checked={createFirstChannel}
                      onChange={(event) => setCreateFirstChannel(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border bg-surface-elevated accent-foreground"
                    />
                    <span>
                      <span className="block font-medium text-foreground">
                        Create an additional channel
                      </span>
                      <span className="mt-1 block text-[12px] text-muted-foreground">
                        Relay always creates a public <code>#general</code> channel for everyone.
                        Keep this checked if you want to create one more channel now.
                      </span>
                    </span>
                  </label>
                  {createFirstChannel && (
                    <>
                      <Labeled
                        label="Channel name"
                        hint="Lowercase works best. Spaces become hyphens."
                      >
                        <div className="flex h-10 items-stretch overflow-hidden rounded-md border border-border bg-surface-elevated/60 focus-within:border-foreground/40">
                          <span className="flex items-center border-r border-border px-3 text-muted-foreground">
                            <Hash className="h-3.5 w-3.5" />
                          </span>
                          <input
                            value={channelName}
                            onChange={(event) =>
                              setChannelName(event.target.value.toLowerCase().replace(/\s+/g, "-"))
                            }
                            className="flex-1 bg-transparent px-3 text-sm focus:outline-none"
                          />
                        </div>
                      </Labeled>
                      <Labeled label="Topic" hint="Short context shown in the channel header.">
                        <Inp value={channelTopic} onChange={setChannelTopic} />
                      </Labeled>
                      <Labeled
                        label="Description"
                        hint="Optional. Give people a little context for what goes here."
                      >
                        <textarea
                          value={channelDescription}
                          onChange={(event) => setChannelDescription(event.target.value)}
                          rows={3}
                          className="block w-full rounded-md border border-border bg-surface-elevated/60 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
                        />
                      </Labeled>
                      <div className="rounded-md border border-border bg-surface-elevated/40 p-3 text-[12.5px] text-muted-foreground">
                        <div className="mb-1.5 flex items-center gap-1.5 text-foreground">
                          <Sparkles className="h-3 w-3" /> Default visibility
                        </div>
                        New channels created in onboarding are public so teammates can join.
                      </div>
                    </>
                  )}
                  <div className="rounded-md border border-border bg-surface-elevated/40 p-3 text-[12.5px] text-muted-foreground">
                    <div className="mb-1.5 flex items-center gap-1.5 text-foreground">
                      <Sparkles className="h-3 w-3" /> Suggestion
                    </div>
                    You'll start with{" "}
                    <code className="rounded bg-foreground/[0.06] px-1">general</code>. Common next
                    channels are{" "}
                    <code className="rounded bg-foreground/[0.06] px-1">engineering</code> or{" "}
                    <code className="rounded bg-foreground/[0.06] px-1">design</code>.
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || submitting}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] transition",
                  step === 0 || submitting
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => void next()}
                disabled={submitting || completeOnboarding.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting || completeOnboarding.isPending ? (
                  <>
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Finishing setup
                  </>
                ) : isLastStep ? (
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
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="block h-10 w-full rounded-md border border-border bg-surface-elevated/60 px-3 text-sm placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none"
    />
  );
}
