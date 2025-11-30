# HODLearn Community Forums - Database Schema

This document provides the complete database schema for the Reddit-style community forums feature.

## Overview

The community forums system uses PostgreSQL with Drizzle ORM. The schema consists of 6 core tables for the forum functionality plus 4 tables for the advertising system.

---

## Forum Tables

### forum_categories

Defines the 10 topic categories for organizing discussions.

```sql
CREATE TABLE forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  color VARCHAR(7),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Default Categories:**
| ID | Name | Slug | Description |
|----|------|------|-------------|
| 1 | Bitcoin Basics | bitcoin-basics | Fundamental concepts and beginner questions |
| 2 | Why Bitcoin | why-bitcoin | Value proposition and monetary properties |
| 3 | Stacking & Strategy | stacking-strategy | DCA strategies and accumulation methods |
| 4 | Macro & Markets | macro-markets | Economic analysis and market cycles |
| 5 | Security & Self-Custody | security-self-custody | Hardware wallets and seed phrases |
| 6 | Bitcoin Lifestyle | bitcoin-lifestyle | Living on Bitcoin and personal finance |
| 7 | Career & Business | career-business | Professional opportunities in Bitcoin |
| 8 | Orange Pilling | orange-pilling | Sharing knowledge with others |
| 9 | News & Events | news-events | Latest developments and announcements |
| 10 | Community | community | General discussion and meetups |

---

### forum_posts

Main posts in the forum, supporting text, images, links, and video content.

```sql
CREATE TABLE forum_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  category_id INTEGER NOT NULL REFERENCES forum_categories(id),
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  flair VARCHAR(50),        -- Tag: question, discussion, article, media, meme
  link_url TEXT,            -- External link for link posts
  image_url TEXT,           -- Image URL for image posts
  video_url TEXT,           -- YouTube/video URL for video posts
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Flair/Tag Values:**
- `question` - Q&A posts seeking answers
- `discussion` - Open-ended conversation starters
- `article` - Long-form educational content
- `media` - Video/multimedia content
- `meme` - Humor and memes

---

### forum_post_stats

Denormalized statistics for each post (for performance).

```sql
CREATE TABLE forum_post_stats (
  id SERIAL PRIMARY KEY,
  post_id INTEGER UNIQUE NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,      -- Always 0 (upvote-only system)
  reply_count INTEGER DEFAULT 0,
  hot_score NUMERIC(10,4) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Note:** The `downvotes` column is retained for schema compatibility but is always 0. The system uses upvote-only voting for positive community culture.

---

### forum_replies

Threaded replies to posts, supporting nested discussions.

```sql
CREATE TABLE forum_replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  parent_reply_id INTEGER REFERENCES forum_replies(id),  -- For threading
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### forum_reply_stats

Denormalized statistics for each reply.

```sql
CREATE TABLE forum_reply_stats (
  id SERIAL PRIMARY KEY,
  reply_id INTEGER UNIQUE NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_reply_id INTEGER REFERENCES forum_replies(id),
  depth INTEGER DEFAULT 0,          -- Nesting level (0 = top-level)
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,      -- Always 0
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### user_karma

Tracks karma points earned through community participation.

```sql
CREATE TABLE user_karma (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  total_karma INTEGER DEFAULT 0,
  post_karma INTEGER DEFAULT 0,     -- Karma from post upvotes
  comment_karma INTEGER DEFAULT 0,  -- Karma from reply upvotes
  awarded_karma INTEGER DEFAULT 0,  -- Manual awards (future)
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Karma Rates:**
- Post upvote: +10 karma to post author
- Reply upvote: +5 karma to reply author

---

## Voting Tables

### post_votes

Tracks user votes on posts.

```sql
CREATE TABLE post_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL,   -- 'up' only
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

---

### reply_votes

Tracks user votes on replies.

```sql
CREATE TABLE reply_votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  reply_id INTEGER NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL,   -- 'up' only
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, reply_id)
);
```

---

## Advertising Tables

### ad_campaigns

Defines advertising campaigns with budget tracking.

```sql
CREATE TABLE ad_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  advertiser VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',   -- draft, active, paused, completed
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  budget_cents INTEGER DEFAULT 0,
  spent_cents INTEGER DEFAULT 0,
  cost_per_click_cents INTEGER DEFAULT 0,
  cost_per_impression_cents INTEGER DEFAULT 0,
  target_impressions INTEGER,
  target_clicks INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### ad_creatives

Individual ad units within campaigns.

```sql
CREATE TABLE ad_creatives (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cta_text VARCHAR(50),             -- Call-to-action button text
  cta_url TEXT,                     -- Click destination
  image_url TEXT,                   -- Ad image
  logo_url TEXT,                    -- Advertiser logo
  category VARCHAR(50),             -- Target category (optional)
  placement VARCHAR(20) DEFAULT 'in_feed',  -- in_feed, sidebar, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### ad_impressions

Tracks when ads are viewed by users.

```sql
CREATE TABLE ad_impressions (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  ip_hash VARCHAR(64),
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

---

### ad_clicks

Tracks when users click on ads.

```sql
CREATE TABLE ad_clicks (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  ip_hash VARCHAR(64),
  clicked_at TIMESTAMP DEFAULT NOW()
);
```

---

## Indexes (Recommended)

```sql
-- Forum performance indexes
CREATE INDEX idx_posts_category ON forum_posts(category_id);
CREATE INDEX idx_posts_user ON forum_posts(user_id);
CREATE INDEX idx_posts_created ON forum_posts(created_at DESC);
CREATE INDEX idx_post_stats_hot ON forum_post_stats(hot_score DESC);
CREATE INDEX idx_replies_post ON forum_replies(post_id);
CREATE INDEX idx_replies_parent ON forum_replies(parent_reply_id);

-- Voting indexes
CREATE INDEX idx_post_votes_post ON post_votes(post_id);
CREATE INDEX idx_reply_votes_reply ON reply_votes(reply_id);

-- Ad tracking indexes
CREATE INDEX idx_impressions_creative ON ad_impressions(creative_id);
CREATE INDEX idx_clicks_creative ON ad_clicks(creative_id);
CREATE INDEX idx_impressions_time ON ad_impressions(viewed_at);
CREATE INDEX idx_clicks_time ON ad_clicks(clicked_at);
```

---

## Users Table (Reference)

The forum system references a `users` table. Your authentication system should provide:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  -- Your auth system's additional fields
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Required fields for forum integration:**
- `id` - Unique user identifier
- `username` - Display name in forum
- `avatar_url` (optional) - User avatar image

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
export const userKarma
export const postVotes
export const replyVotes
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

1. Run `npm run db:push` to apply schema changes
2. Use `seed-community.ts` to populate initial data
3. The schema uses Drizzle ORM - see `drizzle.config.ts` for configuration
