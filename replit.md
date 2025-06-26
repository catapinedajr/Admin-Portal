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
- June 25, 2025. Added Conviction Center with daily quotes and videos from Bitcoin industry leaders
- June 25, 2025. Implemented cyberpunk/retro computer UI theme with Bitcoin orange accents and terminal aesthetics
- June 25, 2025. Added Bitcoin Treasury Companies tracking with corporate holdings data (MicroStrategy, Tesla, Block, Marathon Digital)
- June 25, 2025. Added Sovereign Adoption tracking for nations and governments (El Salvador, CAR, Miami, Wyoming)
- June 25, 2025. Integrated real-time Bitcoin price data from CoinGecko API with live market metrics and chart functionality
- June 25, 2025. Updated treasury company data to use authentic holdings from SEC filings with live Bitcoin price calculations
- June 25, 2025. Added Bitcoin Network Adoption section with real on-chain metrics from blockchain.info and bitnodes.io APIs
- June 25, 2025. Implemented comprehensive beginner-friendly improvements: simplified navigation labels, tooltips for technical terms, welcoming introductions, and accessible explanations for Bitcoin newcomers
- June 25, 2025. Applied ultra-soft earth tone color scheme with cream backgrounds and warm brown text for improved eye comfort, plus redesigned navigation to reduce visual clutter with centered layout and pill-shaped buttons
- June 25, 2025. Transformed to Robinhood-style dark mode interface with compact header, hamburger menu navigation, splash screen intro, financial disclaimer, and removed annoying spinning progress indicators
- June 25, 2025. Removed hamburger menu navigation in favor of clean horizontal navigation tabs for better user experience
- June 25, 2025. Repurposed Bitcoin Adoption section to "User Profiles" with real stories from individuals, businesses, and nations explaining why they use Bitcoin
- June 25, 2025. Added comprehensive "Bitcoin Terms" section with essential vocabulary and beginner-friendly definitions
- June 25, 2025. Implemented daily quiz functionality with multiple choice questions and progress tracking to enhance learning engagement
- June 25, 2025. Simplified Bitcoin price display to focus on education rather than trading, removing daily change indicators to discourage short-term speculation
- June 25, 2025. Shortened financial disclaimer to be more concise while maintaining important educational focus messaging
- June 25, 2025. Renamed "User Profiles" to "BTC In Action" section showing real-world Bitcoin usage stories from individuals, businesses, and nations
- June 25, 2025. Added comprehensive "Explore" subsection in Learning with advanced topics: blockchain technology, proof of work, digital signatures, Lightning Network, and Bitcoin's fixed supply
- June 25, 2025. Implemented extensive visual aids throughout educational areas including interactive diagrams, process flows, network visualizations, and progress charts to enhance learning storytelling
- June 25, 2025. Updated all loading screens to display "Loading your Conviction" for a more concise and impactful message that reinforces the app's educational mission
- June 25, 2025. Expanded Conviction Center with three comprehensive subsections: White Paper (with original Bitcoin paper summary and key points), Books & Articles (featuring essential Bitcoin literature with difficulty levels), and Videos (curated collection of educational content from Bitcoin thought leaders)
- June 25, 2025. Redesigned learning section navigation to be more compact with shorter button text, smaller sizing, and responsive wrapping to fit better on mobile and smaller screens
- June 25, 2025. Added comprehensive Simulation Center with five interactive educational tools: Bitcoin Mining Economics, Transaction Builder, HODLing Strategy Comparison, Dollar-Cost Averaging Analysis, and Bitcoin Halving Impact visualization
- June 25, 2025. Optimized main navigation for mobile responsiveness with compact button text, smaller sizing, and flex-wrap to prevent menu overflow on smaller screens
- June 25, 2025. Added comprehensive Financial Disruption section explaining traditional finance problems, Bitcoin solutions, side-by-side comparisons, and future timeline to help users understand Bitcoin's transformative potential
- June 25, 2025. Reorganized navigation into three logical section groups: Foundation (learning, disruption, terms), Practice (simulations), and Inspiration (stories, conviction) for cleaner user experience and better content organization
- June 25, 2025. Updated navigation labels: "Foundation" → "Learn", "Inspiration" → "Inspo" for more compact mobile-friendly design with centered menu alignment
- June 25, 2025. Added "Dive Deeper" functionality to daily facts with expandable detailed explanations, visual descriptions, real-world examples, and key takeaways for enhanced learning experience
- June 25, 2025. Implemented fully functional interactive simulators: Bitcoin Mining Calculator (hash rate, electricity costs, profitability), DCA Calculator (dollar-cost averaging with volatility simulation), and HODLing vs Trading Strategy Comparison (including fees and taxes)
- June 25, 2025. Optimized main navigation menu for all screen sizes with responsive button sizing, spacing, and typography to prevent overflow on mobile devices
- June 25, 2025. Consolidated Facts, Lesson, and Quiz into unified "Today" section for improved gamified daily learning experience with progress tracking and cohesive content flow
- June 26, 2025. Expanded Bitcoin glossary to 80+ comprehensive terms organized by category (Core Concepts, Wallets & Security, Network & Mining, Transactions & Blocks, Economics & Investment, Key Properties) with interactive tooltips throughout the app
- June 26, 2025. Renamed "Terms" section to "Glossary" and created comprehensive reference guide with color-coded categories and complete Bitcoin whitepaper integration with interactive glossary tooltips
- June 26, 2025. Rebranded application to "₿ Journey" with Bitcoin symbol (₿) + "Journey" logo design throughout the interface, removing "BTC" letters for cleaner branding
- June 26, 2025. Implemented premium welcome screen with sophisticated animations, elegant typography, and clean design focused on captivating users for subscription justification - removed complex illustrations in favor of premium step-by-step experience with gradient backgrounds and smooth transitions
- June 26, 2025. Optimized welcome screen layout for better screen fitting: reduced typography sizes, adjusted spacing, compacted feature cards, and refined button sizes to ensure all content displays properly on various screen sizes while maintaining premium aesthetic
- June 26, 2025. Restructured navigation: "Foundation" → "Learn", "Inspiration" → "More" for cleaner UX and revenue optimization
- June 26, 2025. Implemented comprehensive affiliate store under "More" section with books, hardware wallets, courses, and tools for revenue generation through affiliate commissions
- June 26, 2025. Added premium content restrictions for free users (3 daily facts, 1 lesson/week) with upgrade prompts to drive subscription conversions
- June 26, 2025. Created complete gamification system with user levels (Bitcoin Curious → Crypto Master), achievement tracking with XP rewards, and subscription tier management (Explorer $0, Scholar $9.99, Master $19.99)

## User Preferences

Preferred communication style: Simple, everyday language.