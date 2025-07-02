import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  currentStreak?: number;
  bestStreak?: number;
  totalDaysLearning?: number;
  completedLessons?: number;
  lastActivityDate?: string;
  joinedAt?: string;
  subscriptionTier?: string;
  isEmailVerified?: boolean;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on hook initialization
  useEffect(() => {
    try {
      const sessionId = localStorage.getItem('hodlearn_session');
      const storedUser = localStorage.getItem('hodlearn_user');
      
      if (sessionId && storedUser) {
        // Try to parse stored user data
        JSON.parse(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Invalid stored data, clear it
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
    isLoading: isLoading || (userQuery.isLoading ?? false),
    error: userQuery.error?.message || null,
  };
}