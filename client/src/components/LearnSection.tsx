import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Coins, 
  Brain, 
  Shield, 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronUp, 
  ChevronDown,
  Lightbulb,
  Network,
  Zap,
  Key,
  Globe,
  Target,
  TrendingUp,
  Home,
  CreditCard,
  Wallet,
  Lock,
  Smartphone,
  Award,
  Calendar,
  Users,
  Banknote,
  DollarSign,
  Building,
  BookOpen,
  Star,
  Trophy,
  Coffee,
  Camera,
  Headphones,
  Music,
  Play,
  Pizza,
  Gift,
  Heart,
  Smile
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DailyQuiz from "@/components/DailyQuiz";

type LearnSubTab = "today" | "reference";

interface LearnSectionProps {
  learnSubTab: LearnSubTab;
  setLearnSubTab: (tab: LearnSubTab) => void;
  currentDayIndex: number;
  setCurrentDayIndex: (day: number) => void;
  user: any;
}

interface LessonWithKeyTakeaways {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters?: string;
  estimatedReadTime: number;
  createdAt: string;
}

const iconMap = {
  coins: Coins,
  brain: Brain,
  shield: Shield,
  building2: Building2,
  clock: Clock,
  lightbulb: Lightbulb,
  network: Network,
  zap: Zap,
  key: Key,
  globe: Globe,
  target: Target,
  trendingUp: TrendingUp,
  home: Home,
  creditCard: CreditCard,
  wallet: Wallet,
  lock: Lock,
  smartphone: Smartphone,
  award: Award,
  calendar: Calendar,
  users: Users,
  banknote: Banknote,
  dollarSign: DollarSign,
  building: Building,
  bookOpen: BookOpen,
  star: Star,
  trophy: Trophy,
  coffee: Coffee,
  camera: Camera,
  headphones: Headphones,
  music: Music,
  play: Play,
  pizza: Pizza,
  gift: Gift,
  heart: Heart,
  smile: Smile
};

export default function LearnSection({ 
  learnSubTab, 
  setLearnSubTab, 
  currentDayIndex, 
  setCurrentDayIndex, 
  user 
}: LearnSectionProps) {
  const [showKeyTakeaways, setShowKeyTakeaways] = useState(false);
  const [completionNotificationsShown, setCompletionNotificationsShown] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset completion notifications when the day changes
  useEffect(() => {
    setCompletionNotificationsShown(new Set());
  }, [currentDayIndex]);

  // Queries
  const { data: dayMetadata } = useQuery({
    queryKey: ['/api/day-metadata', currentDayIndex],
  });

  const { data: dailyFacts, isLoading: factsLoading } = useQuery({
    queryKey: ['/api/daily-facts', currentDayIndex],
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['/api/lesson', currentDayIndex],
  });

  const { data: quizQuestions, isLoading: quizLoading } = useQuery({
    queryKey: ['/api/quiz/daily', currentDayIndex],
  });

  const { data: dayCompleted } = useQuery({
    queryKey: ['/api/day-completed', user?.id, currentDayIndex],
  });

  const { data: quizScore } = useQuery({
    queryKey: ['/api/quiz/score', user?.id, new Date().toISOString().split('T')[0]],
  });

  const { data: quizAnswers } = useQuery({
    queryKey: ['/api/quiz/answers', user?.id, new Date().toISOString().split('T')[0]],
  });

  const { data: canAccessDay } = useQuery({
    queryKey: ['/api/day-access', user?.id, currentDayIndex],
  });

  const isCurrentDay = new Date().toISOString().split('T')[0];
  const isDayLockedBySubscription = canAccessDay === false;
  const hasCompletedCurrentDay = Boolean(dayCompleted);

  function cleanText(text: string): React.ReactNode {
    if (!text) return text;
    
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  function getExpandedLessonContent(title: string, content: string): Array<{
    type: 'section';
    title: string;
    content: string;
  }> {
    if (!content) return [];
    
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => ({
      type: 'section' as const,
      title: `Part ${index + 1}`,
      content: section.trim()
    }));
  }

  const expandedContent = lesson ? getExpandedLessonContent(lesson.title, lesson.content) : [];

  return (
    <div className="space-y-6">
      {/* Learn Sub-navigation */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-800/50 rounded-lg p-2">
          <Button
            variant={learnSubTab === "today" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLearnSubTab("today")}
            className="text-xs px-3 py-1"
          >
            Today
          </Button>

          <Button
            variant={learnSubTab === "reference" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLearnSubTab("reference")}
            className="text-xs px-3 py-1"
          >
            Reference
          </Button>
        </div>
      </div>

      {/* Today Tab Content */}
      {learnSubTab === "today" && (
        <div className="space-y-6">
          {/* Journey Progress */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-base font-medium text-zinc-300">
                Day {currentDayIndex} of your Bitcoin journey
              </span>
            </div>
            
            {/* Monthly Theme and Daily Topic */}
            {dayMetadata && (
              <div className="space-y-1">
                <p className="text-lg font-semibold text-orange-400">
                  {dayMetadata.theme}
                </p>
                <p className="text-base font-medium text-zinc-300">
                  {dayMetadata.title}
                </p>
              </div>
            )}
          </div>

          {/* Subscription Lock Message */}
          {isDayLockedBySubscription && (
            <Card className="bg-gradient-to-r from-orange-900/20 to-amber-900/20 border-orange-800/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Lock className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-orange-300">Day {currentDayIndex} Locked</h3>
                </div>
                <p className="text-zinc-300 mb-4">
                  You can only access your current calendar day for maximum learning discipline.
                </p>
                <p className="text-sm text-zinc-400">
                  This ensures consistent daily Bitcoin education and prevents overwhelming yourself.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Daily Facts - Only show if not locked by subscription */}
          {!isDayLockedBySubscription && dailyFacts && Array.isArray(dailyFacts) && dailyFacts.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white border-b border-zinc-700 pb-3 mb-6">Today's Learning Preview</h3>
                <div className="space-y-4">
                  {(dailyFacts as any[]).map((fact: any) => {
                    const IconComponent = iconMap[fact.icon as keyof typeof iconMap] || Coins;
                    
                    return (
                      <div key={fact.id} className="bg-zinc-800/50 rounded-lg overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          <div className="p-2 bg-orange-600/20 rounded-lg flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{fact.title}</h4>
                            
                          </div>
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Lesson Available Message */}
          {!isDayLockedBySubscription && !lesson && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-zinc-500 mx-auto" />
                  <h3 className="text-lg font-semibold text-white">No Lesson Today</h3>
                  <p className="text-zinc-400">
                    Today's lesson hasn't been created yet. Check back soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Lesson - Only show if not locked by subscription */}
          {!isDayLockedBySubscription && lesson && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Lesson Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{lesson.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        ~{lesson.estimatedReadTime || 3} min read
                      </Badge>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="space-y-6">
                    {expandedContent.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-zinc-300 leading-relaxed text-base">
                            {cleanText(section.content)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Takeaways Toggle */}
                  {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                    <div className="border-t border-zinc-700 pt-6">
                      <button
                        onClick={() => setShowKeyTakeaways(!showKeyTakeaways)}
                        className="flex items-center justify-between w-full text-left p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <span className="font-semibold text-orange-300">Key Takeaways</span>
                        {showKeyTakeaways ? (
                          <ChevronUp className="w-4 h-4 text-orange-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-orange-300" />
                        )}
                      </button>
                      
                      {showKeyTakeaways && (
                        <div className="mt-4 space-y-3">
                          {lesson.keyTakeaways.map((takeaway: string, index: number) => (
                            <div key={index} className="flex items-baseline gap-3 p-3 bg-orange-600/10 rounded-lg">
                              <span className="text-orange-400 text-sm font-bold">•</span>
                              <span className="text-zinc-300 text-sm">{cleanText(takeaway)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Why It Matters */}
                  {lesson.whyItMatters && (
                    <div className="border-t border-zinc-700 pt-6">
                      <div className="bg-zinc-800/30 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-300 mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Why It Matters
                        </h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {cleanText(lesson.whyItMatters)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Quiz Component */}
          {!isDayLockedBySubscription && user && (
            <DailyQuiz 
              dayIndex={currentDayIndex}
            />
          )}
        </div>
      )}

      {/* Reference Tab Content */}
      {learnSubTab === "reference" && (
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Bitcoin Reference Guide</h3>
              <p className="text-zinc-400 mb-6">
                Coming soon: Comprehensive Bitcoin reference materials and glossary.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}