import React from "react";

export default function HomePage() {
  // Simplified homepage for production debugging
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-orange-500 text-2xl font-bold">
          HODLearn Production Test
        </div>
        <div className="text-zinc-300">
          Homepage component loaded successfully
        </div>
        <div className="text-sm text-zinc-500">
          Build date: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}