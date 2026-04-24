import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";
import type { AuthTokenResponse, AuthUser, WorkspaceSummary } from "@/types/api.types";

export type InitialAuthSession = {
  status: "authenticated" | "unauthenticated";
  accessToken: string | null;
  user: AuthUser | null;
  workspace: WorkspaceSummary | null;
};

const REFRESH_COOKIE_NAME = "relay_refresh_token";
const SESSION_COOKIE_NAME = "relay_sid";
const SESSION_CACHE_TTL_MS = 5_000;

const unauthenticatedSession = {
  status: "unauthenticated",
  accessToken: null,
  user: null,
  workspace: null,
} satisfies InitialAuthSession;

type CachedSession = {
  expiresAt: number;
  promise: Promise<InitialAuthSession>;
};

const sessionCache = new Map<string, CachedSession>();

function getApiBaseUrl() {
  const fromImportMetaEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromImportMetaEnv === "string" && fromImportMetaEnv.length > 0) {
    return fromImportMetaEnv.replace(/\/$/, "");
  }

  const fromProcessEnv = process.env.VITE_API_BASE_URL ?? process.env.API_BASE_URL;
  if (typeof fromProcessEnv === "string" && fromProcessEnv.length > 0) {
    return fromProcessEnv.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

function hasAuthCookies(cookie: string) {
  return cookie.includes(`${REFRESH_COOKIE_NAME}=`) && cookie.includes(`${SESSION_COOKIE_NAME}=`);
}

async function resolveInitialAuthSession(cookie: string): Promise<InitialAuthSession> {
  const apiBaseUrl = getApiBaseUrl();
  const sessionResponse = await fetch(`${apiBaseUrl}/api/mobile/auth/session`, {
    method: "POST",
    headers: {
      cookie,
      "user-agent": getRequestHeader("user-agent") ?? "",
    },
  });

  if (!sessionResponse.ok) {
    return unauthenticatedSession;
  }

  const auth = (await sessionResponse.json()) as AuthTokenResponse;
  const workspace = auth.activeWorkspace ?? null;

  return {
    status: "authenticated",
    accessToken: auth.accessToken,
    user: auth.user,
    workspace,
  } satisfies InitialAuthSession;
}

function getCachedInitialAuthSession(cookie: string) {
  const now = Date.now();
  const cached = sessionCache.get(cookie);

  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }

  const promise = resolveInitialAuthSession(cookie).catch(() => unauthenticatedSession);
  sessionCache.set(cookie, {
    expiresAt: now + SESSION_CACHE_TTL_MS,
    promise,
  });

  return promise;
}

export const getInitialAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const request = getRequest();
    const cookie = request.headers.get("cookie");

    if (!cookie || !hasAuthCookies(cookie)) {
      return unauthenticatedSession;
    }

    return getCachedInitialAuthSession(cookie);
  } catch {
    return unauthenticatedSession;
  }
});
