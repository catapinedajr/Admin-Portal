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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Unlock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentDay {
  id: number;
  dayIndex: number;
  title: string;
  readingLevel: string;
  culturalStage: string;
  theme: string;
  isActive: boolean;
  isApproved: boolean;
  questionsCount: number;
  lessonsCount: number;
  quizzesCount: number;
}

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
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer" onClick={onEdit}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-orange-500 font-bold">Day {day.dayIndex}</span>
              {day.isApproved ? (
                <Badge className="bg-green-500/20 text-green-400 border-0">Approved</Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-0">Pending</Badge>
              )}
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
    isActive: true,
    isApproved: false,
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
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  
  const { data: lesson, isLoading: lessonLoading } = useQuery<ContentLesson>({
    queryKey: ["/api/admin/content/lessons", day?.id],
    enabled: !!day?.id && open,
  });
  
  const { data: quizzes, isLoading: quizzesLoading } = useQuery<ContentQuiz[]>({
    queryKey: ["/api/admin/content/quizzes", day?.id],
    enabled: !!day?.id && open,
  });
  
  const { data: questions, isLoading: questionsLoading } = useQuery<ContentQuestion[]>({
    queryKey: ["/api/admin/content/questions", day?.id],
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

  useEffect(() => {
    if (day) {
      setFormData({
        title: day.title,
        theme: day.theme,
        readingLevel: day.readingLevel,
        culturalStage: day.culturalStage,
        isActive: day.isActive,
        isApproved: day.isApproved,
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
              <label className="flex items-center gap-2 text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="rounded"
                  disabled={detailsLocked}
                />
                Approved
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
          </TabsContent>

          <TabsContent value="lesson" className="mt-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                {lesson ? "Lesson Content" : "Create New Lesson"}
              </Label>
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
  "lesson": {
    "title": "Lesson Title",
    "content": "Full lesson content goes here...",
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "whyItMatters": "Explanation of why this matters...",
    "estimatedReadTime": 3
  },
  "quizzes": [
    {
      "question": "What is the question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct..."
    }
  ],
  "questions": [
    {
      "title": "Setup Question Title",
      "content": "Question content for user reflection...",
      "category": "financial",
      "icon": "💰"
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
            Paste JSON from your Claude conversations to import a complete day with lesson, quizzes, and questions
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
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {parsedContent.lesson ? "1 lesson" : "No lesson"}
                  </span>
                  <span className="text-zinc-400">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {parsedContent.quizzes?.length || 0} quizzes
                  </span>
                  <span className="text-zinc-400">
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    {parsedContent.questions?.length || 0} questions
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

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDay, setEditingDay] = useState<ContentDay | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const { data: contentDays, isLoading } = useQuery<ContentDay[]>({
    queryKey: ["/api/admin/content/days"],
  });

  const filteredDays = contentDays?.filter(day => 
    day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.dayIndex.toString().includes(searchQuery)
  );

  const nextDayIndex = contentDays ? Math.max(...contentDays.map(d => d.dayIndex), 0) + 1 : 1;

  const handleEdit = (day: ContentDay) => {
    setEditingDay(day);
    setEditDialogOpen(true);
  };

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

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredDays && filteredDays.length > 0 ? (
              filteredDays.map((day) => (
                <ContentDayCard 
                  key={day.id} 
                  day={day} 
                  onEdit={() => handleEdit(day)}
                />
              ))
            ) : (
              <div className="text-center py-12 text-zinc-400">
                {searchQuery ? "No content days match your search" : "No content days found. Click 'Add Day' to create your first one."}
              </div>
            )}
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
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
