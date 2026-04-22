import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Calendar, Figma, Trello, Slack, Zap } from "lucide-react";
import { SettingsHeader, settingsBtnGhost } from "@/components/settings/SettingsShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/integrations")({
  component: IntegrationsPage,
});

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    desc: "PR previews, deploys and issue mentions in channels.",
    connected: true,
  },
  {
    id: "linear",
    name: "Linear",
    icon: Zap,
    desc: "Surface issues and updates from your Linear team.",
    connected: true,
  },
  {
    id: "figma",
    name: "Figma",
    icon: Figma,
    desc: "Inline preview cards for any Figma file or frame.",
    connected: false,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    icon: Calendar,
    desc: "See upcoming meetings and join from a channel.",
    connected: false,
  },
  {
    id: "trello",
    name: "Trello",
    icon: Trello,
    desc: "Card status changes posted to your channels.",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack import",
    icon: Slack,
    desc: "Bring history, channels and members from Slack.",
    connected: false,
  },
];

function IntegrationsPage() {
  const [state, setState] = useState(() =>
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected])),
  );

  return (
    <div>
      <SettingsHeader
        title="Integrations"
        description="Connect Relay to the tools your team already uses."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INTEGRATIONS.map((i) => {
          const connected = state[i.id];
          return (
            <div key={i.id} className="rounded-xl border border-border bg-surface-elevated/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.06]">
                  <i.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13.5px] font-semibold">{i.name}</h3>
                    {connected && (
                      <span className="rounded-full border border-success/30 bg-success/10 px-1.5 py-px text-[10px] font-medium text-success">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                    {i.desc}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setState((s) => ({ ...s, [i.id]: !connected }))}
                  className={cn(
                    settingsBtnGhost,
                    connected &&
                      "border-destructive/30 text-destructive hover:border-destructive/50",
                  )}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
