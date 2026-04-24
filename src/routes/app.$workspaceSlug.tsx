import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { workspacesModule } from "@/api/modules/workspaces.module";
import { WorkspaceShell } from "@/components/app/WorkspaceShell";
import { useAuthSessionState } from "@/lib/auth-session";
import { rememberCurrentWorkspace, useStoredCurrentWorkspace } from "@/lib/current-workspace";
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
  const navigate = useNavigate();
  const { workspaceSlug } = Route.useParams();
  const { status } = useAuthSessionState();
  const { workspace, isHydrated } = useStoredCurrentWorkspace();
  const [resolvedWorkspace, setResolvedWorkspace] = useState<WorkspaceSummary | null>(null);
  const [isResolvingWorkspace, setIsResolvingWorkspace] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/sign-in", replace: true });
    }
  }, [navigate, status]);

  useEffect(() => {
    if (!isHydrated || status !== "authenticated") {
      return;
    }

    if (workspace?.slug === workspaceSlug) {
      setResolvedWorkspace(workspace);
      setIsResolvingWorkspace(false);
      return;
    }

    let cancelled = false;
    setIsResolvingWorkspace(true);

    void workspacesModule
      .getBySlug(workspaceSlug)
      .then((nextWorkspace) => {
        if (cancelled) return;
        rememberCurrentWorkspace(nextWorkspace);
        setResolvedWorkspace(nextWorkspace);
      })
      .catch(() => {
        if (cancelled) return;
        setResolvedWorkspace(null);
      })
      .finally(() => {
        if (cancelled) return;
        setIsResolvingWorkspace(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, status, workspace, workspaceSlug]);

  if (!isHydrated || status === "pending") {
    return null;
  }

  if (status !== "authenticated") {
    return null;
  }

  if (isResolvingWorkspace) {
    return null;
  }

  const effectiveWorkspace =
    resolvedWorkspace ??
    workspace ??
    ({
      id: workspaceSlug,
      name: formatWorkspaceName(workspaceSlug),
      slug: workspaceSlug,
      description: null,
      avatarUrl: null,
      avatarColor: null,
      role: "owner",
    } satisfies WorkspaceSummary);

  return <WorkspaceShell workspace={effectiveWorkspace} />;
}

function formatWorkspaceName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
