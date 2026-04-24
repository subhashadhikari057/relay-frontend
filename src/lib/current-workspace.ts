import { useEffect, useState } from "react";
import type { WorkspaceSummary } from "@/types/api.types";

const CURRENT_WORKSPACE_KEY = "relay:current-workspace";

export function rememberCurrentWorkspace(workspace: WorkspaceSummary) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_WORKSPACE_KEY, JSON.stringify(workspace));
}

export function getCurrentWorkspace(): WorkspaceSummary | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CURRENT_WORKSPACE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as WorkspaceSummary;
  } catch {
    return null;
  }
}

export function getWorkspaceHomePath(workspace?: Pick<WorkspaceSummary, "slug"> | null) {
  return workspace?.slug ? `/app/${workspace.slug}` : "/app";
}

export function useStoredCurrentWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setWorkspace(getCurrentWorkspace());
    setIsHydrated(true);
  }, []);

  return { workspace, isHydrated };
}
