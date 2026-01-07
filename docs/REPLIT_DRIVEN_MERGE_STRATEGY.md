# Replit-Driven Merge Strategy

## Overview

This document outlines a simple, practical approach to merge your HODLearn features into your developer partners' production codebase using Replit's AI tools for comparison and analysis.

---

## The Setup

**Your Project (This Replit)**
- Contains: Admin Portal, HODLearn Points Wallet, Referral System, Legal Pages
- Role: Source of features to migrate

**Partner Project (Their Codebase)**
- Contains: Production backend work, AWS infrastructure
- Role: Master project (final destination)

---

## The Strategy

### Step 1: Get Their Code Into This Project

Have your partners send you their codebase. Create a folder in this project:

```
/partner-code/
  ├── server/
  ├── client/
  ├── shared/
  └── ...
```

This keeps everything in one place for easy comparison. You won't run their code - it's just there for the AI to analyze.

---

### Step 2: Run Foundation Comparison

Before copying any features, have the AI compare the "foundation" pieces that everything else depends on:

**Database Schema**
- Compare `shared/schema.ts` vs `partner-code/shared/schema.ts`
- Look for: Different table structures, conflicting column names, missing tables

**Authentication**
- Compare `server/auth.ts` vs `partner-code/server/auth.ts`
- Look for: Different login approaches, session handling, middleware patterns

**Payments (Stripe)**
- Compare `server/stripeClient.ts` vs `partner-code/server/stripeClient.ts`
- Look for: Different webhook handling, subscription logic

**AI Prompts to Use:**
```
"Compare our schema.ts with partner-code/schema.ts - what tables are different?"

"How does partner-code handle authentication vs our auth.ts?"

"Are there any conflicts in how we both use Stripe?"
```

---

### Step 3: Document the Gaps

Create a simple comparison showing:

| Area | Your Version | Their Version | Compatible? | Action Needed |
|------|--------------|---------------|-------------|---------------|
| User table | Has referral fields | (check theirs) | ? | Add missing columns |
| Auth | Dev middleware | (check theirs) | ? | Use theirs |
| Stripe | Basic setup | (check theirs) | ? | Merge carefully |

---

### Step 4: Prepare Your Features for Migration

**Feature 1: Admin Portal**

Files to copy:
- `client/src/admin/` - All admin UI pages and components
- `server/admin-routes.ts` - All 150+ admin API endpoints
- `server/admin-auth.ts` - Admin authentication system
- Schema: Add all admin-related tables to their schema

**Feature 2: HODLearn Points Wallet**

Files to copy:
- `server/wallet-routes.ts` - Wallet API endpoints
- `client/src/components/` - Wallet UI components (WalletCard, etc.)
- Schema: `user_wallet_progress`, `wallet_earnings`, `wallet_achievements`, `streak_rewards`, `streak_insurance`

**Feature 3: Referral System**

Files to copy:
- `server/referral-routes.ts` - Referral API endpoints
- `client/src/components/InviteFriendsCard.tsx` - Invite UI component
- Schema: `referral_codes`, `referral_events`, plus referral fields on `users` table

**Feature 4: Legal Pages**

Files to copy:
- Terms of Service content/route
- Privacy Policy content/route
- Links in More > About section

---

### Step 5: Execute the Migration

Work in their master project:

1. **Add schema tables first** - Merge your new tables into their schema.ts
2. **Run database migration** - Push schema changes
3. **Copy server routes** - Add your route files, register them in their main routes
4. **Copy client components** - Add UI files, update imports
5. **Test each feature** - Verify it works in their environment

---

### Step 6: Verify Everything Works

**Admin Portal Checklist:**
- [ ] Admin login works
- [ ] All 9 management areas accessible
- [ ] AI content generation works (needs Anthropic key)
- [ ] Data saves correctly

**Wallet Checklist:**
- [ ] Balance displays
- [ ] Bitcoin price fetches
- [ ] Earnings history shows

**Referral Checklist:**
- [ ] Referral code generates
- [ ] Code can be shared
- [ ] Applying code works
- [ ] Admin tracking shows referrals

**Legal Pages Checklist:**
- [ ] Terms of Service accessible
- [ ] Privacy Policy accessible
- [ ] Links work from About section

---

## Timeline Estimate

| Step | Time |
|------|------|
| Get partner code into project | 30 min |
| Run foundation comparison | 1-2 hours |
| Document gaps | 30 min |
| Migrate features | 4-6 hours |
| Testing and fixes | 2-3 hours |

**Total: 8-12 hours** (can be split across sessions)

---

## Working Session Agenda

### Session 1: Compare (2 hours)
- Import partner code to this project
- Run AI comparison on schema, auth, Stripe
- Document conflicts and compatibility

### Session 2: Migrate (4-6 hours)
- Merge schema changes
- Copy admin portal files
- Copy wallet files
- Copy referral files
- Add legal pages

### Session 3: Test (2 hours)
- Walk through all features
- Fix any issues
- Confirm production readiness

---

## Key Questions to Answer Before Merging

1. **How do they handle user authentication?**
   - If they have production auth ready, use theirs
   - Your admin auth is separate and should work alongside

2. **What database tables do they already have?**
   - Avoid duplicate table names
   - Check if `users` table has conflicting columns

3. **How do they connect to Stripe?**
   - Merge webhook handlers if both projects have them
   - Use consistent environment variable names

4. **What's their environment variable setup?**
   - Document all env vars your features need
   - Ensure they're configured in their deployment

---

## Environment Variables Your Features Need

```bash
# Database
DATABASE_URL=postgresql://...

# Admin Portal
SESSION_SECRET=...

# AI Content Generation
ANTHROPIC_API_KEY=...

# Payments
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...

# Bitcoin Price (no key needed for basic CoinGecko)
```

---

## Summary

1. **Drop their code in a folder here** for comparison
2. **AI compares the foundations** (schema, auth, payments)
3. **Copy your 4 features** to their master project
4. **Test everything works**
5. **Deploy to production**

This approach keeps it simple: you're adding your features to their proven production setup, with AI helping catch any conflicts before they cause problems.

---

*Document Created: January 2026*
*Version: 1.0*
