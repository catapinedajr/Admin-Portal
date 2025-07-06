import React from "react";

// Ultra-minimal mobile home component to fix React dispatcher error
export default function MobileHome() {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="h-8 w-8 text-orange-500">₿</div>
          <h1 className="text-2xl font-bold">HODLearn</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{getTimeBasedGreeting()}</h2>
          <p className="text-gray-400">Your Bitcoin education journey</p>
        </div>

        {/* Progress */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-center mb-8">
          <div className="text-orange-500 text-4xl mb-4">⏰</div>
          <div className="text-3xl font-bold">Learning Active</div>
          <div className="text-gray-400">Building Bitcoin knowledge daily</div>
        </div>

        {/* Navigation */}
        <div className="space-y-4 mb-8">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 cursor-pointer hover:bg-zinc-750 transition-colors"
               onClick={() => navigateTo('/learn')}>
            <div className="flex items-center space-x-4">
              <div className="text-blue-500 text-2xl">📚</div>
              <div>
                <div className="text-xl font-semibold">Today's Learning</div>
                <div className="text-gray-400">Continue your Bitcoin education</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 cursor-pointer hover:bg-zinc-750 transition-colors"
               onClick={() => navigateTo('/simulators')}>
            <div className="flex items-center space-x-4">
              <div className="text-purple-500 text-2xl">🎓</div>
              <div>
                <div className="text-xl font-semibold">Practice Center</div>
                <div className="text-gray-400">Interactive Bitcoin simulations</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 cursor-pointer hover:bg-zinc-750 transition-colors"
               onClick={() => navigateTo('/money')}>
            <div className="flex items-center space-x-4">
              <div className="text-green-500 text-2xl">💰</div>
              <div>
                <div className="text-xl font-semibold">Money & Finance</div>
                <div className="text-gray-400">Understanding inflation & Bitcoin</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 cursor-pointer hover:bg-zinc-750 transition-colors"
               onClick={() => navigateTo('/more')}>
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500 text-2xl">💡</div>
              <div>
                <div className="text-xl font-semibold">Resources & More</div>
                <div className="text-gray-400">Books, videos, inspiration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigateTo('/learn')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold w-full rounded-lg transition-colors"
          >
            Start Learning Today
          </button>
        </div>

        {/* Brand Message */}
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 text-center">
          <div className="text-gray-300 text-lg mb-2">
            Understanding Bitcoin takes time,<br />
            Building conviction takes consistency
          </div>
          <div className="text-orange-500 font-bold text-xl">
            This is HODLearn
          </div>
        </div>
      </div>
    </div>
  );
}