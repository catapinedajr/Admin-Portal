# HODLearn Admin Portal - AWS Migration Project Spec

## Project Overview

Migrate the HODLearn Admin Portal from Replit development environment to AWS production infrastructure. The admin portal is a full-stack application with React frontend and Express.js backend, connected to a PostgreSQL database.

**Timeline Estimate:** 5-6 developer days  
**Complexity:** Medium-High  
**Prerequisites:** AWS account with appropriate permissions, domain access for admin subdomain

---

## What's Being Migrated

### Admin Portal Features

| Module | Description |
|--------|-------------|
| **KPI Dashboard** | Executive overview with hero metrics (users, revenue, active users, pipeline), operational health indicators, weekly wins, and activity trends |
| **Content Management** | 180-day Bitcoin education curriculum (lessons, facts, quizzes, setup questions) |
| **Marketing Hub** | Ad campaign management, advertiser clients, performance analytics (impressions, clicks, CTR) |
| **Social Media Hub** | Post scheduling across platforms, AI-powered draft generation, dual-status tracking (content approval + publish status) |
| **Store Management** | Three product types: Affiliates (commission tracking), Referrals (partner programs), Inventory (stock management) |
| **User Management** | Active/inactive users, subscription status (via Stripe), learning progress, streak data |
| **B2B CRM** | Company relationships, contacts, deals pipeline, activity tracking (calls, emails, meetings) |
| **Product Roadmap** | Feature ideas with effort/impact scoring, release management, status tracking |
| **Goals Management** | OKRs (Objectives & Key Results) and KPI targets with progress tracking |

### Data Surface Mapping

Understanding which modules share data with the consumer app is critical for migration planning. Some modules require production data parity; others can be seeded independently.

#### Consumer-Facing Modules (Require Data Migration Parity)

These modules read/write data that directly impacts what consumers see in the HODLearn app:

| Module | Consumer App Connection | Shared Tables |
|--------|------------------------|---------------|
| **Content Management** | Directly feeds the 180-day curriculum users see daily | `content_days`, `content_lessons`, `content_facts`, `content_quizzes`, `content_set_up_questions` |
| **Users Management** | Views/manages the same user records consumers use to login | `users`, `user_sessions`, `user_progress`, `user_quiz_answers`, `daily_activities` |
| **Community/Forums** | Shared forum posts, replies, votes visible to consumers | `forum_categories`, `forum_posts`, `forum_replies`, `forum_votes`, `user_karma` |
| **KPI Dashboard** | Reads from consumer tables (no writes, but depends on consumer data existing) | Aggregates from user/content/community tables |

⚠️ **Migration Note:** These tables must be migrated with production data intact. Any data loss affects consumer experience.

#### Admin-Only Modules (No Consumer App Mapping)

These modules are purely internal operations with no direct consumer-facing impact:

| Module | Purpose | Tables (Can Be Seeded Fresh) |
|--------|---------|------------------------------|
| **Marketing Hub** | Internal advertiser management, campaign analytics | `advertising_clients`, `ad_campaigns`, `ad_creatives`, `ad_impressions`, `ad_clicks` |
| **Social Media Hub** | Internal post scheduling for X/LinkedIn - not user-facing | `social_posts`, `social_post_metrics`, `social_accounts`, `attribution_events` |
| **Store Management** | Affiliate/referral tracking, inventory management | `affiliate_products`, `affiliate_clicks`, `referral_partners`, `referral_signups`, `store_products`, `store_orders` |
| **B2B CRM** | Sales pipeline, company relationships | `crm_companies`, `crm_contacts`, `crm_deals`, `crm_activities` |
| **Product Roadmap** | Internal feature planning | `roadmap_ideas`, `roadmap_releases` |
| **Goals Management** | Internal OKRs and KPI targets | `objectives`, `key_results`, `key_result_updates`, `kpi_targets` |

✅ **Migration Note:** These tables can be initialized empty or with seed data. No production data dependency.

#### Consumer Learning Content (Require Data Migration Parity)

These supplementary tables enhance the consumer learning experience:

| Tables | Consumer Usage |
|--------|----------------|
| `conviction_content` | Quotes and videos shown to users during learning |
| `knowledge_areas` | Progress tracking displayed to consumers |
| `curated_videos`, `video_categories`, `video_subcategories` | Video library accessible to consumers |
| `user_video_engagement` | Tracks consumer video watch progress |
| `daily_discussions` | Day-linked community discussions visible to consumers |

⚠️ **Migration Note:** These tables directly affect consumer features. Migrate with production data.

#### Admin Analytics Tables (Can Be Seeded Fresh)

These tables provide market data and analytics for admin dashboards only:

| Tables | Purpose |
|--------|---------|
| `bitcoin_price` | Historical price cache (consumer app fetches live from CoinGecko API) |
| `treasury_companies`, `sovereign_adoption` | Market research data for admin insights |
| `success_stories`, `story_features` | Success story moderation (admin curation only) |

✅ **Migration Note:** These can be initialized empty. Consumer app doesn't depend on them.

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| **Backend** | Node.js + Express.js + TypeScript |
| **Database** | PostgreSQL (Drizzle ORM) |
| **Authentication** | Session-based with bcrypt password hashing |
| **AI Integration** | Anthropic Claude (claude-sonnet-4-5) for content generation |
| **Payments** | Stripe (subscription management via stripe-replit-sync) |

---

## Repository Structure

```
/client/src/admin/
  /components/
    AdminLayout.tsx          # Main layout wrapper with sidebar
    AdminSidebar.tsx         # Navigation sidebar
  /pages/
    KPIDashboard.tsx         # Executive dashboard with KPIs
    ContentManagement.tsx    # Curriculum & content management
    MarketingManagement.tsx  # Ad campaigns & advertisers
    SocialMediaHub.tsx       # Social post scheduling
    StoreManagement.tsx      # Affiliates, referrals, inventory
    UsersManagement.tsx      # User tracking & subscriptions
    CRMManagement.tsx        # B2B sales pipeline
    RoadmapManagement.tsx    # Product ideas & releases
    GoalsManagement.tsx      # OKRs & KPI targets
    AdminLoginPage.tsx       # Admin authentication

/server/
  admin-routes.ts            # All admin API endpoints (~2500+ lines)
  admin-auth.ts              # Admin authentication logic
  routes.ts                  # Consumer app routes (separate)
  storage.ts                 # Database operations interface

/shared/
  schema.ts                  # Database schema (Drizzle ORM) - 1600+ lines
```

---

## Database Schema

### Authentication Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin accounts (email, hashed password, name, role) |
| `admin_sessions` | Session management for admin auth |
| `users` | Consumer app user accounts |
| `user_sessions` | Consumer user sessions |
| `password_reset_tokens` | Password reset functionality |

### Content Tables

| Table | Purpose |
|-------|---------|
| `content_days` | 180-day curriculum metadata (title, theme, status) |
| `content_lessons` | Lesson content for each day |
| `content_facts` | Daily facts (3 per day) |
| `content_quizzes` | Quiz questions and answers |
| `content_set_up_questions` | Setup questions per day |

### Marketing Tables

| Table | Purpose |
|-------|---------|
| `advertising_clients` | Advertiser companies |
| `ad_campaigns` | Campaign definitions with targeting |
| `ad_creatives` | Campaign creative assets |
| `ad_impressions` | Impression tracking |
| `ad_clicks` | Click tracking |

### Social Media Tables

| Table | Purpose |
|-------|---------|
| `social_posts` | Posts with content/publish status (drafted/approved, planned/posted) |
| `social_post_metrics` | Engagement metrics per post |
| `social_accounts` | Connected social platform accounts |
| `attribution_events` | User attribution funnel tracking |

### Store Tables

| Table | Purpose |
|-------|---------|
| `affiliate_products` | Affiliate product links with commission rates |
| `affiliate_clicks` | Affiliate click tracking |
| `referral_partners` | Referral program partners |
| `referral_signups` | Referral conversion tracking |
| `store_products` | Inventory products (physical/digital) |
| `store_orders` | Order records |
| `store_order_items` | Order line items |
| `invoices` | Invoice management |

### User Progress Tables

| Table | Purpose |
|-------|---------|
| `user_progress` | Learning progress per user |
| `user_quiz_answers` | Quiz response history |
| `daily_activities` | Daily engagement tracking |
| `simulator_completions` | Interactive simulator progress |

### B2B CRM Tables

| Table | Purpose |
|-------|---------|
| `crm_companies` | Company records (account type, industry, size) |
| `crm_contacts` | Contact persons at companies |
| `crm_deals` | Sales opportunities with stages (lead → won/lost) |
| `crm_activities` | Activity log (calls, emails, meetings, demos, notes) |

### Product Roadmap Tables

| Table | Purpose |
|-------|---------|
| `roadmap_ideas` | Feature ideas with effort/impact scores |
| `roadmap_releases` | Release versions and dates |

### Goals & OKRs Tables

| Table | Purpose |
|-------|---------|
| `objectives` | Strategic objectives with timeframes |
| `key_results` | Measurable key results per objective |
| `key_result_updates` | Progress updates on key results |
| `kpi_targets` | KPI targets with current/target values |

### Community/Forum Tables

| Table | Purpose |
|-------|---------|
| `forum_categories` | Forum category definitions |
| `forum_posts` | Community posts with flair types |
| `forum_replies` | Threaded replies |
| `forum_votes` | Upvote tracking |
| `user_karma` | User reputation scores |
| `forum_post_stats` | Aggregated post statistics |
| `forum_reply_stats` | Aggregated reply statistics |
| `daily_discussions` | Day-based community discussions linked to curriculum |
| `success_stories` | User success stories with approval/feature status |
| `story_features` | Featured story management and display ordering |

### Video Library Tables

| Table | Purpose |
|-------|---------|
| `video_categories` | Main categories for video organization |
| `video_subcategories` | Subcategories within main video categories |
| `curated_videos` | Enhanced video content with YouTube IDs, difficulty, tags |
| `user_video_engagement` | User video watch progress and interactions |

### Bitcoin Data Tables

| Table | Purpose |
|-------|---------|
| `bitcoin_price` | Historical Bitcoin price, market cap, volume, dominance |
| `treasury_companies` | Companies holding Bitcoin on balance sheets |
| `sovereign_adoption` | Government/sovereign Bitcoin adoption records |
| `conviction_content` | Quotes and videos for conviction building |
| `knowledge_areas` | Learning area progress tracking |

### Stripe Integration Tables (Auto-managed)

| Table | Purpose |
|-------|---------|
| `stripe_customers` | Synced Stripe customer data |
| `stripe_subscriptions` | Active subscription records |
| `stripe_events` | Webhook event log |

---

## Environment Variables Required

### Database
```
DATABASE_URL=postgresql://user:password@host:5432/database
PGHOST=your-rds-endpoint.amazonaws.com
PGPORT=5432
PGUSER=admin
PGPASSWORD=your-secure-password
PGDATABASE=hodlearn
```

### Authentication
```
SESSION_SECRET=generate-a-32-char-random-string
ADMIN_SESSION_SECRET=generate-another-32-char-string
```

### AI Integration (Claude)
```
# Switch from Replit AI Integrations to direct Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Code change required in server/admin-routes.ts:
# - Remove: AI_INTEGRATIONS_ANTHROPIC_API_KEY  
# - Remove: AI_INTEGRATIONS_ANTHROPIC_BASE_URL
# - Keep model as "claude-sonnet-4-5" (works with direct API too)
```

### Stripe
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

---

## Admin Portal Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | KPIDashboard | Default admin landing page |
| `/admin/kpis` | KPIDashboard | Alias for dashboard |
| `/admin/content` | ContentManagement | Curriculum management |
| `/admin/marketing` | MarketingManagement | Ad campaigns & clients |
| `/admin/social` | SocialMediaHub | Social post scheduling |
| `/admin/store` | StoreManagement | Affiliates, referrals, inventory |
| `/admin/users` | UsersManagement | User management |
| `/admin/crm` | CRMManagement | B2B sales pipeline |
| `/admin/roadmap` | RoadmapManagement | Product ideas & releases |
| `/admin/goals` | GoalsManagement | OKRs & KPI targets |
| `/admin/okrs` | GoalsManagement | Alias for goals |
| `/admin/login` | AdminLoginPage | Admin authentication |

---

## API Endpoints Summary

### Dashboard & KPIs
- `GET /api/admin/kpis` - Aggregate KPI data for dashboard
- `GET /api/admin/kpis/trends` - Time-series trend data

### Content Management
- `GET/POST /api/admin/content/days` - Curriculum days CRUD
- `GET/PUT /api/admin/content/days/:id` - Individual day management
- `POST /api/admin/content/days/:id/lessons` - Add lessons
- `POST /api/admin/content/days/:id/facts` - Add facts
- `POST /api/admin/content/days/:id/quizzes` - Add quizzes

### Marketing
- `GET/POST /api/admin/marketing/campaigns` - Campaign CRUD
- `GET/PUT/DELETE /api/admin/marketing/campaigns/:id` - Campaign management
- `GET/POST /api/admin/marketing/clients` - Advertiser clients

### Social Media
- `GET/POST /api/admin/social/posts` - Post CRUD
- `PUT/DELETE /api/admin/social/posts/:id` - Post management
- `PUT /api/admin/social/posts/:id/status` - Update publish status
- `POST /api/admin/social/posts/generate-draft` - AI draft generation
- `GET /api/admin/social/stats` - Social media statistics

### Store
- `GET/POST /api/admin/store/affiliates` - Affiliate products
- `GET/POST /api/admin/store/referrals` - Referral partners
- `GET/POST /api/admin/store/inventory` - Inventory products

### Users
- `GET /api/admin/users` - User list with progress
- `GET /api/admin/users/:id` - Individual user details
- `GET /api/admin/users/stats` - User statistics

### CRM
- `GET/POST /api/admin/crm/companies` - Company CRUD
- `GET/PUT/DELETE /api/admin/crm/companies/:id` - Company management
- `GET/POST /api/admin/crm/contacts` - Contact CRUD
- `GET/POST /api/admin/crm/deals` - Deal pipeline CRUD
- `PUT /api/admin/crm/deals/:id/stage` - Update deal stage
- `GET/POST /api/admin/crm/activities` - Activity log

### Roadmap
- `GET/POST /api/admin/roadmap/ideas` - Feature ideas CRUD
- `PUT/DELETE /api/admin/roadmap/ideas/:id` - Idea management
- `GET/POST /api/admin/roadmap/releases` - Release management

### Goals & OKRs
- `GET/POST /api/admin/goals/objectives` - Objectives CRUD
- `PUT/DELETE /api/admin/goals/objectives/:id` - Objective management
- `POST /api/admin/goals/objectives/:id/key-results` - Add key results
- `PUT /api/admin/goals/key-results/:id` - Update key result progress
- `GET/POST /api/admin/goals/kpi-targets` - KPI targets CRUD
- `PUT /api/admin/goals/kpi-targets/:id` - Update KPI target

---

## Migration Steps

### Phase 1: Infrastructure Setup (1-2 days)

1. **Create RDS PostgreSQL Instance**
   - Engine: PostgreSQL 15+
   - Instance: db.t3.micro (dev) or db.t3.small (prod)
   - Enable automated backups
   - Configure security group for ECS access

2. **Create ECS Cluster (or Elastic Beanstalk)**
   - Option A: ECS Fargate (recommended for simplicity)
   - Option B: Elastic Beanstalk with Docker
   - Memory: 1GB minimum (2GB recommended for AI features)
   - CPU: 0.5 vCPU minimum

3. **Set Up Application Load Balancer**
   - HTTPS listener (port 443)
   - HTTP redirect to HTTPS
   - Health check path: `/api/health`

4. **Configure Route 53**
   - Create A record for admin.hodlearn.com (or your domain)
   - Point to ALB

5. **Set Up AWS Secrets Manager**
   - Store all environment variables listed above
   - Configure ECS task to pull from Secrets Manager

### Phase 2: Code Preparation (0.5 days)

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

2. **Update Anthropic Configuration**

In `server/admin-routes.ts`, find the AI draft generation endpoint and update:

```typescript
// BEFORE (Replit AI Integrations)
const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

// AFTER (Direct Anthropic API)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // No baseURL needed - uses Anthropic's default
});
```

3. **Add Health Check Endpoint**

In `server/routes.ts`, add:
```typescript
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

### Phase 3: Database Migration (1 day)

1. **Export Schema**
```bash
# From Replit, export the schema
npx drizzle-kit generate:pg
```

2. **Apply to RDS**
```bash
# Connect to RDS and run migrations
npx drizzle-kit push:pg
```

3. **Create Initial Admin User**
```sql
-- Run this in your RDS database
-- Password should be hashed with bcrypt (cost factor 10)
INSERT INTO admin_users (email, password, first_name, last_name, role)
VALUES (
  'admin@hodlearn.com',
  '$2a$10$YOUR_BCRYPT_HASHED_PASSWORD',
  'Admin',
  'User',
  'admin'
);
```

4. **Migrate Content Data**
   - Export all content tables from Replit
   - Import to RDS via pg_dump/pg_restore or SQL scripts
   - Verify 180-day curriculum is complete

5. **Configure Stripe Webhook**
   - Update Stripe webhook endpoint to new AWS URL
   - Re-sync subscription data after migration

### Phase 4: CI/CD Pipeline (1 day)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name hodlearn-admin
```

2. **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/hodlearn-admin:$IMAGE_TAG .
          docker push $ECR_REGISTRY/hodlearn-admin:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster hodlearn --service admin --force-new-deployment
```

### Phase 5: Testing & Launch (1 day)

**Pre-Launch Checklist:**

#### Authentication
- [ ] Admin login works (admin@hodlearn.com)
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

#### Dashboard (KPIs)
- [ ] Hero metrics display (Total Users, Revenue, Active Users, Pipeline)
- [ ] Operational health row shows (Lesson Completion, Campaigns, Community, Goals)
- [ ] Weekly wins section populates
- [ ] Activity trends chart renders

#### Content Management
- [ ] All 180 curriculum days visible
- [ ] Can view/edit lessons, facts, quizzes
- [ ] Content status updates work

#### Marketing
- [ ] Ad campaigns list loads
- [ ] Can create/edit campaigns
- [ ] Advertiser clients display
- [ ] Performance metrics calculate

#### Social Media
- [ ] Posts list with status indicators
- [ ] AI draft generation works (test with Claude)
- [ ] Can update content status (drafted/approved)
- [ ] Can update publish status (planned/posted)

#### Store
- [ ] Affiliates tab shows products
- [ ] Referrals tab shows partners
- [ ] Inventory tab shows stock

#### Users
- [ ] User list loads with progress data
- [ ] Subscription status displays (from Stripe sync)
- [ ] Can filter active/inactive

#### CRM
- [ ] Companies list with pipeline value
- [ ] Deals display with stage progression
- [ ] Activities log updates
- [ ] Can add contacts

#### Product Roadmap
- [ ] Ideas display with effort/impact scores
- [ ] Can create/edit ideas
- [ ] Releases section works
- [ ] Status transitions function

#### Goals
- [ ] Objectives tab shows OKRs
- [ ] Key results with progress bars
- [ ] KPI targets tab displays
- [ ] Progress view aggregates correctly

#### Infrastructure
- [ ] HTTPS working (no mixed content warnings)
- [ ] All API endpoints respond
- [ ] Database queries perform well
- [ ] No console errors

---

## Security Considerations

1. **HTTPS Required** - All traffic over TLS
2. **Session Security** - HttpOnly, Secure, SameSite cookies
3. **Admin IP Restriction** (recommended) - Limit admin access via WAF
4. **Secrets Rotation** - Use Secrets Manager with rotation policies
5. **Database Security** - RDS in private subnet, security group restricted
6. **Logging** - Enable CloudWatch for audit trail
7. **Stripe Security** - Validate webhook signatures
8. **AI API Security** - Anthropic key stored in Secrets Manager only

---

## Cost Estimate (Monthly)

| Service | Estimated Cost |
|---------|---------------|
| RDS db.t3.small | ~$25 |
| ECS Fargate (0.5 vCPU, 2GB) | ~$25 |
| ALB | ~$20 |
| Route 53 | ~$1 |
| Secrets Manager | ~$3 |
| CloudWatch | ~$10 |
| Anthropic API (AI drafts) | Variable (~$5-20 based on usage) |
| **Total** | **~$90-110/month** |

---

## Support Files Location

| Type | Location |
|------|----------|
| Schema Definition | `shared/schema.ts` |
| Admin API Routes | `server/admin-routes.ts` |
| Admin Auth Logic | `server/admin-auth.ts` |
| Admin Frontend Pages | `client/src/admin/pages/` |
| Admin Components | `client/src/admin/components/` |
| Project Documentation | `replit.md` |

---

## Post-Migration Monitoring

### Key Metrics to Watch
- API response times (target: <500ms)
- Database connection pool usage
- Memory consumption (especially during AI calls)
- Error rates by endpoint
- Session creation/expiration rates

### Recommended CloudWatch Alarms
- CPU utilization > 80%
- Memory utilization > 85%
- 5xx error rate > 1%
- Database connections > 80% of max
- API latency p95 > 2s

---

## Contact

For questions about this codebase, refer to the inline comments or the main `replit.md` documentation file in the project root.
