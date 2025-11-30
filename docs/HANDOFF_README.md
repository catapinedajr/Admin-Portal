# HODLearn Community Forums - Production Handoff Package

Welcome to the HODLearn community forums feature! This document provides everything you need to deploy and integrate this Reddit-style discussion system into your production environment.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create .env file with required variables (see Environment Variables section)

# 3. Push database schema using Drizzle
npx drizzle-kit push

# 4. Seed initial data
npx tsx seed-community.ts

# 5. Start the server
npm run dev
```

---

## Package Contents

```
/
├── client/src/                    # Frontend React application
│   ├── pages/
│   │   └── CommunityPage.tsx      # Main forum component
│   ├── components/
│   │   └── YouTubeEmbed.tsx       # Video embed component
│   └── lib/
│       └── queryClient.ts         # API client setup
├── server/                        # Backend Express server
│   ├── routes.ts                  # API routes
│   ├── community.ts               # Forum business logic
│   └── storage.ts                 # Database operations
├── shared/
│   └── schema.ts                  # Database schema (Drizzle ORM)
├── docs/                          # Documentation
│   ├── DATABASE_SCHEMA.md         # Complete schema reference
│   ├── API_REFERENCE.md           # API endpoint docs
│   ├── AUTH_INTEGRATION.md        # Authentication guide
│   └── HANDOFF_README.md          # This file
├── seed-community.ts              # Seed data script
└── drizzle.config.ts              # Database configuration
```

---

## Environment Variables

Create a `.env` file with these variables:

```env
# Database (Required - used by both app and Drizzle migrations)
DATABASE_URL=postgresql://user:password@host:5432/database

# PostgreSQL connection vars (auto-set by Replit, or configure manually)
PGHOST=your-host
PGPORT=5432
PGUSER=your-user
PGPASSWORD=your-password
PGDATABASE=your-database

# Session (Required for production)
SESSION_SECRET=your-secure-random-string-min-32-chars

# Server
PORT=5000
NODE_ENV=production
```

**Note:** The same `DATABASE_URL` is used by both the application runtime (via Neon serverless driver) and Drizzle Kit migrations. Ensure this variable is set before running any database commands.

---

## Database Setup

### PostgreSQL Requirements

- PostgreSQL 14+ recommended
- Extensions needed: None (standard PostgreSQL)

### Schema Migration

The project uses Drizzle ORM. Apply the schema:

```bash
# Push schema to database
npx drizzle-kit push

# View current schema in browser
npx drizzle-kit studio
```

### Initial Data

Seed the database with categories and sample content:

```bash
npx tsx seed-community.ts
```

This creates:
- 10 forum categories
- 18 sample posts across all categories
- 15 sample replies with threading
- 3 user karma records
- 3 ad campaigns
- 3 ad creatives

---

## Feature Overview

### Core Features

| Feature | Description |
|---------|-------------|
| Forum Categories | 10 topic areas for organized discussions |
| Posts | Text, images, links, and YouTube videos |
| Tags | question, discussion, article, media, meme |
| Threaded Replies | Nested comments with depth tracking |
| Upvote-Only Voting | Positive community culture |
| Karma System | Points for receiving upvotes |
| In-Feed Ads | Native advertising with tracking |

### Design Principles

- **Mobile-First**: Optimized for touch interactions
- **Reddit-Inspired**: Familiar UX patterns
- **Performance**: YouTube facade pattern, optimistic updates
- **Accessibility**: Proper ARIA labels and keyboard nav

---

## Frontend Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| TanStack Query | Server state management |
| Wouter | Routing |
| Tailwind CSS | Styling |
| Radix UI | Accessible components |
| Lucide Icons | Icon library |

### Key Components

**CommunityPage.tsx** - Main forum interface:
- Tab navigation (Feed, Categories, Videos)
- Post list with infinite scroll potential
- Post detail modal view
- Create post/reply forms
- Voting interactions
- Ad placements

**YouTubeEmbed.tsx** - Performance-optimized video embeds:
- Thumbnail facade (no iframe until interaction)
- Responsive sizing
- Click-to-play

---

## Backend Stack

| Technology | Purpose |
|------------|---------|
| Express.js | HTTP server |
| Drizzle ORM | Database queries |
| Zod | Request validation |
| PostgreSQL | Data storage |

### API Structure

All forum endpoints are prefixed with `/api/community/`:

```
GET  /api/community/forum-categories           - List categories
GET  /api/community/forum-posts                - List posts
GET  /api/community/forum-posts/:postId        - Get single post
POST /api/community/forum-posts                - Create post
GET  /api/community/forum-posts/:postId/replies   - List replies
POST /api/community/forum-posts/:postId/replies   - Create reply
POST /api/community/forum-posts/:postId/upvote    - Upvote post
POST /api/community/forum-replies/:replyId/upvote - Upvote reply
GET  /api/community/karma/:userId              - Get user karma
GET  /api/ads/active                           - Get active ads
POST /api/ads/impression                       - Track ad view
POST /api/ads/click                            - Track ad click
```

See `API_REFERENCE.md` for complete documentation.

---

## Authentication Integration

The forum is designed to work with your existing authentication system.

### Current State

Development uses a simple default user middleware. For production:

1. Replace the `setDefaultUser` middleware with your auth
2. Ensure `req.user.id` is populated for authenticated requests
3. Update foreign key references if your user ID type differs

See `AUTH_INTEGRATION.md` for detailed instructions.

### Required User Fields

```typescript
interface User {
  id: number;           // Unique identifier
  username: string;     // Display name
  avatarUrl?: string;   // Optional avatar
}
```

---

## Advertising System

### Campaign Structure

- **Campaigns**: Budget, dates, pricing
- **Creatives**: Individual ad units with content
- **Impressions**: View tracking
- **Clicks**: Click tracking

### Ad Placement

Ads appear in the feed every N posts (configurable in frontend). The current setting is every 5 posts.

### Tracking

```javascript
// Record impression when ad enters viewport
POST /api/ads/impression { creativeId: 1 }

// Record click when user clicks
POST /api/ads/click { creativeId: 1 }
```

---

## Customization

### Styling

The forum uses Tailwind CSS with these primary colors:
- Orange: `#F7931A` (Bitcoin orange)
- Zinc grays for backgrounds
- Dark mode support

Update `tailwind.config.ts` to match your brand.

### Categories

Edit categories in the database or `seed-community.ts`:

```typescript
const categories = [
  { 
    name: "Your Category",
    slug: "your-category",
    description: "Description here",
    iconName: "LucideIconName",
    color: "#HexColor"
  }
];
```

### Tags (Flairs)

Available tags are defined in the post creation form. To modify:

1. Update the tag list in `CommunityPage.tsx`
2. Ensure the `flair` field in the database accepts your values

---

## Deployment Recommendations

### Production Checklist

- [ ] Configure production DATABASE_URL
- [ ] Set secure SESSION_SECRET
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Configure CORS for your domains
- [ ] Set up database connection pooling
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Configure error monitoring
- [ ] Set up database backups

### Scaling Considerations

- **Read replicas**: For high-traffic read operations
- **Caching**: Consider Redis for hot posts
- **CDN**: For static assets and images
- **Connection pooling**: PgBouncer recommended

### Recommended Hosting

- **Application**: Vercel, Railway, Render, or AWS ECS
- **Database**: Neon (serverless), Supabase, or AWS RDS
- **CDN**: Cloudflare or AWS CloudFront

---

## Testing

### Manual Testing Checklist

1. [ ] Create a new post in each category
2. [ ] Add text, image, link, and video posts
3. [ ] Create replies at multiple nesting levels
4. [ ] Test upvoting posts and replies
5. [ ] Verify karma updates correctly
6. [ ] Test ad impressions and clicks
7. [ ] Check mobile responsiveness
8. [ ] Verify YouTube embeds load correctly

### API Testing

Use the provided Postman/Insomnia collection or:

```bash
# Get categories
curl http://localhost:5000/api/community/categories

# Create a post
curl -X POST http://localhost:5000/api/community/forum-posts \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"categoryId":1,"title":"Test","content":"Hello"}'
```

---

## Troubleshooting

### Common Issues

**Posts not loading**
- Check DATABASE_URL is correct
- Verify tables exist: `npm run db:push`

**YouTube embeds not working**
- Ensure URLs are valid YouTube links
- Check CORS if embedding fails

**Votes not registering**
- Verify user is authenticated
- Check browser console for errors

**Ads not showing**
- Seed ad data: `npx tsx seed-community.ts`
- Verify campaigns are `active` status

### Support

For questions about this codebase:
1. Review the documentation in `/docs`
2. Check the code comments
3. Search for similar patterns in existing code

---

## License & Attribution

This code is provided for your production use. Attribution to HODLearn appreciated but not required.

---

*Last updated: November 2025*
