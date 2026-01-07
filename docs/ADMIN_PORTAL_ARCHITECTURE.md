# HODLearn Admin Portal - Architecture Documentation

## Overview

This document provides a comprehensive architecture overview of the HODLearn admin portal for AWS production integration. The system is a full-stack TypeScript application with React frontend, Express.js backend, and PostgreSQL database.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React/Vite)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │  Consumer   │  │   Admin     │  │  Shared     │  │   Assets    ││
│  │   Pages     │  │   Portal    │  │ Components  │  │             ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘│
│         │                │                │                         │
│         └────────────────┼────────────────┘                         │
│                          ▼                                          │
│              TanStack Query + Wouter Router                         │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVER (Express.js)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   routes.ts │  │admin-routes │  │  referral-  │  │   wallet-   ││
│  │  (Consumer) │  │    .ts      │  │  routes.ts  │  │  routes.ts  ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│
│         └────────────────┼────────────────┼────────────────┘        │
│                          ▼                                          │
│              Drizzle ORM + Storage Layer                            │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                             │
│              (Neon Serverless / AWS RDS)                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
├── client/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/     # Admin-specific components
│   │   │   └── pages/          # Admin portal pages (9 management areas)
│   │   ├── components/         # Shared UI components
│   │   ├── contexts/           # React contexts (subscription, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities, query client, icons
│   │   └── pages/              # Consumer-facing pages
│   └── index.html
├── server/
│   ├── admin-auth.ts           # Admin authentication service
│   ├── admin-routes.ts         # Admin API endpoints
│   ├── auth.ts                 # Consumer authentication service
│   ├── bitcoin-price.ts        # CoinGecko price integration
│   ├── community.ts            # Forum/community features
│   ├── content-validation.ts   # Content creation framework
│   ├── database-protection.ts  # DB mutation guards
│   ├── db.ts                   # Drizzle database connection
│   ├── index.ts                # App bootstrap
│   ├── referral-routes.ts      # Referral system API
│   ├── routes.ts               # Main consumer API routes
│   ├── storage.ts              # Data access layer
│   ├── stripeClient.ts         # Stripe SDK setup
│   ├── wallet-routes.ts        # HODLearn Points wallet API
│   └── webhookHandlers.ts      # Stripe webhook processing
├── shared/
│   └── schema.ts               # Database schema + TypeScript types
└── docs/
    ├── PRODUCTION_DEPLOYMENT.md
    └── AWS_MIGRATION_PROJECT_SPEC.md
```

---

## Admin Portal - 9 Management Areas

| Area | File | Description | Key API Routes |
|------|------|-------------|----------------|
| **1. Users** | `UsersManagement.tsx` | User lifecycle, referral tracking | `/api/admin/users`, `/api/admin/referrals/*` |
| **2. Content** | `ContentManagement.tsx` | 336-day curriculum CRUD, AI generation | `/api/admin/content/*`, `/api/admin/curriculum` |
| **3. Marketing (B2B)** | `MarketingManagement.tsx` | Advertising clients, campaigns | `/api/admin/marketing/*` |
| **4. Store** | `StoreManagement.tsx` | E-commerce products, orders | `/api/admin/store/*` |
| **5. Social Media** | `SocialMediaHub.tsx` | Content scheduler, AI prompts | `/api/admin/social/*` |
| **6. CRM** | `CRMManagement.tsx` | B2B pipeline, companies, deals | `/api/admin/crm/*` |
| **7. Revenue** | `RevenueControls.tsx` | Paywall settings, Stripe controls | `/api/admin/paywall`, `/api/admin/stripe/*` |
| **8. Roadmap** | `RoadmapManagement.tsx` | Product backlog, releases | `/api/admin/roadmap/*` |
| **9. Goals** | `GoalsManagement.tsx` | OKRs, key results tracking | `/api/admin/okrs/*` |

### Additional Dashboards
- **KPI Dashboard** (`KPIDashboard.tsx`) - Metrics and analytics
- **Integrations** (`IntegrationsManagement.tsx`) - API keys, external services

---

## Backend API Route Mapping

### Consumer Routes (`server/routes.ts`)

| Route Pattern | Method | Description | Auth Required |
|---------------|--------|-------------|---------------|
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/login` | POST | User login | No |
| `/api/auth/logout` | POST | User logout | Yes |
| `/api/auth/forgot-password` | POST | Password reset request | No |
| `/api/auth/reset-password` | POST | Password reset | No |
| `/api/user` | GET | Get current user | Yes* |
| `/api/day-metadata/:dayIndex` | GET | Get day content metadata | Yes* |
| `/api/daily-facts/:dayIndex` | GET | Get daily facts | Yes* |
| `/api/day-access/:userId/:dayIndex` | GET | Check day access | Yes* |
| `/api/day-completed/:userId/:dayIndex` | GET/POST | Day completion status | Yes* |
| `/api/wallet/dashboard` | GET | Wallet summary | Yes* |
| `/api/bitcoin-price` | GET | Current BTC price | No |
| `/api/paywall-config` | GET | Paywall settings | No |

**\* Note:** Currently using `setDefaultUser` middleware (hardcoded user ID 1) for development. **MUST be replaced with proper authentication for production.**

### Referral Routes (`server/referral-routes.ts`)

| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/referral/my-code` | GET | Get user's referral code |
| `/api/referral/my-referrals` | GET | Get referral history |
| `/api/referral/validate-code` | GET | Validate referral code |
| `/api/referral/apply-code` | POST | Apply referral code to account |
| `/api/admin/referrals/stats` | GET | Admin referral statistics |
| `/api/admin/referrals/events` | GET | Admin referral events |

### Wallet Routes (`server/wallet-routes.ts`)

| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/wallet/dashboard` | GET | Wallet overview with BTC price |
| `/api/wallet/earnings` | GET | Earning history |
| `/api/wallet/record-earning` | POST | Record new earning |

### Admin Routes (`server/admin-routes.ts`)

#### Authentication & Core
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/forgot-password` | POST | Password reset request |
| `/api/admin/reset-password` | POST | Password reset |
| `/api/admin/setup` | POST | Initial admin setup |
| `/api/admin/me` | GET | Current admin user |
| `/api/admin/stats` | GET | Dashboard statistics |
| `/api/admin/stats/timeseries` | GET | Time-series metrics |
| `/api/admin/admin-users` | GET/POST | Admin user management |
| `/api/admin/admin-users/:id` | PATCH/DELETE | Admin user CRUD |

#### User Management
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/stats` | GET | User statistics |
| `/api/admin/users/:id` | GET | User details |

#### Content Management
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/content/days` | GET/POST | List/create content days |
| `/api/admin/content/days/:id` | PATCH/DELETE | Update/delete day |
| `/api/admin/content/days/:id/impact` | GET | Day impact analysis |
| `/api/admin/content/lessons/:dayId` | GET/PUT | Lessons CRUD |
| `/api/admin/content/quizzes/:dayId` | GET/POST | Quizzes CRUD |
| `/api/admin/content/quizzes/:id` | PATCH/DELETE | Quiz item CRUD |
| `/api/admin/content/questions/:dayId` | GET/POST | Questions CRUD |
| `/api/admin/content/questions/:id` | PATCH/DELETE | Question item CRUD |
| `/api/admin/content/bulk-import` | POST | Bulk content import |
| `/api/admin/content/generate-draft` | POST | AI content generation |
| `/api/admin/curriculum` | GET/POST | Curriculum structure |
| `/api/admin/curriculum/:id` | DELETE | Delete curriculum entry |
| `/api/admin/curriculum/for-day/:dayIndex` | GET | Get curriculum for day |

#### Marketing (B2B)
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/marketing/clients` | GET/POST | Advertising clients |
| `/api/admin/marketing/clients/:id` | DELETE | Delete client |
| `/api/admin/marketing/campaigns` | GET/POST | Campaigns |
| `/api/admin/marketing/campaigns/:id` | PATCH/DELETE | Campaign CRUD |
| `/api/admin/marketing/creatives` | GET/POST | Ad creatives |
| `/api/admin/marketing/creatives/:id` | PATCH/DELETE | Creative CRUD |
| `/api/admin/marketing/invoices` | GET/POST | Invoices |
| `/api/admin/marketing/invoices/:id` | PATCH/DELETE | Invoice CRUD |
| `/api/admin/marketing/analytics` | GET | Marketing analytics |

#### Store/E-commerce
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/store/inventory` | GET/POST | Product inventory |
| `/api/admin/store/inventory/:id` | PATCH/DELETE | Inventory CRUD |
| `/api/admin/store/orders` | GET | Order list |
| `/api/admin/store/orders/:id` | PATCH | Update order |
| `/api/admin/store/affiliates` | GET/POST | Affiliate products |
| `/api/admin/store/affiliates/:id` | PATCH/DELETE | Affiliate CRUD |
| `/api/admin/store/affiliates/stats` | GET | Affiliate statistics |
| `/api/admin/store/referrals` | GET/POST | Referral partners |
| `/api/admin/store/referrals/:id` | PATCH/DELETE | Referral CRUD |
| `/api/admin/store/referrals/signups` | GET | Referral signups |

#### Social Media
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/social/posts` | GET/POST | Social posts |
| `/api/admin/social/posts/:id` | PATCH/DELETE | Post CRUD |
| `/api/admin/social/posts/:id/publish` | POST | Publish post |
| `/api/admin/social/stats` | GET | Social statistics |
| `/api/admin/social/generate-draft` | POST | AI post generation |
| `/api/admin/social/generate-image` | POST | AI image generation |
| `/api/admin/social/attribution` | POST | Track attribution |
| `/api/admin/social-integrations` | GET/POST | Platform integrations |
| `/api/admin/social-integrations/:platform/validate` | POST | Validate integration |
| `/api/admin/social-integrations/:platform/toggle` | POST | Enable/disable |
| `/api/admin/social-integrations/:platform` | DELETE | Remove integration |

#### CRM
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/crm/companies` | GET/POST | Companies |
| `/api/admin/crm/companies/:id` | GET/PATCH | Company CRUD |
| `/api/admin/crm/contacts` | POST | Create contact |
| `/api/admin/crm/contacts/:id` | PATCH/DELETE | Contact CRUD |
| `/api/admin/crm/deals` | GET/POST | Deals pipeline |
| `/api/admin/crm/deals/:id` | GET/PATCH | Deal CRUD |
| `/api/admin/crm/deals/:id/stage` | PATCH | Update deal stage |
| `/api/admin/crm/activities` | POST | Create activity |
| `/api/admin/crm/activities/:id` | PATCH/DELETE | Activity CRUD |
| `/api/admin/crm/stats` | GET | CRM statistics |
| `/api/admin/crm/options` | GET | CRM dropdown options |

#### Revenue & Paywall
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/paywall` | GET/POST | Paywall settings |
| `/api/admin/stripe/status` | GET | Stripe connection status |
| `/api/admin/stripe/products` | GET | Stripe products |

#### Roadmap
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/roadmap/ideas` | GET/POST | Product ideas |
| `/api/admin/roadmap/ideas/:id` | PATCH/DELETE | Idea CRUD |
| `/api/admin/roadmap/ideas/:id/status` | PATCH | Update idea status |
| `/api/admin/roadmap/releases` | GET/POST | Releases |
| `/api/admin/roadmap/releases/:id` | PATCH/DELETE | Release CRUD |
| `/api/admin/roadmap/stats` | GET | Roadmap statistics |

#### Goals & OKRs
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/okrs/objectives` | GET/POST | Objectives |
| `/api/admin/okrs/objectives/:id` | PATCH/DELETE | Objective CRUD |
| `/api/admin/okrs/key-results` | POST | Create key result |
| `/api/admin/okrs/key-results/:id` | PATCH/DELETE | Key result CRUD |
| `/api/admin/okrs/key-results/:id/update` | POST | Add progress update |
| `/api/admin/okrs/key-results/:id/history` | GET | Progress history |
| `/api/admin/okrs/stats` | GET | OKR statistics |

#### KPIs
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/kpis` | GET | KPI dashboard data |
| `/api/admin/kpis/trends` | GET | KPI trends |
| `/api/admin/kpis/targets` | GET/POST | KPI targets |
| `/api/admin/kpis/targets/:id` | PATCH/DELETE | Target CRUD |
| `/api/admin/kpis/targets/refresh` | POST | Refresh targets |

#### Settings & AI
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/settings` | GET/POST | System settings |
| `/api/admin/settings/:key` | DELETE | Delete setting |
| `/api/admin/settings/:key/decrypt` | GET | Decrypt setting |
| `/api/admin/settings/security-status` | GET | Security status |
| `/api/admin/ai-instructions/:type` | GET/POST | AI prompts |
| `/api/admin/ai-instructions/:type/lock` | POST | Lock instruction |
| `/api/admin/ai-instructions/:type/unlock` | POST | Unlock instruction |
| `/api/admin/ai-instructions/:type/reset` | POST | Reset to default |

#### Archive & Restore
| Route Pattern | Method | Description |
|---------------|--------|-------------|
| `/api/admin/archive` | GET | Archive overview |
| `/api/admin/archived/:entityType` | GET | Archived items |
| `/api/admin/archive/:entityType/:id` | POST/DELETE | Archive/permanent delete |
| `/api/admin/archive/:entityType/:id/restore` | POST | Restore item |
| `/api/admin/restore/:entityType/:id` | POST | Restore item (alt) |
| `/api/admin/permanent-delete/:entityType/:id` | DELETE | Permanent delete |

---

## Database Schema - Key Tables

### User Management
```sql
users                    -- User accounts (id, username, email, password, referralCode, etc.)
user_sessions            -- Active sessions (sessionId, userId, expiresAt)
password_reset_tokens    -- Password reset tokens
admin_users              -- Admin accounts (separate from users)
admin_sessions           -- Admin sessions
```

### Content System
```sql
content_days             -- 336 curriculum days (dayIndex, title, theme, weekNumber, etc.)
content_lessons          -- Lessons per day (dayId, title, content, orderIndex)
content_quizzes          -- Quiz questions (dayId, question, options, correctAnswer)
content_set_up_questions -- Setup questions for context
curriculum_structure     -- Curriculum organization (weekNumber, weekTitle, dayIndex)
```

### Gamification (HODLearn Points)
```sql
user_wallet_progress     -- Total points per user
wallet_earnings          -- Individual earning events (source, amount, earnedAt)
wallet_achievements      -- Unlocked achievements
streak_rewards           -- Streak milestone rewards
streak_insurance         -- Streak protection purchases
```

### Referral System
```sql
referral_codes           -- Generated referral codes
referral_events          -- Referral milestones (signup, 7-day streak, subscription)
users.referral_code      -- User's unique referral code
users.referred_by_user_id -- Who referred this user
```

### Community
```sql
forum_categories         -- Forum structure
forum_posts              -- User posts
forum_replies            -- Threaded replies
forum_votes              -- Upvote/downvote system
user_karma               -- User reputation points
```

### Commerce
```sql
store_products           -- E-commerce products
store_orders             -- Customer orders
store_order_items        -- Order line items
advertising_clients      -- B2B clients
ad_campaigns             -- Advertising campaigns
```

### CRM
```sql
crm_companies            -- B2B companies
crm_contacts             -- Company contacts
crm_deals                -- Sales pipeline deals
crm_activities           -- Activity log
```

---

## Authentication Architecture

### Consumer Authentication
- **Location:** `server/auth.ts`
- **Session storage:** `user_sessions` table
- **Token format:** Bearer token in Authorization header
- **Password hashing:** bcryptjs

```typescript
// Authentication flow
1. User logs in → POST /api/auth/login
2. Server validates credentials, creates session
3. Returns session token
4. Client includes token: Authorization: Bearer <token>
5. requireAuth middleware validates on each request
```

### Admin Authentication
- **Location:** `server/admin-auth.ts`
- **Session storage:** `admin_sessions` table
- **Separate from consumer auth**

```typescript
// Admin auth flow
1. Admin logs in → POST /api/admin/login
2. Validates against admin_users table
3. Creates admin session
4. requireAdminAuth middleware protects admin routes
```

### Production Authentication Requirements

**CRITICAL:** The current development setup uses `setDefaultUser` middleware that hardcodes `req.user = { id: 1 }`. This MUST be replaced for production:

```typescript
// DEVELOPMENT (current - DO NOT USE IN PRODUCTION)
function setDefaultUser(req, res, next) {
  req.user = { id: 1 };
  next();
}

// PRODUCTION (required)
const requireAuth = async (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) return res.status(401).json({ message: "Auth required" });
  
  const user = await authService.getUserFromSession(sessionId);
  if (!user) return res.status(401).json({ message: "Session expired" });
  
  req.user = user;
  next();
};
```

**Files requiring auth middleware update:**
- `server/routes.ts` - Line 2396: `registerReferralRoutes(app, setDefaultUser)` → change to `requireAuth`
- Review all routes using `setDefaultUser`

---

## External Dependencies

### 1. Stripe (Payment Processing)
- **Client:** `server/stripeClient.ts`
- **Webhooks:** `server/webhookHandlers.ts`
- **Required secrets:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY` (frontend)
  - `STRIPE_WEBHOOK_SECRET`

### 2. Anthropic Claude (AI Content Generation)
- **Usage:** Content generation in admin portal
- **Required secrets:**
  - `ANTHROPIC_API_KEY` (production)
  - `AI_INTEGRATIONS_ANTHROPIC_API_KEY` (Replit)

### 3. CoinGecko (Bitcoin Price)
- **Client:** `server/bitcoin-price.ts`
- **Endpoint:** Public API (no key required for basic usage)
- **Caching:** Price cached to reduce API calls

### 4. Google Analytics
- **Required secrets:**
  - `GA_MEASUREMENT_ID`

---

## Environment Variables

### Required for Production

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
SESSION_SECRET=<random-32-char-string>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# Application
APP_URL=https://yourdomain.com
NODE_ENV=production
PORT=5000

# Optional
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Frontend Environment Variables (VITE_ prefix required)

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Middleware & Security

### Rate Limiting
```typescript
// Authentication routes: 5 attempts per 15 minutes
authRateLimiter
adminAuthRateLimiter

// API routes: 100 requests per minute
apiRateLimiter

// Public routes: 200 requests per minute
publicRateLimiter
```

### Database Protection
- `protectContentDatabase` middleware prevents unauthorized content modifications
- Applied globally in `server/routes.ts`

### Content Validation
- `validateContentMiddleware` ensures content follows the curriculum framework
- Located in `server/content-validation.ts`

### Production Security Checklist
- [ ] Replace `setDefaultUser` with proper authentication
- [ ] Enable HTTPS (terminate at load balancer)
- [ ] Configure CORS policies
- [ ] Enable Helmet.js security headers
- [ ] Implement CSRF protection
- [ ] Set HttpOnly, Secure flags on cookies
- [ ] Configure session expiry rotation
- [ ] Enable structured logging (CloudWatch)
- [ ] Set up database connection pooling
- [ ] Configure Stripe webhook signature verification

---

## Key File Reference

| File | Purpose |
|------|---------|
| `shared/schema.ts` | All database tables, types, and Zod schemas |
| `server/routes.ts` | Main consumer API (~3000 lines) |
| `server/admin-routes.ts` | Admin portal API |
| `server/referral-routes.ts` | Referral system |
| `server/wallet-routes.ts` | HODLearn Points wallet |
| `server/auth.ts` | Consumer authentication service |
| `server/admin-auth.ts` | Admin authentication service |
| `server/storage.ts` | Data access abstraction layer |
| `server/db.ts` | Drizzle ORM database connection |
| `server/stripeClient.ts` | Stripe SDK initialization |
| `server/bitcoin-price.ts` | BTC price fetching/caching |
| `client/src/lib/queryClient.ts` | TanStack Query configuration |
| `client/src/admin/pages/*` | Admin portal UI components |

---

## Deployment Notes

### Database Migrations
```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes (development)
npx drizzle-kit push

# For production, use proper migration files
npx drizzle-kit migrate
```

### Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Development mode
npm run dev
```

### AWS Infrastructure Recommendations
- **Compute:** ECS Fargate or EKS
- **Database:** RDS PostgreSQL (or continue with Neon)
- **Load Balancer:** Application Load Balancer (ALB)
- **SSL:** AWS Certificate Manager
- **Secrets:** AWS Secrets Manager or SSM Parameter Store
- **Logging:** CloudWatch Logs
- **CDN:** CloudFront for static assets

---

## Referral System Details

### Reward Structure
```typescript
const REFERRAL_REWARDS = {
  signup: { referrer: 50, referee: 50 },      // On signup
  streak_7: { referrer: 100, referee: 100 },  // 7-day streak
  subscription: { referrer: 500, referee: 500 } // Paid subscription
};
```

### Code Generation
- Format: `[FIRST_NAME_4_CHARS][RANDOM_4_CHARS]`
- Example: `JOHN8X2K`
- Stored in `users.referral_code`

### Event Tracking
- Events stored in `referral_events` table
- Tracks: referrer, referee, event type, points awarded
- Idempotent: prevents duplicate reward claims

---

## Support & Additional Resources

- See `PRODUCTION_DEPLOYMENT.md` for detailed AWS deployment guide
- See `AWS_MIGRATION_PROJECT_SPEC.md` for migration specifications
- Database schema fully documented in `shared/schema.ts`

---

*Document generated: January 2026*
*Version: 1.0*
