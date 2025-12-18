import { pgTable, text, serial, integer, boolean, timestamp, json, decimal, date, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  lastActivityDate: text("last_activity_date"), // YYYY-MM-DD format
  termsAcceptedAt: timestamp("terms_accepted_at"),
  termsVersion: text("terms_version").default("1.0"),
  pwaInstalledAt: timestamp("pwa_installed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Clean session management with automatic cleanup
export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(), // UUID
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsed: timestamp("last_used").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Simple password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// ADMIN PORTAL TABLES (Separate from consumer app)
// ============================================

// Admin users - completely separate from regular users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("admin"), // admin, super_admin
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin sessions - separate from user sessions
export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(), // UUID
  adminId: integer("admin_id").notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsed: timestamp("last_used").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Advertising clients - companies that advertise with HODLearn
export const advertisingClients = pgTable("advertising_clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Store products
export const storeProducts = pgTable("store_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
  priceSats: integer("price_sats"),
  imageUrl: text("image_url"),
  category: text("category"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Store orders
export const storeOrders = pgTable("store_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, paid, shipped, delivered, cancelled
  totalUsd: decimal("total_usd", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Store order items
export const storeOrderItems = pgTable("store_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => storeOrders.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => storeProducts.id),
  quantity: integer("quantity").notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Affiliate products - external products with affiliate links (hardware wallets, books, etc.)
export const affiliateProducts = pgTable("affiliate_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // hardware_wallet, book, course, software
  affiliateUrl: text("affiliate_url").notNull(),
  imageUrl: text("image_url"),
  vendor: text("vendor"), // Ledger, Trezor, Amazon, etc.
  commissionPercent: decimal("commission_percent", { precision: 5, scale: 2 }),
  commissionFlat: decimal("commission_flat", { precision: 10, scale: 2 }),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Affiliate clicks - track clicks on affiliate links
export const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => affiliateProducts.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  converted: boolean("converted").notNull().default(false),
  conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
  convertedAt: timestamp("converted_at"),
});

// Referral partners - companies we refer users to (exchanges, BTC IRAs, etc.)
export const referralPartners = pgTable("referral_partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // exchange, btc_ira, lending, custody
  description: text("description"),
  referralUrl: text("referral_url").notNull(),
  logoUrl: text("logo_url"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  referralFeeType: text("referral_fee_type").notNull().default("flat"), // flat, percent, tiered
  referralFeeAmount: decimal("referral_fee_amount", { precision: 10, scale: 2 }),
  referralFeePercent: decimal("referral_fee_percent", { precision: 5, scale: 2 }),
  payoutFrequency: text("payout_frequency").default("monthly"), // weekly, monthly, quarterly
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Referral signups - track user signups through referral partners
export const referralSignups = pgTable("referral_signups", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => referralPartners.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id),
  referralCode: text("referral_code"),
  status: text("status").notNull().default("pending"), // pending, verified, paid, rejected
  signupDate: timestamp("signup_date").notNull().defaultNow(),
  verifiedAt: timestamp("verified_at"),
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  actualPayout: decimal("actual_payout", { precision: 10, scale: 2 }),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoices for advertising clients
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => advertisingClients.id),
  campaignId: integer("campaign_id").references(() => adCampaigns.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, cancelled
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// SOCIAL MEDIA MANAGEMENT TABLES
// ============================================

// Social media platform connections
export const socialPlatformStatusTypes = ['draft', 'scheduled', 'published', 'failed'] as const;
export type SocialPostStatus = typeof socialPlatformStatusTypes[number];

export const socialPlatformTypes = ['twitter', 'linkedin', 'instagram', 'facebook'] as const;
export type SocialPlatform = typeof socialPlatformTypes[number];

// Social media posts
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().default("twitter"), // twitter, linkedin, instagram, facebook
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  campaignId: integer("campaign_id").references(() => adCampaigns.id),
  linkedDayIndex: integer("linked_day_index"), // Link to curriculum day for content sourcing
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  externalPostId: text("external_post_id"), // ID from Twitter/X API
  utmSource: text("utm_source").default("social"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"), // Unique per post for attribution
  errorMessage: text("error_message"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Social post metrics - synced from platform APIs
export const socialPostMetrics = pgTable("social_post_metrics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => socialPosts.id, { onDelete: 'cascade' }),
  impressions: integer("impressions").notNull().default(0),
  engagements: integer("engagements").notNull().default(0), // likes + retweets + replies
  likes: integer("likes").notNull().default(0),
  retweets: integer("retweets").notNull().default(0),
  replies: integer("replies").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  profileClicks: integer("profile_clicks").notNull().default(0),
  videoViews: integer("video_views").notNull().default(0),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
});

// Attribution events - track user journey from social to signup
export const attributionEvents = pgTable("attribution_events", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => socialPosts.id),
  campaignId: integer("campaign_id").references(() => adCampaigns.id),
  userId: integer("user_id").references(() => users.id),
  eventType: text("event_type").notNull(), // click, signup, day_complete, subscription
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  sessionId: text("session_id"),
  dayIndex: integer("day_index"), // For day_complete events
  metadata: json("metadata"), // Additional event-specific data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Twitter/X account connection
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().default("twitter"),
  accountName: text("account_name").notNull(),
  accountHandle: text("account_handle"),
  accessToken: text("access_token"), // Encrypted
  refreshToken: text("refresh_token"), // Encrypted
  tokenExpiresAt: timestamp("token_expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// B2B CRM TABLES
// ============================================

// CRM opportunity types
export const crmOpportunityTypes = ['enterprise_license', 'team_subscription', 'partnership', 'reseller'] as const;
export type CrmOpportunityType = typeof crmOpportunityTypes[number];

// CRM account types (customer segments)
export const crmAccountTypes = ['hr_benefit', 'financial_services', 'academic_education', 'municipal_government', 'other'] as const;
export type CrmAccountType = typeof crmAccountTypes[number];

// CRM deal stages
export const crmDealStages = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost'] as const;
export type CrmDealStage = typeof crmDealStages[number];

// B2B Companies
export const crmCompanies = pgTable("crm_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  industry: text("industry"),
  employeeCount: text("employee_count"), // "1-10", "11-50", "51-200", "201-500", "500+"
  accountType: text("account_type").notNull().default("other"), // hr_benefit, financial_services, academic_education, municipal_government, other
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// B2B Contacts at companies
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => crmCompanies.id, { onDelete: 'cascade' }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  title: text("title"), // Job title
  isPrimary: boolean("is_primary").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// B2B Deals/Opportunities
export const crmDeals = pgTable("crm_deals", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => crmCompanies.id, { onDelete: 'cascade' }),
  contactId: integer("contact_id").references(() => crmContacts.id),
  title: text("title").notNull(),
  opportunityType: text("opportunity_type").notNull().default("enterprise_license"), // enterprise_license, team_subscription, partnership, reseller
  stage: text("stage").notNull().default("lead"), // lead, qualified, demo, proposal, negotiation, won, lost
  dealValue: decimal("deal_value", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  contractLength: integer("contract_length"), // months
  expectedUsers: integer("expected_users"), // number of user seats
  probability: integer("probability").default(0), // 0-100%
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  lostReason: text("lost_reason"), // If stage is 'lost'
  notes: text("notes"),
  assignedTo: integer("assigned_to").references(() => adminUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// CRM Activity types
export const crmActivityTypes = ['call', 'email', 'meeting', 'demo', 'note', 'task'] as const;
export type CrmActivityType = typeof crmActivityTypes[number];

// B2B Deal activities/notes
export const crmActivities = pgTable("crm_activities", {
  id: serial("id").primaryKey(),
  dealId: integer("deal_id").notNull().references(() => crmDeals.id, { onDelete: 'cascade' }),
  activityType: text("activity_type").notNull().default("note"), // call, email, meeting, demo, note, task
  subject: text("subject").notNull(),
  description: text("description"),
  activityDate: timestamp("activity_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"), // For tasks
  isCompleted: boolean("is_completed").notNull().default(false),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// END ADMIN PORTAL TABLES
// ============================================

// Community forum categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  postCount: integer("post_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Post flair types for categorization
export const postFlairTypes = ['discussion', 'question', 'video', 'article', 'meme', 'security', 'news', 'chart'] as const;
export type PostFlair = typeof postFlairTypes[number];

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  dayIndex: integer("day_index"), // Link to specific curriculum day if applicable
  isSticky: boolean("is_sticky").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  isPinned: boolean("is_pinned").notNull().default(false), // Pinned posts appear at top
  flair: text("flair"), // Post type: discussion, question, video, article, meme, security, news, chart
  imageUrl: text("image_url"), // Direct image upload URL
  linkUrl: text("link_url"), // External link (article, YouTube, etc.)
  linkPreview: json("link_preview"), // { title, description, image, siteName, type }
  replyCount: integer("reply_count").notNull().default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: integer("last_reply_user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Forum post replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Enhanced curated video content with better categorization
export const curatedVideos = pgTable("curated_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  youtubeId: text("youtube_id").notNull().unique(),
  channelName: text("channel_name").notNull(),
  duration: integer("duration"), // in seconds
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  categoryId: integer("category_id").references(() => videoCategories.id),
  subcategoryId: integer("subcategory_id").references(() => videoSubcategories.id),
  tags: text("tags").array(), // searchable tags
  isEssential: boolean("is_essential").notNull().default(false), // For "Essentials" section
  isRecent: boolean("is_recent").notNull().default(false), // Auto-managed for "Recent" section
  isCommunityPick: boolean("is_community_pick").notNull().default(false),
  communityScore: integer("community_score").notNull().default(0), // Community voting score
  viewCount: integer("view_count").notNull().default(0),
  submittedBy: integer("submitted_by").references(() => users.id), // For community submissions
  approvedBy: integer("approved_by").references(() => users.id), // For moderation
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User video engagement
export const userVideoEngagement = pgTable("user_video_engagement", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  watchedAt: timestamp("watched_at").notNull().defaultNow(),
  progressPercent: integer("progress_percent").notNull().default(0), // 0-100
});

// Success stories
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  isFeature: boolean("is_featured").notNull().default(false),
  likeCount: integer("like_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Daily Discussions - Simple day-based community discussions
export const dailyDiscussions = pgTable("daily_discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dayIndex: integer("day_index").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Reddit-style voting system for forum posts and replies
export const forumVotes = pgTable("forum_votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: integer("post_id").references(() => forumPosts.id, { onDelete: 'cascade' }),
  replyId: integer("reply_id").references(() => forumReplies.id, { onDelete: 'cascade' }),
  voteType: text("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User karma tracking system
export const userKarma = pgTable("user_karma", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalKarma: integer("total_karma").notNull().default(0),
  postKarma: integer("post_karma").notNull().default(0),
  commentKarma: integer("comment_karma").notNull().default(0),
  awardedKarma: integer("awarded_karma").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Video categories for better organization
export const videoCategories = pgTable("video_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  isEssential: boolean("is_essential").notNull().default(false), // For "Essentials" section
  icon: text("icon"), // For UI display
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Enhanced video table with better categorization
export const videoSubcategories = pgTable("video_subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => videoCategories.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Story featuring and moderation system
export const storyFeatures = pgTable("story_features", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull().references(() => successStories.id, { onDelete: 'cascade' }),
  featuredDate: timestamp("featured_date").notNull().defaultNow(),
  featuredBy: integer("featured_by").notNull().references(() => users.id),
  adminNotes: text("admin_notes"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Enhanced forum posts with Reddit-style features
export const forumPostStats = pgTable("forum_post_stats", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id, { onDelete: 'cascade' }),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0), // Kept for schema compatibility, always 0 (upvote-only system)
  hotScore: decimal("hot_score", { precision: 10, scale: 4 }).notNull().default('0'), // For "hot" algorithm
  trendingScore: decimal("trending_score", { precision: 10, scale: 4 }).notNull().default('0'), // For "trending" algorithm
  controversyScore: decimal("controversy_score", { precision: 10, scale: 4 }).notNull().default('0'),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Enhanced forum replies with threading support
export const forumReplyStats = pgTable("forum_reply_stats", {
  id: serial("id").primaryKey(),
  replyId: integer("reply_id").notNull().references(() => forumReplies.id, { onDelete: 'cascade' }),
  parentReplyId: integer("parent_reply_id").references(() => forumReplies.id), // For threaded replies
  depth: integer("depth").notNull().default(0), // Reply depth (0 = top level, 1 = reply to post, 2 = reply to reply, etc.)
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  childCount: integer("child_count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Ad Campaigns for monetization
export const adCampaigns = pgTable("ad_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  advertiser: text("advertiser").notNull(), // Company/brand name
  clientId: integer("client_id").references(() => advertisingClients.id), // Link to advertising client
  status: text("status").notNull().default('draft'), // draft, active, paused, completed
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budgetCents: integer("budget_cents"), // Total budget in cents
  spentCents: integer("spent_cents").notNull().default(0),
  costPerClickCents: integer("cost_per_click_cents"), // CPC pricing
  costPerImpressionCents: integer("cost_per_impression_cents"), // CPM pricing (per 1000)
  targetImpressions: integer("target_impressions"), // Campaign goal
  targetClicks: integer("target_clicks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Ad Creatives (the actual ad content)
export const adCreatives = pgTable("ad_creatives", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => adCampaigns.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ctaText: text("cta_text").notNull(), // Button text like "Learn More", "Get Started"
  ctaUrl: text("cta_url").notNull(), // Destination URL
  imageUrl: text("image_url"), // Main creative image
  logoUrl: text("logo_url"), // Brand logo
  category: text("category"), // Ad category for targeting (Security, Getting Started, etc.)
  placement: text("placement").notNull().default('in_feed'), // in_feed, sidebar, banner
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Ad Impressions tracking
export const adImpressions = pgTable("ad_impressions", {
  id: serial("id").primaryKey(),
  creativeId: integer("creative_id").notNull().references(() => adCreatives.id, { onDelete: 'cascade' }),
  campaignId: integer("campaign_id").notNull().references(() => adCampaigns.id, { onDelete: 'cascade' }),
  userId: integer("user_id"), // Can be null for anonymous
  sessionId: text("session_id"), // For tracking unique views
  placement: text("placement").notNull(), // Where the ad was shown
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

// Ad Clicks tracking  
export const adClicks = pgTable("ad_clicks", {
  id: serial("id").primaryKey(),
  creativeId: integer("creative_id").notNull().references(() => adCreatives.id, { onDelete: 'cascade' }),
  campaignId: integer("campaign_id").notNull().references(() => adCampaigns.id, { onDelete: 'cascade' }),
  userId: integer("user_id"), // Can be null for anonymous
  sessionId: text("session_id"),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  dayIndex: integer("day_index").notNull(), // which day of curriculum this represents
  factsViewed: integer("facts_viewed").notNull().default(0),
  lessonCompleted: boolean("lesson_completed").notNull().default(false),
  quizCompleted: boolean("quiz_completed").notNull().default(false),
  dayCompleted: boolean("day_completed").notNull().default(false), // all activities finished
  completedAt: timestamp("completed_at"), // when day was fully completed
  progressPercentage: integer("progress_percentage").notNull().default(0),
});

// Daily activity tracking for consistency calendar
export const dailyActivities = pgTable("daily_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  lessonCompleted: boolean("lesson_completed").notNull().default(false),
  quizCompleted: boolean("quiz_completed").notNull().default(false),
  practiceCompleted: boolean("practice_completed").notNull().default(false), // simulator or safety training
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const simulatorCompletions = pgTable("simulator_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  simulatorType: text("simulator_type").notNull(), // 'dca', 'hodl', 'inflation', 'settlement', 'security'
  completedMonth: text("completed_month").notNull(), // YYYY-MM format
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  // Unique constraint: one completion per user per simulator per month
  index("unique_user_simulator_month").on(table.userId, table.simulatorType, table.completedMonth),
]);

export const knowledgeAreas = pgTable("knowledge_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  completedLessons: integer("completed_lessons").notNull().default(0),
  totalLessons: integer("total_lessons").notNull(),
});

export const convictionContent = pgTable("conviction_content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'quote' or 'video'
  title: text("title").notNull(),
  content: text("content").notNull(), // quote text or video description
  author: text("author").notNull(), // quote author or speaker name
  source: text("source"), // publication/event name
  videoUrl: text("video_url"), // YouTube/video URL for video type
  thumbnailUrl: text("thumbnail_url"), // video thumbnail
  dayIndex: integer("day_index").notNull(),
  featured: boolean("featured").notNull().default(false), // for highlighting important content
});

export const treasuryCompanies = pgTable("treasury_companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ticker: varchar("ticker", { length: 10 }),
  industry: varchar("industry", { length: 100 }).notNull(),
  bitcoinHoldings: decimal("bitcoin_holdings", { precision: 15, scale: 8 }).notNull(),
  marketValue: decimal("market_value", { precision: 20, scale: 2 }),
  acquisitionDate: date("acquisition_date"),
  announcementDate: date("announcement_date").notNull(),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  ceoName: varchar("ceo_name", { length: 255 }),
  country: varchar("country", { length: 100 }).notNull(),
  isPublic: boolean("is_public").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const sovereignAdoption = pgTable("sovereign_adoption", {
  id: serial("id").primaryKey(),
  entityName: varchar("entity_name", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // "country", "state", "province", "city"
  adoptionType: varchar("adoption_type", { length: 100 }).notNull(), // "legal_tender", "treasury_reserve", "mining_friendly", "regulatory_clarity"
  bitcoinHoldings: decimal("bitcoin_holdings", { precision: 15, scale: 8 }),
  population: integer("population"),
  announcementDate: date("announcement_date").notNull(),
  implementationDate: date("implementation_date"),
  description: text("description").notNull(),
  keyOfficials: varchar("key_officials", { length: 500 }),
  gdp: decimal("gdp", { precision: 20, scale: 2 }),
  currency: varchar("currency", { length: 10 }),
  region: varchar("region", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // "active", "proposed", "suspended"
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const bitcoinPrice = pgTable("bitcoin_price", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  priceUsd: decimal("price_usd", { precision: 12, scale: 2 }).notNull(),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  change24h: decimal("change_24h", { precision: 5, scale: 2 }),
  change7d: decimal("change_7d", { precision: 5, scale: 2 }),
  dominance: decimal("dominance", { precision: 5, scale: 2 }),
});

export const userQuizAnswers = pgTable("user_quiz_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  questionId: integer("question_id").notNull(),
  selectedAnswer: text("selected_answer").notNull(), // 'A', 'B', 'C', or 'D'
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

// New Content Management Tables for 180-day curriculum
export const contentDays = pgTable("content_days", {
  id: serial("id").primaryKey(),
  dayIndex: integer("day_index").notNull().unique(),
  title: text("title").notNull(),
  readingLevel: text("reading_level").notNull(), // "9th grade", "10th grade", etc.
  culturalStage: text("cultural_stage").notNull(), // "Normie → Pre-coiner", etc.
  theme: text("theme").notNull(), // "Bitcoin basics", "Austrian economics", etc.
  status: text("status").notNull().default('draft'), // 'draft', 'review', 'approved', 'live'
  isActive: boolean("is_active").notNull().default(true),
  isApproved: boolean("is_approved").notNull().default(false), // for content approval tracking
  reviewerNotes: text("reviewer_notes"), // notes from reviewer during review process
  approvedBy: text("approved_by"), // admin who approved the content
  approvedAt: timestamp("approved_at"), // when content was approved
  publishedAt: timestamp("published_at"), // when content went live
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentSetUpQuestions = pgTable("content_set_up_questions", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  orderIndex: integer("order_index").notNull().default(0), // for multiple questions per day
  createdAt: timestamp("created_at").notNull().defaultNow(),
});



export const contentLessons = pgTable("content_lessons", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  title: text("title").notNull(),
  content: text("content").notNull(), // Main narrative lesson content
  keyTakeaways: json("key_takeaways").$type<string[]>().notNull(),
  whyItMatters: text("why_it_matters"), // "Why This Matters" section content
  estimatedReadTime: integer("estimated_read_time").notNull().default(3), // minutes
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentQuizzes = pgTable("content_quizzes", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentMetadata = pgTable("content_metadata", {
  id: serial("id").primaryKey(),
  dayId: integer("day_id").notNull().references(() => contentDays.id),
  generationPrompt: text("generation_prompt"), // Store the prompt used to generate this content
  generationDate: timestamp("generation_date"),
  qualityScore: integer("quality_score"), // 1-10 rating for content quality
  reviewStatus: text("review_status").notNull().default("pending"), // pending, approved, needs_revision
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contentGenerationSteps = pgTable("content_generation_steps", {
  id: serial("id").primaryKey(),
  stepNumber: varchar("step_number", { length: 10 }).notNull(),
  stepName: varchar("step_name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  qualityGates: text("quality_gates").array(),
  outputs: text("outputs").array(),
  estimatedTimeMinutes: integer("estimated_time_minutes"),
  dependencies: varchar("dependencies", { length: 50 }).array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  createdAt: true,
  lastUsed: true,
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  email: z.string().email('Valid email is required for account recovery'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the Terms of Service and Privacy Policy to create an account'
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(6).max(100),
});



export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertKnowledgeAreaSchema = createInsertSchema(knowledgeAreas).omit({
  id: true,
});

export const insertConvictionContentSchema = createInsertSchema(convictionContent).omit({
  id: true,
});

export const insertTreasuryCompanySchema = createInsertSchema(treasuryCompanies).omit({
  id: true,
  lastUpdated: true,
});

export const insertSovereignAdoptionSchema = createInsertSchema(sovereignAdoption).omit({
  id: true,
  lastUpdated: true,
});

export const insertBitcoinPriceSchema = createInsertSchema(bitcoinPrice).omit({
  id: true,
  timestamp: true,
});

export const insertUserQuizAnswerSchema = createInsertSchema(userQuizAnswers).omit({
  id: true,
  answeredAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

// Insert schemas for new content tables
export const insertContentDaySchema = createInsertSchema(contentDays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentSetUpQuestionSchema = createInsertSchema(contentSetUpQuestions).omit({
  id: true,
  createdAt: true,
});



export const insertContentLessonSchema = createInsertSchema(contentLessons).omit({
  id: true,
  createdAt: true,
});

export const insertContentQuizSchema = createInsertSchema(contentQuizzes).omit({
  id: true,
  createdAt: true,
});

export const insertContentMetadataSchema = createInsertSchema(contentMetadata).omit({
  id: true,
  createdAt: true,
});

export const insertContentGenerationStepsSchema = createInsertSchema(contentGenerationSteps).omit({
  id: true,
  createdAt: true,
});

// Email collection table for progressive access
export const emailCollections = pgTable("email_collections", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull(),
  trigger: varchar("trigger", { length: 50 }), // 'day-limit', 'simulator', 'feature'
  lockedFeature: varchar("locked_feature", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailCollectionSchema = createInsertSchema(emailCollections).omit({
  id: true,
  createdAt: true,
});

// Bitcoin Learning Wallet System
export const userWalletProgress = pgTable("user_wallet_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalSatoshisEarned: integer("total_satoshis_earned").notNull().default(0),
  currentStreakMultiplier: decimal("current_streak_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  lastEarningDate: text("last_earning_date"), // YYYY-MM-DD format
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const walletEarnings = pgTable("wallet_earnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  dayIndex: integer("day_index").notNull(), // Which day of curriculum
  earningType: text("earning_type").notNull(), // 'quiz_question', 'quiz_completion', 'streak_7', 'streak_30', 'streak_365', 'simulator', 'community'
  satoshisEarned: integer("satoshis_earned").notNull(),
  streakMultiplier: decimal("streak_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  bitcoinPriceUsd: decimal("bitcoin_price_usd", { precision: 10, scale: 2 }).notNull(), // Price at time of earning
  usdValueAtEarning: decimal("usd_value_at_earning", { precision: 10, scale: 8 }).notNull(),
  description: text("description"), // "Correct answer: Question 3", "Quiz completed perfectly", "7-day streak bonus", etc.
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const walletAchievements = pgTable("wallet_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text("achievement_type").notNull(), // 'first_1000_sats', 'perfect_week', 'coffee_money', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // Lucide icon name
  satoshisThreshold: integer("satoshis_threshold"), // Required sats for achievement
  usdValueThreshold: decimal("usd_value_threshold", { precision: 10, scale: 2 }), // Required USD value
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  isNotified: boolean("is_notified").notNull().default(false),
});

// Streak rewards tracking for recurring bonuses
export const streakRewards = pgTable("streak_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakType: text("streak_type").notNull(), // '7_day', '30_day', '365_day'
  streakLength: integer("streak_length").notNull(), // Current streak length when earned
  satoshisEarned: integer("satoshis_earned").notNull(),
  streakNumber: integer("streak_number").notNull().default(1), // 1st 7-day streak, 2nd 7-day streak, etc.
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

// Streak insurance system - spend sats to protect streaks
export const streakInsurance = pgTable("streak_insurance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakLength: integer("streak_length").notNull(), // Streak length when insurance purchased
  satoshisCost: integer("satoshis_cost").notNull().default(1000), // Cost to purchase insurance
  isUsed: boolean("is_used").notNull().default(false), // Whether insurance was claimed
  usedAt: timestamp("used_at"), // When insurance was used
  expiresAt: timestamp("expires_at").notNull(), // 24-hour expiration
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const insertUserWalletProgressSchema = createInsertSchema(userWalletProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletEarningSchema = createInsertSchema(walletEarnings).omit({
  id: true,
  earnedAt: true,
});

export const insertWalletAchievementSchema = createInsertSchema(walletAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertStreakRewardSchema = createInsertSchema(streakRewards).omit({
  id: true,
  earnedAt: true,
});

export const insertStreakInsuranceSchema = createInsertSchema(streakInsurance).omit({
  id: true,
  purchasedAt: true,
});

export type EmailCollection = typeof emailCollections.$inferSelect;
export type InsertEmailCollection = z.infer<typeof insertEmailCollectionSchema>;
export type UserWalletProgress = typeof userWalletProgress.$inferSelect;
export type InsertUserWalletProgress = z.infer<typeof insertUserWalletProgressSchema>;
export type WalletEarning = typeof walletEarnings.$inferSelect;
export type InsertWalletEarning = z.infer<typeof insertWalletEarningSchema>;
export type WalletAchievement = typeof walletAchievements.$inferSelect;
export type InsertWalletAchievement = z.infer<typeof insertWalletAchievementSchema>;
export type StreakReward = typeof streakRewards.$inferSelect;
export type InsertStreakReward = z.infer<typeof insertStreakRewardSchema>;
export type StreakInsurance = typeof streakInsurance.$inferSelect;
export type InsertStreakInsurance = z.infer<typeof insertStreakInsuranceSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type KnowledgeArea = typeof knowledgeAreas.$inferSelect;
export type InsertKnowledgeArea = z.infer<typeof insertKnowledgeAreaSchema>;
export type ConvictionContent = typeof convictionContent.$inferSelect;
export type InsertConvictionContent = z.infer<typeof insertConvictionContentSchema>;
export type TreasuryCompany = typeof treasuryCompanies.$inferSelect;
export type InsertTreasuryCompany = z.infer<typeof insertTreasuryCompanySchema>;
export type SovereignAdoption = typeof sovereignAdoption.$inferSelect;
export type InsertSovereignAdoption = z.infer<typeof insertSovereignAdoptionSchema>;
export type BitcoinPrice = typeof bitcoinPrice.$inferSelect;
export type InsertBitcoinPrice = z.infer<typeof insertBitcoinPriceSchema>;
export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type InsertUserQuizAnswer = z.infer<typeof insertUserQuizAnswerSchema>;

// Types for new content tables
export type ContentDay = typeof contentDays.$inferSelect;
export type InsertContentDay = z.infer<typeof insertContentDaySchema>;
export type ContentSetUpQuestion = typeof contentSetUpQuestions.$inferSelect;
export type InsertContentSetUpQuestion = z.infer<typeof insertContentSetUpQuestionSchema>;

export type ContentLesson = typeof contentLessons.$inferSelect;
export type InsertContentLesson = z.infer<typeof insertContentLessonSchema>;
export type ContentQuiz = typeof contentQuizzes.$inferSelect;
export type InsertContentQuiz = z.infer<typeof insertContentQuizSchema>;
export type ContentMetadata = typeof contentMetadata.$inferSelect;
export type InsertContentMetadata = z.infer<typeof insertContentMetadataSchema>;
export type ContentGenerationSteps = typeof contentGenerationSteps.$inferSelect;
export type InsertContentGenerationSteps = z.infer<typeof insertContentGenerationStepsSchema>;

// Enhanced content types for API responses
export type DailyContentSetUpQuestion = ContentSetUpQuestion;

export type DailyContentComplete = {
  day: ContentDay;
  setUpQuestions: DailyContentSetUpQuestion[];
  lesson: ContentLesson | null;
  quizzes: ContentQuiz[];
  metadata: ContentMetadata | null;
};

// Daily Activities schema and types
export const insertDailyActivitySchema = createInsertSchema(dailyActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DailyActivity = typeof dailyActivities.$inferSelect;
export type InsertDailyActivity = z.infer<typeof insertDailyActivitySchema>;

// Simulator Completions schema and types
export const insertSimulatorCompletionSchema = createInsertSchema(simulatorCompletions).omit({
  id: true,
  createdAt: true,
});

export type SimulatorCompletion = typeof simulatorCompletions.$inferSelect;
export type InsertSimulatorCompletion = z.infer<typeof insertSimulatorCompletionSchema>;

// Forum CRUD schemas
export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Community Reddit-style feature schemas
export const insertForumVoteSchema = createInsertSchema(forumVotes).omit({
  id: true,
  createdAt: true,
});

export const insertUserKarmaSchema = createInsertSchema(userKarma).omit({
  id: true,
  updatedAt: true,
});

export const insertVideoCategorySchema = createInsertSchema(videoCategories).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSubcategorySchema = createInsertSchema(videoSubcategories).omit({
  id: true,
  createdAt: true,
});

export const insertStoryFeatureSchema = createInsertSchema(storyFeatures).omit({
  id: true,
  featuredDate: true,
});

export const insertForumPostStatsSchema = createInsertSchema(forumPostStats).omit({
  id: true,
  updatedAt: true,
});

export const insertForumReplyStatsSchema = createInsertSchema(forumReplyStats).omit({
  id: true,
  updatedAt: true,
});

// Ad Campaign schemas
export const insertAdCampaignSchema = createInsertSchema(adCampaigns).omit({
  id: true,
  spentCents: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdCreativeSchema = createInsertSchema(adCreatives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdImpressionSchema = createInsertSchema(adImpressions).omit({
  id: true,
  viewedAt: true,
});

export const insertAdClickSchema = createInsertSchema(adClicks).omit({
  id: true,
  clickedAt: true,
});

// Enhanced curated videos schema
export const insertCuratedVideoSchema = createInsertSchema(curatedVideos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

// Community types
export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumVote = typeof forumVotes.$inferSelect;
export type InsertForumVote = z.infer<typeof insertForumVoteSchema>;
export type UserKarma = typeof userKarma.$inferSelect;
export type InsertUserKarma = z.infer<typeof insertUserKarmaSchema>;
export type VideoCategory = typeof videoCategories.$inferSelect;
export type InsertVideoCategory = z.infer<typeof insertVideoCategorySchema>;
export type VideoSubcategory = typeof videoSubcategories.$inferSelect;
export type InsertVideoSubcategory = z.infer<typeof insertVideoSubcategorySchema>;
export type StoryFeature = typeof storyFeatures.$inferSelect;
export type InsertStoryFeature = z.infer<typeof insertStoryFeatureSchema>;
export type ForumPostStats = typeof forumPostStats.$inferSelect;
export type InsertForumPostStats = z.infer<typeof insertForumPostStatsSchema>;
export type ForumReplyStats = typeof forumReplyStats.$inferSelect;
export type InsertForumReplyStats = z.infer<typeof insertForumReplyStatsSchema>;

// Enhanced community types for API responses
export type CuratedVideo = typeof curatedVideos.$inferSelect;
export type InsertCuratedVideo = z.infer<typeof insertCuratedVideoSchema>;
export type SuccessStory = typeof successStories.$inferSelect;
export type DailyDiscussion = typeof dailyDiscussions.$inferSelect;

// Enhanced forum post with Reddit-style data
export type ForumPostWithStats = ForumPost & {
  stats: ForumPostStats;
  author: Pick<User, 'id' | 'username'>;
  category: ForumCategory;
  userVote?: ForumVote;
  karma: number;
};

// Enhanced forum reply with threading
export type ForumReplyWithStats = ForumReply & {
  stats: ForumReplyStats;
  author: Pick<User, 'id' | 'username'>;
  userVote?: ForumVote;
  children?: ForumReplyWithStats[];
  karma: number;
};

// Video with categorization
export type VideoWithCategory = CuratedVideo & {
  category?: VideoCategory;
  subcategory?: VideoSubcategory;
  submittedByUser?: Pick<User, 'id' | 'username'>;
  approvedByUser?: Pick<User, 'id' | 'username'>;
};

// Featured story
export type FeaturedStory = SuccessStory & {
  author: Pick<User, 'id' | 'username'>;
  feature?: StoryFeature;
};

// Ad Campaign types
export type AdCampaign = typeof adCampaigns.$inferSelect;
export type InsertAdCampaign = z.infer<typeof insertAdCampaignSchema>;
export type AdCreative = typeof adCreatives.$inferSelect;
export type InsertAdCreative = z.infer<typeof insertAdCreativeSchema>;
export type AdImpression = typeof adImpressions.$inferSelect;
export type InsertAdImpression = z.infer<typeof insertAdImpressionSchema>;
export type AdClick = typeof adClicks.$inferSelect;
export type InsertAdClick = z.infer<typeof insertAdClickSchema>;

// Ad creative with campaign info for display
export type AdCreativeWithCampaign = AdCreative & {
  campaign: AdCampaign;
};

// ============================================
// ADMIN PORTAL SCHEMAS AND TYPES
// ============================================

// Admin user schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  lastLoginAt: true,
  createdAt: true,
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Advertising clients schema
export const insertAdvertisingClientSchema = createInsertSchema(advertisingClients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Store products schema
export const insertStoreProductSchema = createInsertSchema(storeProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Store orders schema
export const insertStoreOrderSchema = createInsertSchema(storeOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Store order items schema
export const insertStoreOrderItemSchema = createInsertSchema(storeOrderItems).omit({
  id: true,
  createdAt: true,
});

// Invoices schema
export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Affiliate products schema
export const insertAffiliateProductSchema = createInsertSchema(affiliateProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Affiliate clicks schema
export const insertAffiliateClickSchema = createInsertSchema(affiliateClicks).omit({
  id: true,
  clickedAt: true,
});

// Referral partners schema
export const insertReferralPartnerSchema = createInsertSchema(referralPartners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Referral signups schema
export const insertReferralSignupSchema = createInsertSchema(referralSignups).omit({
  id: true,
  createdAt: true,
});

// Admin types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminLoginRequest = z.infer<typeof adminLoginSchema>;

// Advertising client types
export type AdvertisingClient = typeof advertisingClients.$inferSelect;
export type InsertAdvertisingClient = z.infer<typeof insertAdvertisingClientSchema>;

// Store types
export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertStoreProduct = z.infer<typeof insertStoreProductSchema>;
export type StoreOrder = typeof storeOrders.$inferSelect;
export type InsertStoreOrder = z.infer<typeof insertStoreOrderSchema>;
export type StoreOrderItem = typeof storeOrderItems.$inferSelect;
export type InsertStoreOrderItem = z.infer<typeof insertStoreOrderItemSchema>;

// Invoice types
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// Extended order with items
export type StoreOrderWithItems = StoreOrder & {
  items: (StoreOrderItem & { product: StoreProduct })[];
  user?: Pick<User, 'id' | 'username' | 'email'>;
};

// Affiliate types
export type AffiliateProduct = typeof affiliateProducts.$inferSelect;
export type InsertAffiliateProduct = z.infer<typeof insertAffiliateProductSchema>;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = z.infer<typeof insertAffiliateClickSchema>;

// Referral types
export type ReferralPartner = typeof referralPartners.$inferSelect;
export type InsertReferralPartner = z.infer<typeof insertReferralPartnerSchema>;
export type ReferralSignup = typeof referralSignups.$inferSelect;
export type InsertReferralSignup = z.infer<typeof insertReferralSignupSchema>;

// ============================================
// SOCIAL MEDIA SCHEMAS AND TYPES
// ============================================

// Social posts schema
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Social post metrics schema
export const insertSocialPostMetricsSchema = createInsertSchema(socialPostMetrics).omit({
  id: true,
  syncedAt: true,
});

// Attribution events schema
export const insertAttributionEventSchema = createInsertSchema(attributionEvents).omit({
  id: true,
  createdAt: true,
});

// Social accounts schema
export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Social media types
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPostMetrics = typeof socialPostMetrics.$inferSelect;
export type InsertSocialPostMetrics = z.infer<typeof insertSocialPostMetricsSchema>;
export type AttributionEvent = typeof attributionEvents.$inferSelect;
export type InsertAttributionEvent = z.infer<typeof insertAttributionEventSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

// Extended social post with metrics
export type SocialPostWithMetrics = SocialPost & {
  metrics?: SocialPostMetrics;
  signups?: number;
};

// ============================================
// B2B CRM SCHEMAS AND TYPES
// ============================================

// CRM Company schema
export const insertCrmCompanySchema = createInsertSchema(crmCompanies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// CRM Contact schema
export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// CRM Deal schema
export const insertCrmDealSchema = createInsertSchema(crmDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// CRM Activity schema
export const insertCrmActivitySchema = createInsertSchema(crmActivities).omit({
  id: true,
  createdAt: true,
});

// CRM Types
export type CrmCompany = typeof crmCompanies.$inferSelect;
export type InsertCrmCompany = z.infer<typeof insertCrmCompanySchema>;
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmDeal = typeof crmDeals.$inferSelect;
export type InsertCrmDeal = z.infer<typeof insertCrmDealSchema>;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;

// Extended CRM types
export type CrmDealWithRelations = CrmDeal & {
  company: CrmCompany;
  contact?: CrmContact;
  activities?: CrmActivity[];
};

export type CrmCompanyWithContacts = CrmCompany & {
  contacts: CrmContact[];
  deals: CrmDeal[];
};

// ==================== Product Roadmap Tables ====================
export const roadmapIdeas = pgTable("roadmap_ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default('feature'),
  priority: text("priority").notNull().default('medium'),
  status: text("status").notNull().default('backlog'),
  votes: integer("votes").notNull().default(0),
  effort: text("effort"),
  impact: text("impact"),
  targetRelease: text("target_release"),
  requestedBy: text("requested_by"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roadmapReleases = pgTable("roadmap_releases", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default('planned'),
  targetDate: timestamp("target_date"),
  releaseDate: timestamp("release_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== Goals & OKRs Tables ====================
export const objectives = pgTable("objectives", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default('company'),
  timeframe: text("timeframe").notNull().default('quarterly'),
  quarter: text("quarter"),
  year: integer("year"),
  status: text("status").notNull().default('active'),
  progress: integer("progress").notNull().default(0),
  ownerId: text("owner_id"),
  ownerName: text("owner_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const keyResults = pgTable("key_results", {
  id: serial("id").primaryKey(),
  objectiveId: integer("objective_id").notNull().references(() => objectives.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  metricType: text("metric_type").notNull().default('percentage'),
  targetValue: integer("target_value").notNull().default(100),
  currentValue: integer("current_value").notNull().default(0),
  unit: text("unit"),
  status: text("status").notNull().default('on_track'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const keyResultUpdates = pgTable("key_result_updates", {
  id: serial("id").primaryKey(),
  keyResultId: integer("key_result_id").notNull().references(() => keyResults.id, { onDelete: 'cascade' }),
  previousValue: integer("previous_value").notNull(),
  newValue: integer("new_value").notNull(),
  note: text("note"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Roadmap schemas
export const insertRoadmapIdeaSchema = createInsertSchema(roadmapIdeas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoadmapReleaseSchema = createInsertSchema(roadmapReleases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// OKR schemas
export const insertObjectiveSchema = createInsertSchema(objectives).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKeyResultSchema = createInsertSchema(keyResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKeyResultUpdateSchema = createInsertSchema(keyResultUpdates).omit({
  id: true,
  createdAt: true,
});

// Roadmap types
export type RoadmapIdea = typeof roadmapIdeas.$inferSelect;
export type InsertRoadmapIdea = z.infer<typeof insertRoadmapIdeaSchema>;
export type RoadmapRelease = typeof roadmapReleases.$inferSelect;
export type InsertRoadmapRelease = z.infer<typeof insertRoadmapReleaseSchema>;

// OKR types
export type Objective = typeof objectives.$inferSelect;
export type InsertObjective = z.infer<typeof insertObjectiveSchema>;
export type KeyResult = typeof keyResults.$inferSelect;
export type InsertKeyResult = z.infer<typeof insertKeyResultSchema>;
export type KeyResultUpdate = typeof keyResultUpdates.$inferSelect;
export type InsertKeyResultUpdate = z.infer<typeof insertKeyResultUpdateSchema>;

// Extended OKR types
export type ObjectiveWithKeyResults = Objective & {
  keyResults: KeyResult[];
};
