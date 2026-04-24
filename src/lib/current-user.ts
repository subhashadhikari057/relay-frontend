import { useEffect, useState } from "react";
import type { AuthUser } from "@/types/api.types";

const CURRENT_USER_KEY = "relay:current-user";

export function rememberCurrentUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useStoredCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsHydrated(true);
  }, []);

  return { user, isHydrated };
}
