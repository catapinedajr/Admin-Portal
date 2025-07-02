import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

// Simple production-safe wrapper that loads the main Home component progressively
export default function ProductionSafeHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [HomeComponent, setHomeComponent] = useState<React.ComponentType | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Progressive loading of the large Home component
    const loadHomeComponent = async () => {
      try {
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Dynamically import the Home component
        const module = await import('../pages/home-new');
        setHomeComponent(() => module.default);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Home component:', error);
        // Fallback - redirect to About page which works
        setLocation('/about');
      }
    };

    loadHomeComponent();
  }, [setLocation]);

  // Loading state
  if (!isLoaded || !HomeComponent) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5z"/>
            </svg>
          </div>
          <div className="text-orange-500 text-lg">Loading your Bitcoin journey...</div>
          <div className="text-zinc-400 text-sm">Building your personalized learning experience</div>
        </div>
      </div>
    );
  }

  // Render the loaded component
  return <HomeComponent />;
}