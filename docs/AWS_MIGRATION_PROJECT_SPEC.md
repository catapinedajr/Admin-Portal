# HODLearn Admin Portal - AWS Migration Project Spec

## Project Overview

Migrate the HODLearn Admin Portal from Replit development environment to AWS production infrastructure. The admin portal is a full-stack application with React frontend and Express.js backend, connected to a PostgreSQL database.

**Timeline Estimate:** 4-5 developer days  
**Complexity:** Medium  
**Prerequisites:** AWS account with appropriate permissions, domain access for admin subdomain

---

## What's Being Migrated

### Admin Portal Features
1. **Dashboard** - Overview stats, user activity, revenue metrics
2. **Content Management** - 180-day Bitcoin education curriculum (lessons, facts, quizzes)
3. **Marketing Hub** - Campaign management, analytics, performance tracking
4. **Social Media Hub** - Post scheduling, UTM attribution tracking, AI draft generation
5. **Store Management** - Affiliates, referrals, inventory with commission/stock tracking
6. **User Management** - Active/inactive users, subscriptions, learning progress

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** PostgreSQL (Drizzle ORM)
- **Authentication:** Session-based with bcrypt password hashing

---

## Repository Structure

```
/client/src/admin/           # Admin frontend
  /components/               # Shared admin components
    AdminLayout.tsx          # Main layout wrapper
    AdminSidebar.tsx         # Navigation sidebar
  /pages/                    # Admin pages
    AdminDashboard.tsx       # Dashboard
    ContentHub.tsx           # Content management
    MarketingHub.tsx         # Marketing campaigns
    SocialMediaHub.tsx       # Social media scheduling
    StoreManagement.tsx      # Store/affiliates
    UserManagement.tsx       # User tracking

/server/
  admin-routes.ts            # All admin API endpoints (~1800 lines)
  admin-auth.ts              # Admin authentication logic
  routes.ts                  # Consumer app routes (separate)
  storage.ts                 # Database operations interface

/shared/
  schema.ts                  # Database schema (Drizzle ORM)
```

---

## Database Schema

### Core Admin Tables
| Table | Purpose |
|-------|---------|
| `admin_users` | Admin accounts (email, hashed password, name, role) |
| `admin_sessions` | Session management for admin auth |

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
| `marketing_campaigns` | Campaign definitions |
| `marketing_campaign_metrics` | Performance data (impressions, clicks, conversions) |

### Social Media Tables
| Table | Purpose |
|-------|---------|
| `social_posts` | Scheduled/published posts |
| `utm_captures` | UTM parameter tracking |
| `attribution_events` | User attribution funnel |

### Store Tables
| Table | Purpose |
|-------|---------|
| `store_affiliates` | Affiliate partners |
| `store_affiliate_clicks` | Click tracking |
| `store_affiliate_conversions` | Conversion tracking |
| `store_referrals` | Referral program |
| `store_inventory` | Physical/digital products |

### User Tables
| Table | Purpose |
|-------|---------|
| `users` | Consumer app users |
| `user_progress` | Learning progress tracking |
| `user_streaks` | Streak/gamification data |

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
#   OR use Anthropic's versioned name from their docs (e.g., claude-3-5-sonnet-20241022)
```

### Stripe (if using payments)
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

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
   - Memory: 1GB minimum
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

In `server/admin-routes.ts`, find the AI draft generation endpoint (~line 1748) and update:

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

// Model name "claude-sonnet-4-5" works with both Replit and direct API
// Alternatively, check Anthropic's docs for latest versioned model names
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

4. **Migrate Content Data (if needed)**
   - Export content_days, content_lessons, content_facts from Replit
   - Import to RDS via pg_dump/pg_restore or SQL scripts

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

### Phase 5: Testing & Launch (0.5 days)

**Pre-Launch Checklist:**

- [ ] Admin login works (admin@hodlearn.com)
- [ ] Dashboard loads with stats
- [ ] Content Hub shows curriculum data
- [ ] Marketing campaigns display
- [ ] Social Media Hub creates/schedules posts
- [ ] AI draft generation works (test with lesson)
- [ ] Store management loads affiliates/inventory
- [ ] User management shows user list
- [ ] HTTPS working (no mixed content warnings)
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

---

## Security Considerations

1. **HTTPS Required** - All traffic over TLS
2. **Session Security** - HttpOnly, Secure, SameSite cookies
3. **Admin IP Restriction** (optional) - Limit admin access to specific IPs via WAF
4. **Secrets Rotation** - Use Secrets Manager with rotation policies
5. **Database Security** - RDS in private subnet, security group restricted
6. **Logging** - Enable CloudWatch for audit trail

---

## Cost Estimate (Monthly)

| Service | Estimated Cost |
|---------|---------------|
| RDS db.t3.small | ~$25 |
| ECS Fargate (0.5 vCPU, 1GB) | ~$15 |
| ALB | ~$20 |
| Route 53 | ~$1 |
| Secrets Manager | ~$2 |
| CloudWatch | ~$5 |
| **Total** | **~$70/month** |

---

## Support Files Location

- **Schema Definition:** `shared/schema.ts`
- **Admin API Routes:** `server/admin-routes.ts`
- **Admin Auth Logic:** `server/admin-auth.ts`
- **Admin Frontend Pages:** `client/src/admin/pages/`
- **Admin Components:** `client/src/admin/components/`

---

## Contact

For questions about this codebase, refer to the inline comments or the main `replit.md` documentation file in the project root.
