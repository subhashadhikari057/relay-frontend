import { createFileRoute } from "@tanstack/react-router";
import { SettingsShell } from "@/components/settings/SettingsShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Relay" },
      {
        name: "description",
        content: "Manage your workspace, profile, billing, and security settings.",
      },
    ],
  }),
  component: SettingsShell,
});
