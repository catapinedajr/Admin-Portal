// Deployment-safe authentication utilities
// Handles production environment differences and localStorage issues

export interface DeploymentAuthState {
  isAuthenticated: boolean;
  user: any | null;
  error?: string;
}

export async function checkDeploymentAuth(): Promise<DeploymentAuthState> {
  try {
    // Step 1: Check localStorage with fallback
    let sessionId: string | null = null;
    try {
      sessionId = localStorage.getItem('hodlearn_session');
    } catch (storageError) {
      console.warn('localStorage not available in deployment:', storageError);
      return { isAuthenticated: false, user: null, error: 'localStorage unavailable' };
    }

    // Step 2: If no session, return unauthenticated
    if (!sessionId) {
      return { isAuthenticated: false, user: null };
    }

    // Step 3: Validate session with deployment-optimized request
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionId}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const userData = await response.json();
        return { isAuthenticated: true, user: userData };
      } else {
        // Session invalid - clean up
        try {
          localStorage.removeItem('hodlearn_session');
        } catch (e) {
          console.warn('Could not clear invalid session:', e);
        }
        return { isAuthenticated: false, user: null, error: `Auth failed: ${response.status}` };
      }
    } catch (fetchError: any) {
      console.warn('Auth request failed in deployment:', fetchError.name, fetchError.message);
      
      // Network issues in deployment - don't clear session immediately
      if (fetchError.name === 'AbortError') {
        return { isAuthenticated: false, user: null, error: 'Request timeout' };
      }
      
      return { isAuthenticated: false, user: null, error: 'Network error' };
    }
  } catch (error: any) {
    console.error('Deployment auth check completely failed:', error);
    return { isAuthenticated: false, user: null, error: 'Complete auth failure' };
  }
}

// Fallback authentication for when main auth fails
export function getEmergencyFallback(): DeploymentAuthState {
  // In deployment, if auth completely fails, redirect to login
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth' && currentPath !== '/') {
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1000);
    }
  }
  
  return { isAuthenticated: false, user: null, error: 'Emergency fallback' };
}