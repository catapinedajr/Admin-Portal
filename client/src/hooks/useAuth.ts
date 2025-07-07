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
          localStorage.removeItem('hodlearn_session');
          localStorage.removeItem('hodlearn_user');
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