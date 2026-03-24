/**
 * API configuration for the HODLearn client.
 *
 * The client is deployed as a static SPA that talks to a separate API server.
 * Set VITE_API_BASE_URL at build time:
 *
 *   VITE_API_BASE_URL=https://api.hodlearn.com npm run build
 *
 * During local development the value defaults to '' (same origin),
 * so the Vite dev-server proxy forwards requests to the backend.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

/**
 * Resolve a relative API path like `/api/user` to the full URL.
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/**
 * Drop-in replacement for `fetch()` that prepends API_BASE_URL
 * to any path starting with `/api`. Other URLs pass through unchanged.
 */
export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/api')) {
    return fetch(apiUrl(input), init);
  }
  return fetch(input, init);
}
