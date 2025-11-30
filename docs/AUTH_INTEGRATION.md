# HODLearn Community Forums - Authentication Integration Guide

This document explains how to integrate your authentication system with the community forums feature.

## Overview

The community forums are designed to be auth-agnostic. The current implementation uses a simple user ID system that can be replaced with your own authentication solution.

---

## Current Authentication Points

### 1. Request User Identification

The system identifies users through the `req.user` object. Currently, a middleware sets a default user for development:

**Location:** `server/routes.ts`

```typescript
const setDefaultUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    req.user = { id: 1 };
  }
  next();
};
```

**Your Integration:**
Replace this with your authentication middleware that validates tokens/sessions and populates `req.user`:

```typescript
import { verifyToken } from './your-auth-system';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await verifyToken(token);
    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication' });
  }
};
```

---

### 2. TypeScript Types

Add user type to Express Request:

**Location:** `server/types.ts` (create this file)

```typescript
import { User } from '@shared/schema';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username?: string;
      };
    }
  }
}
```

---

### 3. Protected Endpoints

The following endpoints require authentication:

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/community/forum-posts` | POST | Yes | Create post |
| `/api/community/forum-posts/:id/replies` | POST | Yes | Create reply |
| `/api/community/upvote/post` | POST | Yes | Upvote post |
| `/api/community/upvote/reply` | POST | Yes | Upvote reply |

Read endpoints (GET) can be public or protected based on your requirements.

---

## User Data Requirements

### Minimum User Schema

The forum system requires these user fields:

```typescript
interface ForumUser {
  id: number;           // Unique user identifier
  username: string;     // Display name
  avatarUrl?: string;   // Optional profile image
}
```

### Mapping Your User Model

If your user model has different field names:

```typescript
// In your auth middleware
req.user = {
  id: yourUser.userId,           // Map to 'id'
  username: yourUser.displayName, // Map to 'username'
  avatarUrl: yourUser.profilePic  // Map to 'avatarUrl'
};
```

---

## Database Schema Integration

### Option 1: Use Existing Users Table

If you have an existing `users` table, ensure it has:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,           -- Or your existing ID type
  username VARCHAR(50) NOT NULL,
  avatar_url TEXT
  -- Your other fields
);
```

Update the foreign key references in forum tables if your ID column differs.

### Option 2: Create Mapping Table

If your users table has a different structure:

```sql
CREATE TABLE forum_user_profiles (
  id SERIAL PRIMARY KEY,
  external_user_id VARCHAR(255) UNIQUE NOT NULL,  -- Your system's user ID
  username VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Modify the forum queries to join on this mapping table.

---

## Session Management

### Current Implementation

The development setup uses express-session with PostgreSQL storage:

```typescript
app.use(session({
  store: new PostgresSessionStore({
    pool: dbPool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));
```

### JWT Integration

For JWT-based auth:

```typescript
import jwt from 'jsonwebtoken';

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

app.use('/api/community', (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = { id: decoded.userId, username: decoded.username };
    } catch (e) {
      // Token invalid - continue as anonymous
    }
  }
  next();
});
```

---

## Frontend Authentication

### Current Implementation

The frontend passes `userId` in request bodies and query parameters:

```typescript
// Creating a post
const createPost = async (data) => {
  await apiRequest('/api/community/forum-posts', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      userId: currentUser.id  // From your auth context
    })
  });
};
```

### Recommended Changes

1. **Use Authorization Header:**

```typescript
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken(); // From your auth system
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};
```

2. **Remove userId from body:**

Update POST requests to not include userId - the server should get it from the authenticated session/token.

---

## Karma System Integration

### User Karma Tracking

Karma is stored in `user_karma` table linked by `user_id`:

```sql
CREATE TABLE user_karma (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,  -- References your users table
  total_karma INTEGER DEFAULT 0,
  post_karma INTEGER DEFAULT 0,
  comment_karma INTEGER DEFAULT 0,
  awarded_karma INTEGER DEFAULT 0
);
```

### Karma on User Registration

When a new user registers in your system, optionally create their karma record:

```typescript
// After user creation
await db.insert(userKarma).values({
  userId: newUser.id,
  totalKarma: 0,
  postKarma: 0,
  commentKarma: 0,
  awardedKarma: 0
});
```

Or let it be created lazily when they first interact with the forums.

---

## Security Considerations

### 1. CSRF Protection

Add CSRF tokens for form submissions:

```typescript
import csrf from 'csurf';
app.use(csrf({ cookie: true }));
```

### 2. Rate Limiting

Implement per-user rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 posts per minute
  keyGenerator: (req) => req.user?.id?.toString() || req.ip
});

app.use('/api/community/forum-posts', postLimiter);
```

### 3. Input Validation

All inputs are validated with Zod schemas. Extend validation as needed:

```typescript
const createPostSchema = insertForumPostSchema.extend({
  title: z.string().min(5).max(300),
  content: z.string().min(10).max(10000)
});
```

---

## Migration Checklist

1. [ ] Create or update users table with required fields
2. [ ] Implement authentication middleware
3. [ ] Add TypeScript types for Request.user
4. [ ] Update foreign key references if needed
5. [ ] Configure session/JWT handling
6. [ ] Update frontend to use auth headers
7. [ ] Add CSRF protection
8. [ ] Implement rate limiting
9. [ ] Test all protected endpoints

---

## Testing Authentication

### Development Testing

For development without full auth:

```typescript
// Temporary test middleware
app.use('/api/community', (req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});
```

### Production Testing

Create test accounts and verify:

1. Anonymous access to public endpoints
2. Authenticated user can create posts/replies
3. Users can only edit/delete their own content
4. Karma updates correctly for both parties
5. Session persists across requests
