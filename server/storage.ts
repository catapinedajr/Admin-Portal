import { 
  users, 
  dailyFacts, 
  lessons, 
  userProgress, 
  knowledgeAreas,
  convictionContent,
  treasuryCompanies,
  sovereignAdoption,
  deepDiveTopics,
  type User, 
  type InsertUser, 
  type DailyFact, 
  type InsertDailyFact,
  type Lesson,
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type KnowledgeArea,
  type InsertKnowledgeArea,
  type ConvictionContent,
  type InsertConvictionContent,
  type TreasuryCompany,
  type InsertTreasuryCompany,
  type SovereignAdoption,
  type InsertSovereignAdoption,
  type BitcoinPrice,
  type InsertBitcoinPrice,
  type QuizQuestion,
  type InsertQuizQuestion,
  type UserQuizAnswer,
  type InsertUserQuizAnswer,
  type DeepDiveTopic,
  type InsertDeepDiveTopic
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: number, currentStreak: number, longestStreak: number): Promise<void>;
  updateUserProgress(userId: number, completedLessons: number, lastActivityDate: string): Promise<void>;

  // Daily facts methods
  getDailyFacts(dayIndex: number): Promise<DailyFact[]>;
  getAllDailyFacts(): Promise<DailyFact[]>;
  createDailyFact(fact: InsertDailyFact): Promise<DailyFact>;

  // Lessons methods
  getLesson(dayIndex: number): Promise<Lesson | undefined>;
  getAllLessons(): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User progress methods
  getUserProgress(userId: number, date: string): Promise<UserProgress | undefined>;
  getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Knowledge areas methods
  getKnowledgeAreas(): Promise<KnowledgeArea[]>;
  updateKnowledgeAreaProgress(areaId: number, completedLessons: number): Promise<void>;

  // Conviction content methods
  getConvictionContent(dayIndex: number): Promise<ConvictionContent[]>;
  getAllConvictionContent(): Promise<ConvictionContent[]>;
  createConvictionContent(content: InsertConvictionContent): Promise<ConvictionContent>;

  // Treasury companies methods
  getTreasuryCompanies(): Promise<TreasuryCompany[]>;
  getTreasuryCompanyById(id: number): Promise<TreasuryCompany | undefined>;
  createTreasuryCompany(company: InsertTreasuryCompany): Promise<TreasuryCompany>;
  updateTreasuryCompany(id: number, updates: Partial<InsertTreasuryCompany>): Promise<TreasuryCompany | undefined>;

  // Sovereign adoption methods
  getSovereignAdoptions(): Promise<SovereignAdoption[]>;
  getSovereignAdoptionById(id: number): Promise<SovereignAdoption | undefined>;
  getSovereignAdoptionsByType(adoptionType: string): Promise<SovereignAdoption[]>;
  createSovereignAdoption(adoption: InsertSovereignAdoption): Promise<SovereignAdoption>;
  updateSovereignAdoption(id: number, updates: Partial<InsertSovereignAdoption>): Promise<SovereignAdoption | undefined>;

  // Bitcoin price methods
  getCurrentBitcoinPrice(): Promise<BitcoinPrice | undefined>;
  getBitcoinPriceHistory(hours: number): Promise<BitcoinPrice[]>;
  createBitcoinPrice(price: InsertBitcoinPrice): Promise<BitcoinPrice>;

  // Quiz methods
  getDailyQuizQuestions(dayIndex: number): Promise<QuizQuestion[]>;
  getAllQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]>;
  submitQuizAnswer(answer: InsertUserQuizAnswer): Promise<UserQuizAnswer>;
  getUserQuizScore(userId: number, date: string): Promise<{ correct: number; total: number; percentage: number }>;

  // Deep dive topics methods
  getDailyDeepDive(dayIndex: number): Promise<DeepDiveTopic | undefined>;
  getAllDeepDiveTopics(): Promise<DeepDiveTopic[]>;
  createDeepDiveTopic(topic: InsertDeepDiveTopic): Promise<DeepDiveTopic>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailyFacts: Map<number, DailyFact>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<string, UserProgress>; // key: userId-date
  private knowledgeAreas: Map<number, KnowledgeArea>;
  private convictionContent: Map<number, ConvictionContent>;
  private treasuryCompanies: Map<number, TreasuryCompany>;
  private sovereignAdoptions: Map<number, SovereignAdoption>;
  private bitcoinPrices: Map<number, BitcoinPrice>;
  private quizQuestions: Map<number, QuizQuestion>;
  private userQuizAnswers: Map<string, UserQuizAnswer>; // key: userId-questionId-date
  private deepDiveTopics: Map<number, DeepDiveTopic>;
  private currentUserId: number;
  private currentFactId: number;
  private currentLessonId: number;
  private currentProgressId: number;
  private currentKnowledgeAreaId: number;
  private currentConvictionContentId: number;
  private currentTreasuryCompanyId: number;
  private currentSovereignAdoptionId: number;
  private currentBitcoinPriceId: number;
  private currentQuizQuestionId: number;
  private currentQuizAnswerId: number;

  constructor() {
    this.users = new Map();
    this.dailyFacts = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.knowledgeAreas = new Map();
    this.convictionContent = new Map();
    this.treasuryCompanies = new Map();
    this.sovereignAdoptions = new Map();
    this.quizQuestions = new Map();
    this.userQuizAnswers = new Map();
    this.currentUserId = 1;
    this.currentFactId = 1;
    this.currentLessonId = 1;
    this.currentProgressId = 1;
    this.currentKnowledgeAreaId = 1;
    this.currentConvictionContentId = 1;
    this.currentTreasuryCompanyId = 1;
    this.currentSovereignAdoptionId = 1;
    this.bitcoinPrices = new Map();
    this.currentBitcoinPriceId = 1;
    this.currentQuizQuestionId = 1;
    this.currentQuizAnswerId = 1;

    this.seedData();
  }

  private seedData() {
    // Comprehensive Bitcoin education facts - organized by learning progression
    const facts = [
      // Week 1: Core Concepts
      {
        title: "What is Bitcoin?",
        content: "Bitcoin is digital money that works without banks or governments. It's the first successful cryptocurrency, created to give people financial freedom and control over their own money.",
        category: "Fundamentals",
        icon: "coins",
        dayIndex: 0
      },
      {
        title: "Digital Scarcity",
        content: "Bitcoin has a maximum supply of 21 million coins that will ever exist. This digital scarcity makes it like digital gold - rare and valuable because there's a limited amount.",
        category: "Fundamentals",
        icon: "gem",
        dayIndex: 0
      },
      {
        title: "Why Bitcoin Matters",
        content: "Bitcoin gives you complete control over your money. No one can freeze your account, reverse your transactions, or stop you from sending money anywhere in the world.",
        category: "Purpose",
        icon: "shield-alt",
        dayIndex: 0
      },

      // Day 1: How Bitcoin Works
      {
        title: "The Blockchain",
        content: "Bitcoin transactions are recorded on a blockchain - a digital ledger that's shared across thousands of computers worldwide. This makes it impossible to fake or duplicate Bitcoin.",
        category: "Technology",
        icon: "cube",
        dayIndex: 1
      },
      {
        title: "Peer-to-Peer Network",
        content: "Bitcoin works directly between people without middlemen. When you send Bitcoin, it goes straight from your wallet to theirs - no banks required.",
        category: "Technology",
        icon: "user-secret",
        dayIndex: 1
      },
      {
        title: "Cryptographic Security",
        content: "Bitcoin uses advanced mathematics called cryptography to secure transactions. This makes it virtually impossible to hack or counterfeit Bitcoin.",
        category: "Security",
        icon: "lock",
        dayIndex: 1
      },

      // Day 2: Bitcoin vs Traditional Money
      {
        title: "Inflation Protection",
        content: "Unlike government currencies that lose value over time due to printing, Bitcoin's fixed supply protects against inflation. Your Bitcoin can't be devalued by money printing.",
        category: "Economics",
        icon: "trending-up",
        dayIndex: 2
      },
      {
        title: "24/7 Global Access",
        content: "Bitcoin never sleeps. You can send and receive Bitcoin 24/7, 365 days a year, anywhere in the world. No bank holidays, no business hours.",
        category: "Accessibility",
        icon: "globe",
        dayIndex: 2
      },
      {
        title: "No Censorship",
        content: "No government or corporation can stop Bitcoin transactions. Your money, your rules - Bitcoin gives you true financial sovereignty.",
        category: "Freedom",
        icon: "key",
        dayIndex: 2
      },

      // Day 3: Bitcoin Mining & Security
      {
        title: "Bitcoin Mining",
        content: "Mining is how new Bitcoin is created and transactions are secured. Miners use computer power to solve mathematical puzzles, earning Bitcoin rewards for protecting the network.",
        category: "Mining",
        icon: "zap",
        dayIndex: 3
      },
      {
        title: "Proof of Work",
        content: "Bitcoin uses proof of work to secure the network. Miners must prove they've done computational work to add new blocks, making the blockchain extremely difficult to attack.",
        category: "Security",
        icon: "shield",
        dayIndex: 3
      },
      {
        title: "Network Difficulty",
        content: "Bitcoin automatically adjusts mining difficulty every 2 weeks to maintain 10-minute block times. This keeps the network stable regardless of how many miners participate.",
        category: "Technology",
        icon: "target",
        dayIndex: 3
      },

      // Day 4: Bitcoin Wallets & Keys
      {
        title: "Bitcoin Wallets",
        content: "A Bitcoin wallet stores your private keys, not your Bitcoin. Your Bitcoin exists on the blockchain; your wallet is like a key that proves you own it.",
        category: "Wallets",
        icon: "wallet",
        dayIndex: 4
      },
      {
        title: "Private Keys",
        content: "Your private key is a secret number that controls your Bitcoin. Anyone with your private key can spend your Bitcoin, so keep it secure and never share it.",
        category: "Security",
        icon: "key-round",
        dayIndex: 4
      },
      {
        title: "Not Your Keys, Not Your Coins",
        content: "If you don't control the private keys to your Bitcoin, you don't truly own it. Bitcoin stored on exchanges is controlled by the exchange, not you.",
        category: "Ownership",
        icon: "alert-triangle",
        dayIndex: 4
      },

      // Day 5: Bitcoin Transactions
      {
        title: "How Transactions Work",
        content: "Bitcoin transactions send value from one address to another. Each transaction is digitally signed with your private key and recorded permanently on the blockchain.",
        category: "Transactions",
        icon: "arrow-right",
        dayIndex: 5
      },
      {
        title: "Transaction Fees",
        content: "Bitcoin transaction fees go to miners who include your transaction in a block. Higher fees get faster confirmation during busy periods.",
        category: "Economics",
        icon: "dollar-sign",
        dayIndex: 5
      },
      {
        title: "Confirmation Times",
        content: "Bitcoin transactions typically confirm in 10-60 minutes. More confirmations mean higher security, with 6 confirmations considered fully secure.",
        category: "Technology",
        icon: "clock",
        dayIndex: 5
      },

      // Day 6: Bitcoin Halving & Monetary Policy
      {
        title: "Bitcoin Halving",
        content: "Every 4 years, the Bitcoin reward for mining new blocks is cut in half. This programmed scarcity makes Bitcoin increasingly rare over time.",
        category: "Monetary Policy",
        icon: "scissors",
        dayIndex: 6
      },
      {
        title: "Fixed Supply Schedule",
        content: "Bitcoin's supply increases predictably until reaching 21 million coins around 2140. No central authority can change this monetary policy.",
        category: "Economics",
        icon: "calendar",
        dayIndex: 6
      },
      {
        title: "Store of Value",
        content: "Bitcoin's predictable supply and decentralized nature make it a superior store of value compared to currencies that can be printed endlessly.",
        category: "Investment",
        icon: "vault",
        dayIndex: 6
      },

      // Day 7: Bitcoin vs Traditional Finance
      {
        title: "Fiat Currency Problems",
        content: "Fiat currencies lose purchasing power over time due to inflation. The US dollar has lost over 96% of its value since 1913 due to money printing.",
        category: "Traditional Finance",
        icon: "trending-down",
        dayIndex: 7
      },
      {
        title: "Banking Intermediaries",
        content: "Traditional banking requires trust in third parties who can freeze accounts, charge fees, and control your money. Bitcoin eliminates these intermediaries.",
        category: "Banking",
        icon: "building",
        dayIndex: 7
      },
      {
        title: "Financial Inclusion",
        content: "2 billion people worldwide lack access to banking. Bitcoin only requires internet access, providing financial services to the unbanked globally.",
        category: "Global Impact",
        icon: "users",
        dayIndex: 7
      }
    ];

    facts.forEach(fact => {
      const newFact: DailyFact = { ...fact, id: this.currentFactId++ };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Comprehensive lesson content covering all fundamental Bitcoin concepts
    const lessons = [
      // Week 1: Foundation Lessons
      {
        title: "Understanding Bitcoin: Digital Money Revolution",
        content: `Bitcoin represents the first successful attempt at creating digital money that works without banks, governments, or any central authority controlling it.


What Makes Bitcoin Different?

Unlike traditional money, Bitcoin exists purely as computer code. But this isn't just any digital money - it's programmable money with rules that cannot be changed arbitrarily.


The Core Innovation

Bitcoin solved the "double-spending problem" - how to prevent someone from copying digital money and spending it twice. Previous attempts at digital money failed because they required a central authority to prevent double-spending.


Key Properties

Bitcoin has three fundamental properties:

• Decentralized: No single point of control or failure

• Scarce: Only 21 million will ever exist  

• Permissionless: Anyone can use it without asking permission


The Revolutionary Insight: Money can exist and function without requiring trust in any institution or government.`,
        summary: "Bitcoin is programmable, decentralized digital money that operates without central control, solving the double-spending problem through cryptographic innovation.",
        estimatedReadTime: 6,
        dayIndex: 0
      },

      {
        title: "How Bitcoin Works: The Blockchain Explained",
        content: `The blockchain is Bitcoin's revolutionary innovation - a way to maintain a shared ledger without requiring trust in any central authority.

## The Blockchain Concept

Imagine a notebook that records every Bitcoin transaction. Now imagine this notebook is:
- Copied to thousands of computers worldwide
- Every new page (block) must be agreed upon by the majority
- Once written, pages cannot be changed or removed

## How Transactions Work

1. **You send Bitcoin**: Your wallet creates a transaction and broadcasts it to the network
2. **Miners collect transactions**: They gather pending transactions into a new block
3. **Mining competition**: Miners compete to solve a mathematical puzzle
4. **Winner adds block**: The first to solve it adds their block to the blockchain
5. **Network validates**: Other computers verify the block is valid

## Security Through Consensus

The blockchain is secure because changing any transaction would require controlling more than half of all mining power - economically impossible at Bitcoin's scale.

**Key Insight:** Trust is replaced by mathematical proof and economic incentives.`,
        summary: "The blockchain is a distributed ledger maintained by thousands of computers, where transactions are secured through cryptographic proof rather than trust.",
        estimatedReadTime: 7,
        dayIndex: 1
      },

      {
        title: "Bitcoin vs Traditional Money: Why It Matters",
        content: `To understand Bitcoin's importance, we must first understand the problems with traditional money systems.

## The Fiat Money System

Since 1971, most currencies are "fiat" - backed only by government decree, not by gold or other assets. This system has several critical flaws:

## Problem 1: Inflation by Design

Governments can create new money at will, reducing the value of existing money. The purchasing power of the US dollar has declined over 85% since 1971.

## Problem 2: Central Control

Banks and governments can:
- Freeze your accounts
- Reverse your transactions  
- Control who can send or receive money
- Devalue your savings through money printing

## Problem 3: Exclusion

2 billion people worldwide lack access to basic banking services, excluded from the global economy.

## Bitcoin's Solutions

- **Fixed Supply**: Only 21 million Bitcoin will ever exist
- **Permissionless**: Anyone with internet can participate
- **Censorship Resistant**: No authority can stop valid transactions
- **Global**: Same rules everywhere, no borders

**The Bottom Line:** Bitcoin returns monetary sovereignty to individuals, protecting against both government overreach and institutional failure.`,
        summary: "Bitcoin addresses critical flaws in traditional fiat currency systems: inflation, central control, and financial exclusion through fixed supply and decentralization.",
        estimatedReadTime: 8,
        dayIndex: 2
      },

      {
        title: "Bitcoin Security: Wallets and Private Keys",
        content: `Bitcoin security fundamentally differs from traditional account-based systems. Understanding this is crucial for safely using Bitcoin.

## How Bitcoin Ownership Works

Bitcoin doesn't exist in "accounts" like bank balances. Instead, ownership is proven through **private keys** - secret numbers that allow you to spend specific Bitcoin.

## Your Wallet is Your Key Ring

A Bitcoin wallet is like a digital keyring that:
- Stores your private keys securely
- Shows your Bitcoin balance
- Creates transactions when you want to send Bitcoin
- Generates new addresses for receiving Bitcoin

## The Golden Rule

**"Not your keys, not your coins"** - If you don't control the private keys, you don't truly own the Bitcoin. This is why keeping Bitcoin on exchanges long-term is risky.

## Types of Wallets

- **Hardware Wallets**: Physical devices storing keys offline (most secure)
- **Software Wallets**: Apps on your phone or computer
- **Paper Wallets**: Private keys written on paper
- **Custodial Wallets**: Someone else controls your keys (exchanges)

## Best Practices

1. **Backup your seed phrase**: 12-24 words that can restore your entire wallet
2. **Keep backups secure**: Store in multiple safe locations
3. **Never share private keys**: Anyone with your keys can spend your Bitcoin
4. **Start small**: Learn with small amounts before storing significant value

**Critical Point:** With Bitcoin, you are your own bank. This brings both freedom and responsibility.`,
        summary: "Bitcoin security is based on private key cryptography. Proper wallet management and understanding 'not your keys, not your coins' is essential for safe Bitcoin usage.",
        estimatedReadTime: 9,
        dayIndex: 3
      },

      {
        title: "Bitcoin Mining: Securing the Network",
        content: `Bitcoin mining is often misunderstood. It's not just about creating new Bitcoin - it's the process that keeps the entire network secure and decentralized.

## What Mining Actually Does

Mining serves three critical functions:
1. **Validates transactions**: Ensures all transactions follow Bitcoin's rules
2. **Secures the network**: Makes it extremely expensive to attack Bitcoin
3. **Issues new Bitcoin**: Rewards miners for their security service

## The Mining Process

Miners compete to solve computational puzzles. This "proof of work" requires real energy expenditure, making attacks costly. The winner gets to:
- Add the next block of transactions
- Receive newly created Bitcoin (currently 6.25 BTC per block)
- Collect transaction fees

## Why Energy Use is a Feature

Bitcoin's energy consumption is often criticized, but it serves a purpose:
- **Security**: More energy = harder to attack
- **Decentralization**: Anyone can mine with the right equipment
- **Incentive alignment**: Miners are rewarded for securing the network

## The Halving Cycle

Every 4 years (210,000 blocks), the mining reward is cut in half:
- 2009-2012: 50 BTC per block
- 2012-2016: 25 BTC per block  
- 2016-2020: 12.5 BTC per block
- 2020-2024: 6.25 BTC per block
- 2024-2028: 3.125 BTC per block

This ensures Bitcoin becomes increasingly scarce over time.

**Key Understanding:** Mining isn't wasteful - it's Bitcoin's immune system, protecting the network from attack and manipulation.`,
        summary: "Bitcoin mining secures the network through proof of work, validates transactions, and issues new Bitcoin on a predictable schedule that becomes increasingly scarce.",
        estimatedReadTime: 10,
        dayIndex: 4
      },

      {
        title: "Bitcoin as Digital Gold: Store of Value",
        content: `Bitcoin is often called "digital gold" because it shares many properties with gold while improving upon them for the digital age.

Properties of Good Money

Throughout history, the best forms of money have shared certain characteristics:

• Scarcity: Limited supply maintains value

• Durability: Doesn't degrade over time  

• Portability: Easy to transport and transfer

• Divisibility: Can be broken into smaller units

• Verifiability: Easy to authenticate as genuine


How Bitcoin Compares to Gold

Scarcity: ✅ Fixed 21 million supply vs. unknown gold reserves

Durability: ✅ Digital format vs. physical degradation  

Portability: ✅ Instant global transfer vs. physical transport

Divisibility: ✅ 8 decimal places vs. difficult gold division

Verifiability: ✅ Cryptographic proof vs. expensive testing


Bitcoin's Monetary Advantages

Unlike gold, Bitcoin is:

• Programmable: Can be sent automatically based on conditions

• Permissionless: No need for vaults or intermediaries

• Transparent: All transactions are publicly verifiable

• Resistant to confiscation: Properly stored Bitcoin cannot be seized


The Network Effect

As more people recognize Bitcoin's superior monetary properties:

• Demand increases while supply remains fixed

• Price tends to increase over long time horizons

• Network becomes more valuable and secure


Investment Thesis: Bitcoin combines the scarcity of gold with the utility of digital technology, creating superior hard money for the internet age.`,
        summary: "Bitcoin serves as digital gold, combining scarcity with superior portability, divisibility, and verifiability compared to traditional stores of value.",
        estimatedReadTime: 8,
        dayIndex: 5
      },

      {
        title: "The Lightning Network: Bitcoin's Second Layer",
        content: `While Bitcoin's base layer prioritizes security and decentralization, the Lightning Network enables fast, cheap transactions for everyday payments.

## Why Lightning Exists

Bitcoin's base layer processes about 7 transactions per second globally. This is intentional - prioritizing security over speed. But for daily payments, we need something faster.

## How Lightning Works

Lightning creates "payment channels" between users:
1. **Open channel**: Lock Bitcoin in a 2-of-2 multisig address
2. **Transact freely**: Send payments back and forth instantly
3. **Close channel**: Final balances are settled on Bitcoin's blockchain

## Network Effects

When many payment channels connect, they form a network. You can pay anyone in the network by routing payments through interconnected channels.

## Lightning Benefits

- **Instant payments**: Transactions confirm in milliseconds
- **Low fees**: Often less than a penny per transaction
- **Privacy**: Payments aren't recorded on the public blockchain
- **Scalability**: Millions of transactions per second possible

## Current Applications

Lightning is already being used for:
- Micropayments and tips online
- Point-of-sale payments at merchants
- Cross-border remittances
- Gaming and digital content

## The Layered Approach

This mirrors internet architecture:
- **Layer 1 (Bitcoin)**: Secure settlement layer
- **Layer 2 (Lightning)**: Fast payment layer
- **Future layers**: Additional functionality

**Vision:** Lightning enables Bitcoin to serve both as a store of value (base layer) and medium of exchange (Lightning layer).`,
        summary: "The Lightning Network is Bitcoin's second layer solution, enabling instant, low-cost payments while maintaining the security of Bitcoin's base layer.",
        estimatedReadTime: 9,
        dayIndex: 6
      }
    ];

    lessons.forEach((lessonData, index) => {
      const lesson: Lesson = {
        id: this.currentLessonId++,
        title: lessonData.title,
        content: lessonData.content,
        summary: lessonData.summary,
        estimatedReadTime: lessonData.estimatedReadTime,
        dayIndex: lessonData.dayIndex,
        imageUrl: null
      };
      this.lessons.set(lesson.id, lesson);
    });

    // Seed knowledge areas
    const areas = [
      { name: "Bitcoin Basics", icon: "coins", completedLessons: 8, totalLessons: 12 },
      { name: "Blockchain Tech", icon: "cube", completedLessons: 4, totalLessons: 10 },
      { name: "Economics", icon: "chart-line", completedLessons: 2, totalLessons: 8 }
    ];

    areas.forEach(area => {
      const newArea: KnowledgeArea = { ...area, id: this.currentKnowledgeAreaId++ };
      this.knowledgeAreas.set(newArea.id, newArea);
    });

    // Seed conviction content - quotes and videos
    const convictionData = [
      // Day 0 - 2 quotes, 1 video
      {
        type: "quote",
        title: "Sound Money Principle",
        content: "Bitcoin is the first time in human history we have immutable, digital sound money. This is a once-in-a-species event.",
        author: "Michael Saylor",
        source: "MicroStrategy CEO",
        videoUrl: null,
        thumbnailUrl: null,
        dayIndex: 0,
        featured: true
      },
      {
        type: "quote", 
        title: "Network Effects",
        content: "Every day Bitcoin doesn't die, it gets a little bit stronger. It's like a honey badger that just keeps going.",
        author: "Andreas Antonopoulos",
        source: "Bitcoin Educator",
        videoUrl: null,
        thumbnailUrl: null,
        dayIndex: 0,
        featured: false
      },
      {
        type: "video",
        title: "The Bitcoin Standard - Why Bitcoin Matters",
        content: "Saifedean Ammous explains how Bitcoin's monetary properties make it superior to all forms of money that came before it.",
        author: "Saifedean Ammous",
        source: "What Bitcoin Did Podcast",
        videoUrl: "https://www.youtube.com/watch?v=Zbm772vF-5M",
        thumbnailUrl: "https://img.youtube.com/vi/Zbm772vF-5M/maxresdefault.jpg",
        dayIndex: 0,
        featured: true
      },

      // Day 1 - 2 quotes, 1 video
      {
        type: "quote",
        title: "Store of Value",
        content: "Bitcoin is the best store of value ever created by humans. It's better than gold, better than real estate, better than any government bond.",
        author: "Jack Dorsey",
        source: "Twitter/Block CEO",
        videoUrl: null,
        thumbnailUrl: null,
        dayIndex: 1,
        featured: true
      },
      {
        type: "quote",
        title: "Freedom Money",
        content: "Bitcoin gives us, for the first time, a way for one Internet user to transfer a unique piece of digital property to another Internet user.",
        author: "Marc Andreessen",
        source: "Andreessen Horowitz",
        videoUrl: null,
        thumbnailUrl: null,
        dayIndex: 1,
        featured: false
      },
      {
        type: "video",
        title: "Why I'm Bullish on Bitcoin - Michael Saylor",
        content: "MicroStrategy CEO explains his company's Bitcoin strategy and why he believes it's the ultimate store of value.",
        author: "Michael Saylor",
        source: "Lex Fridman Podcast",
        videoUrl: "https://www.youtube.com/watch?v=mC43pZkpTec",
        thumbnailUrl: "https://img.youtube.com/vi/mC43pZkpTec/maxresdefault.jpg",
        dayIndex: 1,
        featured: true
      }
    ];

    convictionData.forEach(content => {
      const newContent: ConvictionContent = { ...content, id: this.currentConvictionContentId++ };
      this.convictionContent.set(newContent.id, newContent);
    });

    // Seed treasury companies data
    const treasuryData = [
      {
        name: "MicroStrategy",
        ticker: "MSTR",
        industry: "Business Intelligence",
        bitcoinHoldings: "190000.00000000",
        marketValue: "8500000000.00",
        acquisitionDate: "2020-08-11",
        announcementDate: "2020-08-11",
        website: "https://microstrategy.com",
        description: "Leading enterprise analytics company that made Bitcoin its primary treasury reserve asset under CEO Michael Saylor's leadership.",
        ceoName: "Michael Saylor",
        country: "United States",
        isPublic: true
      },
      {
        name: "Tesla",
        ticker: "TSLA",
        industry: "Electric Vehicles",
        bitcoinHoldings: "9720.00000000",
        marketValue: "435000000.00",
        acquisitionDate: "2021-02-08",
        announcementDate: "2021-02-08",
        website: "https://tesla.com",
        description: "Electric vehicle and clean energy company that added Bitcoin to its balance sheet and briefly accepted it as payment.",
        ceoName: "Elon Musk",
        country: "United States",
        isPublic: true
      },
      {
        name: "Block (Square)",
        ticker: "SQ",
        industry: "Financial Services",
        bitcoinHoldings: "8027.00000000",
        marketValue: "360000000.00",
        acquisitionDate: "2020-10-08",
        announcementDate: "2020-10-08",
        website: "https://block.xyz",
        description: "Payment company that allocated corporate funds to Bitcoin and builds Bitcoin infrastructure through its ecosystem.",
        ceoName: "Jack Dorsey",
        country: "United States",
        isPublic: true
      },
      {
        name: "Marathon Digital",
        ticker: "MARA",
        industry: "Bitcoin Mining",
        bitcoinHoldings: "15174.00000000",
        marketValue: "680000000.00",
        acquisitionDate: "2020-12-01",
        announcementDate: "2020-12-01",
        website: "https://marathondigital.com",
        description: "One of the largest Bitcoin mining companies in North America, holding mined Bitcoin as treasury assets.",
        ceoName: "Fred Thiel",
        country: "United States",
        isPublic: true
      }
    ];

    treasuryData.forEach(company => {
      const newCompany: TreasuryCompany = { 
        ...company, 
        id: this.currentTreasuryCompanyId++,
        lastUpdated: new Date()
      };
      this.treasuryCompanies.set(newCompany.id, newCompany);
    });

    // Seed sovereign adoption data
    const sovereignData = [
      {
        entityName: "El Salvador",
        entityType: "country",
        adoptionType: "legal_tender",
        bitcoinHoldings: "2381.00000000",
        population: 6500000,
        announcementDate: "2021-06-05",
        implementationDate: "2021-09-07",
        description: "First country to adopt Bitcoin as legal tender alongside the US dollar, led by President Nayib Bukele.",
        keyOfficials: "President Nayib Bukele",
        gdp: "28737000000.00",
        currency: "USD",
        region: "Central America",
        status: "active"
      },
      {
        entityName: "Central African Republic",
        entityType: "country",
        adoptionType: "legal_tender",
        bitcoinHoldings: null,
        population: 5500000,
        announcementDate: "2022-04-27",
        implementationDate: "2022-04-27",
        description: "Second country to adopt Bitcoin as legal tender, though implementation has faced challenges.",
        keyOfficials: "President Faustin Touadéra",
        gdp: "2380000000.00",
        currency: "XAF",
        region: "Central Africa",
        status: "active"
      },
      {
        entityName: "Miami",
        entityType: "city",
        adoptionType: "treasury_reserve",
        bitcoinHoldings: null,
        population: 470000,
        announcementDate: "2021-02-11",
        implementationDate: "2021-05-01",
        description: "Major US city exploring Bitcoin adoption for municipal treasury and accepting Bitcoin for city services.",
        keyOfficials: "Mayor Francis Suarez",
        gdp: null,
        currency: "USD",
        region: "North America",
        status: "active"
      },
      {
        entityName: "Wyoming",
        entityType: "state",
        adoptionType: "regulatory_clarity",
        bitcoinHoldings: null,
        population: 580000,
        announcementDate: "2018-03-01",
        implementationDate: "2019-07-01",
        description: "US state that passed comprehensive blockchain and cryptocurrency legislation, creating a friendly regulatory environment.",
        keyOfficials: "Governor Mark Gordon",
        gdp: "40000000000.00",
        currency: "USD",
        region: "North America",
        status: "active"
      }
    ];

    sovereignData.forEach(adoption => {
      const newAdoption: SovereignAdoption = { 
        ...adoption, 
        id: this.currentSovereignAdoptionId++,
        lastUpdated: new Date()
      };
      this.sovereignAdoptions.set(newAdoption.id, newAdoption);
    });

    // Seed quiz questions - create questions for multiple day indices to ensure availability
    const baseQuestions = [
      {
        question: "What is the maximum supply of Bitcoin that will ever exist?",
        optionA: "21 million",
        optionB: "100 million", 
        optionC: "50 million",
        optionD: "Unlimited",
        correctAnswer: "A",
        explanation: "Bitcoin has a hard cap of 21 million coins, making it scarce by design. This limit is built into the protocol and cannot be changed.",
        category: "Bitcoin Basics",
        difficulty: "beginner"
      },
      {
        question: "What happens to Bitcoin's mining reward approximately every 4 years?",
        optionA: "It doubles",
        optionB: "It gets cut in half",
        optionC: "It stays the same",
        optionD: "It becomes zero",
        correctAnswer: "B",
        explanation: "Bitcoin undergoes a 'halving' event every ~4 years where the mining reward is cut in half. This reduces the rate of new Bitcoin creation, increasing scarcity over time.",
        category: "Bitcoin Basics",
        difficulty: "beginner"
      },
      {
        question: "What makes Bitcoin different from traditional currencies?",
        optionA: "It's controlled by banks",
        optionB: "It's backed by gold",
        optionC: "It's decentralized with no central authority",
        optionD: "It can be printed unlimited amounts",
        correctAnswer: "C",
        explanation: "Bitcoin operates on a decentralized network with no central bank or government control. This peer-to-peer system is maintained by thousands of computers worldwide.",
        category: "Bitcoin Basics",
        difficulty: "beginner"
      },
      {
        question: "Who is the creator of Bitcoin?",
        optionA: "Elon Musk",
        optionB: "Satoshi Nakamoto",
        optionC: "Vitalik Buterin",
        optionD: "Mark Zuckerberg",
        correctAnswer: "B",
        explanation: "Satoshi Nakamoto is the pseudonymous creator of Bitcoin. Their true identity remains unknown, and they disappeared from public view in 2011.",
        category: "Bitcoin History",
        difficulty: "beginner"
      },
      {
        question: "What is a Bitcoin wallet?",
        optionA: "A physical device that stores Bitcoin",
        optionB: "Software that manages private keys",
        optionC: "A bank account for Bitcoin",
        optionD: "A mining device",
        correctAnswer: "B",
        explanation: "A Bitcoin wallet is software that manages your private keys, which are needed to access and spend your Bitcoin. The Bitcoin itself exists on the blockchain.",
        category: "Wallets & Security",
        difficulty: "beginner"
      },
      {
        question: "What is Bitcoin mining?",
        optionA: "Digging for Bitcoin underground",
        optionB: "Creating new Bitcoin out of thin air",
        optionC: "Validating transactions and securing the network",
        optionD: "Trading Bitcoin for profit",
        correctAnswer: "C",
        explanation: "Bitcoin mining involves using computational power to validate transactions, secure the network, and add new blocks to the blockchain. Miners are rewarded with new Bitcoin for this work.",
        category: "Network & Mining",
        difficulty: "beginner"
      }
    ];

    // Create quiz questions for multiple day indices (current day could be 190+ based on date calculation)
    const quizQuestions = [];
    for (let day = 0; day < 400; day++) {
      baseQuestions.forEach((baseQuestion, index) => {
        quizQuestions.push({
          dayIndex: day,
          ...baseQuestion
        });
      });
    }

    quizQuestions.forEach(question => {
      const newQuestion: QuizQuestion = { ...question, id: this.currentQuizQuestionId++ };
      this.quizQuestions.set(newQuestion.id, newQuestion);
    });

    // Create a default user
    const defaultUser: User = {
      id: this.currentUserId++,
      username: "default_user",
      currentStreak: 7,
      longestStreak: 12,
      completedLessons: 15,
      lastActivityDate: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      username: insertUser.username,
      currentStreak: insertUser.currentStreak || 0,
      longestStreak: insertUser.longestStreak || 0,
      completedLessons: insertUser.completedLessons || 0,
      lastActivityDate: insertUser.lastActivityDate || null,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserStreak(userId: number, currentStreak: number, longestStreak: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.currentStreak = currentStreak;
      user.longestStreak = longestStreak;
      this.users.set(userId, user);
    }
  }

  async updateUserProgress(userId: number, completedLessons: number, lastActivityDate: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.completedLessons = completedLessons;
      user.lastActivityDate = lastActivityDate;
      this.users.set(userId, user);
    }
  }

  async getDailyFacts(dayIndex: number): Promise<DailyFact[]> {
    return Array.from(this.dailyFacts.values()).filter(fact => fact.dayIndex === dayIndex);
  }

  async getAllDailyFacts(): Promise<DailyFact[]> {
    return Array.from(this.dailyFacts.values());
  }

  async createDailyFact(insertFact: InsertDailyFact): Promise<DailyFact> {
    const fact: DailyFact = {
      ...insertFact,
      id: this.currentFactId++
    };
    this.dailyFacts.set(fact.id, fact);
    return fact;
  }

  async getLesson(dayIndex: number): Promise<Lesson | undefined> {
    return Array.from(this.lessons.values()).find(lesson => lesson.dayIndex === dayIndex);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      id: this.currentLessonId++,
      title: insertLesson.title,
      content: insertLesson.content,
      summary: insertLesson.summary,
      estimatedReadTime: insertLesson.estimatedReadTime,
      dayIndex: insertLesson.dayIndex,
      imageUrl: insertLesson.imageUrl || null
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  async getUserProgress(userId: number, date: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${date}`);
  }

  async getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]> {
    const progress: UserProgress[] = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayProgress = this.userProgress.get(`${userId}-${dateStr}`);
      if (dayProgress) {
        progress.push(dayProgress);
      }
    }
    
    return progress;
  }

  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const key = `${insertProgress.userId}-${insertProgress.date}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = {
        id: existing.id,
        userId: insertProgress.userId,
        date: insertProgress.date,
        factsViewed: insertProgress.factsViewed !== undefined ? insertProgress.factsViewed : existing.factsViewed,
        lessonCompleted: insertProgress.lessonCompleted !== undefined ? insertProgress.lessonCompleted : existing.lessonCompleted,
        progressPercentage: insertProgress.progressPercentage || existing.progressPercentage
      };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const progress: UserProgress = {
        id: this.currentProgressId++,
        userId: insertProgress.userId,
        date: insertProgress.date,
        factsViewed: insertProgress.factsViewed || 0,
        lessonCompleted: insertProgress.lessonCompleted || false,
        progressPercentage: insertProgress.progressPercentage || 0
      };
      this.userProgress.set(key, progress);
      return progress;
    }
  }

  async getKnowledgeAreas(): Promise<KnowledgeArea[]> {
    return Array.from(this.knowledgeAreas.values());
  }

  async updateKnowledgeAreaProgress(areaId: number, completedLessons: number): Promise<void> {
    const area = this.knowledgeAreas.get(areaId);
    if (area) {
      area.completedLessons = completedLessons;
      this.knowledgeAreas.set(areaId, area);
    }
  }

  async getConvictionContent(dayIndex: number): Promise<ConvictionContent[]> {
    return Array.from(this.convictionContent.values()).filter(content => content.dayIndex === dayIndex);
  }

  async getAllConvictionContent(): Promise<ConvictionContent[]> {
    return Array.from(this.convictionContent.values());
  }

  async createConvictionContent(insertContent: InsertConvictionContent): Promise<ConvictionContent> {
    const content: ConvictionContent = {
      id: this.currentConvictionContentId++,
      type: insertContent.type,
      title: insertContent.title,
      content: insertContent.content,
      author: insertContent.author,
      source: insertContent.source || null,
      videoUrl: insertContent.videoUrl || null,
      thumbnailUrl: insertContent.thumbnailUrl || null,
      dayIndex: insertContent.dayIndex,
      featured: insertContent.featured || false
    };
    this.convictionContent.set(content.id, content);
    return content;
  }

  // Treasury companies methods
  async getTreasuryCompanies(): Promise<TreasuryCompany[]> {
    return Array.from(this.treasuryCompanies.values());
  }

  async getTreasuryCompanyById(id: number): Promise<TreasuryCompany | undefined> {
    return this.treasuryCompanies.get(id);
  }

  async createTreasuryCompany(insertCompany: InsertTreasuryCompany): Promise<TreasuryCompany> {
    const company: TreasuryCompany = {
      id: this.currentTreasuryCompanyId++,
      name: insertCompany.name,
      ticker: insertCompany.ticker || null,
      industry: insertCompany.industry,
      bitcoinHoldings: insertCompany.bitcoinHoldings,
      marketValue: insertCompany.marketValue || null,
      acquisitionDate: insertCompany.acquisitionDate || null,
      announcementDate: insertCompany.announcementDate,
      website: insertCompany.website || null,
      description: insertCompany.description || null,
      ceoName: insertCompany.ceoName || null,
      country: insertCompany.country,
      isPublic: insertCompany.isPublic || true,
      lastUpdated: new Date()
    };
    this.treasuryCompanies.set(company.id, company);
    return company;
  }

  async updateTreasuryCompany(id: number, updates: Partial<InsertTreasuryCompany>): Promise<TreasuryCompany | undefined> {
    const company = this.treasuryCompanies.get(id);
    if (company) {
      const updated: TreasuryCompany = {
        ...company,
        ...updates,
        id: company.id,
        lastUpdated: new Date()
      };
      this.treasuryCompanies.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Sovereign adoption methods
  async getSovereignAdoptions(): Promise<SovereignAdoption[]> {
    return Array.from(this.sovereignAdoptions.values());
  }

  async getSovereignAdoptionById(id: number): Promise<SovereignAdoption | undefined> {
    return this.sovereignAdoptions.get(id);
  }

  async getSovereignAdoptionsByType(adoptionType: string): Promise<SovereignAdoption[]> {
    return Array.from(this.sovereignAdoptions.values()).filter(adoption => adoption.adoptionType === adoptionType);
  }

  async createSovereignAdoption(insertAdoption: InsertSovereignAdoption): Promise<SovereignAdoption> {
    const adoption: SovereignAdoption = {
      id: this.currentSovereignAdoptionId++,
      entityName: insertAdoption.entityName,
      entityType: insertAdoption.entityType,
      adoptionType: insertAdoption.adoptionType,
      bitcoinHoldings: insertAdoption.bitcoinHoldings || null,
      population: insertAdoption.population || null,
      announcementDate: insertAdoption.announcementDate,
      implementationDate: insertAdoption.implementationDate || null,
      description: insertAdoption.description,
      keyOfficials: insertAdoption.keyOfficials || null,
      gdp: insertAdoption.gdp || null,
      currency: insertAdoption.currency || null,
      region: insertAdoption.region,
      status: insertAdoption.status,
      lastUpdated: new Date()
    };
    this.sovereignAdoptions.set(adoption.id, adoption);
    return adoption;
  }

  async updateSovereignAdoption(id: number, updates: Partial<InsertSovereignAdoption>): Promise<SovereignAdoption | undefined> {
    const adoption = this.sovereignAdoptions.get(id);
    if (adoption) {
      const updated: SovereignAdoption = {
        ...adoption,
        ...updates,
        id: adoption.id,
        lastUpdated: new Date()
      };
      this.sovereignAdoptions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Bitcoin price methods
  async getCurrentBitcoinPrice(): Promise<BitcoinPrice | undefined> {
    const prices = Array.from(this.bitcoinPrices.values());
    return prices.length > 0 ? prices[prices.length - 1] : undefined;
  }

  async getBitcoinPriceHistory(hours: number): Promise<BitcoinPrice[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.bitcoinPrices.values())
      .filter(price => new Date(price.timestamp) >= cutoffTime)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createBitcoinPrice(insertPrice: InsertBitcoinPrice): Promise<BitcoinPrice> {
    const price: BitcoinPrice = {
      id: this.currentBitcoinPriceId++,
      timestamp: new Date(),
      priceUsd: insertPrice.priceUsd,
      marketCap: insertPrice.marketCap || null,
      volume24h: insertPrice.volume24h || null,
      change24h: insertPrice.change24h || null,
      change7d: insertPrice.change7d || null,
      dominance: insertPrice.dominance || null
    };
    this.bitcoinPrices.set(price.id, price);
    return price;
  }

  // Quiz methods
  async getDailyQuizQuestions(dayIndex: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(question => question.dayIndex === dayIndex);
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const question: QuizQuestion = {
      id: this.currentQuizQuestionId++,
      dayIndex: insertQuestion.dayIndex,
      question: insertQuestion.question,
      optionA: insertQuestion.optionA,
      optionB: insertQuestion.optionB,
      optionC: insertQuestion.optionC,
      optionD: insertQuestion.optionD,
      correctAnswer: insertQuestion.correctAnswer,
      explanation: insertQuestion.explanation,
      category: insertQuestion.category,
      difficulty: insertQuestion.difficulty
    };
    this.quizQuestions.set(question.id, question);
    return question;
  }

  async getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]> {
    return Array.from(this.userQuizAnswers.values())
      .filter(answer => answer.userId === userId && answer.date === date);
  }

  async submitQuizAnswer(insertAnswer: InsertUserQuizAnswer): Promise<UserQuizAnswer> {
    const key = `${insertAnswer.userId}-${insertAnswer.questionId}-${insertAnswer.date}`;
    const answer: UserQuizAnswer = {
      id: this.currentQuizAnswerId++,
      userId: insertAnswer.userId,
      questionId: insertAnswer.questionId,
      selectedAnswer: insertAnswer.selectedAnswer,
      isCorrect: insertAnswer.isCorrect,
      answeredAt: new Date(),
      date: insertAnswer.date
    };
    this.userQuizAnswers.set(key, answer);
    return answer;
  }

  async getUserQuizScore(userId: number, date: string): Promise<{ correct: number; total: number; percentage: number }> {
    const answers = await this.getUserQuizAnswers(userId, date);
    const correct = answers.filter(answer => answer.isCorrect).length;
    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }
}

export const storage = new MemStorage();
