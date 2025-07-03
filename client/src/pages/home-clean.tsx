import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PWAInstallButton from "@/components/PWAInstallButton";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  User as UserIcon, 
  Coins, 
  Shield, 
  Gem,
  GraduationCap,
  DollarSign,
  Crown,
  Play,
  Quote,
  Clock,
  Target,
  CheckCircle,
  Users,
  Globe,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Calculator,
  Store,
  Info
} from "lucide-react";

// Types
type MainSection = "learn" | "money" | "simulations" | "more";
type LearnSubTab = "today";
type SimulationsSubTab = "inflation" | "settlement" | "dca" | "hodl" | "wallet";
type MoreSubTab = "about" | "store";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier: string;
  createdAt: string;
}

interface DailyFact {
  id: number;
  title: string;
  icon: string;
  order_index: number;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  estimated_read_time: number;
  key_takeaways: string[];
  why_it_matters: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation: string;
}

interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  daysLearning: number;
  totalQuizzes: number;
  currentDayIndex: number;
}

// Simple Bottom Navigation Component
interface BottomNavigationProps {
  activeSection: MainSection;
  onSectionChange: (section: string) => void;
}

function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'money', label: 'Why BTC', icon: DollarSign },
    { id: 'simulators', label: 'Sims', icon: Calculator },
    { id: 'more', label: 'More', icon: Info }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || 
            (item.id === 'simulations' && activeSection === 'simulations');
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-orange-500 bg-orange-500/10' 
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Time-based greeting function
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

// Get active section from path
function getActiveSectionFromPath(path: string): MainSection {
  if (path.includes('/learn')) return 'learn';
  if (path.includes('/money')) return 'money';
  if (path.includes('/simulators')) return 'simulations';
  if (path.includes('/more')) return 'more';
  return 'learn';
}

// Main Home Component
export default function Home() {
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<MainSection>(getActiveSectionFromPath(location));
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("today");

  // Update active section when location changes
  useEffect(() => {
    setActiveSection(getActiveSectionFromPath(location));
  }, [location]);

  // User data query
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
  });

  // User progress query
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ['/api/user/progress'],
    retry: false,
  });

  // Daily facts query
  const { data: dailyFacts, isLoading: factsLoading } = useQuery<DailyFact[]>({
    queryKey: ['/api/daily-facts'],
    retry: false,
  });

  // Current day lesson query
  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${userProgress?.currentDayIndex || 1}`],
    enabled: !!userProgress?.currentDayIndex,
    retry: false,
  });

  // Quiz questions query
  const { data: quizQuestions, isLoading: quizLoading } = useQuery<QuizQuestion[]>({
    queryKey: [`/api/quiz/questions/${userProgress?.currentDayIndex || 1}`],
    enabled: !!userProgress?.currentDayIndex,
    retry: false,
  });

  if (userLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-orange-500">Loading your Bitcoin journey...</div>
      </div>
    );
  }

  const greeting = getTimeBasedGreeting();
  const displayName = user?.firstName || user?.username || "learner";

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HODLearn</h1>
                <p className="text-xs text-zinc-400">How-to-learn BTC</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <PWAInstallButton />
              {user?.subscriptionTier === 'premium' ? (
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none"
                >
                  <Gem className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {greeting}, {displayName}!
          </h2>
          <p className="text-zinc-400">
            Ready to continue your Bitcoin journey?
          </p>
        </div>

        {/* Progress Overview */}
        {userProgress && (
          <div className="mb-8">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-zinc-100">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{userProgress.currentDayIndex}</div>
                    <div className="text-sm text-zinc-400">Current Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{userProgress.currentStreak}</div>
                    <div className="text-sm text-zinc-400">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{userProgress.daysLearning}</div>
                    <div className="text-sm text-zinc-400">Days Learning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{userProgress.totalQuizzes}</div>
                    <div className="text-sm text-zinc-400">Quizzes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learn Section */}
        {activeSection === 'learn' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Today's Learning</h3>
              <Badge variant="secondary">
                Day {userProgress?.currentDayIndex || 1} of your Bitcoin journey
              </Badge>
            </div>

            {/* Daily Facts */}
            {dailyFacts && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Today's Bitcoin Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyFacts.map((fact) => (
                      <div key={fact.id} className="flex items-start space-x-3">
                        <div className="text-2xl">{fact.icon}</div>
                        <div>
                          <h4 className="font-semibold text-zinc-100">{fact.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Today's Lesson */}
            {lesson && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-zinc-100">{lesson.title}</CardTitle>
                  <p className="text-sm text-zinc-400">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {lesson.estimated_read_time} min read
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-zinc prose-invert max-w-none">
                    {lesson.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-zinc-300 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quiz Section */}
            {quizQuestions && quizQuestions.length > 0 && (
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-zinc-100">Test Your Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 mb-4">
                    {quizQuestions.length} questions to test your understanding
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Other sections placeholder */}
        {activeSection !== 'learn' && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4">
              {activeSection === 'money' && 'Why Bitcoin'}
              {activeSection === 'simulations' && 'Simulators'}
              {activeSection === 'more' && 'More'}
            </h3>
            <p className="text-zinc-400">Content coming soon...</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeSection={activeSection}
        onSectionChange={(section) => {
          const mappedSection = section === 'simulators' ? 'simulations' : section as MainSection;
          setActiveSection(mappedSection);
          setLocation(`/${section}`);
        }}
      />

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
}