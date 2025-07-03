import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { iconMap, bitcoinTerms } from "@/constants/appData";
import { getExpandedLessonContent } from "@/utils/textUtils";
import WeeklyQuiz from "@/components/WeeklyQuiz";
import type { User } from "@shared/schema";
import { 
  Bitcoin, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Coins, 
  Box, 
  Shield, 
  KeyRound,
  Gem,
  Zap,
  GraduationCap,
  HelpCircle,
  DollarSign,
  Heart,
  Plus,
  Crown,
  Play,
  Quote,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  HardDrive,
  Users,
  FileText,
  Calendar,
  Flag,
  Network,
  ArrowRight,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Clock,
  CreditCard,
  Building2,
  Lock,
  Wallet,
  RefreshCw,
} from "lucide-react";

type LearnSubTab = "today" | "reference";

interface LearnSectionProps {
  user: User | undefined;
  currentDayIndex: number;
  dayMetadata: any;
  dailyFacts: any[];
  lesson: any;
  diveDeeper: any[];
  quizQuestions: any[];
  learnSubTab: LearnSubTab;
  setLearnSubTab: (tab: LearnSubTab) => void;
  testDayOverride: number | null;
  setTestDayOverride: (day: number | null) => void;
  isDayCompleted: boolean;
  isPremiumTier: boolean;
  markDayCompleted: () => void;
}

export default function LearnSectionNew({
  user,
  currentDayIndex,
  dayMetadata,
  dailyFacts,
  lesson,
  diveDeeper,
  quizQuestions,
  learnSubTab,
  setLearnSubTab,
  testDayOverride,
  setTestDayOverride,
  isDayCompleted,
  isPremiumTier,
  markDayCompleted
}: LearnSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For now, return a simplified version to test the connection
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

      {/* Test content to verify it's working */}
      <div className="text-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              NEW LearnSection Component Working!
            </h2>
            <p className="text-zinc-400 mb-4">
              Current day: {currentDayIndex}
            </p>
            <p className="text-zinc-400 mb-4">
              Current tab: {learnSubTab}
            </p>
            <p className="text-zinc-400">
              User: {user?.firstName || 'Loading...'}
            </p>
            {dayMetadata && (
              <p className="text-orange-400 mt-2">
                Today's topic: {dayMetadata.title}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}