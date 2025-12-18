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
- **OpenAI API**: Previously used for content generation (now relies on static content after an architectural change).

## Known Issues / Future Improvements
- No current known issues. Paid Users count now pulls from Stripe subscriptions table.