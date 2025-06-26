import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Trophy, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DeepDiveTopic } from '@shared/schema';

interface WeeklyDeepDiveProps {
  className?: string;
}

export function WeeklyDeepDive({ className = "" }: WeeklyDeepDiveProps) {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Fetch current week's deep dive content
  const { data: weeklyContent, isLoading } = useQuery({
    queryKey: ['/api/weekly-deepdive', { currentWeek, userLevel }],
    queryFn: () => fetch(`/api/weekly-deepdive?currentWeek=${currentWeek}&userLevel=${userLevel}`).then(res => res.json()),
    enabled: true
  });

  // Fetch user's learning level
  const { data: userLevelData } = useQuery({
    queryKey: ['/api/user-level'],
    enabled: true
  });

  useEffect(() => {
    if (userLevelData?.level) {
      setUserLevel(userLevelData.level);
    }
  }, [userLevelData]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else if (direction === 'next' && currentWeek < 52) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'intermediate': return 'bg-orange-600/20 text-orange-300 border-orange-600/30';
      case 'advanced': return 'bg-red-600/20 text-red-300 border-red-600/30';
      default: return 'bg-zinc-600/20 text-zinc-300 border-zinc-600/30';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Weekly Deep Dive</h3>
          <p className="text-zinc-400">Learning progression aligned with your Bitcoin knowledge level</p>
        </div>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="loading-state">
                <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading your Conviction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = weeklyContent as DeepDiveTopic[];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Weekly Deep Dive</h3>
        <p className="text-zinc-400">Learning progression aligned with your Bitcoin knowledge level</p>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('prev')}
            disabled={currentWeek === 1}
            className="text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Week
          </Button>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">Week {currentWeek}</div>
            <Badge className={`${getLevelColor(userLevel)} border`}>
              {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Level
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('next')}
            disabled={currentWeek === 52}
            className="text-zinc-400 hover:text-white"
          >
            Next Week
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekly Content */}
      {content && content.length > 0 ? (
        <div className="space-y-4">
          {content.map((topic, index) => (
            <Card key={topic.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Topic Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs text-zinc-400 border-zinc-700">
                          Day {index + 1}
                        </Badge>
                        <Badge className={`${getLevelColor(topic.difficulty)} border text-xs`}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-bold text-white">{topic.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {topic.estimatedReadTime} min
                    </div>
                  </div>

                  {/* Topic Content */}
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {topic.content}
                  </p>

                  {/* Key Learning Points */}
                  {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-white">Key Learning Points:</h5>
                      <ul className="space-y-1">
                        {topic.keyTakeaways.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-zinc-300 text-sm flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Further Reading */}
                  {topic.furtherReading && topic.furtherReading.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-white">Further Reading:</h5>
                      <ul className="space-y-1">
                        {topic.furtherReading.map((reading, rIndex) => (
                          <li key={rIndex} className="text-zinc-300 text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">📚</span>
                            <span>{reading}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-4 text-zinc-400 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Deep Dive</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{topic.level} level</span>
                      </div>
                    </div>
                    
                    {/* Premium Content Indicator */}
                    {index > 0 && (
                      <div className="flex items-center gap-2 text-orange-400 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Premium Content</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center py-8 space-y-4">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-white mb-2">No Content Available</h4>
                <p className="text-zinc-400">This week's deep dive content is not yet available.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Progress Indicator */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">Learning Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-zinc-400 text-sm">Week {currentWeek} of 52</div>
              <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(currentWeek / 52) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}