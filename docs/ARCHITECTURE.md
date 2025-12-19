# HODLearn System Architecture

> Comprehensive architectural overview of the HODLearn Bitcoin Education Platform

## System Overview

HODLearn is a full-stack web application for daily Bitcoin education featuring a consumer learning app and a separate admin portal. The system is built on a React/Express/PostgreSQL stack with multiple external integrations.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              HODLearn Platform                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────┐     ┌──────────────────────────────┐          │
│  │     CONSUMER APPLICATION     │     │      ADMIN PORTAL            │          │
│  │  ─────────────────────────── │     │  ─────────────────────────── │          │
│  │  • Daily Learning (180 days) │     │  • KPI Dashboard             │          │
│  │  • Quiz System               │     │  • Content Management        │          │
│  │  • Gamified Wallet           │     │  • Marketing & Ads           │          │
│  │  • Community Forums          │     │  • Social Media Hub          │          │
│  │  • Simulators                │     │  • Store & Affiliates        │          │
│  │  • Video Library             │     │  • User Management           │          │
│  │                              │     │  • B2B CRM                   │          │
│  │  Auth: userSessions          │     │  • Product Roadmap           │          │
│  │  Port: 5000                  │     │  • Goals (OKRs)              │          │
│  │                              │     │                              │          │
│  │                              │     │  Auth: adminSessions         │          │
│  │                              │     │  Port: 5000 (/admin/*)       │          │
│  └──────────────────────────────┘     └──────────────────────────────┘          │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         EXPRESS.JS BACKEND                               │    │
│  │  ────────────────────────────────────────────────────────────────────── │    │
│  │  server/routes.ts       → Consumer API endpoints                        │    │
│  │  server/admin-routes.ts → Admin API endpoints                           │    │
│  │  server/wallet-routes.ts→ Gamified wallet system                        │    │
│  │  server/community.ts    → Forum & voting                                │    │
│  │  server/auth.ts         → Consumer authentication                       │    │
│  │  server/admin-auth.ts   → Admin authentication                          │    │
│  │  server/webhookHandlers.ts → Stripe webhook processing                  │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                     POSTGRESQL DATABASE (Neon)                          │    │
│  │  ────────────────────────────────────────────────────────────────────── │    │
│  │  67 tables organized into 15 logical modules                            │    │
│  │  ORM: Drizzle ORM with type-safe queries                               │    │
│  │  Validation: drizzle-zod for insert/update schemas                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## High-Level Architecture Diagram

```
                                    ┌─────────────────┐
                                    │   Web Browser   │
                                    │   (Port 5000)   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │  Consumer Routes  │    │   Admin Routes    │    │  Public Routes    │
        │  (/*, /learn, etc)│    │  (/admin/*)       │    │ (/landing, /auth) │
        └─────────┬─────────┘    └─────────┬─────────┘    └─────────┬─────────┘
                  │                        │                        │
                  │    ┌───────────────────┴───────────────────┐    │
                  │    │                                       │    │
                  ▼    ▼                                       ▼    ▼
        ┌────────────────────────────────────────────────────────────────────┐
        │                         REACT FRONTEND                              │
        │  ──────────────────────────────────────────────────────────────── │
        │                                                                    │
        │  ┌─────────────────────┐              ┌────────────────────────┐  │
        │  │  Consumer App       │              │  Admin Portal          │  │
        │  │  ─────────────────  │              │  ──────────────────    │  │
        │  │  AuthGuard          │              │  AdminAuthGuard        │  │
        │  │  NewUserRedirect    │              │  AdminLayout           │  │
        │  │                     │              │                        │  │
        │  │  Pages:             │              │  Pages:                │  │
        │  │  • HomePage         │              │  • KPIDashboard        │  │
        │  │  • LearnPage        │              │  • ContentManagement   │  │
        │  │  • FinancePage      │              │  • MarketingManagement │  │
        │  │  • SimulatorsPage   │              │  • SocialMediaHub      │  │
        │  │  • CommunityPage    │              │  • StoreManagement     │  │
        │  │  • WalletPage       │              │  • UsersManagement     │  │
        │  │  • AccountPage      │              │  • CRMManagement       │  │
        │  │  • MorePage         │              │  • RoadmapManagement   │  │
        │  │                     │              │  • GoalsManagement     │  │
        │  └─────────────────────┘              └────────────────────────┘  │
        │                                                                    │
        │  Shared Infrastructure:                                            │
        │  • QueryClientProvider (TanStack Query)                            │
        │  • SubscriptionProvider (Stripe context)                           │
        │  • TooltipProvider, Toaster (UI feedback)                          │
        │  • Router (Wouter)                                                 │
        └────────────────────────────────────────────────────────────────────┘
                                         │
                                         │ HTTP/REST API
                                         ▼
        ┌────────────────────────────────────────────────────────────────────┐
        │                        EXPRESS.JS SERVER                            │
        │  ──────────────────────────────────────────────────────────────── │
        │                                                                    │
        │  ┌─────────────────────────────────────────────────────────────┐  │
        │  │                     MIDDLEWARE LAYER                         │  │
        │  │  • Session management (connect-pg-simple)                    │  │
        │  │  • Request validation (Zod schemas)                          │  │
        │  │  • Content protection (premium content gating)               │  │
        │  │  • Error handling                                            │  │
        │  │  • Compression                                               │  │
        │  └─────────────────────────────────────────────────────────────┘  │
        │                                                                    │
        │  ┌──────────────────────┐    ┌──────────────────────────────────┐ │
        │  │  Consumer Routes     │    │  Admin Routes                    │ │
        │  │  (server/routes.ts)  │    │  (server/admin-routes.ts)        │ │
        │  │  ──────────────────  │    │  ────────────────────────────    │ │
        │  │                      │    │                                  │ │
        │  │  /api/user           │    │  /api/admin/login                │ │
        │  │  /api/auth/*         │    │  /api/admin/me                   │ │
        │  │  /api/content/*      │    │  /api/admin/content/*            │ │
        │  │  /api/progress/*     │    │  /api/admin/campaigns/*          │ │
        │  │  /api/quiz/*         │    │  /api/admin/social/*             │ │
        │  │  /api/forum/*        │    │  /api/admin/store/*              │ │
        │  │  /api/wallet/*       │    │  /api/admin/crm/*                │ │
        │  │  /api/community/*    │    │  /api/admin/roadmap/*            │ │
        │  │  /api/simulators/*   │    │  /api/admin/goals/*              │ │
        │  │  /api/subscription/* │    │  /api/admin/users/*              │ │
        │  │  /api/ads/*          │    │  /api/admin/kpis/*               │ │
        │  └──────────────────────┘    └──────────────────────────────────┘ │
        │                                                                    │
        │  ┌─────────────────────────────────────────────────────────────┐  │
        │  │                    WEBHOOK HANDLERS                          │  │
        │  │  • Stripe webhooks (subscription events)                     │  │
        │  │  • stripe-replit-sync integration                            │  │
        │  └─────────────────────────────────────────────────────────────┘  │
        └────────────────────────────────────────────────────────────────────┘
                                         │
                                         │ Drizzle ORM
                                         ▼
        ┌────────────────────────────────────────────────────────────────────┐
        │                    POSTGRESQL DATABASE (Neon)                       │
        │  ──────────────────────────────────────────────────────────────── │
        │                                                                    │
        │  See "Database Schema" section below for complete table listing    │
        │                                                                    │
        └────────────────────────────────────────────────────────────────────┘
```

---

## External Integrations

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐  │
│  │       STRIPE        │    │     COINGECKO       │    │    ANTHROPIC AI     │  │
│  │  ─────────────────  │    │  ─────────────────  │    │  ─────────────────  │  │
│  │                     │    │                     │    │                     │  │
│  │  Subscription       │    │  Bitcoin Price API  │    │  Claude Sonnet      │  │
│  │  billing & mgmt     │    │  (Live + cached)    │    │  (Social drafts)    │  │
│  │                     │    │                     │    │                     │  │
│  │  stripe-replit-sync │    │  server/            │    │  AI Integration     │  │
│  │  webhookHandlers.ts │    │  bitcoin-price.ts   │    │  for admin portal   │  │
│  │                     │    │                     │    │                     │  │
│  │  Tables:            │    │  Consumer: Live API │    │  Used in:           │  │
│  │  • subscriptions    │    │  Admin: Cached DB   │    │  • SocialMediaHub   │  │
│  │  (managed by sync)  │    │                     │    │  • Content drafts   │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────────┘  │
│                                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐                             │
│  │  GOOGLE ANALYTICS   │    │       NEON          │                             │
│  │  ─────────────────  │    │  ─────────────────  │                             │
│  │                     │    │                     │                             │
│  │  Client-side        │    │  Serverless         │                             │
│  │  telemetry          │    │  PostgreSQL         │                             │
│  │                     │    │                     │                             │
│  │  Page views, events │    │  @neondatabase/     │                             │
│  │  conversion tracking│    │  serverless driver  │                             │
│  └─────────────────────┘    └─────────────────────┘                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  CONSUMER APP                              ADMIN PORTAL                          │
│  ────────────                              ────────────                          │
│                                                                                  │
│  ┌─────────────────────┐                   ┌─────────────────────┐              │
│  │   users table       │                   │   admin_users table │              │
│  │   ───────────       │                   │   ─────────────────  │              │
│  │   id, username,     │                   │   id, email,        │              │
│  │   email,            │                   │   passwordHash,     │              │
│  │   passwordHash,     │                   │   role (admin/      │              │
│  │   firstName,        │                   │   super_admin),     │              │
│  │   lastName,         │                   │   isActive          │              │
│  │   currentStreak,    │                   │                     │              │
│  │   completedLessons  │                   │                     │              │
│  └──────────┬──────────┘                   └──────────┬──────────┘              │
│             │                                         │                          │
│             ▼                                         ▼                          │
│  ┌─────────────────────┐                   ┌─────────────────────┐              │
│  │  user_sessions      │                   │  admin_sessions     │              │
│  │  ───────────────    │                   │  ───────────────    │              │
│  │  id (UUID PK)       │                   │  id (UUID PK)       │              │
│  │  userId (FK)        │                   │  adminId (FK)       │              │
│  │  expiresAt          │                   │  expiresAt          │              │
│  │  lastUsed           │                   │  lastUsed           │              │
│  └──────────┬──────────┘                   └──────────┬──────────┘              │
│             │                                         │                          │
│             ▼                                         ▼                          │
│  ┌─────────────────────┐                   ┌─────────────────────┐              │
│  │  AuthGuard          │                   │  AdminAuthGuard     │              │
│  │  (client component) │                   │  (client component) │              │
│  │  ───────────────    │                   │  ───────────────    │              │
│  │  localStorage:      │                   │  localStorage:      │              │
│  │  'hodlearn_session' │                   │  'hodlearn_admin_   │              │
│  │                     │                   │   session'          │              │
│  │  Redirects to:      │                   │                     │              │
│  │  /landing           │                   │  Redirects to:      │              │
│  │                     │                   │  /admin/login       │              │
│  └─────────────────────┘                   └─────────────────────┘              │
│                                                                                  │
│  AUTHENTICATION ENDPOINTS:                                                       │
│  ────────────────────────                                                        │
│  Consumer: /api/auth/register, /api/auth/login, /api/auth/logout                │
│            /api/auth/forgot-password, /api/auth/reset-password                  │
│  Admin:    /api/admin/login, /api/admin/logout, /api/admin/me                   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (67 Tables)

### Complete Module Organization

The database schema is organized into **15 logical modules** with **67 tables** defined in `shared/schema.ts`. An additional `subscriptions` table is managed externally by `stripe-replit-sync`.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA BY MODULE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 1: CONSUMER AUTHENTICATION (4 tables)                            ║    │
│  ║  ─────────────────────────────────────────────                           ║    │
│  ║  users                    │ Consumer accounts, streaks, UTM tracking    ║    │
│  ║  user_sessions            │ Consumer session tokens (UUID PK)           ║    │
│  ║  password_reset_tokens    │ Password recovery flow                      ║    │
│  ║  email_collections        │ Lead capture for gated content              ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 2: ADMIN AUTHENTICATION (2 tables)                               ║    │
│  ║  ───────────────────────────────────────                                 ║    │
│  ║  admin_users              │ Admin portal accounts (role-based)          ║    │
│  ║  admin_sessions           │ Admin session tokens (UUID PK)              ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 3: CONTENT CURRICULUM (6 tables)                                 ║    │
│  ║  ─────────────────────────────────────                                   ║    │
│  ║  content_days             │ Day metadata (theme, reading level, status) ║    │
│  ║  content_set_up_questions │ Daily "set up" questions                    ║    │
│  ║  content_lessons          │ Main lesson content per day                 ║    │
│  ║  content_quizzes          │ Quiz questions per day                      ║    │
│  ║  content_metadata         │ Generation tracking, quality scores         ║    │
│  ║  content_generation_steps │ Content creation workflow steps             ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 4: USER PROGRESS & LEARNING (6 tables)                           ║    │
│  ║  ─────────────────────────────────────────                               ║    │
│  ║  user_progress            │ Day-by-day completion tracking              ║    │
│  ║  user_quiz_answers        │ Individual quiz answer history              ║    │
│  ║  daily_activities         │ Calendar activity tracking                  ║    │
│  ║  simulator_completions    │ Interactive simulator progress              ║    │
│  ║  knowledge_areas          │ Topic mastery tracking                      ║    │
│  ║  conviction_content       │ Quotes and videos shown during learning     ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 5: GAMIFIED WALLET ECONOMY (5 tables)                            ║    │
│  ║  ────────────────────────────────────────                                ║    │
│  ║  user_wallet_progress     │ Total sats earned, multiplier               ║    │
│  ║  wallet_earnings          │ Individual earning events with USD value    ║    │
│  ║  wallet_achievements      │ Achievement badges unlocked                 ║    │
│  ║  streak_rewards           │ Streak milestone bonuses (7/30/365 day)     ║    │
│  ║  streak_insurance         │ Streak protection purchases                 ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 6: COMMUNITY FORUMS (8 tables)                                   ║    │
│  ║  ───────────────────────────────                                         ║    │
│  ║  forum_categories         │ Forum sections                              ║    │
│  ║  forum_posts              │ User-created posts with flair               ║    │
│  ║  forum_replies            │ Threaded replies                            ║    │
│  ║  forum_votes              │ Upvote tracking (upvote-only system)        ║    │
│  ║  forum_post_stats         │ Aggregated votes, hot/trending scores       ║    │
│  ║  forum_reply_stats        │ Reply vote aggregates with threading        ║    │
│  ║  user_karma               │ User reputation tracking                    ║    │
│  ║  daily_discussions        │ Day-linked community discussions            ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 7: VIDEO LIBRARY (6 tables)                                      ║    │
│  ║  ────────────────────────────                                            ║    │
│  ║  video_categories         │ Main video categories                       ║    │
│  ║  video_subcategories      │ Nested subcategories                        ║    │
│  ║  curated_videos           │ YouTube videos with metadata, community     ║    │
│  ║  user_video_engagement    │ Watch progress tracking                     ║    │
│  ║  success_stories          │ User success story submissions              ║    │
│  ║  story_features           │ Featured story curation                     ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 8: MARKETING & ADVERTISING (6 tables)                            ║    │
│  ║  ──────────────────────────────────────                                  ║    │
│  ║  advertising_clients      │ B2B advertising customers                   ║    │
│  ║  ad_campaigns             │ Campaign management (CPC/CPM)               ║    │
│  ║  ad_creatives             │ Individual ad units with placement          ║    │
│  ║  ad_impressions           │ View tracking with session                  ║    │
│  ║  ad_clicks                │ Click tracking with session                 ║    │
│  ║  invoices                 │ Client billing with status                  ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 9: SOCIAL MEDIA MANAGEMENT (4 tables)                            ║    │
│  ║  ──────────────────────────────────────                                  ║    │
│  ║  social_posts             │ Scheduled/posted content (dual-status)      ║    │
│  ║  social_post_metrics      │ Engagement metrics from platforms           ║    │
│  ║  social_accounts          │ Connected platform credentials              ║    │
│  ║  attribution_events       │ UTM-based conversion tracking               ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 10: STORE (3 tables)                                             ║    │
│  ║  ─────────────────────                                                   ║    │
│  ║  store_products           │ HODLearn merchandise                        ║    │
│  ║  store_orders             │ Customer orders with status                 ║    │
│  ║  store_order_items        │ Order line items                            ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 11: AFFILIATES & REFERRALS (4 tables)                            ║    │
│  ║  ─────────────────────────────────────                                   ║    │
│  ║  affiliate_products       │ External affiliate products (wallets, etc.) ║    │
│  ║  affiliate_clicks         │ Affiliate link click tracking               ║    │
│  ║  referral_partners        │ Exchange/service partners                   ║    │
│  ║  referral_signups         │ Partner referral conversions                ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 12: B2B CRM (4 tables)                                           ║    │
│  ║  ─────────────────────────                                               ║    │
│  ║  crm_companies            │ B2B prospect/customer companies             ║    │
│  ║  crm_contacts             │ Company contacts                            ║    │
│  ║  crm_deals                │ Sales opportunities/pipeline                ║    │
│  ║  crm_activities           │ Deal activity log (calls, emails, etc.)     ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 13: PRODUCT ROADMAP (2 tables)                                   ║    │
│  ║  ───────────────────────────────                                         ║    │
│  ║  roadmap_ideas            │ Feature ideas with effort/impact scoring    ║    │
│  ║  roadmap_releases         │ Version planning with target dates          ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 14: GOALS & OKRs (4 tables)                                      ║    │
│  ║  ────────────────────────────                                            ║    │
│  ║  objectives               │ Strategic objectives                        ║    │
│  ║  key_results              │ Measurable key results                      ║    │
│  ║  key_result_updates       │ Progress check-ins                          ║    │
│  ║  kpi_targets              │ Automated KPI goal tracking                 ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
│  ╔═════════════════════════════════════════════════════════════════════════╗    │
│  ║  MODULE 15: MARKET DATA (3 tables)                                       ║    │
│  ║  ───────────────────────────                                             ║    │
│  ║  bitcoin_price            │ Historical price cache                      ║    │
│  ║  treasury_companies       │ Corporate BTC holdings                      ║    │
│  ║  sovereign_adoption       │ Government/entity adoption                  ║    │
│  ║                                                                          ║    │
│  ║  External: subscriptions table managed by stripe-replit-sync            ║    │
│  ╚═════════════════════════════════════════════════════════════════════════╝    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Table Count Summary

| Module | Tables | Count |
|--------|--------|-------|
| 1. Consumer Auth | users, user_sessions, password_reset_tokens, email_collections | 4 |
| 2. Admin Auth | admin_users, admin_sessions | 2 |
| 3. Content Curriculum | content_days, content_set_up_questions, content_lessons, content_quizzes, content_metadata, content_generation_steps | 6 |
| 4. User Progress | user_progress, user_quiz_answers, daily_activities, simulator_completions, knowledge_areas, conviction_content | 6 |
| 5. Gamified Wallet | user_wallet_progress, wallet_earnings, wallet_achievements, streak_rewards, streak_insurance | 5 |
| 6. Community Forums | forum_categories, forum_posts, forum_replies, forum_votes, forum_post_stats, forum_reply_stats, user_karma, daily_discussions | 8 |
| 7. Video Library | video_categories, video_subcategories, curated_videos, user_video_engagement, success_stories, story_features | 6 |
| 8. Marketing & Ads | advertising_clients, ad_campaigns, ad_creatives, ad_impressions, ad_clicks, invoices | 6 |
| 9. Social Media | social_posts, social_post_metrics, social_accounts, attribution_events | 4 |
| 10. Store | store_products, store_orders, store_order_items | 3 |
| 11. Affiliates & Referrals | affiliate_products, affiliate_clicks, referral_partners, referral_signups | 4 |
| 12. B2B CRM | crm_companies, crm_contacts, crm_deals, crm_activities | 4 |
| 13. Product Roadmap | roadmap_ideas, roadmap_releases | 2 |
| 14. Goals & OKRs | objectives, key_results, key_result_updates, kpi_targets | 4 |
| 15. Market Data | bitcoin_price, treasury_companies, sovereign_adoption | 3 |
| **TOTAL** | | **67** |

**Note:** The `subscriptions` table is managed externally by `stripe-replit-sync` and auto-created in the database. It is not defined in `shared/schema.ts` but is used by the KPI Dashboard for counting paid users.

---

## Data Flow Diagrams

### Consumer Learning Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CONSUMER LEARNING DATA FLOW                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  User opens app                                                                  │
│       │                                                                          │
│       ▼                                                                          │
│  ┌─────────────┐    Query: /api/user    ┌─────────────┐                         │
│  │ AuthGuard   │ ─────────────────────► │ Express     │                         │
│  │             │ ◄───────────────────── │ Backend     │                         │
│  └─────────────┘    { user, progress }  └──────┬──────┘                         │
│       │                                         │                                │
│       │ Authenticated                           │ DB Query                       │
│       ▼                                         ▼                                │
│  ┌─────────────┐                        ┌─────────────┐                         │
│  │ HomePage    │                        │ PostgreSQL  │                         │
│  │             │                        │ (Neon)      │                         │
│  └──────┬──────┘                        └─────────────┘                         │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │  DAILY LEARNING SEQUENCE                                            │        │
│  │  ─────────────────────────                                           │        │
│  │                                                                      │        │
│  │  1. Set-Up Questions     →  /api/content/day/:dayIndex              │        │
│  │     └─ content_set_up_questions                                      │        │
│  │                                                                      │        │
│  │  2. Lesson Content       →  /api/content/day/:dayIndex              │        │
│  │     └─ content_lessons, conviction_content                          │        │
│  │                                                                      │        │
│  │  3. Quiz                 →  /api/quiz/submit                        │        │
│  │     └─ content_quizzes, user_quiz_answers                           │        │
│  │     └─ Wallet earnings: wallet_earnings, user_wallet_progress       │        │
│  │                                                                      │        │
│  │  4. Progress Update      →  /api/progress/update                    │        │
│  │     └─ user_progress, daily_activities                              │        │
│  │     └─ Streak calculation: users.currentStreak                      │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
│  CoinGecko API ──► Live BTC Price ──► Wallet USD Value Display                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Stripe Subscription Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         STRIPE SUBSCRIPTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  User clicks "Subscribe"                                                         │
│       │                                                                          │
│       ▼                                                                          │
│  ┌─────────────────────┐    Stripe Checkout Session    ┌─────────────────────┐  │
│  │ React Frontend      │ ────────────────────────────► │ Stripe API          │  │
│  │ (Subscription       │                               │                     │  │
│  │  Provider)          │                               │                     │  │
│  └─────────────────────┘                               └──────────┬──────────┘  │
│                                                                   │              │
│                                                                   │ Webhook      │
│                                                                   ▼              │
│  ┌─────────────────────┐    stripe-replit-sync         ┌─────────────────────┐  │
│  │ PostgreSQL          │ ◄──────────────────────────── │ webhookHandlers.ts  │  │
│  │ subscriptions table │    Automatic sync             │ Express endpoint    │  │
│  └─────────────────────┘                               └─────────────────────┘  │
│                                                                                  │
│  KPI Dashboard reads subscriptions table for "Paid Users" metric                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Admin Social Media Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SOCIAL MEDIA WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Admin creates post draft                                                        │
│       │                                                                          │
│       ▼                                                                          │
│  ┌─────────────────────┐    Optional AI    ┌─────────────────────┐              │
│  │ SocialMediaHub      │ ────────────────► │ Anthropic Claude    │              │
│  │ "Generate Draft"    │                   │ (Sonnet 4.5)        │              │
│  │                     │ ◄──────────────── │                     │              │
│  └─────────────────────┘    Draft content  └─────────────────────┘              │
│       │                                                                          │
│       │ contentStatus: 'drafted'                                                │
│       ▼                                                                          │
│  ┌─────────────────────┐                                                        │
│  │ social_posts table  │  Workflow: drafted → approved → planned → posted       │
│  │                     │                                                        │
│  │  contentStatus:     │  Content approval (internal review)                    │
│  │   drafted/approved  │                                                        │
│  │                     │                                                        │
│  │  publishStatus:     │  Publication tracking (manual X/Twitter posting)       │
│  │   planned/posted    │                                                        │
│  └─────────────────────┘                                                        │
│       │                                                                          │
│       │ Manual posting to X/Twitter                                             │
│       ▼                                                                          │
│  ┌─────────────────────┐                                                        │
│  │ social_post_metrics │  Future: Sync metrics from platform APIs               │
│  │ attribution_events  │  UTM tracking for conversion attribution               │
│  └─────────────────────┘                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
hodlearn/
├── client/                          # React frontend
│   └── src/
│       ├── admin/                   # Admin portal
│       │   ├── components/
│       │   │   └── AdminLayout.tsx  # Sidebar, navigation
│       │   └── pages/
│       │       ├── KPIDashboard.tsx
│       │       ├── ContentManagement.tsx
│       │       ├── MarketingManagement.tsx
│       │       ├── SocialMediaHub.tsx
│       │       ├── StoreManagement.tsx
│       │       ├── UsersManagement.tsx
│       │       ├── CRMManagement.tsx
│       │       ├── RoadmapManagement.tsx
│       │       ├── GoalsManagement.tsx
│       │       └── AdminLoginPage.tsx
│       ├── components/              # Shared UI components
│       │   ├── ui/                  # shadcn components
│       │   └── shared/
│       ├── contexts/
│       │   └── SubscriptionContext.tsx
│       ├── hooks/
│       ├── lib/
│       │   └── queryClient.ts       # TanStack Query setup
│       ├── pages/                   # Consumer app pages
│       │   ├── HomePage.tsx
│       │   ├── LearnPage.tsx
│       │   ├── FinancePage.tsx
│       │   ├── SimulatorsPage.tsx
│       │   ├── CommunityPage.tsx
│       │   ├── WalletPage.tsx
│       │   ├── AccountPage.tsx
│       │   ├── MorePage.tsx
│       │   ├── LandingPage.tsx
│       │   └── auth.tsx
│       └── App.tsx                  # Router, auth guards
├── server/                          # Express backend
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # Consumer API routes
│   ├── admin-routes.ts              # Admin API routes
│   ├── wallet-routes.ts             # Wallet system routes
│   ├── community.ts                 # Forum/community routes
│   ├── auth.ts                      # Consumer auth logic
│   ├── admin-auth.ts                # Admin auth logic
│   ├── db.ts                        # Drizzle ORM setup
│   ├── storage.ts                   # Storage interface
│   ├── bitcoin-price.ts             # CoinGecko integration
│   ├── stripeClient.ts              # Stripe client setup
│   ├── webhookHandlers.ts           # Stripe webhook handlers
│   ├── content-validation.ts        # Content protection
│   └── vite.ts                      # Vite dev server
├── shared/
│   └── schema.ts                    # Database schema + types (1600+ lines)
├── docs/
│   ├── ARCHITECTURE.md              # This file
│   └── AWS_MIGRATION_PROJECT_SPEC.md
└── package.json
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Routing** | Wouter | Client-side routing |
| **State** | TanStack Query v5 | Server state management |
| **UI Components** | shadcn/ui + Radix UI | Component library |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Build** | Vite | Frontend bundler |
| **Backend** | Express.js | HTTP server |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Database** | PostgreSQL (Neon) | Data persistence |
| **Validation** | Zod + drizzle-zod | Schema validation |
| **Auth** | Custom sessions | Session-based authentication |
| **Payments** | Stripe + stripe-replit-sync | Subscription billing |
| **AI** | Anthropic Claude | Content generation |
| **Analytics** | Google Analytics | Usage tracking |
| **Price Data** | CoinGecko API | Bitcoin price feeds |

---

## Key Architectural Decisions

1. **Separate Auth Systems**: Consumer and admin use completely separate user tables and session management to enforce security isolation.

2. **Upvote-Only Voting**: Forum system implements Reddit-style voting but only allows upvotes to maintain positive community culture.

3. **Gamified Wallet**: In-app satoshi earnings tied to learning progress with real-time USD value display using live Bitcoin prices.

4. **Dual-Status Social Posts**: Social media posts track both content approval (drafted/approved) and publication state (planned/posted) separately.

5. **Database-First Content**: 180-day curriculum stored in database tables rather than static files for admin editability.

6. **Stripe-Replit-Sync**: Subscription data automatically synced to local database for fast reads and KPI calculations.

7. **Consumer Live Price / Admin Cached**: Consumer app fetches live BTC prices from CoinGecko; admin dashboards use cached database values.

---

*Last Updated: December 2024*
