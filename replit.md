# Daily Learning App - Compressed Architecture Overview

## Overview
This is a full-stack web application designed for daily learning and knowledge acquisition, specifically focused on Bitcoin education. The app delivers daily facts, lessons, and progress tracking to foster consistent learning habits. It aims to build Bitcoin conviction through immediate relevance rather than an academic approach, targeting young professionals. The project envisions significant market potential, positioning itself as the "Duolingo of Bitcoin Education" with ambitious revenue and valuation goals.

## User Preferences
**CRITICAL: Approval-Required Workflow** - All code changes, implementations, and file modifications require explicit "Approved" message from user before execution. Always propose changes first and wait for approval.

## System Architecture

### Core Design Principles
- **User-Centric Learning**: Emphasizes "Conviction Through Curiosity" with content structured for financial urgency and immediate relevance.
- **Gamified Engagement**: Integrates streaks, rewards, and interactive elements to drive daily habit formation.
- **Progressive Education**: Curriculum scales in difficulty, building from beginner fundamentals to advanced concepts.
- **Visual Storytelling**: Prioritizes visual aids and narrative content over text-heavy explanations.
- **Mobile-First Design**: Optimized for seamless experience on mobile devices with PWA capabilities.
- **Data-Driven Content**: Utilizes a structured database for content delivery, supporting scalable curriculum expansion.

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **UI Framework**: Radix UI, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **UI/UX**: HODLearn Card format (dark/inactive default, orange glow engagement, subtle scale animation), consistent zinc/orange color scheme, professional minimalist design, PWA home screen installation.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple
- **API Structure**: RESTful endpoints for user management, content delivery, progress tracking, and community features.
- **Content Management**: 6-table system for daily content, user progress, and community features, adhering to a strict content creation framework.

### Key Features
- **Daily Learning Curriculum**: Structured daily content (facts, lessons, quizzes) with a focus on immediate financial relevance.
- **User Progress Tracking**: Streaks, quiz scores, and day completion tracking.
- **Gamified Wallet System**: In-app rewards (sats per correct answer/quiz completion), real-time Bitcoin price integration, and earning history.
- **Interactive Simulators**: Tools like DCA Calculator, HODL Simulator, Transaction Simulator, Inflation Calculator, and Bitcoin Security Training.
- **Community Forums**: Reddit-style forums with voting, karma, threaded replies, and content creation.
- **PWA Support**: Installable web app with custom installation prompts for a native-like experience.
- **Authentication**: Robust user authentication with session management and password reset.

### Development & Deployment
- **Package Manager**: npm
- **Development Tools**: tsx, esbuild, Vite, Tailwind CSS.
- **Environment**: Replit-optimized with hot reloading.
- **Deployment Strategy**: Replit for development, external platforms (Vercel/Netlify/Railway) recommended for production due to build performance considerations.
- **Database Management**: Drizzle Kit for schema migrations, `DATABASE_URL` for connection.

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments.
- **drizzle-orm**: Type-safe database operations with PostgreSQL dialect.
- **@tanstack/react-query**: Server state management and caching.
- **@radix-ui/***: Accessible UI primitives and components.
- **lucide-react**: Icon library.

### Development Tools
- **tsx**: TypeScript execution for development.
- **esbuild**: Fast JavaScript bundling.
- **tailwindcss**: Utility-first CSS framework.
- **vite**: Frontend build tool.

### Services & APIs
- **PostgreSQL (Neon serverless)**: Primary data persistence.
- **CoinGecko API**: Real-time Bitcoin price data integration.
- **Anthropic Claude API**: AI-powered content generation for curriculum and social media (uses `AI_INTEGRATIONS_ANTHROPIC_API_KEY` in Replit, `ANTHROPIC_API_KEY` in production).
- **Stripe**: Payment processing and subscription management.
- **AWS S3**: Image and media storage with presigned upload URLs.

### AWS S3 Media Storage Configuration
Required environment variables for S3 image uploads:
- `AWS_ACCESS_KEY_ID`: AWS IAM user access key
- `AWS_SECRET_ACCESS_KEY`: AWS IAM user secret key
- `AWS_S3_BUCKET`: S3 bucket name (e.g., "hodlearn-assets")
- `AWS_REGION`: AWS region (default: "us-east-1")
- `AWS_CLOUDFRONT_DOMAIN`: (Optional) CloudFront CDN domain for faster delivery

API Endpoints:
- `GET /api/admin/media/s3-status`: Check if S3 is configured
- `POST /api/admin/media/presigned-upload`: Generate presigned upload URL
- `DELETE /api/admin/media/:key`: Delete an S3 object

Categories for uploads: advertisers, social-media, content, store, misc

### AWS SNS Push Notifications Configuration
Required environment variables for push notifications:
- `AWS_ACCESS_KEY_ID`: AWS IAM user access key (same as S3)
- `AWS_SECRET_ACCESS_KEY`: AWS IAM user secret key (same as S3)
- `AWS_SNS_IOS_PLATFORM_ARN`: SNS Platform Application ARN for Apple APNs
- `AWS_SNS_ANDROID_PLATFORM_ARN`: SNS Platform Application ARN for Firebase FCM

API Endpoints:
- `POST /api/device-tokens`: Register mobile device token for push notifications
- `DELETE /api/device-tokens`: Unregister device token
- `GET /api/admin/push-notifications/stats`: Get device token statistics
- `POST /api/admin/push-notifications`: Create/send push notification

### Automated Notification Templates
Database-driven template system for scheduled notifications with AI-assisted content generation:

Template Categories:
- `morning_spark`: Daily lesson teasers sent each morning
- `streak_coach`: Motivation for users with active streaks
- `reengagement_soft`: Gentle nudge for users idle 3-7 days
- `reengagement_medium`: Stronger message for users idle 7-14 days
- `reengagement_hard`: Last-chance message for users idle 14+ days
- `price_alert`: BTC price movements tied to education
- `milestone`: Achievement and learning milestone celebrations

Placeholders:
- `{{firstName}}`: User's first name
- `{{currentStreak}}`: Current streak in days
- `{{lessonTitle}}`: Current lesson title
- `{{btcPrice}}`: Live Bitcoin price
- `{{dayNumber}}`: Current curriculum day

API Endpoints:
- `GET /api/admin/notification-templates`: List all templates
- `POST /api/admin/notification-templates`: Create template
- `PATCH /api/admin/notification-templates/:id`: Update template
- `DELETE /api/admin/notification-templates/:id`: Delete template
- `POST /api/admin/notification-templates/generate`: AI-generate templates (Claude)
- `POST /api/admin/notification-templates/seed`: Seed 16 starter templates
- `POST /api/admin/notification-scheduler/run`: Run batch send for a category
- `GET /api/admin/notification-scheduler/stats`: Get automation stats
- `GET /api/admin/notification-scheduler/logs`: Get sent notification logs

### Community Moderation
All community mutation routes (post, reply, upvote, report) use session-based authentication with ban/mute enforcement:
- Banned users (bannedAt set) receive 403 response
- Muted users (mutedUntil in future) receive 403 with expiry time
- Admin moderation available at /admin/community

### PDF Invoice Generation
Invoices can be generated as PDFs with HODLearn branding:
- `POST /api/admin/marketing/invoices/:id/generate-pdf`: Generate and store PDF in S3
- `GET /api/admin/marketing/invoices/:id/pdf`: Download invoice PDF

## Admin Portal
- **URL**: `/admin`
- **Default Credentials**: admin@hodlearn.com / admin123 (change immediately in production)
- **Portals**: Content Management, Marketing (B2B), Store (E-commerce), Social Media, Users, B2B CRM, Product Roadmap, KPI Dashboard, Goals

## Production Deployment
See `PRODUCTION_DEPLOYMENT.md` for comprehensive AWS deployment instructions including:
- Environment variable configuration
- Database setup and migrations
- Stripe and Anthropic API integration
- Docker deployment guide
- Post-deployment checklist

## Known Issues / Future Improvements
- No current known issues. All admin portal CRUD operations are fully functional.

## Pending Integrations
- **Resend Email**: Email management system is built (templates, campaigns, automations) but needs `RESEND_API_KEY` secret to enable sending. User can set up Resend account at resend.com, verify their domain, and add the API key as a secret to enable email functionality.