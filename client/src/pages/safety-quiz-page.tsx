import React from 'react';
import SafetyQuiz from '@/components/SafetyQuiz';

export default function SafetyQuizPage() {
  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bitcoin Security Training</h1>
          <p className="text-zinc-300 text-lg">
            Test your knowledge to keep your Bitcoin safe. You need to get most questions right to pass.
          </p>
        </div>
        
        <SafetyQuiz />
      </div>
    </div>
  );
}