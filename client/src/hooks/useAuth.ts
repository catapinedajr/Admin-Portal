import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function useAuth() {
  const [, setLocation] = useLocation();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
    meta: {
      onError: (error: any) => {
        if (error.message?.includes('401')) {
          localStorage.removeItem('sessionId');
          setLocation('/auth');
        }
      }
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error
  };
}