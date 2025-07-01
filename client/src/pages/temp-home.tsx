import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TempHome() {
  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">HODLearn - Bitcoin Education</h1>
          <p className="text-zinc-300 text-lg">
            Welcome to your Bitcoin learning journey
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Bitcoin Security Training</h3>
              <p className="text-zinc-300 mb-4">
                Test your knowledge to keep your Bitcoin safe. Complete the security assessment to ensure you can protect your assets.
              </p>
              <Link href="/safety-quiz">
                <Button className="bg-orange-600 hover:bg-orange-700 w-full">
                  Start Security Training
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Daily Learning</h3>
              <p className="text-zinc-300 mb-4">
                Build your Bitcoin knowledge with daily lessons, facts, and quizzes designed for complete beginners.
              </p>
              <Button disabled className="bg-zinc-600 w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}