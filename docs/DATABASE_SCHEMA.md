# HODLearn Community Forums - Database Schema

This document provides the complete database schema for the Reddit-style community forums feature.

## Overview

The community forums system uses PostgreSQL with Drizzle ORM. The schema consists of core tables for forum functionality plus tables for the advertising system.

---

## Forum Tables

### forum_categories

Defines topic categories for organizing discussions.

```sql
CREATE TABLE forum_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  post_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Current Categories (10):**
| Slug | Name | Description |
|------|------|-------------|
| bitcoin-basics | Bitcoin Basics | Fundamental concepts and beginner questions |
| why-bitcoin | Why Bitcoin | Value proposition and monetary properties |
| stacking-strategy | Stacking & Strategy | DCA strategies and accumulation methods |
| macro-markets | Macro & Markets | Economic analysis and market cycles |
| security-self-custody | Security & Self-Custody | Hardware wallets and seed phrases |
| bitcoin-lifestyle | Bitcoin Lifestyle | Living on Bitcoin and personal finance |
| career-business | Career & Business | Professional opportunities in Bitcoin |
| orange-pilling | Orange Pilling | Sharing knowledge with others |
| news-events | News & Events | Latest developments and announcements |
| community | Community | General discussion and meetups |

---

### forum_posts

Main posts in the forum, supporting text, images, links, and video content.

```sql
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  day_index INTEGER,                -- Link to specific curriculum day if applicable
  is_sticky BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  flair TEXT,                        -- Post type tag
  image_url TEXT,                    -- Direct image URL
  link_url TEXT,                     -- External link URL
  link_preview JSON,                 -- { title, description, image, siteName, type }
  reply_count INTEGER NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMP,
  last_reply_user_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Flair/Tag Values:**
- `discussion` - Open-ended conversation starters
- `question` - Q&A posts seeking answers
- `video` - Video/YouTube content
- `article` - Long-form educational content
- `meme` - Humor and memes
- `security` - Security-related posts
- `news` - News updates
- `chart` - Charts and analysis

---

### forum_replies

Replies to posts.

```sql
CREATE TABLE forum_replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### forum_post_stats

Denormalized statistics for each post (for performance).

```sql
CREATE TABLE forum_post_stats (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,      -- Always 0 (upvote-only system)
  hot_score NUMERIC(10,4) NOT NULL DEFAULT 0,
  trending_score NUMERIC(10,4) NOT NULL DEFAULT 0,
  controversy_score NUMERIC(10,4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Note:** The `downvotes` column is retained for schema compatibility but is always 0. The system uses upvote-only voting for positive community culture.

---

### forum_reply_stats

Denormalized statistics for each reply with threading support.

```sql
CREATE TABLE forum_reply_stats (
  id SERIAL PRIMARY KEY,
  reply_id INTEGER NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
  parent_reply_id INTEGER REFERENCES forum_replies(id),  -- For threading
  depth INTEGER NOT NULL DEFAULT 0,           -- Nesting level
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,       -- Always 0
  child_count INTEGER NOT NULL DEFAULT 0,     -- Number of direct children
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### forum_votes

Tracks user votes on posts and replies.

```sql
CREATE TABLE forum_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL,           -- 'upvote' only
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### user_karma

Tracks karma points earned through community participation.

```sql
CREATE TABLE user_karma (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_karma INTEGER NOT NULL DEFAULT 0,
  post_karma INTEGER NOT NULL DEFAULT 0,
  comment_karma INTEGER NOT NULL DEFAULT 0,
  awarded_karma INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Karma Rates:**
- Post upvote: +10 karma to post author
- Reply upvote: +5 karma to reply author

---

## Advertising Tables

### ad_campaigns

Defines advertising campaigns with budget tracking.

```sql
CREATE TABLE ad_campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  advertiser TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',   -- draft, active, paused, completed
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  budget_cents INTEGER,
  spent_cents INTEGER NOT NULL DEFAULT 0,
  cost_per_click_cents INTEGER,
  cost_per_impression_cents INTEGER,
  target_impressions INTEGER,
  target_clicks INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### ad_creatives

Individual ad units within campaigns.

```sql
CREATE TABLE ad_creatives (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  image_url TEXT,
  logo_url TEXT,
  category TEXT,
  placement TEXT NOT NULL DEFAULT 'in_feed',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### ad_impressions

Tracks when ads are viewed by users.

```sql
CREATE TABLE ad_impressions (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER,
  session_id TEXT,
  placement TEXT NOT NULL,
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

### ad_clicks

Tracks when users click on ads.

```sql
CREATE TABLE ad_clicks (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  user_id INTEGER,
  session_id TEXT,
  clicked_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Users Table (Reference)

The forum system references a `users` table. Your authentication system should provide:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  -- Your auth system's additional fields
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Required fields for forum integration:**
- `id` - Unique user identifier
- `username` - Display name in forum

---

## Drizzle Schema Reference

The TypeScript schema definitions are located in `shared/schema.ts`. Key exports:

```typescript
// Tables
export const forumCategories
export const forumPosts
export const forumPostStats
export const forumReplies
export const forumReplyStats
export const forumVotes
export const userKarma
export const adCampaigns
export const adCreatives
export const adImpressions
export const adClicks

// Insert schemas (for validation)
export const insertForumPostSchema
export const insertForumReplySchema

// Types
export type ForumCategory = typeof forumCategories.$inferSelect
export type ForumPost = typeof forumPosts.$inferSelect
export type ForumReply = typeof forumReplies.$inferSelect
```

---

## Migration Notes

1. Run `npx drizzle-kit push` to apply schema changes
2. Use `seed-community.ts` to populate initial data
3. The schema uses Drizzle ORM - see `drizzle.config.ts` for configuration
