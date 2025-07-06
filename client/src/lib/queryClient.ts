import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  // Get auth headers if available
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  try {
    const sessionId = localStorage.getItem('hodlearn_session');
    if (sessionId) {
      headers['Authorization'] = `Bearer ${sessionId}`;
    }
  } catch (error) {
    // Silent fallback for deployment environments where localStorage might be restricted
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Better deployment compatibility
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
    // Get auth headers if available
    const headers: Record<string, string> = {};
    
    try {
      const sessionId = localStorage.getItem('hodlearn_session');
      if (sessionId) {
        headers['Authorization'] = `Bearer ${sessionId}`;
      }
    } catch (error) {
      // Silent fallback for deployment environments where localStorage might be restricted
    }

    const res = await fetch(queryKey[0] as string, {
      headers: {
        ...headers,
        // Mobile Safari compatibility
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      credentials: "include", // Better deployment compatibility
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
