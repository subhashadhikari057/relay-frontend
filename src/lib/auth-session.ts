import { useSyncExternalStore } from "react";

export type AuthBootstrapStatus = "pending" | "authenticated" | "unauthenticated";

type AuthSessionState = {
  status: AuthBootstrapStatus;
};

let state: AuthSessionState = {
  status: "pending",
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setAuthSessionState(nextState: AuthSessionState) {
  if (state.status === nextState.status) {
    return;
  }
  state = nextState;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAuthSessionState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
