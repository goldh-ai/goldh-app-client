import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Deployments (e.g. Vercel): set VITE_API_BASE_URL to the API origin (see .env.example).
// Local dev: leave unset so /api is same-origin and the Vite proxy can forward.
const API_BASE = import.meta.env.DEV 
  ? '' 
  : (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

/** Prefix a relative /api path with the configured base URL. */
export function apiUrl(path: string): string {
  // If path already has the base (full URL), return as-is
  if (path.startsWith('http')) return path;
  
  // Ensure exactly one slash between API_BASE and path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

/** Bearer token from localStorage for GOLDH protected API routes (omit if unauthenticated). */
export function getSessionAuthHeaders(): Record<string, string> {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

const FETCH_TIMEOUT_MS = 15_000; // 15s — generous for slow dev servers

/** Wraps fetch with an AbortController timeout. */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {
    ...getSessionAuthHeaders(),
    ...(data ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetchWithTimeout(apiUrl(url), {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const headers: Record<string, string> = { ...getSessionAuthHeaders() };

      const rawKey = queryKey.join("/") as string;
      const res = await fetchWithTimeout(apiUrl(rawKey), {
        headers,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

function is4xx(error: unknown): boolean {
  if (error instanceof Error) {
    const code = parseInt(error.message.split(':')[0] ?? '', 10);
    return code >= 400 && code < 500;
  }
  return false;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      // Retry network errors up to 2 times, but never retry 4xx responses.
      retry: (count, error) => count < 2 && !is4xx(error),
    },
    mutations: {
      retry: false,
    },
  },
});
