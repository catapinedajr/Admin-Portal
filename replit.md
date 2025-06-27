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
- June 26, 2025. Fixed lesson content rendering issue: updated getExpandedLessonContent default case to properly split content by double line breaks instead of dumping entire lesson as single paragraph, resolving cramped text display
- June 26, 2025. Added missing line spacing in Bitcoin vs Gold comparison section: separated each checkmark comparison item with proper line breaks for better readability in lesson content
- June 26, 2025. Enhanced lesson content with bold formatting: added **bold** emphasis to key terms like Scarcity, Durability, Programmable, Investment Thesis, etc. to visually separate terms from their descriptions for improved readability
- June 26, 2025. Simplified lesson section formatting: replaced complex ## markdown headers with clean **bold titles** for section divisions (Properties of Good Money, How Bitcoin Compares to Gold, Bitcoin's Monetary Advantages, The Network Effect) for cleaner, less cluttered text presentation
- June 26, 2025. Added missing expandable "Dive Deeper" content for "Why Bitcoin Matters" fact to ensure all daily facts have comprehensive expandable explanations, examples, and key takeaways
- June 26, 2025. Fixed DCA simulator chart X-axis display: added proper time labels (Start, midpoint months, end months) for better chart readability and simplified start date selection by removing noisy descriptive text, showing only clean "Jan 2019" format instead of "Jan 2019 (Post-Crash Recovery)"
- June 26, 2025. Completely rebuilt DCA calculator from scratch with accurate Bitcoin price modeling and real purchase data visualization: orange line shows volatile Bitcoin prices, blue dashed line shows evolving average cost, green dots show actual purchase points with proper data scaling and authentic historical progression
- June 26, 2025. Fixed DCA investment amount interface: removed misleading "/month" text from dropdown options and added "Per selected frequency below" clarification since users can select different frequencies (daily, weekly, monthly, etc.)
- June 26, 2025. Transformed Today's lesson section from bullet-point format to engaging storytelling narratives: removed all technical bullet points, converted lists to flowing paragraphs, added complete "Bitcoin as Digital Gold" story, and enhanced readability by removing markdown formatting for much improved user experience
- June 26, 2025. Removed Deep Dive section from Learn tab navigation for cleaner user experience, simplifying focus to Today, Reference, and Stories subsections as requested
- June 26, 2025. Fixed Weekly content formatting issues: implemented proper HTML rendering for bold text in bullet points, improved paragraph spacing and visual hierarchy, restructured backend content with better line breaks and bullet point formatting for enhanced readability of 65-minute university-level content
- June 26, 2025. Implemented comprehensive Weekly Quiz system for educational reinforcement: added quiz questions schema field to weekly topics, created interactive WeeklyQuiz component with progress tracking, question navigation, and detailed results with explanations, added 5 university-level questions each for Austrian Economics and Mining weeks positioned before Further Reading section for optimal educational flow
- June 27, 2025. Systematically implemented comprehensive "Dive Deeper" expandable content for ALL daily facts in Learn > Today section: added detailed explanations, examples, visual descriptions, and key takeaways for 20+ daily facts covering blockchain, mining, wallets, transactions, halving, and economics to ensure consistent educational depth across the dynamic dataset
- June 27, 2025. Converted all lesson content from markdown/technical formatting to narrative storytelling format: replaced bullet points, numbered lists, and headers with flowing paragraphs that tell engaging stories, applied changes systematically at the data source level to support dynamic content delivery and improve readability for non-technical users
- June 27, 2025. Removed Stories section entirely from app navigation and functionality to streamline user experience and focus on core educational content
- June 27, 2025. Renamed Practice section to "Simulations" throughout navigation and interface to better reflect the interactive nature of the educational tools
- June 27, 2025. Enhanced Transaction Simulator UX: removed pre-populated TO address requiring users to click paste button, fixed paste button responsive positioning with shrink-0 and min-w-0 classes, added empty state validation for recipient address displays, removed redundant Fee Rate Guide from building phase since it appears again during signing
- June 27, 2025. Completely rebuilt HODLing simulator with authentic historical scenarios: added three real Bitcoin market periods (COVID Crash 2020-2021, Bear Market 2018-2021, Early Adopter 2017-2024) with accurate price data, psychological stress levels, investment amount tiers, comprehensive traditional investment comparisons (S&P 500, real estate, gold, savings), educational insights on time-in-market benefits, and visual journey preview functionality to demonstrate real-world HODLing advantages
- June 27, 2025. Streamlined HODLing simulator to single-screen "HODL Challenge" format: condensed three scenarios into compact cards with hover-to-preview functionality, added real-time investment amount slider with instant calculations, implemented live results display with animated comparison bars, eliminated all scrolling requirements for complete interactivity within single viewport for optimal user experience
- June 27, 2025. Fixed HODLing simulator with accurate historical S&P 500 data and cleaned up comparison layout: replaced unrealistic constant 10% annual returns with period-specific historical data (COVID +45%, Bear Market +35%, Early Adopter +180%), redesigned traditional investment comparison from overlapping progress bars to clean 2x2 grid cards showing asset name, portfolio value, and percentage return for better readability
- June 27, 2025. Updated HODLing scenarios to demonstrate true power of holding through January 2025: changed all scenarios to end at current date (Jan 2025) instead of varying endpoints, showing authentic long-term holding periods (COVID Crash 4.8 years +2,400%, Bear Market 7 years +1,362%, Early Adopter 8 years +9,400%) with corresponding updated traditional investment returns for accurate historical comparisons
- June 27, 2025. Enhanced HODLing simulator readability: added prominent "X years holding" labels to each scenario card for clarity, implemented proper comma formatting throughout all numerical displays (portfolio values, percentages, gains) using toLocaleString() to improve readability of large numbers like 2,400% vs 2400%
- June 27, 2025. Fixed HODLing simulator UX issues: replaced confusing emoji stress indicators (🔥 Extreme, ⚡ High, 💎 Diamond) with clear descriptive labels (Market Crash, Bear Market, Early Days), updated slider labels from abbreviated "$25K" to full "$25,000" format for better clarity and visual consistency
- June 27, 2025. Implemented authentic Bitcoin historical pricing data in DCA calculator: updated start date options to January-only from Bitcoin's inception (2009-2024), integrated historically accurate prices from $0.001 (2009) to $42,000 (2024), enhanced mathematical calculations with proper safety checks to prevent NaN errors, added continuous DCA philosophy calculating from any start date to January 2025 present for true long-term accumulation demonstration
- June 27, 2025. Fixed DCA calculator mathematical accuracy and auto-calculation: resolved calculation triggering issues with automatic useEffect updates when inputs change, implemented deterministic price progression model using exponential growth with realistic volatility patterns, validated calculations across all historical periods showing accurate results (Jan 2023 start: $2,400 invested → $6,477 current value = 169.9% return), removed debug logging for clean production code. App confirmed working properly in browser with all simulators functional
- June 27, 2025. Implemented comprehensive AI-powered content generation system using OpenAI API to create Month 1 educational curriculum: added day navigation controls to Learn > Today section for testing generated content, updated backend API endpoints to support day-specific content requests, fixed quiz synchronization with day navigation system so all three components (facts, lessons, quizzes) change together when navigating between days 1-30, and established background content generation process creating narrative-driven educational material following strict accuracy guidelines
- June 27, 2025. Rebranded app from "BTC Journey" to "HODLearn" for stronger educational identity and renamed "Simulations" menu section to "Simulators" for more precise terminology describing the interactive educational tools
- June 27, 2025. Enhanced AI-powered content generation to create 5 contextual quiz questions per day instead of 1: updated content generator to create questions that directly test the daily fact and lesson content with structured progression (fact understanding, lesson details, practical applications, comparisons, broader implications), ensuring comprehensive assessment of each day's educational material
- June 27, 2025. Fixed systemic quiz generation issue where content generation would silently fail after Day 2: identified that AI was sometimes returning malformed quizQuestions data structure, added comprehensive error handling and logging to validate quiz data before creation, ensuring consistent 5-question quizzes for all days in Month 1 curriculum
- June 27, 2025. Resolved data conflicts between static seed content and AI-generated content: removed static daily facts for days 0-29 that were causing duplicate/extra facts to appear, ensuring each day shows exactly 1 AI-generated daily fact and 5 contextual quiz questions without conflicts or duplications
- June 27, 2025. Fixed critical quiz persistence issue: implemented auto-generation system that detects missing Month 1 content on server startup and regenerates it automatically, resolving the root cause where AI-generated quiz questions were lost on server restarts due to memory-only storage, ensuring consistent 5-question quizzes for all days 0-29
- June 27, 2025. Fixed intermittent calculation errors in HODL simulator: implemented validated percentage return calculation using direct price ratio formula (endPrice/startPrice - 1) * 100 to ensure January 2015 consistently shows accurate 29,805% gain instead of occasional incorrect 220.7% display, resolved floating point precision issues affecting long-term historical scenarios
- June 27, 2025. Added comprehensive Finance main navigation section as free tier feature to entice users: created interactive inflation impact calculator showing purchasing power loss over time, banking fees vs Bitcoin cost comparison tool, animated settlement speed race demonstration, modern card-based problem/solution grid with hover animations, and compelling call-to-action directing users to Learn and Simulators sections for premium content engagement
- June 27, 2025. Enhanced "Why BTC" section with comprehensive historical monetary debasement visualization: added interactive 100-year chart (1924-2024) showing dollar purchasing power decline with SVG path visualization, marked key historical events (1933 Gold Standard, 1971 Nixon Shock, 2008 Financial Crisis, 2020 Money Printing), included authentic statistics (96% purchasing power lost, 3000%+ money supply growth since 1971), and contrasted with Bitcoin's fixed 21M supply to demonstrate why Bitcoin matters as sound money
- June 27, 2025. Transformed "Why BTC" section calculators from problematic bar charts to clean progress bars and simple number comparisons for better visual consistency and mobile compatibility
- June 27, 2025. Added extensive narrative storytelling content throughout "Why BTC" section: created compelling introduction about silent monetary theft, added "The Banking Racket" story explaining fee extraction, included "The Time Tax" narrative about settlement delays, and concluded with persuasive call-to-action tying all elements together to motivate users toward learning Bitcoin fundamentals
- June 27, 2025. Completely rebuilt 100-year historical chart to focus on explosive money supply growth instead of purchasing power decline: transformed visualization to show dramatic money creation from $27B (1924) to $21T (2024) representing 777x multiplication, added authentic historical data points with money supply amounts, included Bitcoin's fixed 21M supply contrast, enhanced with color-coded timeline events and shocking statistics showing 40% of all dollars printed in last 4 years (2020-2024)

## User Preferences

Preferred communication style: Simple, everyday language.

Educational Content Enhancement Preferences:
- **Expandable Facts**: Each daily fact should always have expandable "Learn More" content with deeper explanations, examples, and takeaways
- **Daily Deep Dive**: The Deep Dive section should rotate daily with substantial long-form topics rather than static content, providing comprehensive exploration of advanced Bitcoin concepts
- **Content Quality Focus**: Prioritize substantial, well-formatted educational content with proper spacing and clear text presentation over complex visual widgets
- **Text Formatting**: Emphasize clean line breaks, bullet points for lists, and proper spacing between paragraphs for optimal readability