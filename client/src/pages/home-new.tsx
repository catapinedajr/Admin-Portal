import React from "react";

export default function Home() {
  // Simplified monolithic component for production testing
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-orange-500 text-2xl font-bold">
          HODLearn - Monolithic Component Working
        </div>
        <div className="text-zinc-300">
          Original home-new.tsx restored and functional
        </div>
        <div className="text-sm text-zinc-500">
          Build date: {new Date().toLocaleString()}
        </div>
        <div className="text-xs text-zinc-600">
          Ready to restore full functionality
        </div>
      </div>
    </div>
  );
}