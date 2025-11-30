# HODLearn Community Forums - API Reference

This document provides complete API endpoint documentation for the Reddit-style community forums feature.

## Base URL

All endpoints are relative to your server base URL:
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

## Authentication

The API expects a user to be authenticated via session. Currently uses a default user middleware for development. See `AUTH_INTEGRATION.md` for production setup.

---

## Forum Categories

### GET /api/community/forum-categories

Returns all active forum categories ordered by sort_order.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bitcoin Basics",
    "slug": "bitcoin-basics",
    "description": "Fundamental concepts and beginner questions",
    "postCount": 15,
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2025-11-29T15:50:38.141Z",
    "updatedAt": "2025-11-29T15:50:38.141Z"
  }
]
```

---

## Forum Posts

### GET /api/community/forum-posts

Returns forum posts with statistics, author, and category information.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `categoryId` | number | Filter by category ID (optional) |
| `sortBy` | string | Sort order: `hot`, `trending`, `top`, `new` (default: `new`) |
| `flair` | string | Filter by tag (optional) |

**Response:**
```json
[
  {
    "id": 1,
    "categoryId": 1,
    "userId": 1,
    "title": "What's the difference between hot and cold wallets?",
    "content": "I keep hearing these terms...",
    "dayIndex": null,
    "isSticky": false,
    "isLocked": false,
    "isPinned": false,
    "flair": "question",
    "imageUrl": null,
    "linkUrl": null,
    "linkPreview": null,
    "replyCount": 3,
    "lastReplyAt": "2025-11-29T16:00:00.000Z",
    "lastReplyUserId": 2,
    "createdAt": "2025-11-29T15:50:38.141Z",
    "updatedAt": "2025-11-29T15:50:38.141Z",
    "stats": {
      "id": 1,
      "postId": 1,
      "upvotes": 15,
      "downvotes": 0,
      "hotScore": "45.5000",
      "trendingScore": "0.0000",
      "controversyScore": "0.0000",
      "updatedAt": "2025-11-29T15:50:38.141Z"
    },
    "author": {
      "id": 1,
      "username": "bitcoiner123"
    },
    "category": {
      "id": 1,
      "name": "Bitcoin Basics",
      "slug": "bitcoin-basics",
      "description": "Fundamental concepts...",
      "postCount": 15,
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2025-11-29T15:50:38.141Z",
      "updatedAt": "2025-11-29T15:50:38.141Z"
    },
    "userVote": null,
    "karma": 15
  }
]
```

**Notes:**
- `userVote` is the authenticated user's vote record (null if not voted or not authenticated)
- `karma` equals upvotes (upvote-only system)
- `stats.downvotes` is always 0 (retained for schema compatibility)

---

### GET /api/community/forum-posts/:postId

Returns a single post by ID with full details.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `postId` | number | Post ID |

**Response:** Same structure as individual post in list response.

**Error Response (404):**
```json
{
  "message": "Post not found"
}
```

---

### POST /api/community/forum-posts

Creates a new forum post. Requires authentication.

**Request Body:**
```json
{
  "title": "My first post",
  "content": "Hello community!",
  "categoryId": 1,
  "flair": "discussion",
  "imageUrl": null,
  "linkUrl": null,
  "linkPreview": null,
  "dayIndex": null
}
```

**Required Fields:**
- `title` - Post title
- `content` - Post body text
- `categoryId` - Target category ID

**Optional Fields:**
- `flair` - Tag: `discussion`, `question`, `video`, `article`, `meme`, `security`, `news`, `chart`
- `imageUrl` - Direct image URL
- `linkUrl` - External link URL (including YouTube)
- `linkPreview` - JSON object with link preview metadata
- `dayIndex` - Link to curriculum day if applicable

**Response:**
```json
{
  "id": 42,
  "categoryId": 1,
  "userId": 1,
  "title": "My first post",
  "content": "Hello community!",
  "flair": "discussion",
  "createdAt": "2025-11-29T16:30:00.000Z",
  "updatedAt": "2025-11-29T16:30:00.000Z"
}
```

---

## Link Preview

### POST /api/community/link-preview

Fetches Open Graph metadata for a URL. Used for rich link previews.

**Request Body:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Response (YouTube):**
```json
{
  "type": "video",
  "title": "Video Title",
  "description": "By Channel Name",
  "image": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "siteName": "YouTube",
  "videoId": "VIDEO_ID"
}
```

**Response (Article):**
```json
{
  "type": "article",
  "title": "Article Title",
  "description": "Article description...",
  "image": "https://example.com/og-image.jpg",
  "siteName": "Example Site"
}
```

---

## Forum Replies

### GET /api/community/forum-posts/:postId/replies

Returns all replies for a post with threading information.

**Response:**
```json
[
  {
    "id": 1,
    "postId": 1,
    "userId": 2,
    "content": "Hot wallet = connected to internet...",
    "isDeleted": false,
    "createdAt": "2025-11-29T15:55:00.000Z",
    "updatedAt": "2025-11-29T15:55:00.000Z",
    "stats": {
      "id": 1,
      "replyId": 1,
      "parentReplyId": null,
      "depth": 0,
      "upvotes": 5,
      "downvotes": 0,
      "childCount": 1,
      "updatedAt": "2025-11-29T15:55:00.000Z"
    },
    "author": {
      "id": 2,
      "username": "helpfuluser"
    },
    "userVote": null,
    "karma": 5
  }
]
```

**Notes:**
- `stats.depth` indicates nesting level (0 = top-level reply)
- `stats.parentReplyId` is set for nested replies

---

### POST /api/community/forum-posts/:postId/replies

Creates a reply to a post. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `postId` | number | Post ID to reply to |

**Request Body:**
```json
{
  "content": "Great explanation!",
  "parentReplyId": null
}
```

**Parameters:**
- `content` - Reply text (required)
- `parentReplyId` - ID of parent reply for threading (null for top-level)

**Response:**
```json
{
  "id": 15,
  "postId": 1,
  "userId": 1,
  "content": "Great explanation!",
  "isDeleted": false,
  "createdAt": "2025-11-29T16:45:00.000Z",
  "updatedAt": "2025-11-29T16:45:00.000Z"
}
```

---

## Voting

### POST /api/community/forum-posts/:postId/upvote

Upvotes a post. Requires authentication. Idempotent (calling twice has no additional effect).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `postId` | number | Post ID to upvote |

**Request Body:**
```json
{
  "bitcoinPriceUsd": 95000
}
```

**Optional Fields:**
- `bitcoinPriceUsd` - Current BTC price (for wallet integration)

**Response:**
```json
{
  "success": true,
  "newUpvotes": 16,
  "karmaAwarded": 10
}
```

**Notes:**
- User ID is derived from authenticated session
- Karma awarded: 10 points per post upvote to the post author

---

### POST /api/community/forum-replies/:replyId/upvote

Upvotes a reply. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `replyId` | number | Reply ID to upvote |

**Request Body:**
```json
{
  "bitcoinPriceUsd": 95000
}
```

**Response:**
```json
{
  "success": true,
  "newUpvotes": 8,
  "karmaAwarded": 5
}
```

**Notes:**
- Karma awarded: 5 points per reply upvote to the reply author

---

## User Karma

### GET /api/community/karma/:userId

Returns karma statistics for a user.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | number | User ID |

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "totalKarma": 350,
  "postKarma": 250,
  "commentKarma": 100,
  "awardedKarma": 0,
  "updatedAt": "2025-11-29T16:00:00.000Z"
}
```

---

## Advertising

### GET /api/ads/active

Returns active ad creatives for in-feed display.

**Response:**
```json
[
  {
    "id": 1,
    "campaignId": 1,
    "title": "Secure Your Bitcoin with Trezor",
    "description": "Industry-leading hardware wallets...",
    "ctaText": "Shop Now",
    "ctaUrl": "https://trezor.io",
    "imageUrl": "https://images.unsplash.com/...",
    "logoUrl": null,
    "category": null,
    "placement": "in_feed",
    "isActive": true,
    "createdAt": "2025-11-29T16:00:00.000Z",
    "updatedAt": "2025-11-29T16:00:00.000Z"
  }
]
```

---

### POST /api/ads/impression

Records an ad impression (view).

**Request Body:**
```json
{
  "creativeId": 1,
  "sessionId": "abc123",
  "placement": "in_feed"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### POST /api/ads/click

Records an ad click.

**Request Body:**
```json
{
  "creativeId": 1,
  "sessionId": "abc123"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Error Handling

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "message": "URL is required"
}
```

**404 Not Found:**
```json
{
  "message": "Post not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to fetch forum posts"
}
```

---

## Sorting Algorithms

### Hot Score Calculation

Posts are ranked using a time-decay algorithm that balances upvotes with recency.

### Sort Options

- `new` (default) - Created timestamp descending
- `hot` - Hot score descending
- `trending` - Trending score descending  
- `top` - Total upvotes descending

---

## CORS Configuration

For cross-origin requests, configure CORS headers:

```javascript
import cors from 'cors';

app.use(cors({
  origin: ['https://your-frontend.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
