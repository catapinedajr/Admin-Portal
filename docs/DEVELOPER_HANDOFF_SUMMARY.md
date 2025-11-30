# HODLearn Community Forums - Developer Handoff Summary

## What We Built

A **Reddit-style community forums feature** for the HODLearn Bitcoin education app. This is a complete, production-ready community system with the following capabilities:

### Core Features

1. **Forum Posts with Rich Media**
   - Text posts with markdown-style content
   - Image attachments (external URLs)
   - Link previews with Open Graph metadata extraction
   - YouTube video embeds with thumbnail facade pattern
   - Post tags/flairs: discussion, question, video, article, meme, security, news, chart

2. **Threaded Discussions**
   - Nested reply system with unlimited depth
   - Parent-child relationship tracking
   - Reply counts and last activity timestamps

3. **Upvote-Only Voting System**
   - Reddit-style voting (upvotes only, no downvotes)
   - Hot/trending/top/new sorting algorithms
   - Vote tracking per user to prevent duplicate votes

4. **Karma System**
   - Integrated with the app's "BTC Learning Wallet"
   - Post upvotes award 10 karma points
   - Reply upvotes award 5 karma points
   - Separate tracking: post karma, comment karma, awarded karma

5. **10 Topic Categories**
   - Bitcoin Basics, Economics & Money, Stacking Strategies
   - Market & Cycles, Security & Privacy, Living on Bitcoin
   - Career & Income, Orange Pilling, Global Adoption, Meetups & Events

6. **Native In-Feed Advertising**
   - Sponsored post cards that blend with organic content
   - Impression tracking (views)
   - Click tracking with timestamps
   - Campaign management structure

7. **Mobile-First Design**
   - Bottom action bars with pill-shaped buttons
   - Borderless feed with minimal dividers
   - Touch-friendly tap targets
   - Reddit native app-inspired aesthetics

---

## Where to Find Everything in Replit

### File Structure

```
/
├── client/                      # Frontend React application
│   └── src/
│       ├── pages/
│       │   └── CommunityPage.tsx    # Main community UI (posts, replies, voting)
│       ├── components/
│       │   └── ui/                  # Shadcn UI components
│       └── lib/
│           └── queryClient.ts       # API request utilities
│
├── server/                      # Backend Express server
│   ├── routes.ts                # All API endpoints (look for "/api/community/*")
│   ├── community.ts             # Community storage/database operations
│   ├── storage.ts               # Main storage interface
│   └── index.ts                 # Server entry point
│
├── shared/
│   └── schema.ts                # Database schema (Drizzle ORM definitions)
│
├── docs/                        # Documentation for your team
│   ├── DATABASE_SCHEMA.md       # Complete database table documentation
│   ├── API_REFERENCE.md         # All API endpoints with request/response examples
│   ├── AUTH_INTEGRATION.md      # How to integrate your own authentication
│   └── HANDOFF_README.md        # Setup instructions and dependencies
│
├── seed-community.ts            # Script to populate database with sample data
├── drizzle.config.ts            # Database migration configuration
└── package.json                 # Dependencies (do not modify directly)
```

### Key Files Your Team Should Review

| File | Purpose |
|------|---------|
| `shared/schema.ts` | All database table definitions - START HERE |
| `server/community.ts` | All database queries and business logic |
| `server/routes.ts` | API endpoints (search for "community" section) |
| `client/src/pages/CommunityPage.tsx` | Complete frontend UI implementation |
| `docs/API_REFERENCE.md` | API documentation with examples |

---

## Database

### Location
The database is PostgreSQL, managed through Replit's built-in database feature. Connection is via the `DATABASE_URL` environment variable.

### Tables Created

| Table | Purpose |
|-------|---------|
| `forum_categories` | 10 topic categories |
| `forum_posts` | User posts with rich media fields |
| `forum_post_stats` | Upvote counts, hot scores, trending scores |
| `forum_replies` | Threaded reply content |
| `forum_reply_stats` | Reply upvotes and threading metadata |
| `forum_votes` | Tracks who voted on what (prevents duplicates) |
| `user_karma` | Karma totals per user |
| `ad_campaigns` | Advertising campaign metadata |
| `ad_creatives` | Individual ad content/images |
| `ad_impressions` | View tracking |
| `ad_clicks` | Click tracking |

### Viewing the Database
In Replit, click the **Database** tab in the left sidebar to browse tables and data directly.

### Running Migrations
```bash
npx drizzle-kit push
```

### Seeding Sample Data
```bash
npx tsx seed-community.ts
```

---

## How to Run

### In Replit
1. Click the **Run** button or use the "Start application" workflow
2. The app runs on port 5000
3. Navigate to `/community` to see the forums

### Locally (for your team)
```bash
# Install dependencies
npm install

# Set environment variable
export DATABASE_URL="your-postgres-connection-string"

# Run migrations
npx drizzle-kit push

# Seed data (optional)
npx tsx seed-community.ts

# Start development server
npm run dev
```

---

## API Endpoints Summary

All community endpoints are under `/api/community/`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/forum-categories` | List all categories |
| GET | `/forum-posts` | List posts (supports ?categoryId, ?sortBy, ?flair) |
| GET | `/forum-posts/:postId` | Get single post |
| POST | `/forum-posts` | Create new post |
| GET | `/forum-posts/:postId/replies` | Get replies for a post |
| POST | `/forum-posts/:postId/replies` | Create a reply |
| POST | `/forum-posts/:postId/upvote` | Upvote a post |
| POST | `/forum-replies/:replyId/upvote` | Upvote a reply |
| GET | `/karma/:userId` | Get user's karma stats |
| POST | `/link-preview` | Fetch Open Graph data for URLs |

Advertising endpoints under `/api/ads/`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/active` | Get active ad creatives |
| POST | `/impression` | Record ad view |
| POST | `/click` | Record ad click |

---

## Authentication Notes

The current implementation uses a **default user middleware** for development (`setDefaultUser` in routes.ts). 

For production, your team needs to:
1. Replace `setDefaultUser` with your authentication system
2. Ensure `req.user.id` is populated from your auth
3. The `users` table structure is defined in `shared/schema.ts`

See `docs/AUTH_INTEGRATION.md` for detailed integration guide.

---

## Design Decisions

1. **Upvote-only system** - No downvotes, karma equals upvotes
2. **YouTube facade pattern** - Shows thumbnail first, loads iframe on click (performance)
3. **Hot score algorithm** - Balances upvotes with time decay
4. **Mobile-first** - All UI designed for touch/mobile first
5. **In-feed ads** - Sponsored posts styled to match organic content

---

## What's Ready vs What Needs Work

### Ready for Production
- All database schemas and migrations
- Complete API endpoints
- Frontend UI components
- Voting and karma systems
- Ad tracking infrastructure
- Seed data script

### Needs Your Team's Work
- Replace development auth with production auth
- Configure CORS for your domain
- Set up production database
- Add rate limiting for API endpoints
- Implement content moderation tools
- Add image upload (currently uses external URLs)

---

## Contact Points in Code

If your team has questions, these are the main areas to investigate:

- **"How does voting work?"** → `server/community.ts` → `upvotePost()` and `upvoteReply()`
- **"How are posts sorted?"** → `server/community.ts` → `getForumPostsWithStats()` switch statement
- **"How does karma work?"** → `server/community.ts` → `updateUserKarma()`
- **"How do ads appear in feed?"** → `client/src/pages/CommunityPage.tsx` → search for "SponsoredPostCard"
- **"How does threading work?"** → `server/community.ts` → `getThreadedReplies()` and `forum_reply_stats.depth`

---

## Summary

This is a complete, functional Reddit-style community system. Your team can:

1. Export the database schema from `shared/schema.ts`
2. Use the API endpoints documented in `docs/API_REFERENCE.md`
3. Reference the frontend implementation in `CommunityPage.tsx`
4. Run the seed script to populate test data
5. Integrate their own authentication system following `docs/AUTH_INTEGRATION.md`

The code is production-ready and has been tested with real database operations in this Replit environment.
