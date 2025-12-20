import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  BookOpen,
  HelpCircle,
  CheckCircle,
  Clock,
  Search,
  GraduationCap,
  Users,
  Sparkles,
  Upload,
  FileJson,
  AlertCircle,
  Trash2,
  Save,
  X,
  Lock,
  Unlock,
  Eye,
  FileText,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Calendar,
  Wand2,
  RefreshCw,
  Check,
  XCircle,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentDay {
  id: number;
  dayIndex: number;
  title: string;
  readingLevel: string;
  culturalStage: string;
  theme: string;
  status: 'draft' | 'review' | 'approved' | 'live';
  isActive: boolean;
  isApproved: boolean;
  reviewerNotes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  questionsCount: number;
  lessonsCount: number;
  quizzesCount: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  draft: { label: 'Draft', color: 'text-zinc-400', bgColor: 'bg-zinc-600/20', borderColor: 'border-zinc-500/30' },
  review: { label: 'In Review', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
  approved: { label: 'Approved', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
  live: { label: 'Live', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
};

interface ContentLesson {
  id: number;
  dayId: number;
  title: string;
  content: string;
  keyTakeaways: string[];
  whyItMatters: string | null;
  estimatedReadTime: number;
}

interface ContentQuiz {
  id: number;
  dayId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ContentQuestion {
  id: number;
  dayId: number;
  title: string;
  content: string;
  category: string;
  icon: string;
  orderIndex: number;
}

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: adminUser, isLoading, error } = useQuery<{ id: number }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (error || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [isLoading, error, adminUser, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!adminUser) return null;
  return <>{children}</>;
}

function ContentDayCard({ day, onEdit }: { day: ContentDay; onEdit: () => void }) {
  const statusConfig = STATUS_CONFIG[day.status] || STATUS_CONFIG.draft;
  
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer" onClick={onEdit}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-orange-500 font-bold">Day {day.dayIndex}</span>
              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                {statusConfig.label}
              </Badge>
              {!day.isActive && (
                <Badge className="bg-zinc-700 text-zinc-400 border-0">Inactive</Badge>
              )}
            </div>
            <h3 className="text-white font-medium">{day.title}</h3>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {day.theme}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {day.readingLevel}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {day.culturalStage}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {day.questionsCount} questions
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {day.lessonsCount} lesson
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {day.quizzesCount} quizzes
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="text-zinc-400 hover:text-white"
            data-testid={`button-edit-day-${day.dayIndex}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EditDayDialog({ day, open, onOpenChange }: { 
  day: ContentDay | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  
  const [detailsLocked, setDetailsLocked] = useState(true);
  const [lessonLocked, setLessonLocked] = useState(true);
  const [questionsLocked, setQuestionsLocked] = useState(true);
  const [quizzesLocked, setQuizzesLocked] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    readingLevel: "",
    culturalStage: "",
    status: "draft" as 'draft' | 'review' | 'approved' | 'live',
    isActive: true,
    isApproved: false,
    reviewerNotes: "",
  });
  
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    keyTakeaways: ["", "", ""],
    whyItMatters: "",
    estimatedReadTime: 3,
  });
  
  const [editingQuiz, setEditingQuiz] = useState<ContentQuiz | null>(null);
  const [newQuiz, setNewQuiz] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  
  const [editingQuestion, setEditingQuestion] = useState<ContentQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", category: "financial", icon: "💰" });
  const [showPreview, setShowPreview] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);
  
  const { data: lesson, isLoading: lessonLoading } = useQuery<ContentLesson>({
    queryKey: ["/api/admin/content/lessons", day?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/content/lessons/${day?.id}`);
      return res.json();
    },
    enabled: !!day?.id && open,
  });
  
  const { data: quizzes, isLoading: quizzesLoading } = useQuery<ContentQuiz[]>({
    queryKey: ["/api/admin/content/quizzes", day?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/content/quizzes/${day?.id}`);
      return res.json();
    },
    enabled: !!day?.id && open,
  });
  
  const { data: questions, isLoading: questionsLoading } = useQuery<ContentQuestion[]>({
    queryKey: ["/api/admin/content/questions", day?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/content/questions/${day?.id}`);
      return res.json();
    },
    enabled: !!day?.id && open,
  });

  const updateDayMutation = useMutation({
    mutationFn: async (data: Partial<ContentDay>) => {
      const res = await apiRequest("PATCH", `/api/admin/content/days/${day?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Day details updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const saveLessonMutation = useMutation({
    mutationFn: async (data: typeof lessonForm) => {
      const res = await apiRequest("PUT", `/api/admin/content/lessons/${day?.id}`, {
        ...data,
        keyTakeaways: data.keyTakeaways.filter(t => t.trim() !== ""),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/lessons", day?.id] });
      toast({ title: "Lesson saved" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save lesson", description: error.message, variant: "destructive" });
    },
  });

  const createQuizMutation = useMutation({
    mutationFn: async (data: typeof newQuiz) => {
      const res = await apiRequest("POST", `/api/admin/content/quizzes/${day?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/quizzes", day?.id] });
      toast({ title: "Quiz added" });
      setNewQuiz({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
      setShowNewQuiz(false);
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ContentQuiz> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/admin/content/quizzes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/quizzes", day?.id] });
      toast({ title: "Quiz updated" });
      setEditingQuiz(null);
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/content/quizzes/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/quizzes", day?.id] });
      toast({ title: "Quiz deleted" });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: typeof newQuestion) => {
      const res = await apiRequest("POST", `/api/admin/content/questions/${day?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/questions", day?.id] });
      toast({ title: "Question added" });
      setNewQuestion({ title: "", content: "", category: "financial", icon: "💰" });
      setShowNewQuestion(false);
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ContentQuestion> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/admin/content/questions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/questions", day?.id] });
      toast({ title: "Question updated" });
      setEditingQuestion(null);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/content/questions/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/questions", day?.id] });
      toast({ title: "Question deleted" });
    },
  });

  const deleteDayMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/admin/content/days/${day?.id}`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: `Day ${data.deletedDayIndex} deleted successfully` });
      onOpenChange(false);
      resetDeleteState();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const resetDeleteState = () => {
    setShowDeleteConfirm(false);
    setDeleteStep(1);
    setDeleteConfirmText("");
    setDeleteAcknowledged(false);
  };

  useEffect(() => {
    if (day) {
      setFormData({
        title: day.title,
        theme: day.theme,
        readingLevel: day.readingLevel,
        culturalStage: day.culturalStage,
        status: day.status || 'draft',
        isActive: day.isActive,
        isApproved: day.isApproved,
        reviewerNotes: day.reviewerNotes || '',
      });
    }
  }, [day]);

  useEffect(() => {
    if (lesson) {
      setLessonForm({
        title: lesson.title,
        content: lesson.content,
        keyTakeaways: lesson.keyTakeaways?.length >= 3 ? lesson.keyTakeaways : [...(lesson.keyTakeaways || []), "", "", ""].slice(0, 3),
        whyItMatters: lesson.whyItMatters || "",
        estimatedReadTime: lesson.estimatedReadTime,
      });
    }
  }, [lesson]);

  if (!day) return null;

  const isLoading = lessonLoading || quizzesLoading || questionsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Day {day.dayIndex}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Manage all content for this curriculum day
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-zinc-800 border-zinc-700">
            <TabsTrigger value="details" className="data-[state=active]:bg-orange-500">Details</TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-orange-500">Learning Preview ({questions?.length || 0})</TabsTrigger>
            <TabsTrigger value="lesson" className="data-[state=active]:bg-orange-500">Today's Lesson</TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-orange-500">Knowledge Check ({quizzes?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-zinc-300 text-sm font-medium">Day Details</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailsLocked(!detailsLocked)}
                className={`${detailsLocked ? 'border-zinc-600 text-zinc-400' : 'border-orange-500 text-orange-500'}`}
              >
                {detailsLocked ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                {detailsLocked ? "Locked" : "Editing"}
              </Button>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 ${detailsLocked ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="space-y-2">
                <Label className="text-zinc-300">Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  disabled={detailsLocked}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Theme</Label>
                <Input 
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  disabled={detailsLocked}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Reading Level</Label>
                <Input 
                  value={formData.readingLevel}
                  onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="e.g., 8th grade"
                  disabled={detailsLocked}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Cultural Stage</Label>
                <Input 
                  value={formData.culturalStage}
                  onChange={(e) => setFormData({ ...formData, culturalStage: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="e.g., Normie → Pre-coiner"
                  disabled={detailsLocked}
                />
              </div>
            </div>

            {/* Status Pipeline */}
            <div className={`space-y-3 ${detailsLocked ? 'opacity-60 pointer-events-none' : ''}`}>
              <Label className="text-zinc-300">Content Status</Label>
              <div className="flex items-center gap-2">
                {(['draft', 'review', 'approved', 'live'] as const).map((status, index) => {
                  const config = STATUS_CONFIG[status];
                  const isCurrentStatus = formData.status === status;
                  const isPastStatus = ['draft', 'review', 'approved', 'live'].indexOf(formData.status) > index;
                  return (
                    <div key={status} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => !detailsLocked && setFormData({ ...formData, status })}
                        disabled={detailsLocked}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isCurrentStatus 
                            ? `${config.bgColor} ${config.color} ring-2 ring-offset-2 ring-offset-zinc-900 ring-${status === 'draft' ? 'zinc' : status === 'review' ? 'yellow' : status === 'approved' ? 'blue' : 'green'}-500/50`
                            : isPastStatus
                              ? 'bg-zinc-700/50 text-zinc-400'
                              : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                        }`}
                        data-testid={`button-status-${status}`}
                      >
                        {config.label}
                      </button>
                      {index < 3 && (
                        <div className={`w-6 h-0.5 mx-1 ${isPastStatus || isCurrentStatus ? 'bg-zinc-600' : 'bg-zinc-800'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviewer Notes (shown when in review or approved) */}
            {(formData.status === 'review' || formData.status === 'approved') && (
              <div className={`space-y-2 ${detailsLocked ? 'opacity-60 pointer-events-none' : ''}`}>
                <Label className="text-zinc-300">Reviewer Notes</Label>
                <Textarea
                  value={formData.reviewerNotes}
                  onChange={(e) => setFormData({ ...formData, reviewerNotes: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                  placeholder="Add notes about changes needed or approval details..."
                  disabled={detailsLocked}
                />
              </div>
            )}

            <div className={`flex gap-4 ${detailsLocked ? 'opacity-60 pointer-events-none' : ''}`}>
              <label className="flex items-center gap-2 text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                  disabled={detailsLocked}
                />
                Active
              </label>
            </div>

            {!detailsLocked && (
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  onClick={() => { updateDayMutation.mutate(formData); setDetailsLocked(true); }}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={updateDayMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateDayMutation.isPending ? "Saving..." : "Save Details"}
                </Button>
              </div>
            )}

            {/* Delete Section */}
            <div className="border-t border-zinc-800 pt-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Danger Zone</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {day.status === 'live' 
                      ? "Change status to Draft and save before deleting" 
                      : "Delete this day and all its content"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={day.status === 'live'}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  data-testid="button-delete-day"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Day
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lesson" className="mt-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                {lesson ? "Lesson Content" : "Create New Lesson"}
              </Label>
              <div className="flex gap-2">
                {lesson && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    data-testid="button-preview-lesson"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLessonLocked(!lessonLocked)}
                  className={`${lessonLocked ? 'border-zinc-600 text-zinc-400' : 'border-orange-500 text-orange-500'}`}
                >
                  {lessonLocked ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                  {lessonLocked ? "Locked" : "Editing"}
                </Button>
              </div>
            </div>
            
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className={`p-4 space-y-4 ${lessonLocked ? 'opacity-60' : ''}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Lesson Title</Label>
                    <Input 
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Enter lesson title..."
                      disabled={lessonLocked}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Read Time (minutes)</Label>
                    <Input 
                      type="number"
                      value={lessonForm.estimatedReadTime}
                      onChange={(e) => setLessonForm({ ...lessonForm, estimatedReadTime: parseInt(e.target.value) || 3 })}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      min={1}
                      max={30}
                      disabled={lessonLocked}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-zinc-300">Lesson Content</Label>
                  <Textarea 
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white min-h-[200px]"
                    placeholder="Write the full lesson content here..."
                    disabled={lessonLocked}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-zinc-300">Key Takeaways (3 points)</Label>
                  {lessonForm.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <Input 
                        value={takeaway}
                        onChange={(e) => {
                          const updated = [...lessonForm.keyTakeaways];
                          updated[i] = e.target.value;
                          setLessonForm({ ...lessonForm, keyTakeaways: updated });
                        }}
                        className="bg-zinc-900 border-zinc-700 text-white"
                        placeholder={`Key takeaway ${i + 1}...`}
                        disabled={lessonLocked}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-zinc-300">Why It Matters</Label>
                  <Textarea 
                    value={lessonForm.whyItMatters}
                    onChange={(e) => setLessonForm({ ...lessonForm, whyItMatters: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Explain why this lesson matters to the learner..."
                    disabled={lessonLocked}
                  />
                </div>
                
                {!lessonLocked && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => { saveLessonMutation.mutate(lessonForm); setLessonLocked(true); }}
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={saveLessonMutation.isPending || !lessonForm.title || !lessonForm.content}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveLessonMutation.isPending ? "Saving..." : "Save Lesson"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-500" />
                Today's Learning Preview
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestionsLocked(!questionsLocked)}
                  className={`${questionsLocked ? 'border-zinc-600 text-zinc-400' : 'border-orange-500 text-orange-500'}`}
                >
                  {questionsLocked ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                  {questionsLocked ? "Locked" : "Editing"}
                </Button>
                {!questionsLocked && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowNewQuestion(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                )}
              </div>
            </div>

            {!questionsLocked && showNewQuestion && (
              <Card className="bg-zinc-800 border-orange-500/50">
                <CardContent className="p-4 space-y-3">
                  <Input 
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Question title..."
                  />
                  <Textarea 
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Question content..."
                  />
                  <div className="flex gap-2">
                    <Input 
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Category (e.g., financial)"
                    />
                    <Input 
                      value={newQuestion.icon}
                      onChange={(e) => setNewQuestion({ ...newQuestion, icon: e.target.value })}
                      className="bg-zinc-900 border-zinc-700 text-white w-20"
                      placeholder="Icon"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowNewQuestion(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => createQuestionMutation.mutate(newQuestion)}
                      disabled={createQuestionMutation.isPending || !newQuestion.title || !newQuestion.content}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : questions && questions.length > 0 ? (
              <div className={`space-y-3 ${questionsLocked ? 'opacity-70' : ''}`}>
                {questions.map((q, idx) => (
                  <Card key={q.id} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      {!questionsLocked && editingQuestion?.id === q.id ? (
                        <div className="space-y-3">
                          <Input 
                            value={editingQuestion.title}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                            className="bg-zinc-900 border-zinc-700 text-white"
                          />
                          <Textarea 
                            value={editingQuestion.content}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, content: e.target.value })}
                            className="bg-zinc-900 border-zinc-700 text-white"
                          />
                          <div className="flex gap-2">
                            <Input 
                              value={editingQuestion.category}
                              onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                              className="bg-zinc-900 border-zinc-700 text-white"
                            />
                            <Input 
                              value={editingQuestion.icon}
                              onChange={(e) => setEditingQuestion({ ...editingQuestion, icon: e.target.value })}
                              className="bg-zinc-900 border-zinc-700 text-white w-20"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(null)}>Cancel</Button>
                            <Button 
                              size="sm" 
                              onClick={() => updateQuestionMutation.mutate(editingQuestion)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{q.title}</h4>
                            <p className="text-sm text-zinc-400 mt-1">{q.content}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                              <Badge variant="outline" className="border-zinc-600 text-zinc-400">{q.category}</Badge>
                              <span>{q.icon}</span>
                            </div>
                          </div>
                          {!questionsLocked && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(q)}>
                                <Edit className="w-4 h-4 text-zinc-400" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteQuestionMutation.mutate(q.id)}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                {questionsLocked ? "No questions for this day. Unlock to add some." : "No questions for this day. Add some above!"}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                Knowledge Check Quiz
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuizzesLocked(!quizzesLocked)}
                  className={`${quizzesLocked ? 'border-zinc-600 text-zinc-400' : 'border-orange-500 text-orange-500'}`}
                >
                  {quizzesLocked ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                  {quizzesLocked ? "Locked" : "Editing"}
                </Button>
                {!quizzesLocked && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowNewQuiz(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                )}
              </div>
            </div>

            {!quizzesLocked && showNewQuiz && (
              <Card className="bg-zinc-800 border-orange-500/50">
                <CardContent className="p-4 space-y-3">
                  <Input 
                    value={newQuiz.question}
                    onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Question..."
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {newQuiz.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          checked={newQuiz.correctAnswer === i}
                          onChange={() => setNewQuiz({ ...newQuiz, correctAnswer: i })}
                        />
                        <Input 
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newQuiz.options];
                            updated[i] = e.target.value;
                            setNewQuiz({ ...newQuiz, options: updated });
                          }}
                          className="bg-zinc-900 border-zinc-700 text-white"
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        />
                      </div>
                    ))}
                  </div>
                  <Textarea 
                    value={newQuiz.explanation}
                    onChange={(e) => setNewQuiz({ ...newQuiz, explanation: e.target.value })}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Explanation for correct answer..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowNewQuiz(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => createQuizMutation.mutate(newQuiz)}
                      disabled={createQuizMutation.isPending || !newQuiz.question || newQuiz.options.some(o => !o)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : quizzes && quizzes.length > 0 ? (
              <div className={`space-y-4 ${quizzesLocked ? 'opacity-70' : ''}`}>
                {quizzes.map((quiz, idx) => (
                  <Card key={quiz.id} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-4">
                      {!quizzesLocked && editingQuiz?.id === quiz.id ? (
                        <div className="space-y-3">
                          <Input 
                            value={editingQuiz.question}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, question: e.target.value })}
                            className="bg-zinc-900 border-zinc-700 text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            {editingQuiz.options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input 
                                  type="radio" 
                                  checked={editingQuiz.correctAnswer === i}
                                  onChange={() => setEditingQuiz({ ...editingQuiz, correctAnswer: i })}
                                />
                                <Input 
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...editingQuiz.options];
                                    updated[i] = e.target.value;
                                    setEditingQuiz({ ...editingQuiz, options: updated });
                                  }}
                                  className="bg-zinc-900 border-zinc-700 text-white"
                                />
                              </div>
                            ))}
                          </div>
                          <Textarea 
                            value={editingQuiz.explanation}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, explanation: e.target.value })}
                            className="bg-zinc-900 border-zinc-700 text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingQuiz(null)}>Cancel</Button>
                            <Button 
                              size="sm" 
                              onClick={() => updateQuizMutation.mutate(editingQuiz)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <p className="text-white font-medium mb-3">Q{idx + 1}: {quiz.question}</p>
                            {!quizzesLocked && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setEditingQuiz(quiz)}>
                                  <Edit className="w-4 h-4 text-zinc-400" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteQuizMutation.mutate(quiz.id)}>
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {quiz.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`p-2 rounded text-sm ${i === quiz.correctAnswer ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-900 text-zinc-400'}`}
                              >
                                <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 p-2 bg-zinc-900 rounded text-xs text-zinc-400">
                            <span className="text-zinc-500">Explanation:</span> {quiz.explanation}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                {quizzesLocked ? "No quizzes for this day. Unlock to add some." : "No quizzes for this day. Add some above!"}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Mobile Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-sm p-0 overflow-hidden">
          <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-white">Mobile Preview</span>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">
              Day {day?.dayIndex}
            </Badge>
          </div>
          
          {/* Mock Mobile Frame */}
          <div className="bg-zinc-950 max-h-[70vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Day Header */}
              <div className="text-center pb-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white">{day?.title}</h2>
                <p className="text-sm text-zinc-400 mt-1">{day?.theme}</p>
              </div>
              
              {/* Lesson Content */}
              {lesson && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-semibold text-white mb-2">{lessonForm.title || lesson.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>{lessonForm.estimatedReadTime || lesson.estimatedReadTime} min read</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {lessonForm.content || lesson.content}
                  </div>
                  
                  {/* Key Takeaways */}
                  {(lessonForm.keyTakeaways?.some(t => t) || lesson.keyTakeaways?.length > 0) && (
                    <div className="bg-zinc-900 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-medium text-orange-400">Key Takeaways</h4>
                      {(lessonForm.keyTakeaways || lesson.keyTakeaways)?.filter(t => t).map((takeaway, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Why It Matters */}
                  {(lessonForm.whyItMatters || lesson.whyItMatters) && (
                    <div className="bg-orange-500/10 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Why This Matters</h4>
                      <p className="text-sm text-zinc-300">{lessonForm.whyItMatters || lesson.whyItMatters}</p>
                    </div>
                  )}
                </div>
              )}
              
              {!lesson && (
                <div className="text-center py-8 text-zinc-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No lesson content yet</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800">
            <Button 
              onClick={() => setShowPreview(false)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={(open) => { if (!open) resetDeleteState(); else setShowDeleteConfirm(true); }}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Day {day?.dayIndex}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {deleteStep === 1 && (
                <div className="space-y-3">
                  <p>This will permanently delete:</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    <li>The day "{day?.title}"</li>
                    <li>{lesson ? "1 lesson" : "No lessons"}</li>
                    <li>{quizzes?.length || 0} quiz question(s)</li>
                    <li>{questions?.length || 0} setup question(s)</li>
                  </ul>
                  <p className="text-red-400 font-medium mt-4">This action cannot be undone.</p>
                </div>
              )}
              {deleteStep === 2 && (
                <div className="space-y-4">
                  <p>To confirm deletion, type <span className="font-mono text-orange-400">Day {day?.dayIndex}</span> below:</p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={`Type "Day ${day?.dayIndex}" to confirm`}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-delete-confirm"
                  />
                  <label className="flex items-start gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={deleteAcknowledged}
                      onChange={(e) => setDeleteAcknowledged(e.target.checked)}
                      className="mt-1 rounded"
                    />
                    <span className="text-sm">I understand this will permanently delete all content for this day and cannot be undone.</span>
                  </label>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={resetDeleteState}
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              Cancel
            </AlertDialogCancel>
            {deleteStep === 1 && (
              <Button
                onClick={() => setDeleteStep(2)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Continue
              </Button>
            )}
            {deleteStep === 2 && (
              <Button
                onClick={() => deleteDayMutation.mutate()}
                disabled={deleteConfirmText !== `Day ${day?.dayIndex}` || !deleteAcknowledged || deleteDayMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                data-testid="button-confirm-delete"
              >
                {deleteDayMutation.isPending ? "Deleting..." : "Delete Forever"}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

interface GeneratedContent {
  title: string;
  theme: string;
  readingLevel: string;
  culturalStage: string;
  setup_questions: Array<{
    content: string;
    category: string;
    icon: string;
  }>;
  lesson: {
    title: string;
    content: string;
    keyTakeaways: string[];
    whyItMatters: string;
    estimatedReadTime: number;
  };
  quiz_questions: Array<{
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: number;
    explanation: string;
  }>;
}

interface GenerateResponse {
  success: boolean;
  dayIndex: number;
  content: GeneratedContent;
  validation: {
    passed: boolean;
    issues: string[];
  };
  context: {
    cycle: number;
    week: number;
    dayInWeek: number;
    isWeeklyRecap: boolean;
    theme: string;
    priorDaysUsed: number;
  };
}

function AIGenerateDialog({ open, onOpenChange, nextDayIndex }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  nextDayIndex: number;
}) {
  const { toast } = useToast();
  const [dayIndex, setDayIndex] = useState(nextDayIndex);
  const [themeOverride, setThemeOverride] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');
  const [generatedData, setGeneratedData] = useState<GenerateResponse | null>(null);
  const [editedContent, setEditedContent] = useState<GeneratedContent | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    setDayIndex(nextDayIndex);
  }, [nextDayIndex]);

  useEffect(() => {
    if (!open) {
      setStep('input');
      setGeneratedData(null);
      setEditedContent(null);
      setThemeOverride("");
      setNotes("");
      setViewMode('edit');
    }
  }, [open]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/content/generate-draft", {
        dayIndex,
        theme: themeOverride || undefined,
        notes: notes || undefined
      });
      return res.json() as Promise<GenerateResponse>;
    },
    onSuccess: (data) => {
      setGeneratedData(data);
      setEditedContent(data.content);
      setStep('preview');
    },
    onError: (error: Error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
      setStep('input');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editedContent) throw new Error("No content to save");
      
      const payload = {
        dayIndex,
        title: editedContent.title,
        theme: editedContent.theme,
        readingLevel: editedContent.readingLevel,
        culturalStage: editedContent.culturalStage,
        questions: editedContent.setup_questions.map((q, idx) => ({
          title: `Question ${idx + 1}`,
          content: q.content,
          category: q.category,
          icon: q.icon,
          orderIndex: idx
        })),
        lesson: {
          title: editedContent.lesson.title,
          content: editedContent.lesson.content,
          keyTakeaways: editedContent.lesson.keyTakeaways,
          whyItMatters: editedContent.lesson.whyItMatters,
          estimatedReadTime: editedContent.lesson.estimatedReadTime
        },
        quizzes: editedContent.quiz_questions.map(q => ({
          question: q.question,
          options: [q.optionA, q.optionB, q.optionC, q.optionD],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      };
      
      const res = await apiRequest("POST", "/api/admin/content/bulk-import", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Content saved successfully!" });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    },
  });

  const handleGenerate = () => {
    setStep('generating');
    generateMutation.mutate();
  };

  const handleRegenerate = () => {
    setStep('generating');
    generateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-orange-500" />
            AI Content Generator
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Generate curriculum content using AI based on the Content Creation Framework
          </DialogDescription>
        </DialogHeader>
        
        {step === 'input' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Day Number</Label>
                <Input 
                  type="number"
                  value={dayIndex}
                  onChange={(e) => setDayIndex(parseInt(e.target.value) || nextDayIndex)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  data-testid="input-day-number"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Theme Override (optional)</Label>
                <Input 
                  value={themeOverride}
                  onChange={(e) => setThemeOverride(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Leave empty for auto-suggested theme"
                  data-testid="input-theme-override"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-300">Additional Notes (optional)</Label>
              <Textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                placeholder="Any specific guidance for this day's content (e.g., 'focus on security concerns', 'tie into recent news about ETFs')"
                data-testid="input-notes"
              />
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">What will be generated:</h4>
              <ul className="text-xs text-zinc-400 space-y-1">
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Urgency-driven title (under 60 chars)</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> 3 setup questions (curiosity building)</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Lesson content (300-1200 words, 8th grade level)</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> 4 quiz questions with explanations</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Key takeaways and "Why It Matters"</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="button-generate"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <div className="text-center">
              <p className="text-white font-medium">Generating Day {dayIndex} Content...</p>
              <p className="text-zinc-400 text-sm mt-1">This usually takes 30-60 seconds</p>
            </div>
          </div>
        )}

        {step === 'preview' && generatedData && editedContent && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge className={generatedData.validation.passed ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                  {generatedData.validation.passed ? (
                    <><Check className="w-3 h-3 mr-1" /> All checks passed</>
                  ) : (
                    <><AlertCircle className="w-3 h-3 mr-1" /> {generatedData.validation.issues.length} issues</>
                  )}
                </Badge>
                <span className="text-xs text-zinc-500">
                  Cycle {generatedData.context.cycle} • Week {generatedData.context.week} • Day {generatedData.context.dayInWeek}
                  {generatedData.context.priorDaysUsed > 0 && ` • ${generatedData.context.priorDaysUsed} prior days used for context`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${viewMode === 'edit' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                    data-testid="button-view-edit"
                  >
                    <FileText className="w-3 h-3 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${viewMode === 'preview' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                    data-testid="button-view-preview"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Preview
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRegenerate}
                  disabled={generateMutation.isPending}
                  className="border-zinc-700 text-zinc-300"
                  data-testid="button-regenerate"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
            </div>

            {!generatedData.validation.passed && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30 mb-4">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <AlertDescription className="text-yellow-400 text-sm">
                  {generatedData.validation.issues.map((issue, i) => (
                    <span key={i} className="block">{issue}</span>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <ScrollArea className="flex-1 pr-4">
              {viewMode === 'edit' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Title</Label>
                    <Input 
                      value={editedContent.title}
                      onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      data-testid="input-title"
                    />
                    <span className="text-xs text-zinc-500">{editedContent.title.length}/60 characters</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Setup Questions (3 curiosity-building questions)</Label>
                    {editedContent.setup_questions?.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xs text-zinc-500 w-6 mt-2">Q{idx + 1}</span>
                        <Textarea 
                          value={q.content}
                          onChange={(e) => {
                            const updated = [...editedContent.setup_questions];
                            updated[idx] = {...updated[idx], content: e.target.value};
                            setEditedContent({...editedContent, setup_questions: updated});
                          }}
                          className="bg-zinc-800 border-zinc-700 text-white text-sm min-h-[60px] flex-1"
                          placeholder={`Question ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Lesson Content</Label>
                    <Textarea 
                      value={editedContent.lesson.content}
                      onChange={(e) => setEditedContent({
                        ...editedContent, 
                        lesson: {...editedContent.lesson, content: e.target.value}
                      })}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[200px]"
                      data-testid="input-lesson-content"
                    />
                    <span className="text-xs text-zinc-500">
                      {editedContent.lesson.content.split(/\s+/).length} words (target: 300-1200)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Key Takeaways</Label>
                    {editedContent.lesson.keyTakeaways?.map((takeaway, idx) => (
                      <Input 
                        key={idx}
                        value={takeaway}
                        onChange={(e) => {
                          const updated = [...editedContent.lesson.keyTakeaways];
                          updated[idx] = e.target.value;
                          setEditedContent({
                            ...editedContent, 
                            lesson: {...editedContent.lesson, keyTakeaways: updated}
                          });
                        }}
                        className="bg-zinc-800 border-zinc-700 text-white text-sm"
                        placeholder={`Takeaway ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Why It Matters</Label>
                    <Textarea 
                      value={editedContent.lesson.whyItMatters}
                      onChange={(e) => setEditedContent({
                        ...editedContent, 
                        lesson: {...editedContent.lesson, whyItMatters: e.target.value}
                      })}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                      data-testid="input-why-it-matters"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Quiz Questions</Label>
                    {editedContent.quiz_questions?.map((q, idx) => (
                      <div key={idx} className="bg-zinc-800 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 w-6">Q{idx + 1}</span>
                          <Input 
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...editedContent.quiz_questions];
                              updated[idx] = {...updated[idx], question: e.target.value};
                              setEditedContent({...editedContent, quiz_questions: updated});
                            }}
                            className="bg-zinc-700 border-zinc-600 text-white text-sm flex-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pl-8">
                          {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                            <div key={letter} className="flex items-center gap-2">
                              <span className={`text-xs w-4 ${q.correctAnswer === optIdx ? 'text-green-400 font-bold' : 'text-zinc-500'}`}>
                                {letter}
                              </span>
                              <Input 
                                value={q[`option${letter}` as keyof typeof q] as string}
                                onChange={(e) => {
                                  const updated = [...editedContent.quiz_questions];
                                  updated[idx] = {...updated[idx], [`option${letter}`]: e.target.value};
                                  setEditedContent({...editedContent, quiz_questions: updated});
                                }}
                                className="bg-zinc-700 border-zinc-600 text-white text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center text-xs text-zinc-500 mb-4">
                    <Smartphone className="w-4 h-4 inline mr-1" />
                    App Preview - How users will see this content
                  </div>
                  
                  <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <Badge className="bg-orange-500/20 text-orange-400 mb-2">Day {dayIndex}</Badge>
                      <h2 className="text-xl font-bold text-white">{editedContent.title}</h2>
                      <p className="text-sm text-zinc-400 mt-1">{editedContent.theme}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h3 className="text-sm font-medium text-orange-400">Before you start...</h3>
                      {editedContent.setup_questions?.map((q, idx) => (
                        <div key={idx} className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                          <p className="text-sm text-zinc-300">{q.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
                      <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Today's Lesson
                      </h3>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {editedContent.lesson.content?.substring(0, 500)}
                          {editedContent.lesson.content?.length > 500 && '...'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30 mb-6">
                      <h3 className="text-sm font-medium text-orange-400 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Key Takeaways
                      </h3>
                      <ul className="space-y-2">
                        {editedContent.lesson.keyTakeaways?.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                            <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
                      <h3 className="text-sm font-medium text-orange-400 mb-2">Why It Matters</h3>
                      <p className="text-sm text-zinc-300">{editedContent.lesson.whyItMatters}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-orange-400 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Quiz ({editedContent.quiz_questions?.length || 0} questions)
                      </h3>
                      {editedContent.quiz_questions?.map((q, idx) => (
                        <div key={idx} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                          <p className="text-sm font-medium text-white mb-3">{idx + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                              <div 
                                key={letter} 
                                className={`p-2 rounded text-sm ${q.correctAnswer === optIdx 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-zinc-800 text-zinc-400'}`}
                              >
                                <span className="font-medium mr-2">{letter}.</span>
                                {q[`option${letter}` as keyof typeof q]}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-zinc-500 mt-2 italic">{q.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-between gap-2 pt-4 border-t border-zinc-800 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
                Cancel
              </Button>
              <Button 
                onClick={() => saveMutation.mutate()}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={saveMutation.isPending}
                data-testid="button-save-content"
              >
                {saveMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Content</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateDayDialog({ open, onOpenChange, nextDayIndex }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  nextDayIndex: number;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dayIndex: nextDayIndex,
    title: "",
    theme: "",
    readingLevel: "8th grade",
    culturalStage: "Normie → Pre-coiner",
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, dayIndex: nextDayIndex }));
  }, [nextDayIndex]);

  const createDayMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/content/days", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ title: "Content day created successfully" });
      onOpenChange(false);
      setFormData({
        dayIndex: nextDayIndex + 1,
        title: "",
        theme: "",
        readingLevel: "8th grade",
        culturalStage: "Normie → Pre-coiner",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Day</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new curriculum day to your content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Day Number</Label>
              <Input 
                type="number"
                value={formData.dayIndex}
                onChange={(e) => setFormData({ ...formData, dayIndex: parseInt(e.target.value) || nextDayIndex })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Theme</Label>
              <Input 
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., Bitcoin basics"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-zinc-300">Title</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter a compelling title for this day"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Reading Level</Label>
              <Input 
                value={formData.readingLevel}
                onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., 8th grade"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Cultural Stage</Label>
              <Input 
                value={formData.culturalStage}
                onChange={(e) => setFormData({ ...formData, culturalStage: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., Normie → Pre-coiner"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button 
              onClick={() => createDayMutation.mutate(formData)}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={createDayMutation.isPending || !formData.title || !formData.theme}
            >
              {createDayMutation.isPending ? "Creating..." : "Create Day"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulkImportDialog({ open, onOpenChange, nextDayIndex }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  nextDayIndex: number;
}) {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<any>(null);

  const sampleJson = `{
  "dayIndex": ${nextDayIndex},
  "title": "Your Compelling Title Here!",
  "theme": "Bitcoin basics",
  "readingLevel": "8th grade",
  "culturalStage": "Normie → Pre-coiner",
  
  "questions": [
    {
      "title": "Why does your grocery bill keep getting bigger?",
      "content": "Understanding the hidden force that makes everything more expensive",
      "category": "Problem Recognition",
      "icon": "shopping-cart"
    },
    {
      "title": "What happens when governments create new money?",
      "content": "Exploring the effects of money printing on your purchasing power",
      "category": "Problem Recognition",
      "icon": "printer"
    },
    {
      "title": "How can you protect your purchasing power?",
      "content": "Discovering Bitcoin as a solution to money debasement",
      "category": "Problem Recognition",
      "icon": "shield"
    }
  ],
  
  "lesson": {
    "title": "Your Money is Being Secretly Devalued",
    "content": "Have you noticed that your grocery bill keeps getting bigger, even when you buy the same items? Or that the rent keeps going up year after year? This isn't just bad luck—it's a predictable result of how modern money works...",
    "keyTakeaways": [
      "Inflation is not random - it's caused by expanding the money supply",
      "Your savings lose purchasing power over time when held in fiat currency",
      "Bitcoin's fixed supply of 21 million coins makes it resistant to debasement"
    ],
    "whyItMatters": "Understanding inflation is the first step to protecting your wealth. When you see how traditional money loses value over time, you can make informed decisions about how to store and grow your hard-earned money.",
    "estimatedReadTime": 4
  },
  
  "quizzes": [
    {
      "question": "What is the primary cause of rising prices over time?",
      "options": ["Greedy corporations", "Supply chain issues", "Expansion of the money supply", "Consumer demand"],
      "correctAnswer": 2,
      "explanation": "While other factors can affect prices temporarily, the consistent rise in prices over decades is primarily caused by the expansion of the money supply. When more money chases the same goods, prices rise."
    },
    {
      "question": "How many Bitcoin will ever exist?",
      "options": ["Unlimited", "21 million", "100 million", "1 billion"],
      "correctAnswer": 1,
      "explanation": "Bitcoin has a hard cap of 21 million coins that will ever exist, making it resistant to the kind of supply expansion that causes inflation in traditional currencies."
    }
  ]
}`;

  const validateContent = (parsed: any): string[] => {
    const errors: string[] = [];
    
    if (typeof parsed.dayIndex !== 'number' || parsed.dayIndex < 1) {
      errors.push("dayIndex must be a positive number");
    }
    if (!parsed.title || typeof parsed.title !== 'string' || parsed.title.trim() === '') {
      errors.push("title is required");
    }
    if (!parsed.theme || typeof parsed.theme !== 'string' || parsed.theme.trim() === '') {
      errors.push("theme is required");
    }
    
    if (parsed.lesson) {
      if (!parsed.lesson.title) errors.push("lesson.title is required");
      if (!parsed.lesson.content) errors.push("lesson.content is required");
    }
    
    if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
      parsed.quizzes.forEach((quiz: any, idx: number) => {
        if (!quiz.question) errors.push(`Quiz ${idx + 1}: question is required`);
        if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
          errors.push(`Quiz ${idx + 1}: needs at least 2 options`);
        }
        if (typeof quiz.correctAnswer !== 'number' || quiz.correctAnswer < 0 || quiz.correctAnswer >= (quiz.options?.length || 0)) {
          errors.push(`Quiz ${idx + 1}: correctAnswer is invalid`);
        }
      });
    }
    
    if (parsed.questions && Array.isArray(parsed.questions)) {
      parsed.questions.forEach((q: any, idx: number) => {
        if (!q.title) errors.push(`Question ${idx + 1}: title is required`);
        if (!q.content) errors.push(`Question ${idx + 1}: content is required`);
      });
    }
    
    return errors;
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setParseError(null);
    setParsedContent(null);
    
    if (!value.trim()) return;
    
    try {
      const parsed = JSON.parse(value);
      const validationErrors = validateContent(parsed);
      
      if (validationErrors.length > 0) {
        setParseError(validationErrors.join("; "));
        return;
      }
      
      setParsedContent(parsed);
    } catch (e: any) {
      setParseError(`Invalid JSON: ${e.message}`);
    }
  };

  const importMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/content/bulk-import", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content/days"] });
      toast({ 
        title: "Content imported successfully!",
        description: `Day ${data.day.dayIndex} created with ${data.summary.quizzesCreated} quizzes and ${data.summary.questionsCreated} questions`
      });
      onOpenChange(false);
      setJsonInput("");
      setParsedContent(null);
    },
    onError: (error: Error) => {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-500" />
            Bulk Import Content
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Paste JSON from Claude to import a complete day. Maps to Learn page: questions → Learning Preview, lesson → Today's Lesson, quizzes → Knowledge Check
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">JSON Content</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleJsonChange(sampleJson)}
                className="text-xs text-orange-500 hover:text-orange-400"
              >
                <FileJson className="w-3 h-3 mr-1" />
                Load Sample
              </Button>
            </div>
            <Textarea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Paste your JSON content here..."
              className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm min-h-[300px]"
            />
          </div>

          {parseError && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <AlertDescription className="text-red-400">{parseError}</AlertDescription>
            </Alert>
          )}

          {parsedContent && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Preview - Ready to Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Day:</span>
                  <span className="text-white font-medium">{parsedContent.dayIndex}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Title:</span>
                  <span className="text-white">{parsedContent.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Theme:</span>
                  <span className="text-zinc-300">{parsedContent.theme}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-zinc-700">
                  <span className="text-zinc-400">
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    {parsedContent.questions?.length || 0} Learning Preview
                  </span>
                  <span className="text-zinc-400">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {parsedContent.lesson ? "Today's Lesson" : "No lesson"}
                  </span>
                  <span className="text-zinc-400">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {parsedContent.quizzes?.length || 0} Knowledge Check
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300">
              Cancel
            </Button>
            <Button 
              onClick={() => importMutation.mutate(parsedContent)}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={importMutation.isPending || !parsedContent}
            >
              {importMutation.isPending ? "Importing..." : "Import Content"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getWeekNumber(dayIndex: number): number {
  return Math.ceil(dayIndex / 7);
}

function getDaysForWeek(days: ContentDay[], weekNumber: number): ContentDay[] {
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = weekNumber * 7;
  return days.filter(d => d.dayIndex >= startDay && d.dayIndex <= endDay).sort((a, b) => a.dayIndex - b.dayIndex);
}

function getWeekStats(days: ContentDay[]): { live: number; approved: number; review: number; draft: number } {
  return {
    live: days.filter(d => d.status === 'live').length,
    approved: days.filter(d => d.status === 'approved').length,
    review: days.filter(d => d.status === 'review').length,
    draft: days.filter(d => d.status === 'draft').length,
  };
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDay, setEditingDay] = useState<ContentDay | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const [selectedWeek, setSelectedWeek] = useState<number | null>(1);

  const { data: contentDays, isLoading } = useQuery<ContentDay[]>({
    queryKey: ["/api/admin/content/days"],
  });

  const filteredDays = contentDays?.filter(day => 
    day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.dayIndex.toString().includes(searchQuery)
  );

  const nextDayIndex = contentDays ? Math.max(...contentDays.map(d => d.dayIndex), 0) + 1 : 1;
  
  const totalWeeks = contentDays ? Math.ceil(Math.max(...contentDays.map(d => d.dayIndex), 0) / 7) : 0;
  const weeks = Array.from({ length: Math.max(totalWeeks, 26) }, (_, i) => i + 1);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekNumber)) {
        next.delete(weekNumber);
      } else {
        next.add(weekNumber);
      }
      return next;
    });
    setSelectedWeek(weekNumber);
  };

  const handleEdit = (day: ContentDay) => {
    setEditingDay(day);
    setEditDialogOpen(true);
  };

  const daysToShow = selectedWeek && !searchQuery 
    ? getDaysForWeek(filteredDays || [], selectedWeek)
    : filteredDays;

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Content Management</h1>
              <p className="text-zinc-400">Manage daily curriculum content ({contentDays?.length || 0} days)</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800" 
                onClick={() => setImportDialogOpen(true)}
                data-testid="button-import-content"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500" 
                onClick={() => setAiGenerateDialogOpen(true)}
                data-testid="button-ai-generate"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600" 
                onClick={() => setCreateDialogOpen(true)}
                data-testid="button-add-day"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search by title, theme, or day number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              data-testid="input-search-content"
            />
          </div>

          <div className="flex gap-6">
            <div className="w-64 flex-shrink-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Weeks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1">
                      {weeks.map(weekNum => {
                        const weekDays = getDaysForWeek(contentDays || [], weekNum);
                        const stats = getWeekStats(weekDays);
                        const isExpanded = expandedWeeks.has(weekNum);
                        const isSelected = selectedWeek === weekNum;
                        const hasContent = weekDays.length > 0;
                        
                        return (
                          <Collapsible 
                            key={weekNum} 
                            open={isExpanded}
                            onOpenChange={() => toggleWeek(weekNum)}
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
                                  isSelected 
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                }`}
                                data-testid={`button-week-${weekNum}`}
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                  <span className="font-medium">Week {weekNum}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {hasContent && (
                                    <>
                                      {stats.live > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-green-500" title={`${stats.live} live`} />
                                      )}
                                      {stats.approved > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500" title={`${stats.approved} approved`} />
                                      )}
                                      {stats.review > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-yellow-500" title={`${stats.review} in review`} />
                                      )}
                                      {stats.draft > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-zinc-500" title={`${stats.draft} draft`} />
                                      )}
                                    </>
                                  )}
                                  <span className="text-xs ml-1">{weekDays.length}/7</span>
                                </div>
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-6 mt-1 space-y-1">
                                {weekDays.length > 0 ? (
                                  weekDays.map(day => {
                                    const statusConfig = STATUS_CONFIG[day.status] || STATUS_CONFIG.draft;
                                    return (
                                      <button
                                        key={day.id}
                                        onClick={() => handleEdit(day)}
                                        className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                        data-testid={`button-day-${day.dayIndex}`}
                                      >
                                        <span className="truncate">Day {day.dayIndex}</span>
                                        <span className={`w-2 h-2 rounded-full ${statusConfig.bgColor.replace('/20', '')}`} />
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="text-xs text-zinc-600 px-2 py-1">No days yet</div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : daysToShow && daysToShow.length > 0 ? (
                  daysToShow.map((day) => (
                    <ContentDayCard 
                      key={day.id} 
                      day={day} 
                      onEdit={() => handleEdit(day)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    {searchQuery 
                      ? "No content days match your search" 
                      : selectedWeek 
                        ? `No content for Week ${selectedWeek} yet. Click 'Add Day' to create content.`
                        : "No content days found. Click 'Add Day' to create your first one."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <EditDayDialog 
            day={editingDay} 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
          />
          
          <CreateDayDialog 
            open={createDialogOpen} 
            onOpenChange={setCreateDialogOpen}
            nextDayIndex={nextDayIndex}
          />
          
          <BulkImportDialog 
            open={importDialogOpen} 
            onOpenChange={setImportDialogOpen}
            nextDayIndex={nextDayIndex}
          />
          
          <AIGenerateDialog 
            open={aiGenerateDialogOpen} 
            onOpenChange={setAiGenerateDialogOpen}
            nextDayIndex={nextDayIndex}
          />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
