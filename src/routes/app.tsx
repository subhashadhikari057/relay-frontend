import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/app/WorkspaceShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Relay — Workspace" },
      { name: "description", content: "Your Relay workspace — channels, DMs, and threads." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  return <WorkspaceShell />;
}
