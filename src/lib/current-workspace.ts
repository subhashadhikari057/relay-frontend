import { useSyncExternalStore } from "react";
import type { WorkspaceSummary } from "@/types/api.types";

const CURRENT_WORKSPACE_KEY = "relay:current-workspace";
const listeners = new Set<() => void>();
let cachedRawWorkspace: string | null | undefined;
let cachedWorkspace: WorkspaceSummary | null = null;

function emitWorkspaceChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getWorkspaceSnapshot() {
  return readWorkspaceSnapshot();
}

export function rememberCurrentWorkspace(workspace: WorkspaceSummary) {
  if (typeof window === "undefined") return;
  const nextRaw = JSON.stringify(workspace);
  if (cachedRawWorkspace === nextRaw) return;

  window.localStorage.setItem(CURRENT_WORKSPACE_KEY, nextRaw);
  cachedRawWorkspace = nextRaw;
  cachedWorkspace = workspace;
  emitWorkspaceChange();
}

export function clearCurrentWorkspace() {
  if (typeof window === "undefined") return;
  if (cachedRawWorkspace === null) return;

  window.localStorage.removeItem(CURRENT_WORKSPACE_KEY);
  cachedRawWorkspace = null;
  cachedWorkspace = null;
  emitWorkspaceChange();
}

export function getCurrentWorkspace(): WorkspaceSummary | null {
  return readWorkspaceSnapshot();
}

function readWorkspaceSnapshot(): WorkspaceSummary | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CURRENT_WORKSPACE_KEY);
  if (raw === cachedRawWorkspace) {
    return cachedWorkspace;
  }

  cachedRawWorkspace = raw;

  if (!raw) {
    cachedWorkspace = null;
    return null;
  }

  try {
    cachedWorkspace = JSON.parse(raw) as WorkspaceSummary;
  } catch {
    cachedWorkspace = null;
  }

  return cachedWorkspace;
}

export function getWorkspaceHomePath(workspace?: Pick<WorkspaceSummary, "slug"> | null) {
  return workspace?.slug ? `/app/${workspace.slug}` : "/sign-in";
}

export function useStoredCurrentWorkspace() {
  const workspace = useSyncExternalStore(subscribe, getWorkspaceSnapshot, () => null);

  return { workspace, isHydrated: true };
}
