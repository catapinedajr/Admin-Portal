# HODLearn Technical Architecture Deep Dive

## Current Codebase Analysis

### File Structure Overview
```
hodlearn/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Route components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configurations
│   │   └── App.tsx           # Main application component
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── server/                    # Express.js backend
│   ├── db.ts                 # Database connection
│   ├── storage.ts            # Data access layer
│   ├── routes.ts             # API endpoints
│   ├── auth.ts               # Authentication logic
│   ├── bitcoin-price.ts      # Price fetching service
│   ├── video-routes.ts       # Video engagement APIs
│   ├── wallet-routes.ts      # Wallet and earnings APIs
│   └── index.ts              # Server entry point
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Database schema definitions
├── package.json              # Root dependencies
├── vite.config.ts            # Build configuration
├── tailwind.config.ts        # Styling configuration
└── drizzle.config.ts         # Database configuration
```

### Database Schema Details

#### Core Tables
```typescript
// Users - Authentication and profile
users: {
  id: serial primary key
  username: text unique
  passwordHash: text
  email: text unique
  firstName, lastName: text
  currentStreak, longestStreak: integer
  completedLessons: integer
  lastActivityDate: text (YYYY-MM-DD)
  termsAcceptedAt: timestamp
  createdAt: timestamp
}

// Content Management
contentDays: {
  id: serial primary key
  dayIndex: integer unique
  title: text
  description: text
  isActive: boolean
  unlocksAt: timestamp
}

contentSetUpQuestions: {  // Daily facts
  id: serial primary key
  dayId: integer -> contentDays
  title: text
  content: text
  category: text
  icon: text
  orderIndex: integer
}

contentLessons: {
  id: serial primary key
  dayId: integer -> contentDays
  title: text
  content: text (rich text)
  keyTakeaways: text[]
  whyItMatters: text
  estimatedReadTime: integer
}

contentQuizQuestions: {
  id: serial primary key
  dayId: integer -> contentDays
  question: text
  options: text[]
  correctAnswer: integer
  explanation: text
  orderIndex: integer
}

// Progress Tracking
userDailyProgress: {
  id: serial primary key
  userId: integer -> users
  dayIndex: integer
  factsCompleted: boolean
  lessonCompleted: boolean
  quizCompleted: boolean
  completedAt: timestamp
  earnedSats: integer
}

userQuizAnswers: {
  id: serial primary key
  userId: integer -> users
  questionId: integer -> contentQuizQuestions
  selectedAnswer: integer
  isCorrect: boolean
  answeredAt: timestamp
  date: text (YYYY-MM-DD)
}

// Wallet System
walletEarnings: {
  id: serial primary key
  userId: integer -> users
  dayIndex: integer
  earningType: text (quiz_correct, video_engagement, etc.)
  satoshisEarned: integer
  streakMultiplier: decimal
  bitcoinPriceUsd: decimal
  usdValueAtEarning: decimal
  description: text
  earnedAt: timestamp
  date: text (YYYY-MM-DD)
}

userWalletProgress: {
  id: serial primary key
  userId: integer -> users unique
  totalSatoshisEarned: integer
  currentStreakMultiplier: decimal
  lastEarningDate: text
  createdAt, updatedAt: timestamp
}

// Video Engagement
userVideoEngagement: {
  id: serial primary key
  userId: integer -> users
  videoId: text (YouTube ID)
  watchedAt: timestamp
  progressPercent: integer
  completed: boolean
  completedAt: timestamp
  rewardEarned: integer
  totalWatchTime: integer (seconds)
  lastPosition: integer (seconds)
}

videoReactions: {
  id: serial primary key
  userId: integer -> users
  videoId: text
  reactionType: text (rocket, mind_blown, etc.)
  createdAt: timestamp
}

videoComments: {
  id: serial primary key
  userId: integer -> users
  videoId: text
  content: text
  timestamp: integer (video position)
  createdAt: timestamp
}

videoCommentLikes: {
  id: serial primary key
  userId: integer -> users
  commentId: integer -> videoComments
  createdAt: timestamp
}

videoStats: {
  id: serial primary key
  videoId: text unique
  totalViews: integer
  totalComments: integer
  totalReactions: integer
  avgWatchTime: integer
  completionRate: decimal
  lastUpdated: timestamp
}
```

#### Missing Tables for Production
```typescript
// Subscription Management (CRITICAL)
userSubscriptions: {
  id: serial primary key
  userId: integer -> users
  subscriptionType: text (free, premium)
  stripeCustomerId: text
  stripeSubscriptionId: text
  currentPeriodStart: timestamp
  currentPeriodEnd: timestamp
  status: text (active, canceled, past_due)
  createdAt: timestamp
}

// Content Management (CRITICAL)
contentVersions: {
  id: serial primary key
  contentType: text (lesson, fact, quiz)
  contentId: integer
  version: integer
  content: jsonb
  status: text (draft, published, archived)
  createdBy: integer -> users
  createdAt: timestamp
}

// Analytics (IMPORTANT)
userEvents: {
  id: serial primary key
  userId: integer -> users
  eventType: text
  properties: jsonb
  timestamp: timestamp
}

// Forum/Community (EXISTING - already implemented)
forumCategories, forumPosts, forumReplies: { ... }
```

### API Endpoint Analysis

#### Current Endpoints
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/user
GET  /api/user/stats

// Content Access
GET  /api/day-metadata/:dayIndex
GET  /api/daily-facts/:dayIndex
GET  /api/lesson/:dayIndex
GET  /api/quiz/daily/:dayIndex
POST /api/quiz/answer

// Progress Tracking
GET  /api/day-completed/:userId/:dayIndex
GET  /api/day-access/:userId/:dayIndex
GET  /api/next-available-day/:userId

// Wallet System
GET  /api/wallet/dashboard
GET  /api/wallet/progress
GET  /api/wallet/earnings

// Video System
GET  /api/videos/:videoId/stats
GET  /api/videos/:videoId/comments
POST /api/videos/progress
POST /api/videos/reaction
POST /api/videos/comment

// External Data
GET  /api/bitcoin-price

// Community
GET  /api/daily-discussions
GET  /api/forum/categories
```

#### Missing Critical Endpoints
```typescript
// Subscription Management
POST /api/subscriptions/create
POST /api/subscriptions/cancel
GET  /api/subscriptions/status
POST /api/stripe/webhook

// Content Management (Admin)
POST /api/admin/content/lesson
PUT  /api/admin/content/lesson/:id
GET  /api/admin/content/preview
POST /api/admin/content/publish

// Analytics
POST /api/analytics/event
GET  /api/admin/analytics/dashboard

// Paywall Enforcement
GET  /api/access/check/:dayIndex  // Checks subscription status
```

### Security Analysis

#### Current Security Measures
- Password hashing with bcryptjs
- Session-based authentication
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM

#### Security Gaps to Address
```typescript
// Rate Limiting (CRITICAL)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// CORS Configuration (IMPORTANT)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// Security Headers (IMPORTANT)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// API Key Validation (CRITICAL)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};
```

### Performance Optimization Opportunities

#### Database Optimization
```sql
-- Current missing indexes (CRITICAL)
CREATE INDEX CONCURRENTLY idx_user_progress_lookup 
ON user_daily_progress(user_id, day_index);

CREATE INDEX CONCURRENTLY idx_wallet_earnings_user_date 
ON wallet_earnings(user_id, date DESC);

CREATE INDEX CONCURRENTLY idx_video_engagement_user 
ON user_video_engagement(user_id, video_id);

CREATE INDEX CONCURRENTLY idx_quiz_answers_user_date 
ON user_quiz_answers(user_id, date);

-- Connection pooling optimization
-- Current: Single connection
-- Recommended: Pool of 10-20 connections
```

#### Caching Strategy
```typescript
// Redis caching implementation needed
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache Bitcoin price for 1 minute
const getCachedBitcoinPrice = async () => {
  const cached = await client.get('bitcoin_price');
  if (cached) return JSON.parse(cached);
  
  const fresh = await fetchBitcoinPrice();
  await client.setex('bitcoin_price', 60, JSON.stringify(fresh));
  return fresh;
};

// Cache user progress for 5 minutes
const getCachedUserProgress = async (userId) => {
  const key = `user_progress_${userId}`;
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  const fresh = await storage.getUserProgress(userId);
  await client.setex(key, 300, JSON.stringify(fresh));
  return fresh;
};
```

#### Frontend Optimization
```typescript
// Lazy loading implementation needed
const VideoPlayer = lazy(() => import('./VideoPlayer'));
const BitcoinPriceChart = lazy(() => import('./BitcoinPriceChart'));

// Service worker for PWA caching
// Currently missing - need to implement

// Bundle size optimization
// Current bundle: ~2MB
// Target: <500KB initial load
```

### Deployment Architecture

#### Current Replit Limitations
- Single-core CPU limitation
- Memory constraints for 10K users
- No horizontal scaling capability
- Limited database connection pooling

#### Production Architecture Recommendation
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel CDN    │────│   Load Balancer  │────│  App Instances  │
│   (Frontend)    │    │                  │    │   (Railway)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Redis Cache   │────│   Application    │────│  PostgreSQL     │
│   (Session)     │    │   Servers        │    │   (Neon)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Stripe API    │────│   External APIs  │────│  CoinGecko API  │
│   (Payments)    │    │                  │    │  (Price Data)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Critical Implementation Tasks

#### Week 1: Infrastructure Foundation
```typescript
// Environment configuration
const config = {
  development: {
    database: process.env.DEV_DATABASE_URL,
    redis: process.env.DEV_REDIS_URL,
    stripe: process.env.STRIPE_TEST_KEY,
  },
  staging: {
    database: process.env.STAGING_DATABASE_URL,
    redis: process.env.STAGING_REDIS_URL,
    stripe: process.env.STRIPE_TEST_KEY,
  },
  production: {
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
    stripe: process.env.STRIPE_LIVE_KEY,
  }
};

// CI/CD Pipeline setup
// GitHub Actions or Railway deployment
```

#### Week 2: Paywall Implementation
```typescript
// Subscription middleware
const requireSubscription = async (req, res, next) => {
  const user = req.user;
  const dayIndex = parseInt(req.params.dayIndex);
  
  // Free access for days 1-7
  if (dayIndex <= 7) return next();
  
  // Check subscription status
  const subscription = await storage.getUserSubscription(user.id);
  if (!subscription || subscription.status !== 'active') {
    return res.status(402).json({ 
      error: 'Subscription required',
      upgradeUrl: '/pricing'
    });
  }
  
  next();
};

// Apply to protected routes
app.get('/api/lesson/:dayIndex', requireAuth, requireSubscription, getLessonHandler);
app.get('/api/quiz/daily/:dayIndex', requireAuth, requireSubscription, getQuizHandler);
```

#### Week 3: Content Management System
```typescript
// Admin content creation API
app.post('/api/admin/content/lesson', adminAuth, async (req, res) => {
  const { dayIndex, title, content, keyTakeaways, whyItMatters } = req.body;
  
  // Validate input
  const schema = z.object({
    dayIndex: z.number().min(1).max(180),
    title: z.string().min(10).max(200),
    content: z.string().min(100),
    keyTakeaways: z.array(z.string()).min(3).max(5),
    whyItMatters: z.string().min(50)
  });
  
  const validated = schema.parse(req.body);
  
  // Create content
  const lesson = await storage.createLesson(validated);
  res.json({ success: true, lesson });
});

// Content preview system
app.get('/api/admin/content/preview/:id', adminAuth, getContentPreview);
```

#### Week 4: Analytics & Monitoring
```typescript
// Event tracking
const trackEvent = async (userId, eventType, properties) => {
  await db.insert(userEvents).values({
    userId,
    eventType,
    properties,
    timestamp: new Date()
  });
  
  // Send to external analytics
  if (process.env.MIXPANEL_TOKEN) {
    mixpanel.track(eventType, { userId, ...properties });
  }
};

// Key events to track
// - lesson_started, lesson_completed
// - quiz_started, quiz_completed
// - video_played, video_completed
// - subscription_created, subscription_canceled
// - paywall_hit, upgrade_clicked
```

### Risk Mitigation Strategies

#### Technical Risks
1. **Database Performance Under Load**
   - Solution: Connection pooling + read replicas
   - Timeline: Week 1 implementation

2. **API Rate Limiting (CoinGecko)**
   - Solution: Multiple API sources + local caching
   - Timeline: Week 2 implementation

3. **Payment Processing Failures**
   - Solution: Stripe webhook retry logic + manual reconciliation
   - Timeline: Week 2 implementation

#### Business Risks
1. **Content Creation Bottleneck**
   - Solution: Efficient CMS + content templates
   - Timeline: Week 3 implementation

2. **User Onboarding Friction**
   - Solution: Progressive onboarding + clear value prop
   - Timeline: Week 4 optimization

### Success Metrics & KPIs

#### Technical Metrics
- API response time < 200ms (p95)
- Database query time < 50ms (p95)
- Uptime > 99.9%
- Error rate < 0.1%

#### Business Metrics
- Free-to-paid conversion > 10%
- Daily active users > 30% of total
- Lesson completion rate > 80%
- User retention (D7) > 60%

This technical deep dive provides the development team with the detailed information needed to successfully scale HODLearn from MVP to production-ready platform supporting 10,000 users.