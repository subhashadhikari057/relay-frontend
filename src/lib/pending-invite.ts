const PENDING_INVITE_KEY = "relay:pending-invite-token";

export function getPendingInviteToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(PENDING_INVITE_KEY);
}

export function setPendingInviteToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PENDING_INVITE_KEY, token);
}

export function clearPendingInviteToken() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(PENDING_INVITE_KEY);
}
