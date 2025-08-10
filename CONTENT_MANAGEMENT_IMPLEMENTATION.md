# Content Management System Implementation Guide

## Overview
This document outlines the implementation of a robust content management system for HODLearn that allows safe, efficient creation and management of the 180-day Bitcoin education curriculum.

## Current Content Status

### Completed Content
- **Day 1**: Complete curriculum implementation
  - 3 Daily Facts (setup questions)
  - 1 Comprehensive Lesson (2,000+ words)
  - 5 Quiz Questions with explanations
  - Fully functional and tested

### Content Gap Analysis
- **Days 2-180**: Need complete curriculum creation
- **Video Content**: 30 expert videos integrated, need engagement optimization
- **Simulator Content**: Frameworks exist, need content population
- **Community Content**: Forum structure exists, need moderation tools

## Content Management Architecture

### Database Schema for Content Management

```typescript
// Content versioning and workflow
export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'lesson', 'fact', 'quiz'
  contentId: integer("content_id").notNull(),
  version: integer("version").notNull().default(1),
  content: json("content").notNull(),
  status: text("status").notNull().default("draft"), // 'draft', 'review', 'published', 'archived'
  createdBy: integer("created_by").notNull().references(() => users.id),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Content scheduling
export const contentSchedule = pgTable("content_schedule", {
  id: serial("id").primaryKey(),
  dayIndex: integer("day_index").notNull().unique(),
  scheduledDate: date("scheduled_date"),
  contentStatus: text("content_status").notNull().default("pending"), // 'pending', 'ready', 'published'
  assignedTo: integer("assigned_to").references(() => users.id),
  deadline: timestamp("deadline"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Content templates for consistency
export const contentTemplates = pgTable("content_templates", {
  id: serial("id").primaryKey(),
  templateType: text("template_type").notNull(), // 'lesson', 'fact', 'quiz'
  name: text("name").notNull(),
  structure: json("structure").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Content quality metrics
export const contentMetrics = pgTable("content_metrics", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(),
  contentId: integer("content_id").notNull(),
  dayIndex: integer("day_index").notNull(),
  completionRate: decimal("completion_rate"),
  avgTimeSpent: integer("avg_time_spent"), // seconds
  userRating: decimal("user_rating"),
  difficultyScore: decimal("difficulty_score"),
  engagementScore: decimal("engagement_score"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});
```

### Admin Portal Implementation

#### 1. Content Creation Interface

```typescript
// Admin content creation API
export function registerContentManagementRoutes(app: Express) {
  // Content dashboard
  app.get('/api/admin/content/dashboard', adminAuth, async (req, res) => {
    const stats = await db
      .select({
        totalDays: count(),
        completedDays: sum(case().when(eq(contentSchedule.contentStatus, 'published'), 1).else(0)),
        pendingDays: sum(case().when(eq(contentSchedule.contentStatus, 'pending'), 1).else(0)),
        draftCount: count(contentVersions.id).where(eq(contentVersions.status, 'draft')),
      })
      .from(contentSchedule)
      .leftJoin(contentVersions, eq(contentSchedule.dayIndex, contentVersions.contentId));
    
    res.json(stats[0]);
  });

  // Create new lesson
  app.post('/api/admin/content/lesson', adminAuth, async (req, res) => {
    const lessonSchema = z.object({
      dayIndex: z.number().min(1).max(180),
      title: z.string().min(10).max(200),
      content: z.string().min(500),
      keyTakeaways: z.array(z.string()).min(3).max(5),
      whyItMatters: z.string().min(100),
      estimatedReadTime: z.number().min(1).max(10),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      tags: z.array(z.string()).optional(),
    });

    const validated = lessonSchema.parse(req.body);
    
    // Check if day exists
    let contentDay = await db
      .select()
      .from(contentDays)
      .where(eq(contentDays.dayIndex, validated.dayIndex))
      .limit(1);

    if (contentDay.length === 0) {
      // Create day if it doesn't exist
      contentDay = await db
        .insert(contentDays)
        .values({
          dayIndex: validated.dayIndex,
          title: validated.title,
          description: `Day ${validated.dayIndex} curriculum content`,
          isActive: false, // Start as inactive until all content is ready
        })
        .returning();
    }

    // Create lesson
    const lesson = await db
      .insert(contentLessons)
      .values({
        dayId: contentDay[0].id,
        title: validated.title,
        content: validated.content,
        keyTakeaways: validated.keyTakeaways,
        whyItMatters: validated.whyItMatters,
        estimatedReadTime: validated.estimatedReadTime,
      })
      .returning();

    // Create content version for tracking
    await db.insert(contentVersions).values({
      contentType: 'lesson',
      contentId: lesson[0].id,
      content: validated,
      status: 'draft',
      createdBy: req.user.id,
    });

    res.json({ success: true, lesson: lesson[0] });
  });

  // Create daily facts
  app.post('/api/admin/content/facts', adminAuth, async (req, res) => {
    const factsSchema = z.object({
      dayIndex: z.number().min(1).max(180),
      facts: z.array(z.object({
        title: z.string().min(5).max(100),
        content: z.string().min(50).max(500),
        category: z.enum(['technology', 'economics', 'history', 'practical']),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      })).min(3).max(5),
    });

    const validated = factsSchema.parse(req.body);
    
    // Get or create content day
    let contentDay = await db
      .select()
      .from(contentDays)
      .where(eq(contentDays.dayIndex, validated.dayIndex))
      .limit(1);

    if (contentDay.length === 0) {
      contentDay = await db
        .insert(contentDays)
        .values({
          dayIndex: validated.dayIndex,
          title: `Day ${validated.dayIndex}`,
          description: `Day ${validated.dayIndex} curriculum content`,
          isActive: false,
        })
        .returning();
    }

    // Create facts
    const facts = [];
    for (let i = 0; i < validated.facts.length; i++) {
      const fact = validated.facts[i];
      const savedFact = await db
        .insert(contentSetUpQuestions)
        .values({
          dayId: contentDay[0].id,
          title: fact.title,
          content: fact.content,
          category: fact.category,
          icon: getCategoryIcon(fact.category),
          orderIndex: i,
        })
        .returning();
      
      facts.push(savedFact[0]);
    }

    res.json({ success: true, facts });
  });

  // Create quiz questions
  app.post('/api/admin/content/quiz', adminAuth, async (req, res) => {
    const quizSchema = z.object({
      dayIndex: z.number().min(1).max(180),
      questions: z.array(z.object({
        question: z.string().min(20).max(300),
        options: z.array(z.string()).length(4),
        correctAnswer: z.number().min(0).max(3),
        explanation: z.string().min(50).max(500),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        category: z.string(),
      })).min(4).max(6),
    });

    const validated = quizSchema.parse(req.body);
    
    // Get content day
    const contentDay = await db
      .select()
      .from(contentDays)
      .where(eq(contentDays.dayIndex, validated.dayIndex))
      .limit(1);

    if (contentDay.length === 0) {
      return res.status(404).json({ error: 'Content day not found. Create lesson and facts first.' });
    }

    // Create quiz questions
    const questions = [];
    for (let i = 0; i < validated.questions.length; i++) {
      const q = validated.questions[i];
      const savedQuestion = await db
        .insert(contentQuizQuestions)
        .values({
          dayId: contentDay[0].id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          orderIndex: i,
        })
        .returning();
      
      questions.push(savedQuestion[0]);
    }

    res.json({ success: true, questions });
  });
}

function getCategoryIcon(category: string): string {
  const icons = {
    'technology': '⚡',
    'economics': '💰',
    'history': '📚',
    'practical': '🛠️'
  };
  return icons[category] || '💡';
}
```

#### 2. Content Review and Publishing Workflow

```typescript
// Content review system
app.put('/api/admin/content/review/:versionId', adminAuth, async (req, res) => {
  const { versionId } = req.params;
  const { status, reviewNotes } = req.body;
  
  if (!['approved', 'rejected', 'needs_revision'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  await db
    .update(contentVersions)
    .set({
      status: status === 'approved' ? 'review' : 'draft',
      reviewedBy: req.user.id,
      reviewNotes,
    })
    .where(eq(contentVersions.id, parseInt(versionId)));

  res.json({ success: true });
});

// Publish content
app.post('/api/admin/content/publish/:dayIndex', adminAuth, async (req, res) => {
  const dayIndex = parseInt(req.params.dayIndex);
  
  // Verify all content exists for the day
  const contentDay = await db
    .select()
    .from(contentDays)
    .where(eq(contentDays.dayIndex, dayIndex))
    .limit(1);

  if (contentDay.length === 0) {
    return res.status(404).json({ error: 'Content day not found' });
  }

  // Check if lesson exists
  const lesson = await db
    .select()
    .from(contentLessons)
    .where(eq(contentLessons.dayId, contentDay[0].id))
    .limit(1);

  // Check if facts exist
  const facts = await db
    .select()
    .from(contentSetUpQuestions)
    .where(eq(contentSetUpQuestions.dayId, contentDay[0].id));

  // Check if quiz exists
  const quiz = await db
    .select()
    .from(contentQuizQuestions)
    .where(eq(contentQuizQuestions.dayId, contentDay[0].id));

  if (lesson.length === 0 || facts.length < 3 || quiz.length < 4) {
    return res.status(400).json({ 
      error: 'Incomplete content. Day must have lesson, 3+ facts, and 4+ quiz questions.' 
    });
  }

  // Activate the day
  await db
    .update(contentDays)
    .set({ isActive: true })
    .where(eq(contentDays.id, contentDay[0].id));

  // Update content schedule
  await db
    .insert(contentSchedule)
    .values({
      dayIndex,
      contentStatus: 'published',
      scheduledDate: new Date().toISOString().split('T')[0],
    })
    .onConflictDoUpdate({
      target: contentSchedule.dayIndex,
      set: { contentStatus: 'published' }
    });

  res.json({ success: true, message: `Day ${dayIndex} published successfully` });
});
```

#### 3. Content Templates and Bulk Creation

```typescript
// Content templates for consistency
const contentTemplates = {
  lesson: {
    structure: {
      introduction: "Hook the reader with immediate relevance",
      mainContent: "Explain the concept with real-world examples",
      keyTakeaways: ["3-5 bullet points of main learnings"],
      whyItMatters: "Connect to personal financial impact",
      nextSteps: "What the user should do next"
    },
    lengthGuidelines: {
      introduction: "2-3 sentences",
      mainContent: "300-500 words",
      keyTakeaways: "10-15 words each",
      whyItMatters: "100-150 words"
    }
  },
  fact: {
    structure: {
      title: "Attention-grabbing question or statement",
      content: "Concise explanation with concrete example",
      category: "technology, economics, history, or practical"
    },
    lengthGuidelines: {
      title: "5-15 words",
      content: "50-150 words"
    }
  },
  quiz: {
    structure: {
      question: "Clear, specific question",
      options: ["4 options with 1 clearly correct answer"],
      explanation: "Why the answer is correct and others are wrong"
    },
    guidelines: {
      "Avoid trick questions",
      "Make incorrect options plausible but clearly wrong",
      "Explanations should teach, not just confirm"
    }
  }
};

// Bulk content creation from CSV/JSON
app.post('/api/admin/content/bulk-import', adminAuth, upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    let content;
    if (file.mimetype === 'application/json') {
      content = JSON.parse(file.buffer.toString());
    } else if (file.mimetype === 'text/csv') {
      content = parseCSV(file.buffer.toString());
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const results = [];
    for (const item of content) {
      try {
        if (item.type === 'lesson') {
          const lesson = await createLesson(item);
          results.push({ success: true, type: 'lesson', id: lesson.id });
        } else if (item.type === 'facts') {
          const facts = await createFacts(item);
          results.push({ success: true, type: 'facts', count: facts.length });
        } else if (item.type === 'quiz') {
          const quiz = await createQuiz(item);
          results.push({ success: true, type: 'quiz', count: quiz.length });
        }
      } catch (error) {
        results.push({ success: false, error: error.message, item });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(400).json({ error: 'Failed to process file: ' + error.message });
  }
});
```

#### 4. Content Analytics and Optimization

```typescript
// Content performance analytics
app.get('/api/admin/analytics/content/:dayIndex', adminAuth, async (req, res) => {
  const dayIndex = parseInt(req.params.dayIndex);
  
  const analytics = await db
    .select({
      dayIndex,
      totalUsers: count(userDailyProgress.userId),
      completionRate: avg(
        case()
          .when(userDailyProgress.lessonCompleted, 1)
          .else(0)
      ),
      avgQuizScore: avg(
        sql`(
          SELECT COUNT(*) * 1.0 / (
            SELECT COUNT(*) FROM content_quiz_questions 
            WHERE day_id = (
              SELECT id FROM content_days WHERE day_index = ${dayIndex}
            )
          )
          FROM user_quiz_answers uqa
          JOIN content_quiz_questions cqq ON uqa.question_id = cqq.id
          WHERE uqa.user_id = user_daily_progress.user_id 
          AND uqa.is_correct = true
          AND cqq.day_id = (
            SELECT id FROM content_days WHERE day_index = ${dayIndex}
          )
        )`
      ),
      avgTimeSpent: avg(
        sql`EXTRACT(EPOCH FROM (completed_at - created_at))`
      ),
      dropoffRate: avg(
        case()
          .when(and(
            userDailyProgress.factsCompleted,
            not(userDailyProgress.lessonCompleted)
          ), 1)
          .else(0)
      )
    })
    .from(userDailyProgress)
    .where(eq(userDailyProgress.dayIndex, dayIndex))
    .groupBy(userDailyProgress.dayIndex);

  res.json(analytics[0] || { dayIndex, noData: true });
});

// Content quality scoring
app.get('/api/admin/quality/day/:dayIndex', adminAuth, async (req, res) => {
  const dayIndex = parseInt(req.params.dayIndex);
  
  // Calculate quality metrics
  const qualityScore = await calculateContentQuality(dayIndex);
  
  res.json({
    dayIndex,
    qualityScore,
    recommendations: generateQualityRecommendations(qualityScore)
  });
});

async function calculateContentQuality(dayIndex: number) {
  // Implementation of quality scoring algorithm
  // Based on completion rates, time spent, quiz scores, user feedback
  return {
    overall: 85,
    engagement: 90,
    difficulty: 75,
    clarity: 88,
    relevance: 92
  };
}
```

## Content Creation Workflow

### Phase 1: Content Planning (Week 1)
1. **Curriculum Outline Review**
   - Validate 180-day progression plan
   - Identify key learning objectives for each week
   - Map difficulty progression curve

2. **Content Templates Setup**
   - Implement template system
   - Create style guidelines
   - Set up quality checklists

### Phase 2: Bulk Content Creation (Weeks 2-3)
1. **Week 1 Content (Days 2-7)** - Priority 1
   - Focus on foundational concepts
   - Build on Day 1 momentum
   - Critical for free user experience

2. **Week 2 Content (Days 8-14)** - Priority 1
   - First paywall content
   - Must demonstrate premium value
   - Introduction to intermediate concepts

3. **Month 1 Content (Days 15-30)** - Priority 2
   - Solidify user habits
   - Introduce practical applications
   - Build towards simulators

### Phase 3: Quality Assurance (Week 4)
1. **Content Review Process**
   - Peer review system
   - Quality scoring implementation
   - User testing with small group

2. **Performance Optimization**
   - A/B testing setup
   - Analytics implementation
   - Feedback collection system

## Content Management Best Practices

### Writing Guidelines
1. **Tone and Voice**
   - Conversational but authoritative
   - Avoid jargon without explanation
   - Use "you" to make it personal

2. **Structure Consistency**
   - Start with immediate relevance
   - Use concrete examples
   - End with actionable insights

3. **Difficulty Progression**
   - Week 1: Pure beginner concepts
   - Month 1: Basic practical applications
   - Month 3: Intermediate technical concepts
   - Month 6: Advanced strategic thinking

### Quality Control Checklist
- [ ] Content follows template structure
- [ ] Length guidelines met
- [ ] No spelling or grammar errors
- [ ] Examples are current and relevant
- [ ] Key takeaways are actionable
- [ ] Quiz questions test understanding, not memorization
- [ ] Explanations teach concepts clearly

### Content Metrics to Track
1. **Engagement Metrics**
   - Completion rates by content type
   - Time spent on each section
   - User progression patterns

2. **Learning Effectiveness**
   - Quiz scores and improvement over time
   - User feedback and ratings
   - Knowledge retention testing

3. **Business Impact**
   - Conversion rates at paywall
   - Content that drives upgrades
   - User lifetime value by cohort

This content management system will enable efficient, scalable content creation while maintaining high quality standards essential for user engagement and learning effectiveness.