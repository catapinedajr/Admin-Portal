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
- June 26, 2025. Rebranded app from "Daily Bitcoin Learning" to "BTC Journey" and renamed "Inspo" navigation to "More" section for better user experience
- June 26, 2025. Added comprehensive Wallet Safety section to Practice area with private key security rules, wallet type comparisons, common scam awareness, and interactive security checklist
- June 26, 2025. Implemented affiliate revenue store in More section featuring hardware wallets (Ledger Nano X, Trezor Model T) and essential Bitcoin books (Lyn Alden's "Broken Money", "Bitcoin Standard", "Fiat Standard") with affiliate disclosure
- June 26, 2025. Enhanced "Today" section in Learn area for maximum educational effectiveness: clear learning objectives, structured 3-step progression (Essential Facts → Deep Dive → Knowledge Test), interactive learning path visualization, motivational progress tracking, and completion celebration to improve engagement and knowledge retention
- June 26, 2025. Redesigned "Today" section top area with Apple Activity tracker-inspired progress rings: condensed header with concentric progress circles showing completion status, streak counter prominently displayed in center, 50% smaller footprint while retaining all features for cleaner mobile-friendly design
- June 26, 2025. Enhanced Apple Activity tracker section aesthetics: restructured layout with text above circles, centered activity rings as focal point, improved visual hierarchy with clear header/progress/footer sections, and better formatted progress labels for optimal readability
- June 26, 2025. Fully restored sophisticated interactive functionality across Practice section: enhanced Safety section with 7-question interactive quiz, comprehensive Interactive Wallet Explorer with detailed pros/cons/examples for Hardware/Mobile/Desktop/Exchange wallets, advanced Transaction Builder with address generation capabilities, signing simulation, and blockchain processing visualization, plus enhanced DCA/HODL calculators with adjustable amounts and timelines while removing active trading comparisons for educational focus
- June 26, 2025. Implemented comprehensive Ledger Live-style Transaction Simulator with complete flow: Build → Preview → Fee Selection → Sign → Broadcast → Confirm → Complete, including realistic timing (2-minute confirmation process), hardware wallet signing simulation, real-time confirmation tracking (0-6 confirmations), fee priority selection (slow/standard/fast), security warnings, and educational disclaimers about real-world transaction timelines
- June 26, 2025. Enhanced DCA calculator with comprehensive dropdown interfaces: 17 investment amounts ($25-$10,000), 5 frequencies (daily to quarterly), 12 time periods (3 months to 10 years), 18 historical start dates (2019-2024), and realistic historical price simulation with authentic market volatility patterns for accurate backtesting
- June 26, 2025. Completely redesigned lesson section in Today tab with engaging interactive elements: multi-section lesson format with visual progress tracking, learning objectives and quick overview, step-by-step content with numbered progression, interactive SVG diagrams and visual representations, real-world examples and practical applications, knowledge checkpoints throughout lessons, key takeaways with highlighted insights, and seamless integration to quiz and practice sections for comprehensive learning experience
- June 26, 2025. Fixed text formatting issues in lesson content: removed markdown "##" headers and "-" bullet points, replaced with clean text headers and "•" bullet points for optimal readability and proper spacing
- June 26, 2025. Enhanced lesson readability with improved section spacing: added proper line breaks between sections where markdown headers were removed to prevent cramped text appearance
- June 26, 2025. Fixed cramped bullet point lists in lessons: added individual line spacing between each bullet point item for much better readability and visual separation
- June 26, 2025. Added missing expandable "Dive Deeper" content for "Why Bitcoin Matters" fact to ensure all daily facts have comprehensive expandable explanations, examples, and key takeaways

## User Preferences

Preferred communication style: Simple, everyday language.

Educational Content Enhancement Preferences:
- **Expandable Facts**: Each daily fact should always have expandable "Learn More" content with deeper explanations, examples, and takeaways
- **Daily Deep Dive**: The Deep Dive section should rotate daily with substantial long-form topics rather than static content, providing comprehensive exploration of advanced Bitcoin concepts
- **Content Quality Focus**: Prioritize substantial, well-formatted educational content with proper spacing and clear text presentation over complex visual widgets
- **Text Formatting**: Emphasize clean line breaks, bullet points for lists, and proper spacing between paragraphs for optimal readability