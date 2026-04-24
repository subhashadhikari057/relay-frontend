import { useSyncExternalStore } from "react";
import type { AuthUser } from "@/types/api.types";

const CURRENT_USER_KEY = "relay:current-user";
const listeners = new Set<() => void>();
let cachedRawUser: string | null | undefined;
let cachedUser: AuthUser | null = null;

function emitUserChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getUserSnapshot() {
  return readUserSnapshot();
}

export function rememberCurrentUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  const nextRaw = JSON.stringify(user);
  if (cachedRawUser === nextRaw) return;

  window.localStorage.setItem(CURRENT_USER_KEY, nextRaw);
  cachedRawUser = nextRaw;
  cachedUser = user;
  emitUserChange();
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  if (cachedRawUser === null) return;

  window.localStorage.removeItem(CURRENT_USER_KEY);
  cachedRawUser = null;
  cachedUser = null;
  emitUserChange();
}

export function getCurrentUser(): AuthUser | null {
  return readUserSnapshot();
}

function readUserSnapshot(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (raw === cachedRawUser) {
    return cachedUser;
  }

  cachedRawUser = raw;

  if (!raw) {
    cachedUser = null;
    return null;
  }

  try {
    cachedUser = JSON.parse(raw) as AuthUser;
  } catch {
    cachedUser = null;
  }

  return cachedUser;
}

export function useStoredCurrentUser() {
  const user = useSyncExternalStore(subscribe, getUserSnapshot, () => null);

  return { user, isHydrated: true };
}
