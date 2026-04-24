import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/app/WorkspaceShell";
import { useStoredCurrentWorkspace } from "@/lib/current-workspace";
import type { WorkspaceSummary } from "@/types/api.types";

export const Route = createFileRoute("/app/$workspaceSlug")({
  head: () => ({
    meta: [
      { title: "Relay — Workspace" },
      { name: "description", content: "Your Relay workspace — channels, DMs, and threads." },
    ],
  }),
  component: WorkspaceSlugPage,
});

function WorkspaceSlugPage() {
  const { workspaceSlug } = Route.useParams();
  const { workspace, isHydrated } = useStoredCurrentWorkspace();

  if (!isHydrated) {
    return null;
  }

  return <WorkspaceShell workspace={getWorkspaceForSlug(workspace, workspaceSlug)} />;
}

function getWorkspaceForSlug(
  workspace: WorkspaceSummary | null,
  workspaceSlug: string,
): WorkspaceSummary {
  if (workspace?.slug === workspaceSlug) {
    return workspace;
  }

  return {
    id: workspace?.id || workspaceSlug,
    name: formatWorkspaceName(workspaceSlug),
    slug: workspaceSlug,
    description: workspace?.description || null,
    avatarUrl: null,
    avatarColor: workspace?.avatarColor || null,
    role: workspace?.role || "owner",
  };
}

function formatWorkspaceName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
