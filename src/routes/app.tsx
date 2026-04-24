import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { WorkspaceShell } from "@/components/app/WorkspaceShell";
import { useStoredCurrentWorkspace } from "@/lib/current-workspace";

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
  const navigate = useNavigate();
  const { workspace, isHydrated } = useStoredCurrentWorkspace();

  useEffect(() => {
    if (workspace?.slug) {
      void navigate({
        to: "/app/$workspaceSlug",
        params: { workspaceSlug: workspace.slug },
        replace: true,
      });
    }
  }, [navigate, workspace]);

  if (!isHydrated) {
    return null;
  }

  return <WorkspaceShell workspace={workspace} />;
}
