# HODLearn Community Forums - API Reference

This document provides complete API endpoint documentation for the Reddit-style community forums feature.

## Base URL

All endpoints are relative to your server base URL:
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

## Authentication

The API expects a `user_id` to be available from your authentication system. See `AUTH_INTEGRATION.md` for integration details.

For development/testing, endpoints support a `userId` query parameter.

---

## Forum Categories

### GET /api/community/categories

Returns all forum categories in sort order.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bitcoin Basics",
    "slug": "bitcoin-basics",
    "description": "Fundamental concepts and beginner questions",
    "iconName": "GraduationCap",
    "color": "#F7931A",
    "sortOrder": 1,
    "createdAt": "2025-11-29T15:50:38.141Z"
  }
]
```

---

## Forum Posts

### GET /api/community/forum-posts

Returns forum posts with statistics and author information.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `categoryId` | number | Filter by category ID |
| `sortBy` | string | Sort order: `hot`, `new`, `top` (default: `hot`) |
| `userId` | number | Current user ID (for auth) |
| `flair` | string | Filter by tag: `question`, `discussion`, `article`, `media`, `meme` |

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "title": "What's the difference between hot and cold wallets?",
    "content": "I keep hearing these terms...",
    "flair": "question",
    "linkUrl": null,
    "imageUrl": null,
    "videoUrl": null,
    "isPinned": false,
    "isLocked": false,
    "createdAt": "2025-11-29T15:50:38.141Z",
    "upvotes": 15,
    "replyCount": 3,
    "hotScore": 45.5,
    "hasUpvoted": false,
    "author": {
      "id": 1,
      "username": "bitcoiner123",
      "avatarUrl": null
    },
    "category": {
      "id": 1,
      "name": "Bitcoin Basics",
      "slug": "bitcoin-basics",
      "color": "#F7931A"
    }
  }
]
```

---

### GET /api/community/forum-posts/:postId

Returns a single post by ID with full details.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `postId` | number | Post ID (path parameter) |
| `userId` | number | Current user ID (query parameter) |

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 1,
  "title": "What's the difference between hot and cold wallets?",
  "content": "I keep hearing these terms...",
  "flair": "question",
  "linkUrl": null,
  "imageUrl": null,
  "videoUrl": null,
  "isPinned": false,
  "isLocked": false,
  "createdAt": "2025-11-29T15:50:38.141Z",
  "upvotes": 15,
  "replyCount": 3,
  "hotScore": 45.5,
  "hasUpvoted": true,
  "author": {
    "id": 1,
    "username": "bitcoiner123",
    "avatarUrl": null
  },
  "category": {
    "id": 1,
    "name": "Bitcoin Basics",
    "slug": "bitcoin-basics",
    "color": "#F7931A"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Post not found"
}
```

---

### POST /api/community/forum-posts

Creates a new forum post.

**Request Body:**
```json
{
  "userId": 1,
  "categoryId": 1,
  "title": "My first post",
  "content": "Hello community!",
  "flair": "discussion",
  "linkUrl": null,
  "imageUrl": null,
  "videoUrl": null
}
```

**Required Fields:**
- `userId` - Author's user ID
- `categoryId` - Target category ID
- `title` - Post title (max 300 chars)
- `content` - Post body text

**Optional Fields:**
- `flair` - Tag: `question`, `discussion`, `article`, `media`, `meme`
- `linkUrl` - External link URL
- `imageUrl` - Image URL
- `videoUrl` - YouTube or video URL

**Response (201):**
```json
{
  "id": 42,
  "userId": 1,
  "categoryId": 1,
  "title": "My first post",
  "content": "Hello community!",
  "flair": "discussion",
  "createdAt": "2025-11-29T16:30:00.000Z"
}
```

---

## Forum Replies

### GET /api/community/forum-posts/:postId/replies

Returns all replies for a post, structured for threading.

**Response:**
```json
[
  {
    "id": 1,
    "postId": 1,
    "userId": 2,
    "content": "Hot wallet = connected to internet...",
    "parentReplyId": null,
    "isDeleted": false,
    "createdAt": "2025-11-29T15:55:00.000Z",
    "depth": 0,
    "upvotes": 5,
    "hasUpvoted": false,
    "author": {
      "id": 2,
      "username": "helpfuluser",
      "avatarUrl": null
    }
  },
  {
    "id": 3,
    "postId": 1,
    "userId": 1,
    "content": "That analogy helps! Thanks!",
    "parentReplyId": 2,
    "isDeleted": false,
    "createdAt": "2025-11-29T15:58:00.000Z",
    "depth": 1,
    "upvotes": 2,
    "hasUpvoted": true,
    "author": {
      "id": 1,
      "username": "bitcoiner123",
      "avatarUrl": null
    }
  }
]
```

---

### POST /api/community/forum-posts/:postId/replies

Creates a reply to a post.

**Request Body:**
```json
{
  "userId": 1,
  "content": "Great explanation!",
  "parentReplyId": null
}
```

**Parameters:**
- `content` - Reply text (required)
- `parentReplyId` - ID of parent reply for threading (null for top-level)

**Response (201):**
```json
{
  "id": 15,
  "postId": 1,
  "userId": 1,
  "content": "Great explanation!",
  "parentReplyId": null,
  "createdAt": "2025-11-29T16:45:00.000Z"
}
```

---

## Voting

### POST /api/community/upvote/post

Upvotes a post. Upvotes are idempotent (calling twice has no effect).

**Request Body:**
```json
{
  "userId": 1,
  "postId": 5,
  "bitcoinPriceUsd": 95000
}
```

**Response:**
```json
{
  "success": true,
  "newUpvotes": 16,
  "karmaAwarded": 10
}
```

**Notes:**
- `karmaAwarded` is 10 for post upvotes
- `bitcoinPriceUsd` is optional, used for wallet integration

---

### POST /api/community/upvote/reply

Upvotes a reply.

**Request Body:**
```json
{
  "userId": 1,
  "replyId": 12,
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

---

## User Karma

### GET /api/community/karma/:userId

Returns karma stats for a user.

**Response:**
```json
{
  "userId": 1,
  "totalKarma": 350,
  "postKarma": 250,
  "commentKarma": 100,
  "awardedKarma": 0
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
    "campaign": {
      "id": 1,
      "name": "Bitcoin Security Launch",
      "advertiser": "Trezor",
      "status": "active"
    }
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
  "error": "Validation failed",
  "details": ["title is required", "categoryId must be a number"]
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Failed to create post"
}
```

---

## Rate Limiting (Recommended)

Implement rate limiting for production:

| Endpoint Type | Recommended Limit |
|---------------|-------------------|
| GET requests | 100 requests/minute |
| POST (posts/replies) | 10 requests/minute |
| POST (votes) | 30 requests/minute |
| POST (ads tracking) | 60 requests/minute |

---

## Sorting Algorithms

### Hot Score Calculation

Posts are ranked using a time-decay algorithm:

```
hot_score = upvotes / (hours_since_creation + 2)^1.5
```

This balances upvotes with recency, ensuring new content can surface while highly upvoted content stays visible.

### Sort Options

- `hot` - Default. Uses hot_score descending
- `new` - Created timestamp descending
- `top` - Total upvotes descending

---

## CORS Configuration

For cross-origin requests, configure CORS headers:

```javascript
app.use(cors({
  origin: ['https://your-frontend.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
