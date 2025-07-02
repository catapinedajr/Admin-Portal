import { useState, useEffect } from 'react';

interface LoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}

export function LoadingWrapper({ children, fallback, timeout = 5000 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Component loaded successfully
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    // Timeout fallback
    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true);
      setIsLoading(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutTimer);
    };
  }, [timeout]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
          <div className="text-orange-500 animate-pulse">Loading your Bitcoin journey...</div>
        </div>
      )
    );
  }

  if (showTimeout) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-orange-500">Taking longer than expected...</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default LoadingWrapper;