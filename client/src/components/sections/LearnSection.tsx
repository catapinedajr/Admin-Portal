import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye,
  ArrowLeft,
  Calculator,
  Info,
  TrendingDown,
  Target,
  Star,
  Brain,
  Key
} from "lucide-react";
import type { User } from "@shared/schema";
import DailyQuiz from "@/components/DailyQuiz";
import { BitcoinTerm, AutoGlossary } from "@/components/BitcoinGlossary";
import { useToast } from "@/hooks/use-toast";
import { ProgressIndicator, AchievementBadge, LearningAnalytics } from "@/components/ProgressIndicator";
import AchievementSystem from "@/components/AchievementSystem";
import { useSubscription } from "@/contexts/SubscriptionContext";
import LockedContent from "@/components/LockedContent";

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

// Define bitcoin terms and other constants
const bitcoinTerms = [
  // ... (will need to extract these from the main file)
];

const iconMap = {
  // ... (will need to extract these from the main file)
};

export default function LearnSection({
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

  // This is a placeholder for the actual Learn section content
  // I need to extract the full content from lines 2574-3062
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

      {/* Placeholder for rest of Learn section content */}
      <div className="text-center text-zinc-400">
        Learn section content will be extracted here...
        <br />
        Current day: {currentDayIndex}
        <br />
        Sub tab: {learnSubTab}
      </div>
    </div>
  );
}