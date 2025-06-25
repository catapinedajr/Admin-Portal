# Daily Learning App - Architecture Overview

## Overview

This is a full-stack web application built for daily learning and knowledge acquisition. The app provides users with daily facts, lessons, and progress tracking to encourage consistent learning habits. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

### Development Setup
- **Package Manager**: npm
- **Development Server**: tsx for TypeScript execution
- **Build Process**: esbuild for backend bundling, Vite for frontend
- **Environment**: Replit-optimized with hot reloading

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following core tables:

1. **Users**: Stores user profiles with streak tracking and activity metrics
2. **Daily Facts**: Contains categorized educational content with icons and cycling logic
3. **Lessons**: Structured learning content with estimated read times and summaries
4. **User Progress**: Tracks daily engagement and completion percentages
5. **Knowledge Areas**: Organizes content into learning categories with progress tracking

### API Structure
RESTful API endpoints provide:
- User profile management and streak tracking
- Daily fact retrieval with cycling logic
- Lesson content delivery
- Progress tracking and analytics
- Knowledge area organization

### UI Components
Comprehensive component library built on Radix UI primitives:
- Cards, buttons, and form elements
- Progress indicators and badges
- Navigation and layout components
- Toast notifications and dialogs
- Data visualization components

## Data Flow

1. **User Authentication**: Currently uses a default user system (ID: 1) for simplicity
2. **Daily Content**: Facts and lessons are served based on day cycling logic
3. **Progress Tracking**: User interactions are recorded and progress percentages calculated
4. **Streak Management**: Activity dates are tracked to maintain learning streaks

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database operations with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives and components

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundling
- **tailwindcss**: Utility-first CSS framework
- **vite**: Frontend build tool with HMR

## Deployment Strategy

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build` (Vite + esbuild)
- **Start Command**: `npm run start` (production mode)
- **Development**: `npm run dev` (development mode with hot reloading)
- **Port Configuration**: Internal port 5000, external port 80

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Connection**: Environment variable `DATABASE_URL` for PostgreSQL connection
- **Schema Location**: `./shared/schema.ts` for shared type definitions

### Build Process
1. Frontend assets built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static file serving configured for production deployment

## Changelog

- June 25, 2025. Initial setup with Bitcoin and blockchain education app
- June 25, 2025. Added traditional finance educational content with structured fact ordering (Bitcoin Basics → Use Case → Traditional Finance comparison)

## User Preferences

Preferred communication style: Simple, everyday language.