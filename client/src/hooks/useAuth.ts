import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  currentStreak: number;
  bestStreak: number;
  totalDaysLearning: number;
  completedLessons: number;
  lastActivityDate?: string;
  joinedAt: string;
  subscriptionTier: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth(): AuthState & {
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
} {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check authentication status on hook initialization
  useEffect(() => {
    const sessionId = localStorage.getItem('hodlearn_session');
    const storedUser = localStorage.getItem('hodlearn_user');
    
    if (!sessionId || !storedUser) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    
    try {
      JSON.parse(storedUser); // Validate stored user data
      setIsAuthenticated(true);
    } catch (e) {
      // Invalid stored user data, clear storage
      localStorage.removeItem('hodlearn_session');
      localStorage.removeItem('hodlearn_user');
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Fetch user data when authenticated
  const userQuery = useQuery({
    queryKey: ['/api/user'],
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('/api/auth/login', 'POST', credentials);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem('hodlearn_session', data.sessionId);
      localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      setError(error.message || 'Login failed');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string }) => {
      const response = await apiRequest('/api/auth/register', 'POST', userData);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem('hodlearn_session', data.sessionId);
      localStorage.setItem('hodlearn_user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      setError(error.message || 'Registration failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const sessionId = localStorage.getItem('hodlearn_session');
      if (sessionId) {
        try {
          await apiRequest('/api/auth/logout', 'POST', {});
        } catch (error) {
          // Even if logout fails on server, clear local storage
          console.warn('Logout request failed, but clearing local storage');
        }
      }
    },
    onSuccess: () => {
      localStorage.removeItem('hodlearn_session');
      localStorage.removeItem('hodlearn_user');
      setIsAuthenticated(false);
      setError(null);
      queryClient.clear();
    },
  });

  // Get user data - prefer fresh data from query, fallback to localStorage
  const getUserData = (): User | null => {
    if (userQuery.data) {
      return userQuery.data;
    }
    
    // Fallback to localStorage for immediate availability
    const storedUser = localStorage.getItem('hodlearn_user');
    if (storedUser && isAuthenticated) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    
    return null;
  };

  const user = getUserData();

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || userQuery.isLoading || loginMutation.isPending || registerMutation.isPending,
    error: error || userQuery.error?.message || null,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refetchUser: () => queryClient.invalidateQueries({ queryKey: ['/api/user'] }),
  };
}