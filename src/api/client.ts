export type ApiError = {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_TIMEOUT_MS = 10_000;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL;
  if (value) return String(value).replace(/\/$/, "");
  return import.meta.env.DEV ? "http://localhost:3000" : "";
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const baseUrl = getApiBaseUrl();
  const url = new URL(
    `${baseUrl}${path}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function createTimeoutSignal(signal?: AbortSignal) {
  if (signal) return signal;

  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    return AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
  }

  return undefined;
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeError(payload: unknown, statusCode: number): ApiError {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message =
      typeof record.message === "string"
        ? record.message
        : Array.isArray(record.message)
          ? record.message.join(", ")
          : "Request failed";

    return {
      message,
      code: typeof record.code === "string" ? record.code : `HTTP_${statusCode}`,
      statusCode,
      details: payload,
    };
  }

  return {
    message: typeof payload === "string" ? payload : "Request failed",
    code: `HTTP_${statusCode}`,
    statusCode,
    details: payload,
  };
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path, options.params), {
    ...options,
    method,
    headers,
    credentials: options.credentials ?? "include",
    signal: createTimeoutSignal(options.signal),
    body:
      options.body === undefined || isFormData
        ? (options.body as BodyInit | undefined)
        : JSON.stringify(options.body),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw normalizeError(payload, response.status);
  }

  return payload as T;
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
};
