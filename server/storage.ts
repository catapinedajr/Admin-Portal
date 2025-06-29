import { 
  users, 
  userProgress, 
  knowledgeAreas,
  convictionContent,
  treasuryCompanies,
  sovereignAdoption,
  userQuizAnswers,
  contentDays,
  contentFacts,
  contentDiveDeeper,
  contentLessons,
  contentQuizzes,
  contentMetadata,
  type User, 
  type InsertUser, 
  type UserProgress,
  type InsertUserProgress,
  type ContentDay,
  type InsertContentDay,
  type ContentFact,
  type InsertContentFact,
  type ContentDiveDeeper,
  type InsertContentDiveDeeper,
  type ContentLesson,
  type InsertContentLesson,
  type ContentQuiz,
  type InsertContentQuiz,
  type ContentMetadata,
  type InsertContentMetadata,
  type DailyContentFact,
  type DailyContentComplete,
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
  type InsertDeepDiveTopic,
  type WeeklyTopic,
  type InsertWeeklyTopic,
  type UserWeeklyProgress,
  type InsertUserWeeklyProgress
} from "@shared/schema";

import { db } from "./db";
import { eq } from "drizzle-orm";

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
  getUserProgressByDay(userId: number, dayIndex: number): Promise<UserProgress | undefined>;
  getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Day completion and access control methods
  isDayCompleted(userId: number, dayIndex: number): Promise<boolean>;
  markDayCompleted(userId: number, dayIndex: number): Promise<void>;
  getNextAvailableDay(userId: number): Promise<number>;
  canAccessDay(userId: number, dayIndex: number): Promise<boolean>;
  getCompletedDays(userId: number): Promise<number[]>;

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

  // Weekly topics methods
  getCurrentWeeklyTopic(): Promise<WeeklyTopic | undefined>;
  getWeeklyTopic(weekNumber: number): Promise<WeeklyTopic | undefined>;
  getAllWeeklyTopics(): Promise<WeeklyTopic[]>;
  createWeeklyTopic(topic: InsertWeeklyTopic): Promise<WeeklyTopic>;
  
  // User weekly progress methods
  getUserWeeklyProgress(userId: number, weekNumber: number): Promise<UserWeeklyProgress | undefined>;
  createOrUpdateWeeklyProgress(progress: InsertUserWeeklyProgress): Promise<UserWeeklyProgress>;
  updateWeeklyProgress(userId: number, weekNumber: number, currentSection: number, progressPercentage: number): Promise<void>;
  completeWeeklyTopic(userId: number, weekNumber: number): Promise<void>;
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
  private weeklyTopics: Map<number, WeeklyTopic>;
  private userWeeklyProgress: Map<string, UserWeeklyProgress>; // key: userId-weekNumber
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
  private currentDeepDiveTopicId: number;
  private currentWeeklyTopicId: number;
  private currentWeeklyProgressId: number;

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
    this.deepDiveTopics = new Map();
    this.weeklyTopics = new Map();
    this.userWeeklyProgress = new Map();
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
    this.currentDeepDiveTopicId = 1;
    this.currentWeeklyTopicId = 1;
    this.currentWeeklyProgressId = 1;

    this.seedData();
    
    // Static data system only - no AI generation needed
  }

  // AI content generation system removed - using consistent static data only

  private seedData() {
    // Daily facts rewritten for 9th grade reading level
    const facts = [
      // Day 1: Core Concepts Made Simple
      {
        title: "What is Bitcoin?",
        content: "Bitcoin is like digital cash that you can use online. Unlike regular money, no bank or government controls it. You can send it to anyone in the world without asking permission.",
        category: "Basics",
        icon: "coins",
        dayIndex: 0
      },
      {
        title: "Bitcoin is Limited",
        content: "There will only ever be 21 million bitcoins. That's it - no more can ever be made. This makes Bitcoin special because rare things are usually worth more, just like rare baseball cards.",
        category: "Basics",
        icon: "gem",
        dayIndex: 0
      },
      {
        title: "You Own Your Bitcoin",
        content: "When you have Bitcoin, it's really yours. Nobody can take it away, freeze it, or tell you what to do with it. It's like having cash in your pocket, but digital.",
        category: "Freedom",
        icon: "shield-alt",
        dayIndex: 0
      },

      // Day 2: How Bitcoin Works
      {
        title: "The Shared Notebook",
        content: "Bitcoin works like a notebook that everyone can see but nobody can cheat. Every Bitcoin transaction gets written in this shared notebook, so everyone knows who owns what.",
        category: "How It Works",
        icon: "cube",
        dayIndex: 1
      },
      {
        title: "No Middleman Needed",
        content: "When you send Bitcoin, it goes directly from you to your friend. No bank has to approve it or take a cut. It's like handing someone cash, but online.",
        category: "How It Works",
        icon: "user-secret",
        dayIndex: 1
      },
      {
        title: "Super Secure Math",
        content: "Bitcoin uses special math codes that are incredibly hard to break. It's like having the world's best lock on your digital money that only you have the key for.",
        category: "Security",
        icon: "lock",
        dayIndex: 1
      },

      // Day 3: Bitcoin vs Regular Money
      {
        title: "Your Money Keeps Its Value",
        content: "Regular money loses value when governments print more of it. Bitcoin can't be printed like paper money, so it keeps its value better over time.",
        category: "Money",
        icon: "trending-up",
        dayIndex: 2
      },
      {
        title: "Always Open",
        content: "Bitcoin works 24 hours a day, every day of the year. Banks close on weekends and holidays, but Bitcoin never sleeps. You can send money anytime.",
        category: "Always Available",
        icon: "globe",
        dayIndex: 2
      },
      {
        title: "Nobody Can Stop You",
        content: "With Bitcoin, you're the boss of your own money. No government or company can freeze your Bitcoin or tell you how to spend it.",
        category: "Freedom",
        icon: "key",
        dayIndex: 2
      },

      // Day 4: How Bitcoin Gets Made
      {
        title: "Digital Puzzle Solving",
        content: "Bitcoin mining is like solving really hard math puzzles. People use powerful computers to solve these puzzles, and when they win, they get new Bitcoin as a prize.",
        category: "Mining",
        icon: "zap",
        dayIndex: 3
      },
      {
        title: "Earning Your Bitcoin",
        content: "To get new Bitcoin, you have to prove you did the hard work of solving the puzzle. This makes sure no one can cheat or fake Bitcoin.",
        category: "Security",
        icon: "shield",
        dayIndex: 3
      },
      {
        title: "Keeps Getting Harder",
        content: "Every two weeks, Bitcoin makes the puzzles harder or easier to keep the time at 10 minutes per block. It's like a video game that gets harder when more players join.",
        category: "How It Works",
        icon: "target",
        dayIndex: 3
      },

      // Day 5: Your Bitcoin Wallet
      {
        title: "Your Digital Wallet",
        content: "A Bitcoin wallet is like a special app that holds your secret code. The Bitcoin isn't actually in the app - it's on the shared notebook, but your app proves it's yours.",
        category: "Wallets",
        icon: "wallet",
        dayIndex: 4
      },
      {
        title: "Your Secret Code",
        content: "Your private key is like a secret password that only you know. If someone else learns your secret code, they can steal your Bitcoin. Keep it safe!",
        category: "Security",
        icon: "key-round",
        dayIndex: 4
      },
      {
        title: "You Must Control Your Key",
        content: "If you don't have your secret code, you don't really own your Bitcoin. It's like letting someone else hold your house key - they could lock you out.",
        category: "Ownership",
        icon: "alert-triangle",
        dayIndex: 4
      },

      // Day 6: Sending Bitcoin
      {
        title: "How to Send Bitcoin",
        content: "Sending Bitcoin is like sending a secure message. You sign it with your secret code, and everyone can see it happened, but only you could have sent it.",
        category: "Transactions",
        icon: "arrow-right",
        dayIndex: 5
      },
      {
        title: "Paying the Network",
        content: "When you send Bitcoin, you pay a small fee to the people maintaining the network. It's like paying postage to mail a letter, but way cheaper.",
        category: "Fees",
        icon: "dollar-sign",
        dayIndex: 5
      },
      {
        title: "Waiting for Confirmation",
        content: "After you send Bitcoin, it takes about 10-60 minutes to be completely confirmed. It's like waiting for a check to clear, but much faster.",
        category: "Timing",
        icon: "clock",
        dayIndex: 5
      },

      // Day 7: Bitcoin's Built-in Scarcity
      {
        title: "The Great Halving",
        content: "Every 4 years, Bitcoin cuts the reward for mining in half. It's like a store that gives out fewer and fewer free samples each year, making them more valuable.",
        category: "Scarcity",
        icon: "scissors",
        dayIndex: 6
      },
      {
        title: "No More After 21 Million",
        content: "Bitcoin will stop making new coins when it reaches 21 million, probably around the year 2140. After that, no new Bitcoin will ever be created.",
        category: "Limited Supply",
        icon: "calendar",
        dayIndex: 6
      },
      {
        title: "Saves Your Money's Value",
        content: "Bitcoin protects your money's value over time. While regular money loses value when governments print more, Bitcoin can't be printed, so it holds its value better.",
        category: "Value Storage",
        icon: "vault",
        dayIndex: 6
      },

      // Day 8: Bitcoin vs Regular Money Problems
      {
        title: "Regular Money Loses Value",
        content: "Regular money loses its buying power every year. A dollar today buys way less than a dollar did 20 years ago because governments keep printing more money.",
        category: "Money Problems",
        icon: "trending-down",
        dayIndex: 7
      },
      {
        title: "Banks Control Your Money",
        content: "Banks can freeze your account, charge you fees, and decide what you can do with your money. With Bitcoin, you're in complete control.",
        category: "Freedom",
        icon: "building",
        dayIndex: 7
      },
      {
        title: "Bitcoin Helps Everyone",
        content: "Billions of people can't get a bank account, but anyone with internet can use Bitcoin. It gives everyone access to digital money.",
        category: "Helping People",
        icon: "users",
        dayIndex: 7
      },

      // Day 9: How Bitcoin Moves
      {
        title: "Bitcoin Transactions are Simple",
        content: "When you send Bitcoin, you're basically saying 'take some from my pile and put it in their pile.' Everyone can see it happen, which keeps it honest.",
        category: "Moving Money",
        icon: "exchange",
        dayIndex: 8
      },
      {
        title: "Paying to Use the Network",
        content: "When you send Bitcoin, you pay a tiny fee to the network. It's like paying a toll to use a highway, but the highway is super fast and secure.",
        category: "Network Fees",
        icon: "dollar-sign",
        dayIndex: 8
      },
      {
        title: "Making Sure It's Real",
        content: "After you send Bitcoin, the network double-checks and triple-checks that everything is correct. The more checks, the more sure everyone is.",
        category: "Security",
        icon: "check-circle",
        dayIndex: 8
      },

      // Day 10: Bitcoin's Story
      {
        title: "The Mystery Creator",
        content: "Someone named Satoshi Nakamoto invented Bitcoin, then disappeared forever. Bitcoin keeps working perfectly without its creator, proving no one person controls it.",
        category: "Bitcoin History",
        icon: "user-secret",
        dayIndex: 9
      },
      {
        title: "Bitcoin's Birthday",
        content: "Bitcoin was born on January 3, 2009. The very first block included a newspaper headline about banks getting bailed out during the financial crisis.",
        category: "Bitcoin History",
        icon: "database",
        dayIndex: 9
      },
      {
        title: "The Famous Pizza",
        content: "The first real purchase with Bitcoin was two pizzas for 10,000 Bitcoin in 2010. Those same Bitcoin would be worth millions today!",
        category: "Bitcoin History",
        icon: "pizza-slice",
        dayIndex: 9
      },

      // Day 11: Bitcoin's Speed
      {
        title: "Slow But Secure",
        content: "Bitcoin processes about 7 transactions per second. That's slow compared to credit cards, but Bitcoin chose security over speed.",
        category: "Network Speed",
        icon: "layers",
        dayIndex: 10
      },
      {
        title: "Can't Have Everything",
        content: "Bitcoin could be faster, but that would make it less secure or more centralized. Bitcoin picked security and decentralization as most important.",
        category: "Trade-offs",
        icon: "triangle",
        dayIndex: 10
      },
      {
        title: "Lightning Fast Layer",
        content: "Lightning Network sits on top of Bitcoin and can handle millions of transactions per second while staying just as secure as regular Bitcoin.",
        category: "Fast Payments",
        icon: "lightning",
        dayIndex: 10
      },

      // Day 12: Bitcoin and Energy
      {
        title: "Energy Makes It Safe",
        content: "Bitcoin uses lots of energy on purpose. This energy makes it incredibly expensive for anyone to attack or hack the network.",
        category: "Security",
        icon: "zap",
        dayIndex: 11
      },
      {
        title: "Clean Energy Mining",
        content: "More than half of Bitcoin mining uses clean energy like solar and wind. Miners want the cheapest electricity, which is often renewable.",
        category: "Environment",
        icon: "leaf",
        dayIndex: 11
      },
      {
        title: "Helping the Grid",
        content: "Bitcoin miners help balance electricity grids. They can quickly use extra power when there's too much, or stop using it when needed.",
        category: "Helping Society",
        icon: "grid-3x3",
        dayIndex: 11
      },

      // Day 13: Bitcoin's Money Rules
      {
        title: "Only 21 Million Ever",
        content: "There will only be 21 million Bitcoin, period. This has never happened in history - a money that can't be printed no matter what.",
        category: "Limited Money",
        icon: "lock",
        dayIndex: 12
      },
      {
        title: "Cutting Rewards in Half",
        content: "Every 4 years, Bitcoin cuts the mining reward in half. This makes new Bitcoin even more rare, and historically prices have gone up.",
        category: "Getting Rarer",
        icon: "trending-up",
        dayIndex: 12
      },
      {
        title: "Rules That Can't Change",
        content: "Bitcoin's money rules are set in stone. Unlike government money, no one can change Bitcoin's rules to print more or take control.",
        category: "Fixed Rules",
        icon: "calendar",
        dayIndex: 12
      },

      // Day 13: Self-Custody
      {
        title: "Not Your Keys, Not Your Coins",
        content: "If you don't control the private keys, you don't truly own the Bitcoin. Self-custody eliminates counterparty risk.",
        category: "Security",
        icon: "key",
        dayIndex: 13
      },
      {
        title: "Hardware Wallets",
        content: "Hardware wallets store private keys offline, providing maximum security for long-term Bitcoin storage and large amounts.",
        category: "Wallets",
        icon: "shield",
        dayIndex: 13
      },
      {
        title: "Seed Phrase Backup",
        content: "Your seed phrase can restore your entire wallet. Store it securely in multiple locations and never share it with anyone.",
        category: "Backup",
        icon: "file-text",
        dayIndex: 13
      },

      // Day 14: Privacy and Transparency
      {
        title: "Pseudonymous Transactions",
        content: "Bitcoin transactions are pseudonymous, not anonymous. Addresses are public but identities behind them are private by default.",
        category: "Privacy",
        icon: "eye-off",
        dayIndex: 14
      },
      {
        title: "Public Blockchain",
        content: "All Bitcoin transactions are recorded on a public ledger, enabling unprecedented financial transparency and accountability.",
        category: "Transparency",
        icon: "search",
        dayIndex: 14
      },
      {
        title: "Privacy Techniques",
        content: "Use new addresses for each transaction, avoid address reuse, and consider privacy-focused wallets to maintain pseudonymity.",
        category: "Best Practices",
        icon: "mask",
        dayIndex: 14
      },

      // Day 15: Network Effects
      {
        title: "Metcalfe's Law",
        content: "A network's value grows with the square of its users. As Bitcoin adoption doubles, its utility potentially quadruples.",
        category: "Network Effects",
        icon: "network-wired",
        dayIndex: 15
      },
      {
        title: "Global Adoption",
        content: "Each new Bitcoin user, merchant, or institution makes Bitcoin more valuable and useful for everyone else in the network.",
        category: "Adoption",
        icon: "globe",
        dayIndex: 15
      },
      {
        title: "Critical Mass",
        content: "Bitcoin reaches critical mass when the cost of not participating exceeds the cost of learning and adopting Bitcoin.",
        category: "Tipping Point",
        icon: "trending-up",
        dayIndex: 15
      },

      // Days 16-29: Continue with essential Bitcoin concepts
      {
        title: "Bitcoin Innovation",
        content: "Bitcoin combines existing technologies in a novel way, demonstrating that breakthrough innovations often come from creative combinations.",
        category: "Technology",
        icon: "lightbulb",
        dayIndex: 16
      },
      {
        title: "Open Source Development",
        content: "Bitcoin's open-source nature allows global collaboration and transparency, creating one of the most reviewed software projects in history.",
        category: "Development",
        icon: "code",
        dayIndex: 16
      },
      {
        title: "Protocol Upgrades",
        content: "Bitcoin improves through careful consensus-driven upgrades like SegWit and Taproot that enhance functionality while maintaining security.",
        category: "Upgrades",
        icon: "tools",
        dayIndex: 16
      }
    ];

    // Days 17-29: Advanced Bitcoin concepts with 9th grade reading level
    const advancedFacts = [
      // Day 17: Proving ownership and computer rules
      {
        title: "Proving You Own It",
        content: "Bitcoin uses computer math to prove you really own your money without showing your secret password to anyone.",
        category: "Ownership",
        icon: "signature",
        dayIndex: 17
      },
      {
        title: "Computer Rules Money",
        content: "Bitcoin follows computer rules that never change, so no person or government can mess with your money.",
        category: "Rules",
        icon: "code",
        dayIndex: 17
      },
      {
        title: "More Users, More Useful",
        content: "As more people use Bitcoin, it becomes more helpful and valuable for everyone who has it.",
        category: "Growth",
        icon: "network",
        dayIndex: 17
      },

      // Day 18: Money without borders
      {
        title: "Money Without Borders",
        content: "Bitcoin works exactly the same way in every country. No need to exchange money when you travel.",
        category: "Global",
        icon: "globe-2",
        dayIndex: 18
      },
      {
        title: "Gets More Valuable",
        content: "Bitcoin tends to become worth more over time because there's a limited amount but more people want it.",
        category: "Value Growth",
        icon: "trending-up",
        dayIndex: 18
      },
      {
        title: "You Control Your Money",
        content: "Bitcoin gives you the same power over your money that only governments and big banks used to have.",
        category: "Control",
        icon: "user-crown",
        dayIndex: 18
      },

      // Day 19: Freedom through technology
      {
        title: "Freedom Through Technology",
        content: "Bitcoin uses computer math to give you money freedom that doesn't depend on where you live or who's in charge.",
        category: "Freedom",
        icon: "unlock",
        dayIndex: 19
      },
      {
        title: "Digital Gold",
        content: "Bitcoin works like digital gold that keeps your wealth safe and is easier to carry and check than real gold.",
        category: "Digital Gold",
        icon: "vault",
        dayIndex: 19
      },
      {
        title: "Fair Money for Everyone",
        content: "Bitcoin treats everyone the same using computer rules instead of favoring certain people or countries.",
        category: "Fairness",
        icon: "balance-scale",
        dayIndex: 19
      },

      // Day 20: Protection and rewards
      {
        title: "Rewarded for Protection",
        content: "People get paid in Bitcoin for helping protect the network, so everyone wants to keep it safe.",
        category: "Protection",
        icon: "shield-check",
        dayIndex: 20
      },
      {
        title: "Can't Be Stopped",
        content: "Once you send Bitcoin, no government or company can stop, cancel, or reverse your payment.",
        category: "Unstoppable",
        icon: "send",
        dayIndex: 20
      },
      {
        title: "Math Instead of Trust",
        content: "Bitcoin uses computer math instead of trusting banks or governments to keep your money safe.",
        category: "No Trust Needed",
        icon: "calculator",
        dayIndex: 20
      },

      // Days 21-29: Advanced concepts made simple
      {
        title: "Money Away from Politics",
        content: "Bitcoin keeps money separate from government control so politicians can't print more or steal it.",
        category: "Politics",
        icon: "scales",
        dayIndex: 21
      },
      {
        title: "Saving Gets Rewarded",
        content: "Bitcoin encourages people to save money for the future instead of spending everything right away.",
        category: "Saving",
        icon: "lock-keyhole",
        dayIndex: 21
      },
      {
        title: "Permanent Money Record",
        content: "Bitcoin keeps a permanent record of who owned what and when that can never be erased.",
        category: "Digital Scarcity",
        icon: "clock",
        dayIndex: 21
      },

      {
        title: "People Choose to Use It",
        content: "Bitcoin grows because people want to use it, not because they're forced to by laws.",
        category: "Choice",
        icon: "handshake",
        dayIndex: 22
      },
      {
        title: "Electricity Keeps It Safe",
        content: "Bitcoin uses real electricity to protect everyone's money, making it expensive for bad guys to attack.",
        category: "Safety",
        icon: "zap-circle",
        dayIndex: 22
      },
      {
        title: "Gets Stronger When Attacked",
        content: "Bitcoin becomes more powerful every time someone tries to break it or ban it.",
        category: "Strength",
        icon: "shield-plus",
        dayIndex: 22
      },

      {
        title: "Be Your Own Bank",
        content: "Bitcoin lets you control your money completely by yourself without needing any bank.",
        category: "Control",
        icon: "key-round",
        dayIndex: 23
      },
      {
        title: "First Rare Digital Thing",
        content: "Bitcoin is the first digital thing that can't be copied, making it truly special and rare.",
        category: "Rare",
        icon: "cpu",
        dayIndex: 23
      },
      {
        title: "Peaceful Money Change",
        content: "Bitcoin changes money systems through people choosing it, not through wars or force.",
        category: "Peace",
        icon: "dove",
        dayIndex: 23
      },

      {
        title: "Math Rules, Not People",
        content: "Bitcoin follows computer math rules instead of letting politicians or bankers decide what happens to money.",
        category: "Math Rules",
        icon: "users-round",
        dayIndex: 24
      },
      {
        title: "Final Money Settlement",
        content: "Bitcoin is like the final place where all big money transfers get settled, like a digital bank for banks.",
        category: "Settlement",
        icon: "layers-3",
        dayIndex: 24
      },
      {
        title: "Real Price Discovery",
        content: "Bitcoin shows the real price of things because nobody can fake or manipulate the numbers.",
        category: "Real Prices",
        icon: "trending-up-down",
        dayIndex: 24
      },

      {
        title: "You Really Own It",
        content: "Bitcoin gives you true ownership of your money that nobody can take away, freeze, or steal.",
        category: "True Ownership",
        icon: "home",
        dayIndex: 25
      },
      {
        title: "Pass It to Your Kids",
        content: "Bitcoin makes it easy to pass your money to your children without paying big taxes to the government.",
        category: "Family Money",
        icon: "family",
        dayIndex: 25
      },
      {
        title: "Foundation for New Money",
        content: "Bitcoin is like a foundation that other people can build new money tools and services on top of.",
        category: "Building Block",
        icon: "lightbulb",
        dayIndex: 25
      },

      {
        title: "Escape Shrinking Money",
        content: "Bitcoin lets you escape from regular money that loses value every year when governments print more.",
        category: "Escape",
        icon: "exit",
        dayIndex: 26
      },
      {
        title: "Bitcoin-Only Businesses",
        content: "As more people use Bitcoin, whole businesses start earning, spending, and saving only in Bitcoin.",
        category: "Bitcoin Business",
        icon: "recycle",
        dayIndex: 26
      },
      {
        title: "Private But Open",
        content: "Bitcoin keeps your money private while still being open for everyone to check that the system is honest.",
        category: "Privacy",
        icon: "eye-off",
        dayIndex: 26
      },

      {
        title: "Bitcoin Takes Over",
        content: "Bitcoin's better money features make it likely to become the main money that most people use.",
        category: "Takeover",
        icon: "rocket",
        dayIndex: 27
      },
      {
        title: "Good Money Returns",
        content: "Bitcoin brings back good money that encourages people to save and plan for the future.",
        category: "Good Money",
        icon: "coins",
        dayIndex: 27
      },
      {
        title: "Perfect Money Features",
        content: "Bitcoin combines all the best features money should have: it lasts forever, is easy to carry, and stays rare.",
        category: "Perfect",
        icon: "settings",
        dayIndex: 27
      },

      {
        title: "Better Business Decisions",
        content: "Bitcoin helps businesses make better decisions because prices aren't messed up by money printing.",
        category: "Better Decisions",
        icon: "calculator-plus",
        dayIndex: 28
      },
      {
        title: "No Single Failure Point",
        content: "Bitcoin can't be broken by one company or government failing because it's spread across many computers.",
        category: "Can't Break",
        icon: "shield-minus",
        dayIndex: 28
      },
      {
        title: "Think Long Term",
        content: "Bitcoin encourages people to save and think about the future instead of spending money right away.",
        category: "Future Planning",
        icon: "hourglass",
        dayIndex: 28
      },

      {
        title: "Money for Everyone",
        content: "Bitcoin gives people without bank accounts a way to save and send money anywhere in the world.",
        category: "For Everyone",
        icon: "users-plus",
        dayIndex: 29
      },
      {
        title: "Countries Get Freedom",
        content: "Bitcoin lets countries control their own money instead of depending on other countries' banks.",
        category: "Country Freedom",
        icon: "flag",
        dayIndex: 29
      },
      {
        title: "Working Together Peacefully",
        content: "Bitcoin shows how people around the world can work together using math instead of fighting or force.",
        category: "Working Together",
        icon: "globe-lock",
        dayIndex: 29
      }
    ];

    const additionalFactDays = advancedFacts;

    // Combine all facts
    const allFacts = [...facts, ...additionalFactDays];

    // Create facts with comprehensive dive deeper content
    allFacts.forEach(fact => {
      let diveDeeper = null;
      
      // Add dive deeper content based on the fact title
      if (fact.title === "What is Bitcoin?") {
        diveDeeper = {
          explanation: "Bitcoin is the first digital money that works without anyone being in charge. Regular money needs banks or governments to control it. Bitcoin uses thousands of computers around the world to keep it safe and make sure no one cheats. This creates money that belongs to everyone and no one at the same time.",
          examples: [
            "Regular money: Banks can freeze your account anytime they want",
            "Bitcoin: You control your own money with your secret code",
            "Regular money: Governments can print as much as they want",
            "Bitcoin: Only 21 million will ever exist, period"
          ],
          visualDescription: "Think of Bitcoin like a notebook that thousands of people keep copies of. When someone sends money, everyone updates their notebook at the same time. No one person can cheat because everyone else would see the lie.",
          keyTakeaways: [
            "Bitcoin works without banks or governments being in charge",
            "Only 21 million Bitcoin will ever be made",
            "You can use Bitcoin anywhere in the world with internet",
            "Thousands of computers keep Bitcoin safe and honest"
          ]
        };
      }

      if (fact.title === "Bitcoin is Limited") {
        diveDeeper = {
          explanation: "Bitcoin has a limit of 21 million coins written into its computer code. Thousands of computers around the world make sure this rule never changes. Regular money loses value when governments print more. Bitcoin stays valuable because no one can make more of it.",
          examples: [
            "US Dollar: Government printed 40% of all dollars in just 2020-2021",
            "Bitcoin: Exactly 21 million coins, no exceptions ever",
            "Venezuela money: Lost almost all its value from too much printing",
            "Bitcoin: Keeps its value because the amount never increases"
          ],
          visualDescription: "Think of Bitcoin like rare baseball cards. If only 21 million cards were ever made and no more could be printed, each card becomes more valuable as more people want them. That's exactly how Bitcoin works.",
          keyTakeaways: [
            "Only 21 million Bitcoin will ever exist",
            "No government can create more Bitcoin",
            "Computer code enforces this limit forever",
            "Your Bitcoin can't lose value from money printing"
          ]
        };
      }

      if (fact.title === "You Own Your Bitcoin") {
        diveDeeper = {
          explanation: "When you control your Bitcoin secret code, you really own your money. No one can take it away from you. This is different from banks where they actually own your account and can stop you from using your money anytime they want.",
          examples: [
            "Regular banking: Bank holds your money and decides when you can use it",
            "Bitcoin: You hold your own money with your secret code",
            "Regular accounts: Banks can freeze your account for any reason",
            "Bitcoin: Only you can use your money if you have your secret code"
          ],
          visualDescription: "Think of having a safe that only you know the combination to. No one else can open it, break into it, or tell you what to do with what's inside. That's how Bitcoin works with your secret code.",
          keyTakeaways: [
            "Your secret code means you truly own your Bitcoin",
            "No bank can freeze or take your Bitcoin",
            "You are your own bank with total control",
            "Math protects your ownership, not promises from people"
          ]
        };
      }
      
      if (fact.title === "The Shared Notebook") {
        diveDeeper = {
          explanation: "The blockchain is like a notebook that everyone can read but no one can erase or change. Every page has a list of who paid who. Each page connects to the page before it. This makes it impossible to lie about what happened without everyone seeing the lie.",
          examples: [
            "Regular banking: Only the bank sees what you did with your money",
            "Bitcoin notebook: Everyone can check every payment ever made",
            "Regular systems: Banks can change their records anytime",
            "Bitcoin: Once written down, records can never be changed"
          ],
          visualDescription: "Picture a notebook where every page has a number and mentions the page before it. If someone tries to rip out or change an old page, the numbers won't match up, and everyone will know something's wrong.",
          keyTakeaways: [
            "Blockchain keeps records that can never be erased",
            "Everyone can check transactions by themselves",
            "No single person controls the record book",
            "Being open creates trust without needing banks"
          ]
        };
      }

      if (fact.title === "Your Money Keeps Its Value") {
        diveDeeper = {
          explanation: "Bitcoin has a limit of 21 million coins written into its computer code. Thousands of computers around the world make sure this rule never changes. Regular money loses value when governments print more. Bitcoin stays valuable because no one can make more of it.",
          examples: [
            "US Dollar: Government printed 40% of all dollars in just 2020-2021",
            "Bitcoin: Exactly 21 million coins, no exceptions ever",
            "Venezuela money: Lost almost all its value from too much printing",
            "Bitcoin: Keeps its value because the amount never increases"
          ],
          visualDescription: "Think of Bitcoin like rare trading cards. If only 21 million cards were ever made and no more could be printed, each card becomes more valuable as more people want them. That's exactly how Bitcoin works.",
          keyTakeaways: [
            "Only 21 million Bitcoin will ever exist",
            "No government can create more Bitcoin",
            "Computer code enforces this limit forever",
            "Your Bitcoin can't lose value from money printing"
          ]
        };
      }

      if (fact.title === "Digital Puzzle Solving") {
        diveDeeper = {
          explanation: "Bitcoin mining is like a global contest where people compete to solve math puzzles. The winner gets to add the next page of transactions and earn new Bitcoin. This keeps Bitcoin safe because changing old transactions would mean solving all the puzzles again, which would cost way too much money.",
          examples: [
            "Regular banking: Banks check transactions using trusted workers",
            "Bitcoin: Miners check transactions by solving hard math puzzles",
            "Regular systems: Safety comes from guards and locked vaults",
            "Bitcoin: Safety comes from how much it costs to attack the system"
          ],
          visualDescription: "Picture thousands of people racing to solve crossword puzzles. The first person to solve it gets a prize and can write the next page in the world's money book. To cheat, someone would need to solve puzzles faster than everyone else put together.",
          keyTakeaways: [
            "Mining keeps Bitcoin safe by making attacks cost too much",
            "Miners compete to handle transactions and get rewards",
            "Using energy creates real protection for digital money",
            "More miners means Bitcoin becomes safer"
          ]
        };
      }

      if (fact.title === "Your Digital Wallet") {
        diveDeeper = {
          explanation: "A Bitcoin wallet is like a digital safe that only you can open. Your secret code is like the combination. Anyone who knows it can get your Bitcoin. Your address is like your house address. You can tell people your address so they can send you Bitcoin.",
          examples: [
            "Regular banking: Bank holds your money and decides when you can use it",
            "Bitcoin wallet: You hold your own money with your secret code",
            "Regular accounts: Banks can freeze your account anytime",
            "Bitcoin: Only you can use your money if you have your secret code"
          ],
          visualDescription: "Picture a mailbox where you tell people your address so they can send you mail (Bitcoin), but only you have the key to open the mailbox and get what's inside.",
          keyTakeaways: [
            "Secret codes give you total control over your Bitcoin",
            "Losing your secret code means losing your Bitcoin forever",
            "Addresses are safe to share for getting Bitcoin",
            "If you don't have the secret code, it's not really your money"
          ]
        };
      }

      if (fact.title === "How to Send Bitcoin") {
        diveDeeper = {
          explanation: "Sending Bitcoin is like mailing a letter, but instead of writing an address on an envelope, you tell thousands of computers around the world about your transaction. These computers check your signature and update everyone's money notebook to show the payment.",
          examples: [
            "Regular transfer: Bank moves numbers between their own accounts",
            "Bitcoin: Your signed message goes to thousands of computers worldwide",
            "Regular: Banks can cancel or block your transactions",
            "Bitcoin: Once confirmed, transactions can never be undone"
          ],
          visualDescription: "Picture telling a room full of bookkeepers that you're sending money to someone. Each bookkeeper writes it down in their book. The transaction only works if most bookkeepers agree it's real.",
          keyTakeaways: [
            "Bitcoin transactions go to the whole network",
            "Your signature proves you approved the transaction",
            "Once confirmed, transactions can never be reversed",
            "No middleman needed - direct person-to-person transfer"
          ]
        };
      }

      if (fact.title === "The Great Halving") {
        diveDeeper = {
          explanation: "Every four years, the amount of new Bitcoin created gets cut in half automatically. This is written into Bitcoin's computer code and makes Bitcoin more rare over time. It's like if gold miners could only find half as much gold every four years, making the gold they already found worth more.",
          examples: [
            "2009-2012: 50 new Bitcoin every 10 minutes",
            "2012-2016: 25 new Bitcoin every 10 minutes", 
            "2016-2020: 12.5 new Bitcoin every 10 minutes",
            "2020-2024: 6.25 new Bitcoin every 10 minutes"
          ],
          visualDescription: "Picture a water faucet that drips gold coins. Every four years, the faucet automatically slows down to drip half as fast. Eventually, the faucet will stop dripping completely, but people will still want the coins that already came out.",
          keyTakeaways: [
            "Bitcoin becomes more rare every four years automatically",
            "The halving is built into the code, not controlled by people",
            "Less new supply often makes Bitcoin worth more",
            "Around year 2140, no new Bitcoin will ever be made"
          ]
        };
      }

      if (fact.title === "Regular Money Loses Value") {
        diveDeeper = {
          explanation: "Inflation happens when governments print more money, making each existing dollar worth less. This is like diluting orange juice with water - you have more liquid, but each sip has less orange flavor. Bitcoin can't be diluted because no one can create more of it.",
          examples: [
            "1971: $1 could buy what $6.50 can buy today",
            "Since 2000: US dollar lost 35% of its purchasing power",
            "Venezuela 2018: Inflation rate reached 1,000,000%",
            "Bitcoin: Same 21 million limit since day one"
          ],
          visualDescription: "Imagine if someone could photocopy dollar bills perfectly. Soon everyone would have lots of dollars, but stores would charge more because dollars would be everywhere. Bitcoin can't be photocopied or created out of thin air.",
          keyTakeaways: [
            "Money printing reduces the value of existing money",
            "Bitcoin's fixed supply protects against this devaluation",
            "Historical data shows steady purchasing power decline",
            "Scarcity preservation is Bitcoin's key advantage"
          ]
        };
      }

      if (fact.title === "Lightning Fast") {
        diveDeeper = {
          explanation: "Lightning Network is like having a tab at your favorite coffee shop. Instead of paying for each coffee individually, you open a tab, buy multiple coffees throughout the week, then settle the total bill at the end. Lightning works the same way but with Bitcoin.",
          examples: [
            "Traditional Bitcoin: Each transaction recorded on global ledger",
            "Lightning: Many transactions bundled into one settlement",
            "Banking analogy: Like writing one check instead of paying cash for every purchase",
            "Real usage: Instant payments for coffee, tips, or streaming content"
          ],
          visualDescription: "Picture two people with a shared notebook where they keep track of IOUs. They can exchange money back and forth instantly by updating the notebook. Only when they're done do they settle up with real cash.",
          keyTakeaways: [
            "Lightning enables instant Bitcoin payments",
            "Transactions cost fractions of a penny",
            "Built on top of Bitcoin's security foundation",
            "Perfect for small, frequent payments"
          ]
        };
      }

      if (fact.title === "Why Bitcoin Matters") {
        diveDeeper = {
          explanation: "Bitcoin matters because it solves fundamental problems with money that have existed for thousands of years. For the first time in history, we have money that can't be controlled, manipulated, or devalued by any government or institution.",
          examples: [
            "Problem: Governments can freeze bank accounts → Bitcoin: You control your own money",
            "Problem: Money loses value through printing → Bitcoin: Fixed supply of 21 million",
            "Problem: International transfers take days → Bitcoin: Transfers in minutes globally",
            "Problem: Banks exclude billions of people → Bitcoin: Anyone with internet can use it"
          ],
          visualDescription: "Imagine if there was a form of gold that you could teleport instantly anywhere in the world, that couldn't be counterfeited, and that no government could confiscate or control. That's essentially what Bitcoin represents in digital form.",
          keyTakeaways: [
            "First money that works without anyone in charge",
            "Fixes problems money has always had",
            "Gives people complete control over their money",
            "Changes how money works forever"
          ]
        };
      }

      if (fact.title === "No Middleman Needed") {
        diveDeeper = {
          explanation: "Bitcoin lets you send money directly to another person without banks, payment companies, or governments getting involved. It's like handing someone cash, but it works anywhere in the world instantly. No one can stop your transaction or charge you extra fees.",
          examples: [
            "Regular payments: Bank controls your transaction and takes fees",
            "Bitcoin: You send money directly with no permission needed",
            "Regular transfers: Can take 3-5 business days to complete",
            "Bitcoin: Transfers happen in about 10 minutes worldwide"
          ],
          visualDescription: "Think of Bitcoin like handing cash directly to someone, but instead of being in the same room, you can do it instantly across the entire world without anyone else being involved.",
          keyTakeaways: [
            "Send money anywhere without asking permission",
            "No banks or payment companies control your transactions",
            "Works 24/7 including weekends and holidays",
            "True peer-to-peer money like digital cash"
          ]
        };
      }

      if (fact.title === "Super Secure Math") {
        diveDeeper = {
          explanation: "Bitcoin uses special math called cryptography that makes it nearly impossible to hack or steal. Your Bitcoin is protected by the same type of math that keeps government secrets safe. Even the world's most powerful computers would need thousands of years to break this protection.",
          examples: [
            "Regular passwords: Can be guessed or hacked by computer programs",
            "Bitcoin math: Would take longer than the age of the universe to crack",
            "Bank security: Relies on physical guards and locked doors",
            "Bitcoin: Protected by pure mathematics that can't be bribed or threatened"
          ],
          visualDescription: "Imagine having a lock that's so complex, all the computers in the world working together for a thousand years couldn't break it. That's how strong Bitcoin's math protection is.",
          keyTakeaways: [
            "Uses military-grade mathematical protection",
            "Cannot be hacked with current technology",
            "Your secret code is virtually unbreakable",
            "Math provides better security than physical locks"
          ]
        };
      }

      if (fact.title === "Always Open") {
        diveDeeper = {
          explanation: "Bitcoin runs on thousands of computers around the world that never shut down. While banks close on weekends and holidays, Bitcoin works 24 hours a day, 7 days a week, 365 days a year. You can send money on Christmas morning or Sunday night - Bitcoin never takes a break.",
          examples: [
            "Banks: Closed nights, weekends, and holidays",
            "Bitcoin: Open every minute of every day forever",
            "Regular transfers: Can't send money when banks are closed",
            "Bitcoin: Send money anytime, even on Christmas Day"
          ],
          visualDescription: "Think of Bitcoin like the internet - it never shuts down. While your local bank might close at 5 PM, Bitcoin is like having a bank that's always open, even during natural disasters or emergencies.",
          keyTakeaways: [
            "Bitcoin never closes or takes breaks",
            "Works during holidays and weekends",
            "Available 24/7 around the world",
            "No business hours or banking delays"
          ]
        };
      }

      if (fact.title === "Nobody Can Stop You") {
        diveDeeper = {
          explanation: "When you control your Bitcoin with your secret code, you have complete financial freedom. No government, bank, or company can freeze your account, block your payments, or tell you what to do with your money. This is different from regular money where others can control your access.",
          examples: [
            "Bank accounts: Can be frozen by government or bank decisions",
            "Bitcoin: Only you control access with your secret code",
            "Regular money: Companies can block your payments",
            "Bitcoin: Nobody can stop transactions once you broadcast them"
          ],
          visualDescription: "Picture having a magic wallet that only responds to your voice. No matter who wants to take it, freeze it, or control it, the wallet only listens to you. That's how Bitcoin works with your secret code.",
          keyTakeaways: [
            "You have complete control over your Bitcoin",
            "No one can freeze or block your Bitcoin",
            "Your money, your rules, your decisions",
            "True freedom from banks and governments"
          ]
        };
      }

      if (fact.title === "Earning Your Bitcoin") {
        diveDeeper = {
          explanation: "Bitcoin mining rewards people who help secure the network by solving computer puzzles. Miners compete to solve these puzzles, and the winner gets new Bitcoin as a prize. This system creates new Bitcoin while keeping the network safe from attackers.",
          examples: [
            "Regular banking: Banks create money by typing numbers on computers",
            "Bitcoin: New coins only come from solving difficult math puzzles",
            "Regular systems: Central authority decides who gets new money",
            "Bitcoin: Math and energy determine who earns new Bitcoin"
          ],
          visualDescription: "Think of Bitcoin mining like a lottery where everyone buys tickets by solving puzzles. The more energy you use to solve puzzles, the more tickets you get. When you win, you get brand new Bitcoin that didn't exist before.",
          keyTakeaways: [
            "New Bitcoin comes only from mining rewards",
            "Miners must use real energy to earn Bitcoin",
            "Mining creates money through work, not printing",
            "System rewards those who help secure the network"
          ]
        };
      }

      if (fact.title === "Keeps Getting Harder") {
        diveDeeper = {
          explanation: "Bitcoin automatically adjusts how hard the mining puzzles are to keep them taking about 10 minutes to solve. If more people start mining, the puzzles get harder. If people stop mining, the puzzles get easier. This keeps Bitcoin running smoothly no matter what.",
          examples: [
            "Regular manufacturing: More workers means more products faster",
            "Bitcoin mining: More miners means puzzles get harder, not faster",
            "Regular systems: Humans decide when to change the rules",
            "Bitcoin: Computer code automatically adjusts difficulty every two weeks"
          ],
          visualDescription: "Imagine a video game that watches how fast you're beating levels and automatically makes them harder or easier to keep you playing for exactly the same amount of time each level.",
          keyTakeaways: [
            "Bitcoin adjusts mining difficulty automatically",
            "Keeps blocks coming every 10 minutes on average",
            "More miners means harder puzzles, not faster blocks",
            "System stays stable without human intervention"
          ]
        };
      }

      if (fact.title === "Your Secret Code") {
        diveDeeper = {
          explanation: "Your Bitcoin secret code is called a private key. It's like an extremely long password that only you know. This code is what proves you own your Bitcoin. Anyone who knows this code can spend your Bitcoin, so keeping it secret is the most important thing.",
          examples: [
            "Regular passwords: Usually 8-16 characters long",
            "Bitcoin private key: 256 random bits, impossible to guess",
            "Regular accounts: Companies can reset your password",
            "Bitcoin: If you lose your private key, your Bitcoin is gone forever"
          ],
          visualDescription: "Think of your private key like the combination to the world's most secure safe. The combination is so long and random that all the computers on Earth couldn't guess it in a billion years.",
          keyTakeaways: [
            "Private key proves you own your Bitcoin",
            "Keep it secret and safe at all times",
            "No one can get it back if you lose it",
            "Impossible for others to guess"
          ]
        };
      }

      if (fact.title === "You Must Control Your Key") {
        diveDeeper = {
          explanation: "If someone else holds your Bitcoin private key, they really own your Bitcoin, not you. This is why keeping Bitcoin on exchanges is risky. The exchange has your keys, so they control your money. True Bitcoin ownership means you control your own keys.",
          examples: [
            "Bank account: Bank controls your money and can stop you anytime",
            "Your Bitcoin wallet: You control your money with your private keys",
            "Exchange custody: Exchange can freeze, lose, or steal your Bitcoin",
            "Self-custody: Only you can access or move your Bitcoin"
          ],
          visualDescription: "Imagine giving someone else the combination to your safe and trusting them to give you your things when you ask. That's what keeping Bitcoin on exchanges is like.",
          keyTakeaways: [
            "Not your keys, not your Bitcoin",
            "Self-custody gives you complete control",
            "Exchanges can fail, get hacked, or freeze accounts",
            "True ownership requires personal responsibility"
          ]
        };
      }

      if (fact.title === "Paying the Network") {
        diveDeeper = {
          explanation: "When you send Bitcoin, you pay a small fee to the miners who process your transaction. This fee goes to the people running the computers that keep Bitcoin secure. Higher fees make your transaction process faster, while lower fees might take longer.",
          examples: [
            "Bank transfers: Bank keeps all the fees for themselves",
            "Bitcoin: Fees go directly to people securing the network",
            "Credit cards: Fees often 2-3% of transaction amount",
            "Bitcoin: Fees usually under $1, regardless of amount sent"
          ],
          visualDescription: "Think of Bitcoin fees like paying a delivery service. The more you tip, the faster your package gets delivered. The tip goes directly to the delivery person, not to a big company.",
          keyTakeaways: [
            "Fees pay people who keep Bitcoin safe",
            "Higher fees make transactions go faster",
            "Fees cost much less than regular payments",
            "You decide how much fee to pay"
          ]
        };
      }

      if (fact.title === "Waiting for Confirmation") {
        diveDeeper = {
          explanation: "After you send Bitcoin, it takes about 10 minutes for the network to confirm your transaction is real. This happens when miners include your transaction in a new block. The waiting time helps keep Bitcoin secure by making sure no one can cheat.",
          examples: [
            "Bank transfers: Can take 3-5 business days to really complete",
            "Bitcoin: Confirmed in 10 minutes, settled forever",
            "Credit cards: Can be reversed for months after purchase",
            "Bitcoin: Once confirmed, transactions can never be undone"
          ],
          visualDescription: "Think of Bitcoin confirmation like waiting for a check to clear, but instead of days, it takes just 10 minutes and then it's permanent forever.",
          keyTakeaways: [
            "Bitcoin takes about 10 minutes to confirm payments",
            "Waiting time stops fraud and cheating",
            "Once confirmed, payments are permanent",
            "Much faster than regular bank transfers"
          ]
        };
      }

      if (fact.title === "The Great Halving") {
        diveDeeper = {
          explanation: "Every four years, Bitcoin automatically cuts the mining reward in half. This is built into the computer code and can't be changed. It makes new Bitcoin more scarce over time, similar to how gold becomes harder to find as the easy deposits are mined out.",
          examples: [
            "2009-2012: Miners got 50 Bitcoin per block",
            "2012-2016: Reward dropped to 25 Bitcoin per block",
            "2016-2020: Reward dropped to 12.5 Bitcoin per block",
            "2020-2024: Reward dropped to 6.25 Bitcoin per block"
          ],
          visualDescription: "Imagine a gold mine that automatically produces half as much gold every four years. Eventually, very little new gold comes out, making existing gold more valuable.",
          keyTakeaways: [
            "Mining rewards get cut in half every four years",
            "Makes Bitcoin more rare over time",
            "Built into the code and cannot be changed",
            "Often makes Bitcoin price go up"
          ]
        };
      }

      if (fact.title === "No More After 21 Million") {
        diveDeeper = {
          explanation: "Bitcoin has a hard limit of 21 million coins built into its code. Around the year 2140, all Bitcoin will have been mined and no new ones will ever be created. This makes Bitcoin the first truly finite digital asset in history.",
          examples: [
            "US Dollar: No limit - government can print as much as they want",
            "Bitcoin: Hard limit of 21 million coins forever",
            "Gold: Unknown how much exists or could be found in the future",
            "Bitcoin: Exact supply known and cannot be increased"
          ],
          visualDescription: "Imagine if there were exactly 21 million rare diamonds in the world, and everyone knew that no more diamonds could ever be created. That's how Bitcoin works.",
          keyTakeaways: [
            "Only 21 million Bitcoin will ever exist",
            "Mining will stop completely around 2140",
            "Makes Bitcoin perfectly scarce",
            "No government or company can create more"
          ]
        };
      }

      if (fact.title === "Saves Your Money's Value") {
        diveDeeper = {
          explanation: "Because only 21 million Bitcoin will ever exist, your Bitcoin can't lose value from money printing like regular currency does. While governments can print unlimited amounts of their money, making it worth less, Bitcoin's fixed supply protects your purchasing power.",
          examples: [
            "Venezuela: Currency lost 99% of value from money printing",
            "Bitcoin: Cannot be devalued through money printing",
            "US Dollar: Lost 96% of purchasing power since 1913",
            "Bitcoin: Designed to maintain or increase purchasing power"
          ],
          visualDescription: "Think of Bitcoin like a lifeboat that protects your wealth from the sinking ship of money printing. No matter how much paper money gets printed, your Bitcoin stays safe.",
          keyTakeaways: [
            "Fixed supply protects against inflation",
            "Cannot be devalued by money printing",
            "Preserves purchasing power over time",
            "Shields wealth from currency debasement"
          ]
        };
      }

      if (fact.title === "Regular Money Loses Value") {
        diveDeeper = {
          explanation: "Governments and central banks constantly print more money, which makes each dollar worth less over time. This is called inflation. The more money they print, the less your savings can buy. It's like a hidden tax that slowly steals your wealth.",
          examples: [
            "1970: Average house cost $17,000",
            "2024: Average house costs $400,000+ for the same house",
            "1970: Gallon of gas cost 36 cents",
            "2024: Gallon of gas costs $3-4 for the same gas"
          ],
          visualDescription: "Imagine if every year someone secretly took 10% of the things in your closet. Eventually, you'd have much less stuff. That's what money printing does to your savings.",
          keyTakeaways: [
            "Money printing makes everything more expensive over time",
            "Your savings lose purchasing power every year",
            "Inflation is a hidden tax on savers",
            "Hard assets like Bitcoin protect against this theft"
          ]
        };
      }

      if (fact.title === "Banks Control Your Money") {
        diveDeeper = {
          explanation: "When you put money in a bank, you don't really own it anymore. The bank owns it and promises to give it back. They can freeze your account, limit your withdrawals, or even lose your money. With Bitcoin, you truly own your money and no one can take it away.",
          examples: [
            "Bank accounts: Bank can freeze your money anytime",
            "Bitcoin: Only you can freeze or move your money",
            "Bank failures: Your money can disappear if bank fails",
            "Bitcoin: Your money exists independently of any company"
          ],
          visualDescription: "Bank money is like giving your car keys to someone else and hoping they'll let you drive when you need to. Bitcoin is like keeping your keys in your own pocket.",
          keyTakeaways: [
            "Banks control access to 'your' money",
            "Bitcoin gives you direct ownership",
            "Banks can fail and lose your money",
            "Bitcoin cannot be controlled by institutions"
          ]
        };
      }

      if (fact.title === "Bitcoin Helps Everyone") {
        diveDeeper = {
          explanation: "Bitcoin works the same for everyone, everywhere. It doesn't care about your nationality, politics, or social status. People in countries with bad governments or weak banking systems can use Bitcoin to protect their wealth and participate in the global economy.",
          examples: [
            "Nigeria: Government limits foreign currency access",
            "Bitcoin: Nigerians can access global economy directly",
            "Argentina: High inflation destroys savings accounts",
            "Bitcoin: Argentinians preserve wealth outside their currency"
          ],
          visualDescription: "Think of Bitcoin like the internet for money. Just like anyone can use the internet regardless of where they live, anyone can use Bitcoin to send and receive value.",
          keyTakeaways: [
            "Bitcoin doesn't discriminate based on location or status",
            "Helps people escape bad monetary systems",
            "Provides financial access to the unbanked",
            "Creates equal access to global financial network"
          ]
        };
      }

      if (fact.title === "Bitcoin Transactions are Simple") {
        diveDeeper = {
          explanation: "Sending Bitcoin is actually simpler than using banks once you understand it. You just need someone's Bitcoin address and you can send them money instantly. No forms to fill out, no banks to call, no business hours to worry about.",
          examples: [
            "Bank wire: Multiple forms, ID checks, waiting periods",
            "Bitcoin: Copy address, enter amount, click send",
            "International transfer: High fees, currency conversion, delays",
            "Bitcoin: Same process whether sending across the street or across the world"
          ],
          visualDescription: "Sending Bitcoin is like sending an email with money attached. You type in an address, write your message (amount), and hit send.",
          keyTakeaways: [
            "No paperwork or bureaucracy required",
            "Same simple process for all transactions",
            "Works 24/7 without business hours",
            "No difference between local and international payments"
          ]
        };
      }

      if (fact.title === "Making Sure It's Real") {
        diveDeeper = {
          explanation: "Every Bitcoin transaction gets checked by thousands of computers around the world. They all have to agree that your transaction is real before it gets added to the permanent record. This makes cheating almost impossible because you'd need to fool thousands of computers at once.",
          examples: [
            "Fake money: Only one person checks if cash is real",
            "Bitcoin: Thousands of computers verify every transaction",
            "Credit cards: Can be reversed or disputed later",
            "Bitcoin: Once verified, transactions are permanent"
          ],
          visualDescription: "Imagine having thousands of accountants all checking your math at the same time. If they all agree, then you know the answer is definitely correct.",
          keyTakeaways: [
            "Thousands of computers verify each transaction",
            "Makes fraud nearly impossible",
            "No single point of failure",
            "Creates trust through mathematical proof"
          ]
        };
      }

      // Add remaining critical fact titles
      if (fact.title === "The Mystery Creator") {
        diveDeeper = {
          explanation: "Bitcoin was created by someone using the name Satoshi Nakamoto, but no one knows who this person really is. They disappeared in 2011 and haven't been heard from since. This anonymity actually makes Bitcoin stronger because there's no single person who can control or change it.",
          examples: [
            "Regular companies: Have CEOs who can make decisions and change things",
            "Bitcoin: No leader means no one can control or manipulate it",
            "Traditional systems: Depend on key people who can be pressured or corrupted",
            "Bitcoin: Works automatically without needing any specific person"
          ],
          visualDescription: "Think of Bitcoin like a recipe that was shared with the world and then the chef disappeared. The recipe works perfectly without the chef, and no one can change it now.",
          keyTakeaways: [
            "Creator's anonymity protects Bitcoin's independence",
            "No single person can control Bitcoin",
            "System works automatically without human intervention",
            "Decentralization means no point of failure"
          ]
        };
      }

      if (fact.title === "Bitcoin's Birthday") {
        diveDeeper = {
          explanation: "Bitcoin's network started on January 3, 2009, when the first block was created. This block included a newspaper headline about government bailouts during the financial crisis, showing why Bitcoin was needed. It was born from the need for money that couldn't be manipulated by governments.",
          examples: [
            "2008: Financial crisis caused by bank failures and money printing",
            "2009: Bitcoin created as alternative to failed banking system",
            "Traditional money: Caused the crisis through unlimited printing",
            "Bitcoin: Designed to prevent such crises with fixed supply"
          ],
          visualDescription: "Bitcoin was like a lifeboat launched just as the traditional financial ship was sinking. It provided an escape route from the chaos of the 2008 financial crisis.",
          keyTakeaways: [
            "Born during the 2008 financial crisis",
            "Created as response to banking system failures",
            "Genesis block referenced bank bailout headlines",
            "Designed to prevent future financial crises"
          ]
        };
      }

      if (fact.title === "The Famous Pizza") {
        diveDeeper = {
          explanation: "On May 22, 2010, a programmer named Laszlo paid 10,000 Bitcoin for two pizzas. This was the first time Bitcoin was used to buy something in the real world. Those pizzas are now worth hundreds of millions of dollars, making them the most expensive pizzas in history.",
          examples: [
            "2010: 10,000 Bitcoin bought 2 pizzas ($40 worth)",
            "2024: Same 10,000 Bitcoin worth over $400 million",
            "Shows Bitcoin's growth: From worthless to extremely valuable",
            "Proves Bitcoin works as real money for real purchases"
          ],
          visualDescription: "Imagine if you bought lunch with some new tokens that seemed worthless, but those same tokens later became worth enough to buy a mansion. That's the Bitcoin pizza story.",
          keyTakeaways: [
            "First real-world Bitcoin purchase in history",
            "Demonstrates Bitcoin's incredible value growth",
            "Proved Bitcoin could function as actual money",
            "May 22 is now celebrated as Bitcoin Pizza Day"
          ]
        };
      }

      if (fact.title === "Slow But Secure") {
        diveDeeper = {
          explanation: "Bitcoin takes about 10 minutes to confirm transactions because security is more important than speed. This waiting time makes Bitcoin incredibly secure and prevents fraud. It's like having a really good lock on your house - it takes a bit longer to open, but it keeps your valuables much safer.",
          examples: [
            "Credit cards: Fast but can be reversed for months",
            "Bitcoin: Takes 10 minutes but permanent forever",
            "Bank transfers: Fast to send but take days to actually settle",
            "Bitcoin: Settles permanently in 10 minutes"
          ],
          visualDescription: "Bitcoin is like a careful accountant who double-checks everything. It takes a bit of time, but you can trust the results completely.",
          keyTakeaways: [
            "10-minute confirmation ensures maximum security",
            "Trade-off between speed and security favors security",
            "Once confirmed, transactions are permanent",
            "Security is more important than instant gratification"
          ]
        };
      }

      if (fact.title === "Can't Have Everything") {
        diveDeeper = {
          explanation: "Bitcoin was designed to be secure and decentralized, which means it can't also be super fast. This is called the blockchain trilemma - you can have two out of three: secure, decentralized, or fast. Bitcoin chose security and decentralization over speed, which is why it's so trustworthy.",
          examples: [
            "Traditional banking: Fast and centralized but not secure (banks fail)",
            "Bitcoin: Secure and decentralized but not instant",
            "Credit cards: Fast but centralized and can be reversed",
            "Bitcoin: Slower but more secure and truly permanent"
          ],
          visualDescription: "It's like choosing a car: you can have fast, cheap, or reliable - pick two. Bitcoin chose reliable and distributed over fast.",
          keyTakeaways: [
            "Impossible to maximize security, speed, and decentralization together",
            "Bitcoin prioritizes security and decentralization",
            "Trade-offs are necessary in system design",
            "Bitcoin's choices make it more trustworthy long-term"
          ]
        };
      }

      if (fact.title === "Lightning Fast Layer") {
        diveDeeper = {
          explanation: "Lightning Network is like an express lane built on top of Bitcoin. It allows instant payments while still using Bitcoin's security. Think of Bitcoin as the highway system and Lightning as the city streets - both work together to get you where you need to go.",
          examples: [
            "Bitcoin base layer: Perfect for large, important transactions",
            "Lightning Network: Perfect for small, everyday payments",
            "Buying a house: Use main Bitcoin network for security",
            "Buying coffee: Use Lightning Network for speed"
          ],
          visualDescription: "Lightning is like having a tab at your local coffee shop. You open the tab (Lightning channel), buy coffee instantly all month, then settle the final bill (on Bitcoin) at the end.",
          keyTakeaways: [
            "Lightning enables instant Bitcoin payments",
            "Built on top of Bitcoin's secure foundation",
            "Perfect for small, frequent transactions",
            "Combines Bitcoin's security with instant speed"
          ]
        };
      }

      // Add dive deeper for additional fact categories
      if (fact.title === "Sound Money Principles") {
        diveDeeper = {
          explanation: "Sound money maintains its value over time and encourages saving rather than spending. Unlike modern fiat currencies that lose value through inflation, sound money rewards patience and long-term thinking.",
          examples: [
            "Gold standard era: Prices remained stable for decades",
            "Modern fiat: Dollar lost 96% of value since 1913",
            "Bitcoin: Designed to appreciate as adoption grows",
            "Savings behavior: Sound money encourages saving, fiat encourages spending"
          ],
          visualDescription: "Think of sound money as a reliable measuring stick that doesn't shrink over time. If you saved money under your mattress for 20 years, it should still buy roughly the same amount of goods.",
          keyTakeaways: [
            "Sound money maintains purchasing power over time",
            "Encourages saving and long-term planning",
            "Bitcoin returns to sound money principles",
            "Protects wealth from currency debasement"
          ]
        };
      }

      if (fact.title === "Financial Sovereignty") {
        diveDeeper = {
          explanation: "Financial sovereignty means complete control over your money without depending on banks, governments, or other institutions. With Bitcoin, you can be your own bank and make financial decisions without asking permission.",
          examples: [
            "Traditional: Banks can freeze accounts during political unrest",
            "Bitcoin: Your keys, your control, regardless of politics",
            "Traditional: Government can seize assets through laws",
            "Bitcoin: Mathematical protection from seizure"
          ],
          visualDescription: "Imagine having a safe that only you know the combination to, that can't be broken into, and that works the same way everywhere in the world. That's the level of control Bitcoin provides.",
          keyTakeaways: [
            "Complete control over your financial assets",
            "No dependence on traditional financial institutions",
            "Protection from political and economic instability",
            "True ownership in the digital age"
          ]
        };
      }

      if (fact.title === "Global Currency") {
        diveDeeper = {
          explanation: "Bitcoin is the first truly global currency that works the same way everywhere. Unlike national currencies that stop at borders, Bitcoin operates on a worldwide network that treats everyone equally.",
          examples: [
            "US Dollar: Primarily useful in United States",
            "Bitcoin: Works identically in Japan, Nigeria, or Brazil",
            "Euro: Limited to European Union countries",
            "Bitcoin: Same rules and access globally"
          ],
          visualDescription: "Picture a universal language that everyone in the world can speak and understand, regardless of their native tongue. Bitcoin is like that for money - a universal financial language.",
          keyTakeaways: [
            "First currency that works identically worldwide",
            "No exchange rates or conversion needed",
            "Equal access regardless of nationality",
            "Enables truly global commerce"
          ]
        };
      }

      if (fact.title === "Only 21 Million Ever") {
        diveDeeper = {
          explanation: "Bitcoin has a strict limit of exactly 21 million coins built into its computer code. This number can never be changed without everyone agreeing, which will never happen. Regular money has no limit - governments can print as much as they want, making your money worth less.",
          examples: [
            "US Dollar: No limit - $20 trillion printed since 2008",
            "Bitcoin: Hard limit of 21 million coins forever",
            "Venezuelan Bolívar: Printed so much it became worthless",
            "Bitcoin: Cannot be inflated or devalued by printing"
          ],
          visualDescription: "Imagine if there were only 21 million rare diamonds in the entire world, and everyone knew for certain that no more could ever be created. That scarcity makes each diamond incredibly valuable.",
          keyTakeaways: [
            "Exactly 21 million Bitcoin will ever exist",
            "Computer code makes this limit unchangeable",
            "No government can print more Bitcoin",
            "Scarcity protects your money's value over time"
          ]
        };
      }

      if (fact.title === "Cutting Rewards in Half") {
        diveDeeper = {
          explanation: "Every four years, Bitcoin automatically cuts the mining reward in half. This happens like clockwork and is written into the code. It makes new Bitcoin increasingly rare over time, like turning down the water faucet that creates new coins.",
          examples: [
            "2009-2012: Miners got 50 Bitcoin every 10 minutes",
            "2012-2016: Reward cut to 25 Bitcoin every 10 minutes",
            "2016-2020: Reward cut to 12.5 Bitcoin every 10 minutes",
            "2020-2024: Current reward is 6.25 Bitcoin every 10 minutes"
          ],
          visualDescription: "Picture a magic money tree that drops fewer and fewer coins every four years. Eventually, the tree stops dropping coins completely, making all existing coins more valuable.",
          keyTakeaways: [
            "Mining rewards get cut in half every four years",
            "This makes new Bitcoin increasingly scarce",
            "The halving is automatic and unstoppable",
            "Less new supply often makes Bitcoin more valuable"
          ]
        };
      }

      if (fact.title === "Rules That Can't Change") {
        diveDeeper = {
          explanation: "Bitcoin's most important rules are protected by mathematics and thousands of computers worldwide. The 21 million limit, 10-minute blocks, and halving schedule cannot be changed unless almost everyone agrees - which is nearly impossible for fundamental rules.",
          examples: [
            "US Dollar rules: Changed by small group of Federal Reserve officials",
            "Bitcoin rules: Require agreement from thousands of participants worldwide",
            "Bank policies: Can change overnight without asking customers",
            "Bitcoin: Major changes need overwhelming global consensus"
          ],
          visualDescription: "Think of Bitcoin like a constitution protected by thousands of guardians. To change the basic rules, you'd need to convince almost all the guardians at once - nearly impossible.",
          keyTakeaways: [
            "Core rules are protected by mathematics and consensus",
            "No single person or group can change Bitcoin's basic rules",
            "21 million limit is practically unchangeable",
            "This protection makes Bitcoin trustworthy money"
          ]
        };
      }

      // Additional comprehensive diveDeeper content from frontend consolidation
      if (fact.title === "Halving Events") {
        diveDeeper = {
          explanation: "Bitcoin halving is a pre-programmed event that occurs approximately every 4 years (210,000 blocks) where the reward for mining new blocks is cut in half. This reduces the rate at which new bitcoins enter circulation.",
          examples: [
            "2012: Reward dropped from 50 BTC to 25 BTC per block",
            "2016: Reward dropped from 25 BTC to 12.5 BTC per block", 
            "2020: Reward dropped from 12.5 BTC to 6.25 BTC per block",
            "2024: Reward dropped from 6.25 BTC to 3.125 BTC per block (most recent)"
          ],
          visualDescription: "Imagine a giant digital clock counting down blocks. Every 210,000 blocks, an automated mechanism literally cuts the mining reward in half, like a factory automatically reducing production.",
          keyTakeaways: [
            "Reduces new Bitcoin supply entering the market",
            "Creates predictable scarcity timeline",
            "Often correlates with price increases due to supply shock",
            "Demonstrates Bitcoin's deflationary monetary policy"
          ]
        };
      }

      if (fact.title === "Decentralized Currency") {
        diveDeeper = {
          explanation: "Unlike traditional currencies controlled by governments and central banks, Bitcoin operates without any central authority. The network rules are enforced by mathematics and consensus among participants.",
          examples: [
            "No central bank can print more bitcoins",
            "No government can shut down the Bitcoin network",
            "Monetary policy is transparent and unchangeable",
            "Works the same way in every country"
          ],
          visualDescription: "Imagine money that operates like the internet - no single entity controls it, yet it works reliably through agreed-upon rules that everyone follows.",
          keyTakeaways: [
            "No central authority controls Bitcoin",
            "Monetary policy is fixed and transparent",
            "Resistant to government interference",
            "Global currency with consistent rules everywhere"
          ]
        };
      }

      if (fact.title === "Bitcoin Mining") {
        diveDeeper = {
          explanation: "Mining is the process by which new bitcoins are created and transactions are verified. Miners use computational power to solve complex mathematical puzzles, securing the network and earning bitcoin rewards.",
          examples: [
            "Miners compete to solve cryptographic puzzles",
            "Winner gets to add the next block and earn rewards",
            "Mining difficulty adjusts every 2016 blocks",
            "Energy consumption secures the network"
          ],
          visualDescription: "Think of mining like a global lottery where millions of computers race to solve a puzzle. The winner gets to write the next page in Bitcoin's ledger and receives newly created bitcoins as a prize.",
          keyTakeaways: [
            "Mining secures the Bitcoin network",
            "Provides economic incentives for network participation", 
            "Creates new bitcoins according to a fixed schedule",
            "Difficulty adjusts to maintain 10-minute block times"
          ]
        };
      }

      if (fact.title === "Store of Value") {
        diveDeeper = {
          explanation: "Bitcoin serves as digital gold - a way to preserve wealth over time. Its fixed supply and decentralized nature make it resistant to inflation and monetary debasement by central authorities.",
          examples: [
            "Limited supply of 21 million coins maximum",
            "Cannot be inflated away by governments",
            "Portable across borders without confiscation risk",
            "Divisible into 100 million satoshis per bitcoin"
          ],
          visualDescription: "Imagine digital gold that you can carry in your phone, send across the world instantly, and that no government can print more of or confiscate.",
          keyTakeaways: [
            "Fixed supply creates scarcity like precious metals",
            "Immune to monetary inflation",
            "Portable and divisible digital asset",
            "Censorship-resistant wealth preservation"
          ]
        };
      }

      if (fact.title === "Blockchain Technology") {
        diveDeeper = {
          explanation: "The blockchain is Bitcoin's underlying technology - a chain of blocks containing transaction data, linked and secured using cryptography. Each block references the previous one, creating an unchangeable history.",
          examples: [
            "Each block contains a hash of the previous block",
            "Tampering with any block breaks the chain",
            "All nodes verify the complete chain",
            "Longest valid chain is accepted as truth"
          ],
          visualDescription: "Picture a chain where each link contains transaction records and is mathematically connected to the previous link. Breaking any link would be obvious to everyone watching.",
          keyTakeaways: [
            "Creates immutable transaction history",
            "Uses cryptographic hashing for security",
            "Distributed across thousands of nodes",
            "Transparent and verifiable by anyone"
          ]
        };
      }

      if (fact.title === "The Blockchain") {
        diveDeeper = {
          explanation: "A blockchain is a distributed ledger that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block, creating an unchangeable chain of transaction history.",
          examples: [
            "Every 10 minutes, a new block is added to the chain",
            "Each block references the previous block's hash",
            "Thousands of computers worldwide maintain identical copies",
            "Tampering with any block would break the entire chain"
          ],
          visualDescription: "Picture a digital ledger book where each page (block) is numbered and contains a unique fingerprint of the previous page. Changing any page would immediately reveal the tampering to everyone holding a copy.",
          keyTakeaways: [
            "Creates permanent, unchangeable transaction records",
            "Distributed across thousands of computers globally",
            "Uses cryptographic hashing for security",
            "Forms the foundation of Bitcoin's trustless system"
          ]
        };
      }

      if (fact.title === "Peer-to-Peer Network") {
        diveDeeper = {
          explanation: "Bitcoin operates on a peer-to-peer network where participants (nodes) connect directly with each other without intermediaries. This creates a resilient, decentralized system where no single point of failure can bring down the entire network.",
          examples: [
            "Over 15,000 nodes worldwide verify transactions",
            "No central server that can be shut down",
            "Each node maintains a complete copy of the blockchain",
            "Transactions propagate through the network in seconds"
          ],
          visualDescription: "Imagine a global web where every computer talks directly to others, sharing information instantly. No central hub exists - if some computers go offline, the network continues operating seamlessly.",
          keyTakeaways: [
            "Eliminates single points of failure",
            "Resistant to censorship and shutdowns",
            "Enables direct value transfer between users",
            "Creates trustless interaction through consensus"
          ]
        };
      }

      if (fact.title === "Cryptographic Security") {
        diveDeeper = {
          explanation: "Bitcoin uses advanced cryptographic techniques including SHA-256 hashing and elliptic curve digital signatures to secure transactions. These mathematical proofs make it computationally impossible to forge transactions or double-spend bitcoins.",
          examples: [
            "Private keys use 256-bit cryptography",
            "Each transaction has a unique digital signature",
            "Hash functions create unique 'fingerprints' for blocks",
            "Breaking Bitcoin's crypto would require more energy than the sun produces"
          ],
          visualDescription: "Think of cryptography as unbreakable mathematical locks. Your private key is the only key that can unlock your bitcoins, and the math behind it is so complex that even all the world's computers working together couldn't crack it.",
          keyTakeaways: [
            "Uses military-grade cryptographic security",
            "Mathematically impossible to counterfeit",
            "Each transaction is cryptographically signed",
            "Security increases with network growth"
          ]
        };
      }

      if (fact.title === "Inflation Protection") {
        diveDeeper = {
          explanation: "Bitcoin's fixed supply of 21 million coins provides protection against monetary inflation. Unlike fiat currencies that central banks can print indefinitely, Bitcoin's monetary policy is set in code and cannot be changed, preserving purchasing power over time.",
          examples: [
            "US dollar lost 96% of value since 1913 due to printing",
            "Bitcoin supply increases predictably and will cap at 21M",
            "Venezuelan bolívar lost 99% value in recent hyperinflation",
            "Bitcoin holders preserve wealth during currency crises"
          ],
          visualDescription: "Imagine a currency where the total amount is written in stone and can never be changed. While governments print more money and dilute value, Bitcoin remains mathematically scarce forever.",
          keyTakeaways: [
            "Fixed supply prevents monetary debasement",
            "Shields wealth from central bank policies",
            "Predictable monetary policy built into code",
            "Historical hedge against currency crises"
          ]
        };
      }

      if (fact.title === "24/7 Global Access") {
        diveDeeper = {
          explanation: "Bitcoin operates 24/7/365 without holidays, weekends, or banking hours. The network never sleeps, allowing instant global transactions at any time. This provides unprecedented access to financial services regardless of geography or time zones.",
          examples: [
            "Send money to Japan at 3 AM on Christmas",
            "Receive payments during bank holidays",
            "Access your funds from anywhere with internet",
            "No waiting for Monday morning to open accounts"
          ],
          visualDescription: "Picture a global ATM that's always open, in every country, that speaks every language and never closes for maintenance or holidays. That's Bitcoin's accessibility.",
          keyTakeaways: [
            "Never closes or goes offline",
            "Global access from any internet connection",
            "No geographical restrictions or borders",
            "Immediate settlement without waiting periods"
          ]
        };
      }

      if (fact.title === "No Censorship") {
        diveDeeper = {
          explanation: "Bitcoin transactions cannot be censored, reversed, or blocked by any authority. Once a transaction is included in the blockchain, it becomes permanent and irreversible. This provides true financial sovereignty and protection from authoritarian control.",
          examples: [
            "Journalists receiving donations in restrictive countries",
            "Protesters fundraising despite government opposition",
            "Businesses operating despite payment processor bans",
            "Individuals preserving wealth during capital controls"
          ],
          visualDescription: "Imagine money that works like cash but digitally - no one can stop you from spending it, no authority can freeze it, and no intermediary can block your transactions.",
          keyTakeaways: [
            "Transactions cannot be reversed or blocked",
            "No central authority can freeze accounts",
            "Enables free speech through financial freedom",
            "Protects against authoritarian monetary control"
          ]
        };
      }

      if (fact.title === "Proof of Work") {
        diveDeeper = {
          explanation: "Proof of Work is Bitcoin's consensus mechanism where miners compete to solve computational puzzles, proving they've expended real energy. This creates objective consensus without requiring trust in any central authority, making the network extremely secure.",
          examples: [
            "Miners spend electricity to earn the right to add blocks",
            "Network automatically adjusts difficulty every 2016 blocks",
            "Attacking Bitcoin would cost billions in energy",
            "More mining power means more network security"
          ],
          visualDescription: "Think of Proof of Work like a global lottery where buying tickets costs real electricity. The more tickets (computational work) you buy, the better chance of winning, but everyone can verify the winner is legitimate.",
          keyTakeaways: [
            "Secures network through energy expenditure",
            "Creates objective consensus without trust",
            "Makes attacks prohibitively expensive",
            "Difficulty adjusts to maintain security"
          ]
        };
      }

      if (fact.title === "Network Difficulty") {
        diveDeeper = {
          explanation: "Bitcoin's network difficulty automatically adjusts every 2,016 blocks (approximately two weeks) to maintain a consistent 10-minute average block time. This self-regulating mechanism ensures Bitcoin's predictable supply schedule regardless of mining participation.",
          examples: [
            "If more miners join, difficulty increases to slow down blocks",
            "If miners leave, difficulty decreases to speed up blocks",
            "Maintains 10-minute average regardless of hash rate",
            "Ensures predictable 21 million coin supply schedule"
          ],
          visualDescription: "Imagine a smart puzzle that automatically becomes harder when more people are solving it and easier when fewer people participate, always keeping the solution time at exactly 10 minutes.",
          keyTakeaways: [
            "Automatically maintains 10-minute block times",
            "Adjusts every 2,016 blocks (~2 weeks)",
            "Ensures predictable Bitcoin issuance",
            "Self-regulates regardless of mining participation"
          ]
        };
      }

      if (fact.title === "Bitcoin Wallets") {
        diveDeeper = {
          explanation: "Bitcoin wallets don't actually store Bitcoin - they store the private keys that control your Bitcoin on the blockchain. Think of wallets as key managers that prove ownership and enable spending of your Bitcoin.",
          examples: [
            "Hardware wallets store keys offline for security",
            "Mobile wallets enable convenient daily transactions",
            "Paper wallets are physical printouts of private keys",
            "Multi-signature wallets require multiple keys to spend"
          ],
          visualDescription: "A Bitcoin wallet is like a digital keychain that holds the cryptographic keys to your Bitcoin safe deposit boxes on the blockchain. The Bitcoin stays in the boxes; the wallet just holds your keys.",
          keyTakeaways: [
            "Wallets store private keys, not Bitcoin itself",
            "Different wallet types serve different security needs",
            "Private key ownership equals Bitcoin ownership",
            "Multiple wallet options provide flexibility"
          ]
        };
      }

      if (fact.title === "Private Keys") {
        diveDeeper = {
          explanation: "Private keys are secret 256-bit numbers that mathematically control your Bitcoin. They generate public keys and addresses, enable transaction signing, and provide ultimate ownership proof. Losing private keys means losing Bitcoin forever.",
          examples: [
            "Each private key controls specific Bitcoin addresses",
            "Private keys create unforgeable digital signatures",
            "Lost keys mean permanently lost Bitcoin",
            "12-24 word seed phrases back up private keys"
          ],
          visualDescription: "Think of a private key as the master key to an unbreakable digital safe. Anyone with this key can open the safe and take everything inside, but without it, the contents are lost forever.",
          keyTakeaways: [
            "Private keys provide absolute Bitcoin control",
            "Losing keys means losing Bitcoin permanently",
            "Never share private keys with anyone",
            "Secure backup is essential for recovery"
          ]
        };
      }

      if (fact.title === "Not Your Keys, Not Your Coins") {
        diveDeeper = {
          explanation: "This fundamental Bitcoin principle means that without controlling the private keys, you don't truly own your Bitcoin. Exchanges, custodial services, and third parties that hold your keys can freeze, seize, or lose your Bitcoin.",
          examples: [
            "Exchange bankruptcies resulting in lost customer funds",
            "Governments seizing exchange-held Bitcoin",
            "Frozen accounts preventing Bitcoin access",
            "Self-custody providing true ownership"
          ],
          visualDescription: "It's like keeping your gold in someone else's vault versus your own safe. You might have a receipt saying it's yours, but until you control the keys to your own safe, you're trusting others with your wealth.",
          keyTakeaways: [
            "True ownership requires private key control",
            "Third-party custody introduces counterparty risk",
            "Self-custody provides maximum security",
            "Exchanges are for trading, not long-term storage"
          ]
        };
      }

      if (fact.title === "How Transactions Work") {
        diveDeeper = {
          explanation: "Bitcoin transactions transfer value by spending previous transaction outputs. Each transaction is digitally signed with private keys, broadcast to the network, verified by nodes, and permanently recorded on the blockchain by miners.",
          examples: [
            "Alice signs a transaction spending her Bitcoin to Bob",
            "Network nodes verify Alice owns the Bitcoin",
            "Miners include the transaction in a new block",
            "Transaction becomes permanent after confirmation"
          ],
          visualDescription: "Imagine writing a digital check that instantly proves you have the money, can't be forged, and gets recorded in a global ledger that everyone can verify but no one can change.",
          keyTakeaways: [
            "Transactions transfer ownership through digital signatures",
            "Network verification ensures validity",
            "Blockchain provides permanent transaction record",
            "Process eliminates need for trusted intermediaries"
          ]
        };
      }

      if (fact.title === "Transaction Fees") {
        diveDeeper = {
          explanation: "Bitcoin transaction fees compensate miners for including transactions in blocks. Users can choose fee levels - higher fees get faster confirmation during busy periods, while lower fees may take longer but cost less.",
          examples: [
            "High fees during network congestion ensure fast confirmation",
            "Low fees during quiet periods save money",
            "Fee markets create economic efficiency",
            "Lightning Network enables ultra-low fee transactions"
          ],
          visualDescription: "Think of transaction fees like express mail pricing - you can pay more for faster delivery or pay less and wait longer. The network automatically processes highest-fee transactions first.",
          keyTakeaways: [
            "Fees incentivize miners to process transactions",
            "Users control fee levels based on urgency",
            "Fee markets create network efficiency",
            "Higher fees generally mean faster confirmation"
          ]
        };
      }

      if (fact.title === "Confirmation Times") {
        diveDeeper = {
          explanation: "Bitcoin confirmations represent how many blocks have been added after your transaction's block. Each confirmation exponentially reduces the risk of transaction reversal, with 6 confirmations considered fully secure for large amounts.",
          examples: [
            "1 confirmation: Transaction in latest block",
            "3 confirmations: Very unlikely to reverse",
            "6 confirmations: Considered fully final",
            "Zero-confirmation: Transaction broadcast but not mined"
          ],
          visualDescription: "Imagine each confirmation as another layer of concrete poured over your transaction. After 6 layers, it would take enormous effort to dig it up and change it.",
          keyTakeaways: [
            "More confirmations mean higher security",
            "6 confirmations considered fully secure",
            "Confirmation time varies with network congestion",
            "Large amounts should wait for multiple confirmations"
          ]
        };
      }

      if (fact.title === "Bitcoin Halving") {
        diveDeeper = {
          explanation: "Every 210,000 blocks (approximately 4 years), Bitcoin's mining reward is cut in half. This programmed scarcity reduces new Bitcoin supply over time, making existing Bitcoin more scarce and potentially more valuable.",
          examples: [
            "2009-2012: 50 BTC reward per block",
            "2012-2016: 25 BTC reward per block",
            "2016-2020: 12.5 BTC reward per block",
            "2020-2024: 6.25 BTC reward per block"
          ],
          visualDescription: "Imagine a gold mine that automatically produces half as much gold every four years. As production slows, existing gold becomes increasingly rare and valuable.",
          keyTakeaways: [
            "Occurs every 210,000 blocks (~4 years)",
            "Reduces new Bitcoin supply by 50%",
            "Creates increasing scarcity over time",
            "Built into Bitcoin's code and unchangeable"
          ]
        };
      }

      if (fact.title === "Fixed Supply Schedule") {
        diveDeeper = {
          explanation: "Bitcoin's monetary policy is completely predictable and unchangeable. New bitcoins are created on a fixed schedule that will result in exactly 21 million total bitcoins by approximately 2140, after which no new bitcoins will ever be created.",
          examples: [
            "Current supply increases by ~6.25 BTC every 10 minutes",
            "Supply growth rate decreases with each halving",
            "Final bitcoin will be mined around year 2140",
            "No central authority can change this schedule"
          ],
          visualDescription: "Picture a vending machine programmed to release coins on a fixed schedule that slows down over time until it's completely empty. No one can reprogram it or add more coins - ever.",
          keyTakeaways: [
            "Exactly 21 million bitcoins will ever exist",
            "Supply schedule is coded and unchangeable",
            "Predictable scarcity increases over time",
            "No inflation possible after 2140"
          ]
        };
      }

      if (fact.title === "Fiat Currency Problems") {
        diveDeeper = {
          explanation: "Fiat currencies are backed only by government decree and can be printed infinitely, leading to inflation and currency debasement. Historical data shows all fiat currencies eventually lose significant value or collapse entirely.",
          examples: [
            "US dollar lost 96% purchasing power since 1913",
            "Weimar Germany hyperinflation destroyed savings",
            "Venezuelan bolívar lost 99% value in recent years",
            "Over 3,000 fiat currencies have failed throughout history"
          ],
          visualDescription: "Imagine a currency where the government can photocopy money whenever it wants. Each copy reduces the value of every existing bill in your wallet.",
          keyTakeaways: [
            "Fiat currencies inevitably lose purchasing power",
            "Inflation is a hidden tax on savers",
            "Money printing benefits insiders at public expense",
            "Historical precedent shows fiat currencies fail"
          ]
        };
      }

      if (fact.title === "Digital Scarcity") {
        diveDeeper = {
          explanation: "Bitcoin achieves true digital scarcity for the first time in history. Unlike digital files that can be copied endlessly, Bitcoin uses cryptographic proof and network consensus to ensure each bitcoin exists only once and cannot be duplicated.",
          examples: [
            "Music files can be copied infinitely without cost",
            "Bitcoin transactions require cryptographic proof",
            "Double-spending is mathematically impossible",
            "Network consensus prevents counterfeiting"
          ],
          visualDescription: "Think of digital scarcity like having the only copy of a digital painting that can never be duplicated, even though it exists in digital form.",
          keyTakeaways: [
            "First truly scarce digital asset in history",
            "Mathematical proof prevents duplication",
            "Network consensus ensures uniqueness",
            "Creates digital property rights"
          ]
        };
      }

      if (fact.title === "Banking Intermediaries") {
        diveDeeper = {
          explanation: "Traditional banking requires trusted intermediaries to facilitate transactions and maintain accounts. Bitcoin eliminates this need through cryptographic proof and decentralized consensus, removing counterparty risk and enabling true peer-to-peer value transfer.",
          examples: [
            "Banks can freeze or close accounts arbitrarily",
            "Wire transfers require multiple intermediary banks",
            "Banking hours limit when you can access money",
            "Bitcoin works 24/7 without permission from anyone"
          ],
          visualDescription: "Imagine being able to hand cash directly to someone across the world instantly, without needing any banks or intermediaries to facilitate the transfer.",
          keyTakeaways: [
            "Eliminates need for trusted third parties",
            "Reduces counterparty risk significantly",
            "Enables true peer-to-peer transactions",
            "Removes single points of failure"
          ]
        };
      }

      if (fact.title === "Lightning Network") {
        diveDeeper = {
          explanation: "The Lightning Network is a second-layer solution built on top of Bitcoin that enables instant, low-cost transactions. It uses payment channels to allow users to transact directly without waiting for blockchain confirmations.",
          examples: [
            "Instant payments for coffee purchases",
            "Micropayments as small as fractions of a penny",
            "Cross-border remittances in seconds",
            "Streaming payments for content consumption"
          ],
          visualDescription: "Think of Lightning like a tab you run with someone - you can make many small transactions instantly, and only settle the final balance on the main Bitcoin blockchain when you're done.",
          keyTakeaways: [
            "Enables instant Bitcoin transactions",
            "Dramatically reduces transaction fees",
            "Maintains Bitcoin's security guarantees",
            "Scales Bitcoin for everyday purchases"
          ]
        };
      }

      if (fact.title === "Financial Sovereignty") {
        diveDeeper = {
          explanation: "Financial sovereignty means having complete control over your money without relying on banks, governments, or other institutions. Bitcoin provides this through self-custody, where you alone control your private keys and therefore your wealth.",
          examples: [
            "No need for bank permission to access your money",
            "Protection from government capital controls",
            "Ability to transact globally without restrictions",
            "Complete ownership independent of third parties"
          ],
          visualDescription: "Imagine having a personal vault that only you can open, that works anywhere in the world, and that no authority can seize or freeze.",
          keyTakeaways: [
            "Complete control over your financial assets",
            "Independence from traditional banking system",
            "Protection from institutional failures",
            "True ownership through private key control"
          ]
        };
      }

      if (fact.title === "Sound Money Principles") {
        diveDeeper = {
          explanation: "Sound money holds its value over time and can't be created out of thin air. Bitcoin follows these principles by having a fixed supply that can't be increased, unlike regular money that governments can print whenever they want.",
          examples: [
            "Gold was sound money because it was scarce and hard to find",
            "Paper money started backed by gold but governments removed that backing",
            "Bitcoin brings back sound money with mathematics instead of promises",
            "Only 21 million bitcoins will ever exist, making it truly scarce"
          ],
          visualDescription: "Think of sound money like a measuring stick that never changes length. You can always count on it to measure value fairly, unlike a rubber ruler that stretches and shrinks.",
          keyTakeaways: [
            "Sound money keeps its value over long periods",
            "Bitcoin returns to sound money principles",
            "Fixed supply prevents value dilution",
            "Mathematics replaces human promises"
          ]
        };
      }

      if (fact.title === "Global Currency") {
        diveDeeper = {
          explanation: "Bitcoin works exactly the same way in every country around the world. Unlike local currencies that change when you cross borders, Bitcoin is universal money that everyone can use regardless of where they live.",
          examples: [
            "Send money from America to Japan instantly with same rules",
            "No exchange rates or conversion fees between countries",
            "Works in countries with unstable local currencies",
            "Poor people in any country can access same financial system"
          ],
          visualDescription: "Imagine having one type of money that works everywhere on Earth, like having a universal language that everyone understands regardless of their native tongue.",
          keyTakeaways: [
            "Same rules and features work everywhere",
            "No borders or geographic restrictions",
            "Eliminates currency exchange complications",
            "Provides financial access to everyone globally"
          ]
        };
      }

      if (fact.title === "Bitcoin is Limited") {
        diveDeeper = {
          explanation: "Bitcoin has a hard limit of 21 million coins that can never be changed. This is written into Bitcoin's code and protected by thousands of computers worldwide. Unlike regular money where governments can print more anytime, Bitcoin's limit cannot be increased.",
          examples: [
            "Regular money: Governments printed trillions during COVID",
            "Bitcoin: Only 21 million will ever exist, no exceptions",
            "Baseball cards: Limited edition cards are worth more",
            "Bitcoin: Scarcity built into the system makes it valuable"
          ],
          visualDescription: "Think of Bitcoin like a limited edition collectible where only 21 million pieces will ever be made, and the factory that makes them will shut down forever when they reach that number.",
          keyTakeaways: [
            "Maximum 21 million bitcoins will ever exist",
            "This limit is unchangeable and permanent",
            "Scarcity makes Bitcoin different from regular money",
            "No central authority can create more bitcoins"
          ]
        };
      }

      if (fact.title === "You Own Your Bitcoin") {
        diveDeeper = {
          explanation: "When you control your Bitcoin properly, it's truly yours in a way that bank money isn't. Banks can freeze accounts, governments can seize assets, but nobody can take Bitcoin that you control with your private keys.",
          examples: [
            "Bank account: Bank can freeze it anytime",
            "Bitcoin: Only you can move it with your private key",
            "Cash in hand: Yours to spend freely",
            "Bitcoin in your wallet: Digital version of cash in hand"
          ],
          visualDescription: "Imagine having money that works like cash in your physical wallet, but digital. Just like no one can take cash from your pocket without your permission, no one can take properly stored Bitcoin without your private key.",
          keyTakeaways: [
            "True ownership means you control the private keys",
            "No bank or government can freeze your Bitcoin",
            "Your Bitcoin is like digital cash you carry",
            "Ownership comes with responsibility for security"
          ]
        };
      }

      if (fact.title === "The Shared Notebook") {
        diveDeeper = {
          explanation: "The Bitcoin blockchain is like a giant notebook that everyone in the world can read, but no one can erase or change what's already written. Every Bitcoin transaction gets recorded in this notebook, creating a permanent history that everyone can verify.",
          examples: [
            "Traditional ledger: Only the bank can see and control it",
            "Bitcoin blockchain: Everyone can see every transaction",
            "School gradebook: Only teacher can change grades",
            "Bitcoin records: No one can change past transactions"
          ],
          visualDescription: "Picture a massive library where every transaction is written in permanent ink in books that thousands of librarians around the world keep identical copies of. If someone tries to change one book, everyone else can see it doesn't match.",
          keyTakeaways: [
            "All Bitcoin transactions are publicly recorded",
            "Past transactions cannot be changed or deleted",
            "Thousands of computers verify the records",
            "Transparency prevents fraud and cheating"
          ]
        };
      }

      if (fact.title === "No Middleman Needed") {
        diveDeeper = {
          explanation: "Bitcoin allows you to send value directly to another person without needing a bank, payment company, or government to approve it. This peer-to-peer system works through mathematical proof instead of trusted institutions.",
          examples: [
            "Sending cash: Hand it directly to someone",
            "Bank transfer: Bank must approve and process it",
            "Bitcoin: Send directly without asking permission",
            "Email: Send messages directly to anyone worldwide"
          ],
          visualDescription: "Think of Bitcoin like being able to hand cash directly to someone on the other side of the world instantly, without needing any postal service, bank, or middleman to deliver it for you.",
          keyTakeaways: [
            "Direct person-to-person value transfer",
            "No banks or institutions needed",
            "Operates through mathematical proof",
            "Eliminates censorship and control points"
          ]
        };
      }

      if (fact.title === "Super Secure Math") {
        diveDeeper = {
          explanation: "Bitcoin uses the same type of math codes that protect military secrets and online banking. These codes are so strong that even the world's most powerful computers working together for millions of years couldn't break them.",
          examples: [
            "Your online banking uses similar math for security",
            "Military communications use this type of encryption",
            "Bitcoin private keys are harder to guess than lottery numbers",
            "Breaking Bitcoin's math would require more energy than the sun produces"
          ],
          visualDescription: "Imagine a lock so complex that you would need to try every possible key in the universe, and even then it would take longer than the age of the universe to find the right one.",
          keyTakeaways: [
            "Uses military-grade mathematical security",
            "Practically impossible to hack or break",
            "Same security technology banks and governments use",
            "Gets stronger as computers get more powerful"
          ]
        };
      }

      if (fact.title === "Your Money Keeps Its Value") {
        diveDeeper = {
          explanation: "Regular money loses buying power when governments print more of it. It's like adding water to juice - the more you add, the weaker it gets. Bitcoin can't be 'watered down' because no one can make more than the 21 million limit.",
          examples: [
            "1913: A dollar could buy what $30 buys today",
            "2020: Governments printed trillions, reducing money's value",
            "Bitcoin: Fixed supply means no value dilution",
            "Gold: Used to keep value, but governments can find more"
          ],
          visualDescription: "Think of value like juice concentrate. Regular money gets watered down over time, making it weaker. Bitcoin is like concentrate that can never be diluted - it stays strong.",
          keyTakeaways: [
            "Fixed supply protects against value loss",
            "Government money printing reduces purchasing power",
            "Bitcoin's mathematical limit preserves value",
            "Scarcity tends to increase value over time"
          ]
        };
      }

      if (fact.title === "Always Open") {
        diveDeeper = {
          explanation: "Bitcoin never closes, takes holidays, or goes offline for maintenance. While banks close on weekends and holidays, Bitcoin works 24 hours a day, 7 days a week, 365 days a year, anywhere in the world.",
          examples: [
            "Banks: Closed evenings, weekends, and holidays",
            "Bitcoin: Works at 3 AM on Christmas Day",
            "International transfers: Can take days through banks",
            "Bitcoin: Arrives in minutes any time of day"
          ],
          visualDescription: "Imagine a store that never closes its doors - not for lunch, not for holidays, not even for blizzards. That's how Bitcoin operates, always ready to serve anyone, anytime.",
          keyTakeaways: [
            "Operates 24/7 without interruption",
            "No banking hours or holiday closures",
            "Global access from any internet connection",
            "Always available when you need it"
          ]
        };
      }

      if (fact.title === "Nobody Can Stop You") {
        diveDeeper = {
          explanation: "Bitcoin transactions can't be blocked, reversed, or censored by anyone. Once you send Bitcoin, it's final - no bank can stop it, no government can reverse it, and no company can freeze it.",
          examples: [
            "Banks can deny wire transfers for any reason",
            "Payment companies can shut down accounts",
            "Governments can freeze assets during conflicts",
            "Bitcoin transactions proceed regardless of politics"
          ],
          visualDescription: "It's like having unstoppable money - once you decide to send it, nothing in the world can prevent it from reaching its destination, just like dropping a letter in the mail that no one can intercept.",
          keyTakeaways: [
            "Transactions cannot be censored or stopped",
            "No authority can reverse completed payments",
            "Provides financial freedom from interference",
            "Works regardless of political situations"
          ]
        };
      }

      if (fact.title === "Digital Puzzle Solving") {
        diveDeeper = {
          explanation: "Bitcoin mining is like a worldwide puzzle contest where computers race to solve math problems. The winner gets to add new transactions to Bitcoin's record book and earns some new bitcoins as a prize.",
          examples: [
            "Sudoku puzzle: Requires work to solve, easy to verify",
            "Bitcoin puzzle: Requires computer work, easy to check",
            "Lottery: Random winner, but everyone can see the result",
            "Mining: Computer lottery with verifiable math work"
          ],
          visualDescription: "Imagine millions of computers worldwide racing to solve a giant math puzzle every 10 minutes. The first to solve it wins the right to write the next page in Bitcoin's history book.",
          keyTakeaways: [
            "Computers compete to solve mathematical puzzles",
            "Winners get to record transactions and earn Bitcoin",
            "Process secures the network through work",
            "Anyone can verify the solutions are correct"
          ]
        };
      }

      if (fact.title === "Earning Your Bitcoin") {
        diveDeeper = {
          explanation: "People who help secure the Bitcoin network by running mining computers earn new bitcoins as a reward. This is how new bitcoins enter the world - they're given to people who contribute computer power to keep the system safe.",
          examples: [
            "Gold mining: Dig up gold from the ground with work",
            "Bitcoin mining: Earn bitcoins by solving computer puzzles",
            "Security guard: Get paid to protect something valuable",
            "Bitcoin miner: Get paid to protect the Bitcoin network"
          ],
          visualDescription: "Think of Bitcoin miners like digital security guards who get paid in brand new bitcoins for keeping the network safe and processing everyone's transactions.",
          keyTakeaways: [
            "Mining creates new bitcoins as rewards",
            "Miners earn bitcoin by securing the network",
            "This is how new bitcoins enter circulation",
            "Mining provides economic incentive for security"
          ]
        };
      }

      if (fact.title === "Keeps Getting Harder") {
        diveDeeper = {
          explanation: "Bitcoin automatically adjusts how hard the puzzles are to keep blocks coming every 10 minutes. If more miners join, the puzzles get harder. If miners leave, they get easier. This keeps Bitcoin running smoothly no matter what.",
          examples: [
            "Video game: Gets harder as you get better at it",
            "Bitcoin: Gets harder as more miners join",
            "Traffic light: Changes timing based on traffic volume",
            "Mining difficulty: Changes based on total mining power"
          ],
          visualDescription: "Imagine a smart video game that automatically adjusts difficulty so levels always take exactly 10 minutes to complete, regardless of how many players are playing.",
          keyTakeaways: [
            "Difficulty adjusts every 2,016 blocks",
            "Maintains steady 10-minute block times",
            "More miners means higher difficulty",
            "Self-regulating system needs no human control"
          ]
        };
      }

      if (fact.title === "Your Digital Wallet") {
        diveDeeper = {
          explanation: "A Bitcoin wallet is like a digital keychain that holds the secret codes needed to spend your Bitcoin. The Bitcoin itself stays recorded on the blockchain, but your wallet holds the keys that prove you own it.",
          examples: [
            "Physical wallet: Holds cash and cards",
            "Bitcoin wallet: Holds private keys, not actual coins",
            "Car keys: Prove you can use the car",
            "Bitcoin keys: Prove you can spend the Bitcoin"
          ],
          visualDescription: "Think of a Bitcoin wallet like a keychain with secret keys to digital safe deposit boxes. The money stays in the boxes (blockchain), but you need the keys (wallet) to open them.",
          keyTakeaways: [
            "Wallets store private keys, not Bitcoin itself",
            "Different wallet types for different needs",
            "Private keys prove ownership of Bitcoin",
            "Lose the keys, lose access to Bitcoin forever"
          ]
        };
      }

      if (fact.title === "Your Secret Code") {
        diveDeeper = {
          explanation: "Your private key is like the secret password to your Bitcoin. It's a super long number that only you should know. Anyone who gets this number can spend your Bitcoin, so keeping it secret and safe is extremely important.",
          examples: [
            "Bank PIN: Short secret number for your account",
            "Private key: Super long secret number for Bitcoin",
            "House key: Only you should have a copy",
            "Private key: Only you should know the number"
          ],
          visualDescription: "Imagine your private key like the world's longest, most complex password that unlocks your digital treasure chest. Anyone who gets this password can take everything inside.",
          keyTakeaways: [
            "Private keys control your Bitcoin completely",
            "Never share your private key with anyone",
            "Lost private keys mean lost Bitcoin forever",
            "Write down backup words in safe place"
          ]
        };
      }

      if (fact.title === "You Must Control Your Key") {
        diveDeeper = {
          explanation: "If someone else holds your private key, they really control your Bitcoin, not you. This is why it's important to use wallets where you control the keys rather than leaving Bitcoin on exchanges or other services.",
          examples: [
            "Hotel safe: Hotel has backup code to your valuables",
            "Exchange wallet: Exchange controls your Bitcoin",
            "Personal safe: Only you have the combination",
            "Self-custody wallet: Only you control the keys"
          ],
          visualDescription: "It's like the difference between keeping money in your own safe versus someone else's safe. Even if they promise it's yours, they still have the keys to open it.",
          keyTakeaways: [
            "True ownership requires private key control",
            "Exchanges and services can freeze your funds",
            "Self-custody provides maximum security",
            "Your keys, your coins - their keys, their coins"
          ]
        };
      }

      // Continue with the remaining 40+ fact titles systematically

      if (fact.title === "How to Send Bitcoin") {
        diveDeeper = {
          explanation: "Sending Bitcoin is like sending a digital package that needs the right address and enough postage. You enter the recipient's Bitcoin address, choose how much to send, set the fee level, and broadcast it to the network.",
          examples: [
            "Email: Need correct email address to deliver message",
            "Bitcoin: Need correct Bitcoin address to send payment",
            "Mailing package: Higher shipping cost for faster delivery",
            "Bitcoin fee: Higher fee for faster confirmation"
          ],
          visualDescription: "Think of sending Bitcoin like mailing a valuable package - you need the exact address, proper postage, and once it's sent, you can track its delivery but can't change the destination.",
          keyTakeaways: [
            "Recipient's Bitcoin address must be exactly correct",
            "Transaction fees determine confirmation speed",
            "Transactions are irreversible once sent",
            "Network confirms transactions through mining"
          ]
        };
      }

      if (fact.title === "Paying the Network") {
        diveDeeper = {
          explanation: "Bitcoin transaction fees pay the miners who process your transaction and add it to the blockchain. Higher fees incentivize miners to include your transaction faster, while lower fees might take longer during busy periods.",
          examples: [
            "Express shipping: Pay more for faster delivery",
            "Bitcoin fees: Pay more for faster confirmation",
            "Tip at restaurant: Better service with higher tip",
            "Miner priority: Higher fees get processed first"
          ],
          visualDescription: "Imagine transaction fees like tipping delivery drivers - tip more and your package gets priority delivery, tip less and it arrives when the driver has time.",
          keyTakeaways: [
            "Fees incentivize miners to process transactions",
            "Higher fees typically mean faster confirmation",
            "Fee market creates efficient priority system",
            "You control how much fee to pay"
          ]
        };
      }

      if (fact.title === "Waiting for Confirmation") {
        diveDeeper = {
          explanation: "Bitcoin confirmations are like layers of security on your transaction. Each confirmation means another block has been added on top of yours, making it exponentially harder to reverse. Most people wait for 1-6 confirmations depending on the amount.",
          examples: [
            "Concrete layers: Each layer makes foundation stronger",
            "Bitcoin confirmations: Each block makes transaction more secure",
            "Committee vote: More votes make decision more final",
            "Blockchain consensus: More confirmations mean more certainty"
          ],
          visualDescription: "Think of confirmations like burying a time capsule deeper underground - with each shovel of dirt (new block), it becomes exponentially harder for someone to dig it up and change it.",
          keyTakeaways: [
            "More confirmations mean higher security",
            "6 confirmations considered very secure",
            "First confirmation usually sufficient for small amounts",
            "Large amounts should wait for multiple confirmations"
          ]
        };
      }

      if (fact.title === "The Great Halving") {
        diveDeeper = {
          explanation: "Every 210,000 blocks (about 4 years), Bitcoin automatically cuts the mining reward in half. This programmed scarcity reduces the rate of new Bitcoin creation, making existing Bitcoin more scarce over time.",
          examples: [
            "Gold mine: Produces less gold as easier deposits run out",
            "Bitcoin halving: Produces fewer new bitcoins every 4 years",
            "Limited edition: Fewer copies made means higher value",
            "Bitcoin scarcity: Fewer new coins means increased rarity"
          ],
          visualDescription: "Imagine a magic money printer that automatically cuts its printing speed in half every four years until it eventually stops forever - that's how Bitcoin's supply works.",
          keyTakeaways: [
            "Occurs every 210,000 blocks (~4 years)",
            "Reduces new Bitcoin supply by 50%",
            "Built into Bitcoin's code and unchangeable",
            "Creates increasing scarcity over time"
          ]
        };
      }

      if (fact.title === "No More After 21 Million") {
        diveDeeper = {
          explanation: "Bitcoin has a hard-coded limit of exactly 21 million coins. Once all are mined (around 2140), no new bitcoins will ever be created. This makes Bitcoin the first money in history with a truly fixed, unchangeable supply limit.",
          examples: [
            "Limited edition collectibles: Only X amount ever made",
            "Bitcoin: Only 21 million will ever exist",
            "Gold: New mines can always be discovered",
            "Bitcoin: Mathematical limit cannot be exceeded"
          ],
          visualDescription: "Think of Bitcoin like a master artist who will only ever create 21 million paintings - once the last one is finished, no more will ever be made, making each one increasingly precious.",
          keyTakeaways: [
            "Exactly 21 million maximum forever",
            "No central authority can change this limit",
            "Final bitcoin mined around year 2140",
            "Creates ultimate scarcity in digital form"
          ]
        };
      }

      // Add the critical missing ones that users are testing right now

      if (fact.title === "Saves Your Money's Value") {
        diveDeeper = {
          explanation: "While regular money loses buying power through inflation, Bitcoin's fixed supply helps preserve value over time. When governments print more money, each dollar becomes worth less. Bitcoin can't be printed, so it maintains purchasing power better.",
          examples: [
            "1970s: Gas cost 50 cents, now costs $4 (inflation)",
            "Bitcoin 2010: $0.10, 2024: $50,000+ (deflation)",
            "Savings account: Loses value to inflation",
            "Bitcoin savings: Tends to gain value over time"
          ],
          visualDescription: "Think of Bitcoin as a life preserver that keeps your wealth from sinking in the ocean of inflation that drowns regular money over time.",
          keyTakeaways: [
            "Fixed supply protects against monetary inflation",
            "Historical trend shows value preservation",
            "Deflationary asset in inflationary world",
            "Long-term store of value properties"
          ]
        };
      }

      if (fact.title === "Regular Money Loses Value") {
        diveDeeper = {
          explanation: "When governments print more money, each existing dollar becomes worth less. This hidden tax on savers has reduced the dollar's purchasing power by 96% since 1913. Bitcoin cannot be inflated away because no one can create more.",
          examples: [
            "1950s: Movie ticket cost 50 cents, now $15",
            "1980s: House cost $50,000, now $500,000",
            "2020: Government printed $6 trillion in one year",
            "Bitcoin: Same 21 million limit since day one"
          ],
          visualDescription: "Imagine regular money as ice cubes that slowly melt away, while Bitcoin is like a diamond that stays solid and valuable forever.",
          keyTakeaways: [
            "Money printing dilutes value of existing money",
            "Inflation is a hidden tax on savers",
            "96% of dollar's value lost since 1913",
            "Bitcoin's fixed supply prevents this problem"
          ]
        };
      }

      if (fact.title === "Banks Control Your Money") {
        diveDeeper = {
          explanation: "Traditional banks can freeze accounts, limit withdrawals, charge fees, and even lose your money. You need their permission for many transactions. Bitcoin removes this control, giving you direct ownership like having cash in your pocket.",
          examples: [
            "Bank holidays: Can't access your money",
            "Account freezing: Bank decides you can't spend",
            "Wire limits: Bank controls how much you can send",
            "Bitcoin: Available 24/7 with no permission needed"
          ],
          visualDescription: "Banks are like having a strict parent control your allowance, while Bitcoin is like having your own money that you can spend however and whenever you want.",
          keyTakeaways: [
            "Banks have ultimate control over 'your' money",
            "Bitcoin eliminates need for banking permission",
            "Self-custody means true ownership",
            "No third party can freeze or limit Bitcoin"
          ]
        };
      }

      if (fact.title === "Bitcoin Helps Everyone") {
        diveDeeper = {
          explanation: "Bitcoin provides financial services to anyone with internet access, regardless of credit score, bank account, or geographic location. It's especially helpful for people in countries with unstable currencies or restrictive banking systems.",
          examples: [
            "Unbanked populations: Can use Bitcoin without bank account",
            "Remittances: Send money across borders without Western Union",
            "Hyperinflation: Protect savings when local currency fails",
            "Financial censorship: Access money when banks won't serve you"
          ],
          visualDescription: "Bitcoin is like a financial lifeline thrown to anyone drowning in the limitations of traditional banking, regardless of who they are or where they live.",
          keyTakeaways: [
            "Provides financial inclusion globally",
            "No discrimination based on location or status",
            "Especially valuable in unstable economies",
            "Empowers individuals over institutions"
          ]
        };
      }

      // Add all remaining critical facts that users are actively testing

      if (fact.title === "Bitcoin Transactions are Simple") {
        diveDeeper = {
          explanation: "Bitcoin transactions contain just the essential information: sender, receiver, amount, and digital signature. This simplicity makes them easy to verify, process quickly, and understand clearly without complex banking paperwork.",
          examples: [
            "Bank transfer: Requires forms, approvals, intermediaries",
            "Bitcoin: Just address, amount, and digital signature",
            "Writing a check: Fill out multiple fields and information",
            "Bitcoin: Simple digital equivalent of handing cash"
          ],
          visualDescription: "Think of Bitcoin transactions like digital cash handovers - just 'from me to you, this amount, signed' - no complicated forms or middleman approvals needed.",
          keyTakeaways: [
            "Transactions contain only essential information",
            "No complex paperwork or approvals needed",
            "Easy to verify and understand",
            "Simplicity enables global accessibility"
          ]
        };
      }

      if (fact.title === "Paying to Use the Network") {
        diveDeeper = {
          explanation: "Bitcoin transaction fees compensate miners for processing transactions and securing the network. These fees create a market where users can choose between paying more for faster service or less for slower processing.",
          examples: [
            "Express mail: Pay more for faster delivery",
            "Regular mail: Pay less but takes longer",
            "Bitcoin high fee: Fast confirmation in next block",
            "Bitcoin low fee: Confirmation when network is less busy"
          ],
          visualDescription: "Bitcoin fees work like shipping options - express delivery costs more but arrives faster, while standard shipping is cheaper but takes longer.",
          keyTakeaways: [
            "Fees compensate miners for their work",
            "Higher fees typically mean faster processing",
            "Users choose their preferred speed/cost balance",
            "Fee market creates efficient priority system"
          ]
        };
      }

      if (fact.title === "Making Sure It's Real") {
        diveDeeper = {
          explanation: "Bitcoin uses multiple verification steps to ensure transactions are valid. The network checks digital signatures, account balances, and transaction history before accepting any payment, making fraud practically impossible.",
          examples: [
            "Cash payment: Hard to verify if bills are real",
            "Check payment: Might bounce if no funds",
            "Credit card: Can be charged back or fraudulent",
            "Bitcoin: Mathematical proof prevents all fraud"
          ],
          visualDescription: "Bitcoin verification is like having thousands of expert accountants instantly check every transaction to make sure the math is perfect and no one is cheating.",
          keyTakeaways: [
            "Multiple verification steps prevent fraud",
            "Network consensus ensures validity",
            "Mathematical proof replaces trust",
            "Fraudulent transactions are rejected automatically"
          ]
        };
      }

      if (fact.title === "The Mystery Creator") {
        diveDeeper = {
          explanation: "Bitcoin was created by someone using the name Satoshi Nakamoto, but their real identity remains unknown. They disappeared from public view in 2011, leaving Bitcoin to develop as a truly decentralized system without a leader.",
          examples: [
            "Most inventions: Known creator who controls development",
            "Bitcoin: Anonymous creator who stepped away",
            "Company CEO: Makes decisions for the organization",
            "Bitcoin: No single person in charge"
          ],
          visualDescription: "Imagine someone inventing the internet and then completely disappearing, leaving their creation to grow and evolve on its own - that's what Satoshi did with Bitcoin.",
          keyTakeaways: [
            "Creator's identity remains unknown",
            "Satoshi disappeared to ensure decentralization",
            "No single person controls Bitcoin's development",
            "Community-driven evolution since 2011"
          ]
        };
      }

      if (fact.title === "Bitcoin's Birthday") {
        diveDeeper = {
          explanation: "Bitcoin's first block was mined on January 3, 2009, during the global financial crisis. This timing wasn't accidental - the block contained a newspaper headline about bank bailouts, showing Bitcoin as an alternative to the failing financial system.",
          examples: [
            "2008: Banks needed government bailouts to survive",
            "2009: Bitcoin launched as alternative to banking",
            "Traditional system: Required bailouts when it failed",
            "Bitcoin: Designed to work without bailouts or central control"
          ],
          visualDescription: "Bitcoin was born like a lifeboat launched during a shipwreck, designed to save people from the sinking traditional financial system.",
          keyTakeaways: [
            "Launched January 3, 2009",
            "Timing coincided with financial crisis",
            "Created as alternative to traditional banking",
            "Genesis block referenced bank bailout headlines"
          ]
        };
      }

      if (fact.title === "The Famous Pizza") {
        diveDeeper = {
          explanation: "On May 22, 2010, programmer Laszlo Hanyecz bought two pizzas for 10,000 bitcoins - the first real-world Bitcoin transaction. This day is celebrated as Bitcoin Pizza Day, marking when Bitcoin first became actual money instead of just computer code.",
          examples: [
            "2010: 10,000 bitcoins bought 2 pizzas ($25)",
            "2024: Those same bitcoins worth $500+ million",
            "Historic significance: Proved Bitcoin could buy real things",
            "Pizza Day: Annual celebration of Bitcoin's first purchase"
          ],
          visualDescription: "The pizza purchase was like Bitcoin's first baby steps - proving it could walk in the real world and buy actual things, not just exist as numbers on a computer.",
          keyTakeaways: [
            "First real-world Bitcoin transaction",
            "10,000 bitcoins for two pizzas",
            "May 22 celebrated as Bitcoin Pizza Day",
            "Demonstrated Bitcoin's practical utility"
          ]
        };
      }

      // Complete the remaining critical fact titles

      if (fact.title === "Slow But Secure") {
        diveDeeper = {
          explanation: "Bitcoin prioritizes security over speed by taking about 10 minutes for each transaction block. This deliberate slowness allows time for global consensus and makes the network extremely secure against attacks or fraud attempts.",
          examples: [
            "Bank transfer: Fast processing but can be reversed",
            "Bitcoin: Slower processing but irreversible security",
            "Armored truck: Moves slowly but protects valuable cargo",
            "Bitcoin: Moves carefully but protects digital value"
          ],
          visualDescription: "Bitcoin is like a heavily armored bank vault on wheels - it moves slowly and carefully, but once it arrives, your money is absolutely secure and can't be stolen.",
          keyTakeaways: [
            "Security prioritized over transaction speed",
            "10-minute blocks allow global consensus",
            "Deliberate design choice for maximum protection",
            "Trade-off between speed and security"
          ]
        };
      }

      if (fact.title === "Can't Have Everything") {
        diveDeeper = {
          explanation: "Bitcoin makes deliberate trade-offs to optimize for what matters most. It chooses security over speed, decentralization over efficiency, and immutability over convenience. These trade-offs create a system that excels at being unstoppable money.",
          examples: [
            "Fast food: Quick but not always healthy",
            "Home cooking: Takes time but better nutrition",
            "Bitcoin: Slower but maximum security and ownership",
            "Traditional systems: Faster but less secure and more controlled"
          ],
          visualDescription: "Bitcoin is like choosing a strong, reliable truck over a fast sports car when you need to transport something valuable across dangerous terrain - speed isn't worth the risk.",
          keyTakeaways: [
            "Deliberate trade-offs optimize for key properties",
            "Security and decentralization prioritized",
            "Not designed to be fastest payment system",
            "Excellence in digital store of value properties"
          ]
        };
      }

      if (fact.title === "Lightning Fast Layer") {
        diveDeeper = {
          explanation: "The Lightning Network is built on top of Bitcoin to enable instant, cheap payments while maintaining Bitcoin's security. It works by opening payment channels that can process thousands of transactions off the main blockchain.",
          examples: [
            "Main road: Bitcoin blockchain (secure but slower)",
            "Express lane: Lightning Network (fast but uses main road security)",
            "Bank: Many small transactions, occasional large settlement",
            "Lightning: Many instant payments, periodic Bitcoin settlements"
          ],
          visualDescription: "Lightning is like an express lane built above the secure Bitcoin highway - you can zoom along instantly for small trips, but you're still protected by the strong foundation below.",
          keyTakeaways: [
            "Second layer built on top of Bitcoin",
            "Enables instant, low-cost transactions",
            "Maintains Bitcoin's underlying security",
            "Solves small payment use cases"
          ]
        };
      }

      if (fact.title === "No Central Control") {
        diveDeeper = {
          explanation: "Bitcoin has no CEO, headquarters, or central authority making decisions. It's controlled by everyone who uses it through mathematical consensus, making it impossible for any single entity to control or shut down.",
          examples: [
            "Company: CEO makes all major decisions",
            "Bitcoin: Users collectively make decisions through code",
            "Government currency: Central bank controls supply",
            "Bitcoin: Mathematical rules control everything"
          ],
          visualDescription: "Bitcoin is like a river that flows according to natural laws rather than being controlled by any dam or authority - it follows the path that math and consensus determine.",
          keyTakeaways: [
            "No single entity controls Bitcoin",
            "Decentralized decision-making through consensus",
            "Mathematical rules replace human authority",
            "Cannot be shut down or controlled centrally"
          ]
        };
      }

      if (fact.title === "Math Never Lies") {
        diveDeeper = {
          explanation: "Bitcoin relies on mathematical proof rather than trust in people or institutions. The rules are written in code that everyone can verify, creating a system where human corruption or error cannot change the fundamental properties.",
          examples: [
            "Human promise: Can be broken or forgotten",
            "Mathematical proof: Always produces same result",
            "Bank ledger: Can be altered by insiders",
            "Bitcoin ledger: Protected by unbreakable math"
          ],
          visualDescription: "Bitcoin is like having the laws of physics govern your money instead of having human politicians write rules they can change whenever convenient.",
          keyTakeaways: [
            "Mathematical proof replaces human trust",
            "Code rules cannot be arbitrarily changed",
            "Eliminates human error and corruption",
            "Objective mathematical consensus"
          ]
        };
      }

      // Add final missing titles to complete comprehensive coverage
      
      if (fact.title === "Digital Gold Properties") {
        diveDeeper = {
          explanation: "Bitcoin shares many properties with gold that made it valuable money throughout history: scarcity, durability, divisibility, and difficulty to counterfeit. However, Bitcoin improves on gold by being easily transportable and verifiable.",
          examples: [
            "Gold: Heavy to transport, Bitcoin: Weightless",
            "Gold: Hard to verify purity, Bitcoin: Instantly verifiable",
            "Gold: Difficult to divide precisely, Bitcoin: Infinitely divisible",
            "Both: Scarce, durable, and valuable store of wealth"
          ],
          visualDescription: "Bitcoin is like gold that learned to fly - it keeps all the valuable properties that made gold precious for thousands of years, but adds the ability to travel instantly anywhere in the world.",
          keyTakeaways: [
            "Combines gold's store of value properties",
            "Adds digital advantages like portability",
            "Maintains scarcity and durability",
            "Improves on gold's practical limitations"
          ]
        };
      }

      // Continue with days 12-30 fact titles

      if (fact.title === "Energy Makes It Safe") {
        diveDeeper = {
          explanation: "Bitcoin uses a lot of energy because that energy creates security. The more energy spent mining Bitcoin, the more expensive it becomes to attack the network. This energy cost is what makes Bitcoin transactions irreversible and trustworthy.",
          examples: [
            "Bank vault: Thick steel walls cost money but provide security",
            "Bitcoin: Energy costs money but provides digital security",
            "Home alarm: Uses electricity to protect your house",
            "Bitcoin mining: Uses electricity to protect the network"
          ],
          visualDescription: "Think of Bitcoin's energy use like a digital fortress - the more energy powering the walls, the stronger and more secure the fortress becomes against any attackers.",
          keyTakeaways: [
            "Energy consumption creates network security",
            "More energy makes attacks more expensive",
            "Security cost is proportional to protection value",
            "Energy secures trillions in digital value"
          ]
        };
      }

      if (fact.title === "Only 21 Million Ever") {
        diveDeeper = {
          explanation: "Bitcoin's supply is permanently capped at 21 million coins through mathematical code that cannot be changed. This makes it the first form of money in history with a truly fixed, verifiable supply limit that no authority can override.",
          examples: [
            "Government money: Can always print more when convenient",
            "Bitcoin: Mathematically impossible to create more",
            "Gold supply: New discoveries can increase total amount",
            "Bitcoin supply: Fixed forever at exactly 21 million"
          ],
          visualDescription: "Imagine if there were only 21 million rare paintings that could ever exist, and everyone could verify this limit was real and unchangeable - that's Bitcoin's scarcity.",
          keyTakeaways: [
            "Hard cap of exactly 21 million bitcoins",
            "Impossible to increase this limit",
            "First truly fixed-supply money in history",
            "Scarcity is mathematically guaranteed"
          ]
        };
      }

      if (fact.title === "Not Your Keys, Not Your Coins") {
        diveDeeper = {
          explanation: "This famous Bitcoin saying means that if you don't control the private keys to your Bitcoin, you don't really own it. Whoever controls the keys can spend the Bitcoin, regardless of who thinks they own it.",
          examples: [
            "Bank account: Bank controls your access to funds",
            "Bitcoin exchange: Exchange controls your Bitcoin keys",
            "Cash in hand: You physically control your money",
            "Self-custody Bitcoin: You digitally control your money"
          ],
          visualDescription: "It's like the difference between keeping gold in your own safe versus keeping it in someone else's safe - even if they promise it's yours, they have the key to take it.",
          keyTakeaways: [
            "Private key control equals true ownership",
            "Third parties can freeze or seize funds they control",
            "Self-custody provides maximum security",
            "Responsibility comes with true ownership"
          ]
        };
      }

      if (fact.title === "Pseudonymous Transactions") {
        diveDeeper = {
          explanation: "Bitcoin transactions are pseudonymous, meaning they're linked to addresses rather than real names. While all transactions are public, the identities behind the addresses aren't automatically known, providing a balance of transparency and privacy.",
          examples: [
            "Cash: Anonymous but hard to track large amounts",
            "Bank transfer: Private but bank knows everything",
            "Bitcoin: Public transactions, private identities",
            "Internet username: Public actions, hidden real name"
          ],
          visualDescription: "Bitcoin transactions are like watching masked performers on stage - you can see all their actions clearly, but you don't know who's behind the mask unless they reveal themselves.",
          keyTakeaways: [
            "Addresses are public, identities are private",
            "All transactions are transparent and verifiable",
            "Privacy through pseudonymous addresses",
            "Better than both cash and banking for most needs"
          ]
        };
      }

      if (fact.title === "Metcalfe's Law") {
        diveDeeper = {
          explanation: "Metcalfe's Law states that a network becomes more valuable as more people join it. Bitcoin follows this pattern - as more people use Bitcoin, it becomes more useful, more accepted, and more valuable to everyone in the network.",
          examples: [
            "Telephone: One phone is useless, millions create value",
            "Internet: More users make it more valuable for everyone",
            "Bitcoin: More users increase utility and acceptance",
            "Social media: Platform value grows with user count"
          ],
          visualDescription: "Bitcoin is like a growing city - the more people who move there, the more shops, services, and opportunities become available for everyone who lives there.",
          keyTakeaways: [
            "Network value grows with user adoption",
            "More users create more utility for everyone",
            "Adoption drives both value and functionality",
            "Self-reinforcing growth cycle"
          ]
        };
      }

      if (fact.title === "Bitcoin Innovation") {
        diveDeeper = {
          explanation: "Bitcoin continues to evolve through improvements and new layers built on top of it. Innovations like the Lightning Network, smart contracts, and scaling solutions make Bitcoin more useful while maintaining its core security properties.",
          examples: [
            "Internet: Started basic, added video, social media, apps",
            "Bitcoin: Started with payments, adding smart features",
            "Highway system: Base roads plus express lanes and bridges",
            "Bitcoin: Base layer plus Lightning and other improvements"
          ],
          visualDescription: "Bitcoin development is like building a city - you start with strong foundations, then add roads, bridges, and new neighborhoods while keeping the core infrastructure solid.",
          keyTakeaways: [
            "Bitcoin evolves through layered improvements",
            "Core security properties remain unchanged",
            "Innovation happens on top of solid foundation",
            "Continuous development by global community"
          ]
        };
      }

      // Add remaining fact titles for comprehensive coverage through day 30

      if (fact.title === "Proving You Own It") {
        diveDeeper = {
          explanation: "Bitcoin uses computer math to prove you really own your money without showing your secret password to anyone. It's like having a magic way to prove something belongs to you.",
          examples: [
            "Regular signature: Someone could copy your handwriting",
            "Bitcoin proof: Computer math makes copying impossible",
            "Driver's license: Shows you can drive legally",
            "Bitcoin proof: Shows you can spend this money legally"
          ],
          visualDescription: "Think of it like having a magic pen that only you can use. Everyone can see your writing and know it's real, but nobody can steal your pen or fake your signature.",
          keyTakeaways: [
            "Computer math proves you own your money",
            "Nobody can fake or copy your proof",
            "Works without showing your secret password",
            "Keeps your Bitcoin safe and secure"
          ]
        };
      }

      if (fact.title === "Computer Rules Money") {
        diveDeeper = {
          explanation: "Bitcoin follows computer rules that never change, so no person or government can mess with your money. It's like having a robot that always follows the same fair rules.",
          examples: [
            "Bank rules: People can change them anytime",
            "Bitcoin rules: Computer code never changes",
            "Government money: Politicians decide what happens",
            "Bitcoin: Math decides what happens"
          ],
          visualDescription: "Bitcoin is like having a perfect robot that always follows the same rules, never plays favorites, never makes mistakes, and can't be tricked or bribed.",
          keyTakeaways: [
            "Rules are controlled by computers, not people",
            "Nobody can change the rules to cheat",
            "Same fair treatment for everyone",
            "Math replaces politics in money"
          ]
        };
      }

      if (fact.title === "More Users, More Useful") {
        diveDeeper = {
          explanation: "As more people use Bitcoin, it becomes more helpful and valuable for everyone who has it. More users means more places accept it and more people to trade with.",
          examples: [
            "Phone network: More phones make calling more useful",
            "Bitcoin network: More users make Bitcoin more useful",
            "Language: More speakers make learning it worthwhile",
            "Money: More acceptance makes it easier to spend"
          ],
          visualDescription: "Bitcoin growth is like a snowball rolling down a hill - it starts small but gets bigger and faster as more people join, making it better for everyone.",
          keyTakeaways: [
            "More people using it helps everyone",
            "Growth creates more growth",
            "Bigger network means more places to use it",
            "Value comes from how useful it is"
          ]
        };
      }

      if (fact.title === "Borderless Money System") {
        diveDeeper = {
          explanation: "Bitcoin works exactly the same way whether you're sending money across the street or across the world. There are no international exchange rates, currency conversion fees, or different rules for different countries - it's truly global money.",
          examples: [
            "International wire: Different rules, fees, delays per country",
            "Bitcoin: Same rules everywhere, no borders",
            "Travel money: Need to exchange currencies in each country",
            "Bitcoin: One currency that works everywhere"
          ],
          visualDescription: "Bitcoin is like having a universal key that opens any door in the world - no matter what country you're in, the key works exactly the same way.",
          keyTakeaways: [
            "Same functionality worldwide",
            "No exchange rates or conversion needed",
            "No international transfer complications",
            "Truly global monetary system"
          ]
        };
      }

      if (fact.title === "Deflationary Asset Properties") {
        diveDeeper = {
          explanation: "Unlike regular money that loses value over time through inflation, Bitcoin tends to gain value as demand increases while supply remains fixed. This makes it deflationary - the opposite of traditional currencies that inflate away your savings.",
          examples: [
            "Dollar: More printed each year, buys less over time",
            "Bitcoin: Fixed supply, tends to buy more over time",
            "Collectibles: Limited supply often increases value",
            "Bitcoin: Ultimate limited supply digital collectible"
          ],
          visualDescription: "Think of Bitcoin like a rare vintage wine - while regular money spoils and loses value over time, Bitcoin tends to age well and become more valuable with patience.",
          keyTakeaways: [
            "Fixed supply creates deflationary pressure",
            "Tends to gain purchasing power over time",
            "Opposite of inflationary government money",
            "Rewards saving instead of punishing it"
          ]
        };
      }

      if (fact.title === "Monetary Sovereignty for Individuals") {
        diveDeeper = {
          explanation: "Bitcoin gives individuals the same monetary powers that were previously only available to governments and banks. You can store value, send payments, and control money without needing permission from any institution.",
          examples: [
            "Government: Can print money and control currency",
            "Individual with Bitcoin: Can control their own money",
            "Bank: Can approve or deny your transactions",
            "Bitcoin user: Can transact without approval"
          ],
          visualDescription: "Bitcoin is like giving every person their own printing press for money - except instead of printing, you earn your share through participation in a fair, limited system.",
          keyTakeaways: [
            "Individual control over monetary decisions",
            "No need for institutional permission",
            "Personal financial sovereignty",
            "Democratic access to sound money"
          ]
        };
      }

      // Complete all remaining fact titles to ensure comprehensive coverage

      if (fact.title === "Economic Freedom Through Technology") {
        diveDeeper = {
          explanation: "Bitcoin uses technology to create economic freedom that doesn't depend on politics, geography, or social status. Anyone with internet access can participate in the global Bitcoin economy regardless of their government's policies.",
          examples: [
            "Traditional banking: Requires government permission and approval",
            "Bitcoin: Requires only internet and basic knowledge",
            "International business: Complex regulations and restrictions",
            "Bitcoin commerce: Simple global peer-to-peer transactions"
          ],
          visualDescription: "Bitcoin is like having a passport to a global economy that no government can revoke - once you understand it, you have access to financial freedom anywhere in the world.",
          keyTakeaways: [
            "Technology enables economic participation",
            "Freedom independent of political systems",
            "Global access regardless of location",
            "Economic empowerment through mathematics"
          ]
        };
      }

      if (fact.title === "Store of Value for the Digital Age") {
        diveDeeper = {
          explanation: "Bitcoin serves as digital store of value that maintains purchasing power over time, similar to how gold has historically preserved wealth. However, Bitcoin offers advantages like portability and verifiability that physical assets cannot match.",
          examples: [
            "Gold: Heavy, hard to transport, difficult to verify",
            "Bitcoin: Weightless, instant transport, easy verification",
            "Real estate: Tied to location, high transaction costs",
            "Bitcoin: Global, low transaction costs, high liquidity"
          ],
          visualDescription: "Bitcoin is like having gold that you can email to anyone in the world instantly, while being certain it's real gold and not a fake.",
          keyTakeaways: [
            "Digital alternative to traditional stores of value",
            "Combines preservation with modern convenience",
            "Superior portability and verifiability",
            "Maintains value without physical limitations"
          ]
        };
      }

      if (fact.title === "Neutral Money for Everyone") {
        diveDeeper = {
          explanation: "Bitcoin doesn't discriminate based on race, nationality, religion, politics, or social status. It works the same for everyone and treats all participants equally according to mathematical rules rather than human biases.",
          examples: [
            "Banking system: Can discriminate based on location or status",
            "Bitcoin: Treats everyone according to same mathematical rules",
            "Government currency: Reflects political preferences",
            "Bitcoin: Politically and socially neutral technology"
          ],
          visualDescription: "Bitcoin is like a perfectly fair judge that applies the exact same rules to everyone, regardless of who they are, where they're from, or what they believe.",
          keyTakeaways: [
            "No discrimination or favoritism",
            "Equal treatment based on mathematical rules",
            "Politically and socially neutral",
            "Universal access and fairness"
          ]
        };
      }

      if (fact.title === "Incentive Alignment Creates Security") {
        diveDeeper = {
          explanation: "Bitcoin's security comes from aligning economic incentives so that protecting the network is profitable while attacking it is expensive. Miners earn money by following the rules and lose money by breaking them.",
          examples: [
            "Security guard: Paid to protect, fired for stealing",
            "Bitcoin miner: Rewarded for security, punished for attacks",
            "Bank vault: Strong walls but guards might be corrupted",
            "Bitcoin: Mathematical incentives prevent corruption"
          ],
          visualDescription: "Bitcoin security is like a system where the guards get paid more for protecting the treasure than they could ever steal, making honest behavior the most profitable choice.",
          keyTakeaways: [
            "Economic incentives drive security",
            "Attacking the network is unprofitable",
            "Self-interested behavior protects everyone",
            "Incentive alignment creates robust system"
          ]
        };
      }

      if (fact.title === "Unstoppable Peer-to-Peer Value Transfer") {
        diveDeeper = {
          explanation: "Once a Bitcoin transaction is properly broadcast to the network, no authority on Earth can stop it from being processed. This creates unstoppable money that works regardless of politics, sanctions, or institutional interference.",
          examples: [
            "Bank wire: Can be stopped by banks or governments",
            "Bitcoin transaction: Cannot be stopped once broadcast",
            "Payment app: Company can freeze or reverse payments",
            "Bitcoin: Irreversible and unstoppable by design"
          ],
          visualDescription: "Bitcoin transactions are like messages in bottles thrown into an ocean of computers - once they're out there, no one can stop them from reaching their destination.",
          keyTakeaways: [
            "Transactions cannot be censored or stopped",
            "Works regardless of political interference",
            "Irreversible and final settlement",
            "True peer-to-peer value transfer"
          ]
        };
      }

      if (fact.title === "Mathematical Certainty Replaces Trust") {
        diveDeeper = {
          explanation: "Bitcoin eliminates the need to trust people or institutions by using mathematical proof to verify everything. Instead of hoping someone is honest, you can verify mathematically that the system works correctly.",
          examples: [
            "Bank statement: You trust the bank's records",
            "Bitcoin blockchain: You can verify every transaction yourself",
            "Government promise: Requires faith in political system",
            "Bitcoin code: Requires only understanding of mathematics"
          ],
          visualDescription: "Bitcoin is like replacing a pinky promise with a mathematical proof - instead of hoping someone keeps their word, you have certainty that the math always works.",
          keyTakeaways: [
            "Mathematical proof replaces human trust",
            "Verifiable by anyone with basic tools",
            "Eliminates need for trusted intermediaries",
            "Objective truth through mathematics"
          ]
        };
      }

      // Add missing fact titles for days 12, 14, 15, 16, 17

      if (fact.title === "Clean Energy Mining") {
        diveDeeper = {
          explanation: "Most Bitcoin mining uses clean energy because miners want the cheapest electricity, which is often renewable. Solar and wind power is getting cheaper, so miners naturally move toward green energy to save money.",
          examples: [
            "Traditional factories: Use whatever energy is cheapest nearby",
            "Bitcoin miners: Travel the world seeking cheapest, often green energy",
            "Regular industry: Stuck with local power grid options",
            "Bitcoin mining: Can move anywhere with cheap renewable energy"
          ],
          visualDescription: "Bitcoin mining is like a nomadic energy hunter that follows the cheapest power around the world, and the cheapest power is increasingly solar and wind energy.",
          keyTakeaways: [
            "Over 50% of mining uses renewable energy",
            "Miners seek lowest cost electricity",
            "Renewable energy is becoming cheapest option",
            "Mining can help fund green energy projects"
          ]
        };
      }

      if (fact.title === "Helping the Grid") {
        diveDeeper = {
          explanation: "Bitcoin miners help electricity grids by using excess power when there's too much and shutting down when there's not enough. They act like a flexible industrial customer that can turn on and off instantly to help balance supply and demand.",
          examples: [
            "Wind farm: Sometimes produces too much electricity with nowhere to send it",
            "Bitcoin miner: Can use that excess energy instead of wasting it",
            "Power shortage: Regular factories can't shut down quickly",
            "Bitcoin mining: Can stop instantly to free up electricity"
          ],
          visualDescription: "Bitcoin miners are like giant electricity sponges that can soak up extra power when there's too much, or quickly squeeze themselves dry when power is needed elsewhere.",
          keyTakeaways: [
            "Miners provide grid flexibility and stability",
            "Use excess energy that would otherwise be wasted",
            "Can shut down instantly during power shortages",
            "Help make renewable energy projects profitable"
          ]
        };
      }

      if (fact.title === "Cutting Rewards in Half") {
        diveDeeper = {
          explanation: "Every four years, Bitcoin automatically cuts the reward for mining new blocks in half. This reduces the supply of new Bitcoin entering the market, making existing Bitcoin more scarce and typically more valuable.",
          examples: [
            "Gold mining: Finding gold becomes naturally harder over time",
            "Bitcoin: Code automatically makes new Bitcoin production slower",
            "Regular money: Governments can print as much as they want",
            "Bitcoin: Fixed schedule reduces new supply every four years"
          ],
          visualDescription: "The halving is like a gold mine that automatically gets twice as hard to dig every four years, ensuring that gold becomes more and more rare over time.",
          keyTakeaways: [
            "Happens every 210,000 blocks (about 4 years)",
            "Reduces new Bitcoin supply by 50%",
            "Historically followed by price increases",
            "Creates predictable scarcity schedule"
          ]
        };
      }

      if (fact.title === "Rules That Can't Change") {
        diveDeeper = {
          explanation: "Bitcoin's core rules like the 21 million limit are extremely difficult to change because thousands of people would have to agree. This protects Bitcoin from being manipulated by governments, companies, or individuals.",
          examples: [
            "Government money: Rules change when politicians decide",
            "Bitcoin: Rules only change if thousands of people agree",
            "Company money: CEO can change policies anytime",
            "Bitcoin: No CEO or central authority to change rules"
          ],
          visualDescription: "Changing Bitcoin's rules is like trying to get everyone in a large city to agree on what color to paint all the buildings - almost impossible to coordinate.",
          keyTakeaways: [
            "Core rules protected by global consensus",
            "No single authority can change Bitcoin",
            "21 million limit is practically unchangeable",
            "Stability through distributed agreement"
          ]
        };
      }

      if (fact.title === "Hardware Wallets") {
        diveDeeper = {
          explanation: "Hardware wallets are special devices that keep your Bitcoin private keys completely offline and secure. They're like tiny computers designed specifically to protect your Bitcoin from hackers and malware.",
          examples: [
            "Software wallet: Connected to internet, vulnerable to hackers",
            "Hardware wallet: Never connects to internet, much safer",
            "Writing down keys: Can be lost, stolen, or damaged",
            "Hardware device: Protected by PIN codes and secure chips"
          ],
          visualDescription: "A hardware wallet is like a tiny underground vault for your Bitcoin keys - even if your computer gets hacked, the vault stays completely separate and safe.",
          keyTakeaways: [
            "Keeps private keys completely offline",
            "Protected by secure hardware chips",
            "Best security for large Bitcoin amounts",
            "Requires physical access to steal funds"
          ]
        };
      }

      if (fact.title === "Seed Phrase Backup") {
        diveDeeper = {
          explanation: "Your seed phrase is a list of 12 or 24 words that can recreate your entire Bitcoin wallet. If you lose your device, these words can get all your Bitcoin back. Keep them safer than gold.",
          examples: [
            "Lost phone: All your apps and photos might be gone forever",
            "Lost Bitcoin device with seed phrase: You can get all Bitcoin back",
            "Forgot bank password: Bank can reset it for you",
            "Lost seed phrase: Your Bitcoin is gone forever with no recovery"
          ],
          visualDescription: "Your seed phrase is like a magic spell that can recreate your entire Bitcoin treasure chest - but if you forget the spell, the treasure disappears forever.",
          keyTakeaways: [
            "Can restore your entire wallet from any device",
            "Must be stored securely in multiple locations",
            "Never share with anyone or store digitally",
            "No recovery possible if permanently lost"
          ]
        };
      }

      if (fact.title === "Public Blockchain") {
        diveDeeper = {
          explanation: "Every Bitcoin transaction is recorded on a public ledger that anyone can view. This creates unprecedented transparency where you can trace every Bitcoin from its creation to current ownership.",
          examples: [
            "Bank records: Only you and the bank can see your transactions",
            "Bitcoin blockchain: Anyone can see every transaction ever",
            "Government spending: Often hidden or hard to track",
            "Bitcoin transactions: Completely transparent and traceable"
          ],
          visualDescription: "The Bitcoin blockchain is like a giant transparent safe where everyone can see every coin and how it moves, but you need the secret combination to actually touch anything.",
          keyTakeaways: [
            "All transactions are publicly visible",
            "Enables unprecedented financial transparency",
            "Anyone can verify the entire history",
            "Creates accountability through openness"
          ]
        };
      }

      if (fact.title === "Privacy Techniques") {
        diveDeeper = {
          explanation: "While Bitcoin transactions are public, you can maintain privacy by using new addresses for each transaction and avoiding patterns that link your addresses together.",
          examples: [
            "Using same address repeatedly: Like using same P.O. box for everything",
            "Using new address each time: Like getting a new P.O. box for each delivery",
            "Reusing addresses: Makes it easy to track all your transactions",
            "Fresh addresses: Keeps your transactions separate and private"
          ],
          visualDescription: "Bitcoin privacy is like wearing a different mask for each public appearance - people can see what each mask does, but they can't easily tell it's the same person.",
          keyTakeaways: [
            "Use a new address for every transaction",
            "Avoid linking addresses through patterns",
            "Consider privacy-focused wallet software",
            "Balance transparency needs with privacy goals"
          ]
        };
      }

      if (fact.title === "Global Adoption") {
        diveDeeper = {
          explanation: "Every new person who starts using Bitcoin makes it more valuable and useful for everyone else. More users mean more merchants accept it, more developers improve it, and more infrastructure gets built.",
          examples: [
            "Telephone network: One phone was useless, millions created value",
            "Bitcoin network: Each new user adds value for everyone",
            "Social media: Platform becomes better with more users",
            "Bitcoin: More adoption creates more utility and acceptance"
          ],
          visualDescription: "Bitcoin adoption is like a city that gets better as more people move there - more residents means more shops, services, and opportunities for everyone.",
          keyTakeaways: [
            "Each new user increases network value",
            "More adoption drives merchant acceptance",
            "Growing user base attracts more development",
            "Network effects create self-reinforcing growth"
          ]
        };
      }

      if (fact.title === "Critical Mass") {
        diveDeeper = {
          explanation: "Bitcoin reaches critical mass when the cost of not having it becomes higher than the effort of learning and using it. This creates a tipping point where adoption accelerates rapidly.",
          examples: [
            "Email in 1990s: Initially complicated, but became necessary",
            "Bitcoin today: Still complex but increasingly necessary",
            "Internet adoption: Reached critical mass in mid-1990s",
            "Bitcoin adoption: Approaching critical mass for institutions"
          ],
          visualDescription: "Critical mass is like a snowball rolling down a hill - at first it rolls slowly, but once it gets big enough, it starts rolling faster and faster on its own.",
          keyTakeaways: [
            "Tipping point where adoption accelerates",
            "Cost of exclusion exceeds cost of adoption",
            "Creates self-reinforcing adoption cycles",
            "Institutional adoption signals approaching critical mass"
          ]
        };
      }

      if (fact.title === "Open Source Development") {
        diveDeeper = {
          explanation: "Bitcoin's code is completely open for anyone to read, review, and improve. Thousands of developers around the world can examine every line of code, making it one of the most reviewed software projects in history.",
          examples: [
            "Bank software: Secret code that only bank employees see",
            "Bitcoin code: Anyone in the world can read and check it",
            "Company app: Hidden algorithms and potential backdoors",
            "Bitcoin: Every algorithm is transparent and verifiable"
          ],
          visualDescription: "Bitcoin's open source nature is like having a recipe that anyone can read, test, and improve, versus a secret formula locked in a corporate vault.",
          keyTakeaways: [
            "Anyone can review the code for problems",
            "Global collaboration improves security",
            "No hidden features or backdoors possible",
            "Transparency builds trust through verification"
          ]
        };
      }

      if (fact.title === "Protocol Upgrades") {
        diveDeeper = {
          explanation: "Bitcoin improves through careful, consensus-driven upgrades that add new features while maintaining security. Major upgrades like SegWit and Taproot took years of testing and discussion before activation.",
          examples: [
            "Software apps: Company pushes updates whenever they want",
            "Bitcoin: Updates only happen with broad community agreement",
            "Operating system: Automatic updates can break things",
            "Bitcoin: Upgrades tested extensively before deployment"
          ],
          visualDescription: "Bitcoin upgrades are like renovating a historical building - you improve it carefully while preserving the essential structure that makes it valuable.",
          keyTakeaways: [
            "Upgrades require broad community consensus",
            "New features maintain backward compatibility",
            "Extensive testing prevents breaking changes",
            "Conservative approach prioritizes security"
          ]
        };
      }

      // Complete all remaining advanced facts for days 21-29

      if (fact.title === "Separation of Money and State") {
        diveDeeper = {
          explanation: "Bitcoin separates money from government control for the first time in modern history. This creates money that can't be manipulated by politicians or used as a tool of control over citizens.",
          examples: [
            "Government money: Can be printed to fund wars or political projects",
            "Bitcoin: Cannot be printed or controlled by any government",
            "Fiat currency: Value depends on political stability and decisions",
            "Bitcoin: Value depends on mathematical rules and adoption"
          ],
          visualDescription: "Separating money from state is like separating religion from government - it prevents the abuse of monetary power for political purposes.",
          keyTakeaways: [
            "First apolitical money system in modern history",
            "Cannot be manipulated for political purposes",
            "Protects citizens from monetary abuse",
            "Creates neutral, mathematical money"
          ]
        };
      }

      if (fact.title === "Fixed Supply Economics") {
        diveDeeper = {
          explanation: "Bitcoin's mathematically fixed supply creates economics that reward people who save money instead of punishing them. This encourages long-term thinking and building wealth over time.",
          examples: [
            "Regular money: Loses value over time, punishes savers",
            "Bitcoin: Tends to gain value, rewards savers",
            "Government policy: Encourages debt and consumption",
            "Bitcoin economics: Encourages saving and investment"
          ],
          visualDescription: "Fixed supply economics is like having a pie that can never get bigger - as more people want slices, each slice becomes more valuable.",
          keyTakeaways: [
            "Rewards saving instead of spending",
            "Encourages long-term thinking",
            "Creates deflationary economics",
            "Builds wealth over time for holders"
          ]
        };
      }

      if (fact.title === "Time Chain of Value") {
        diveDeeper = {
          explanation: "Bitcoin creates an unbreakable record of who owned what and when. This timeline of value can never be erased or changed, creating permanent proof of ownership throughout history.",
          examples: [
            "Bank records: Can be lost, changed, or destroyed",
            "Bitcoin blockchain: Permanent record that cannot be altered",
            "Government records: Can be censored or manipulated",
            "Bitcoin time chain: Mathematically protected forever"
          ],
          visualDescription: "The time chain is like a permanent history book written in stone - every page shows exactly what happened and cannot be torn out or rewritten.",
          keyTakeaways: [
            "Creates immutable ownership records",
            "Proves digital scarcity mathematically",
            "Cannot be erased or changed",
            "Establishes permanent property rights"
          ]
        };
      }

      if (fact.title === "Voluntary Adoption Network") {
        diveDeeper = {
          explanation: "Bitcoin grows because people choose to use it, not because they're forced to. This creates real value and utility based on people's genuine needs rather than government mandates.",
          examples: [
            "Government currency: Must use it or face legal consequences",
            "Bitcoin: People use it because they find it valuable",
            "Forced adoption: Creates resentment and resistance",
            "Voluntary adoption: Creates genuine value and growth"
          ],
          visualDescription: "Voluntary adoption is like a restaurant that gets popular because the food is great, versus a cafeteria you're forced to eat at.",
          keyTakeaways: [
            "Growth through genuine utility and value",
            "No force or coercion required",
            "Creates strong network effects",
            "Based on real user needs and preferences"
          ]
        };
      }

      if (fact.title === "Energy-Backed Security Model") {
        diveDeeper = {
          explanation: "Bitcoin converts real-world energy into digital security. The more energy used to protect Bitcoin, the more expensive it becomes for anyone to attack or hack the network.",
          examples: [
            "Bank vault: Physical steel walls cost money but provide security",
            "Bitcoin: Energy walls cost money but provide digital security",
            "House alarm: Uses electricity to protect your home",
            "Bitcoin mining: Uses electricity to protect everyone's money"
          ],
          visualDescription: "Energy-backed security is like building a wall of electricity around Bitcoin - the thicker the wall, the safer everyone's money becomes.",
          keyTakeaways: [
            "Real energy creates real security",
            "More energy makes attacks more expensive",
            "Physical cost creates digital protection",
            "Most secure payment network in history"
          ]
        };
      }

      if (fact.title === "Antifragile Money Design") {
        diveDeeper = {
          explanation: "Bitcoin gets stronger every time someone tries to attack it or ban it. Each challenge tests the system and makes it more resilient, like how muscles get stronger from exercise.",
          examples: [
            "Regular systems: Break down when stressed or attacked",
            "Bitcoin: Gets stronger and more resilient when challenged",
            "Glass: Shatters when hit hard",
            "Bitcoin: Like a material that becomes harder when struck"
          ],
          visualDescription: "Bitcoin is like a mythical creature that grows stronger every time someone tries to defeat it - each attack just makes it more powerful.",
          keyTakeaways: [
            "Becomes stronger when challenged",
            "Benefits from stress and attacks",
            "Grows more resilient over time",
            "Self-improving through adversity"
          ]
        };
      }

      if (fact.title === "Individual Financial Sovereignty") {
        diveDeeper = {
          explanation: "Bitcoin lets you become your own bank with complete control over your money. You don't need permission from anyone to save, send, or receive money anywhere in the world.",
          examples: [
            "Traditional banking: Need permission for many financial actions",
            "Bitcoin self-custody: You control everything yourself",
            "Bank account: Can be frozen or closed by others",
            "Bitcoin wallet: Only you can access or control it"
          ],
          visualDescription: "Financial sovereignty is like having your own private kingdom where you make all the rules about your money instead of following someone else's rules.",
          keyTakeaways: [
            "Complete control over your money",
            "No need for institutional permission",
            "Become your own bank",
            "True financial independence"
          ]
        };
      }

      if (fact.title === "Programmable Scarcity") {
        diveDeeper = {
          explanation: "Bitcoin programs absolute scarcity into computer code. For the first time in history, we have something digital that cannot be copied, creating true digital ownership and value.",
          examples: [
            "Digital files: Can be copied infinite times for free",
            "Bitcoin: Cannot be copied or duplicated ever",
            "Digital music: Can be pirated and shared endlessly",
            "Bitcoin: Each coin is unique and cannot be counterfeited"
          ],
          visualDescription: "Programmable scarcity is like creating digital gold that has all the properties of physical gold but exists only in computer code.",
          keyTakeaways: [
            "First truly scarce digital asset",
            "Cannot be copied or counterfeited",
            "Scarcity enforced by mathematics",
            "Creates real digital ownership"
          ]
        };
      }

      if (fact.title === "Peaceful Money Revolution") {
        diveDeeper = {
          explanation: "Bitcoin changes the monetary system through voluntary adoption rather than violence or political force. People choose Bitcoin because it works better, not because they're forced to use it.",
          examples: [
            "Historical monetary changes: Usually involved wars or coercion",
            "Bitcoin adoption: Peaceful choice by individuals",
            "Government currency reforms: Imposed by force",
            "Bitcoin revolution: Spreads through voluntary use"
          ],
          visualDescription: "The Bitcoin revolution is like water gradually carving through stone - slow, peaceful, but ultimately unstoppable and transformative.",
          keyTakeaways: [
            "Changes money through choice, not force",
            "Non-violent monetary revolution",
            "Spreads through voluntary adoption",
            "Peaceful transformation of finance"
          ]
        };
      }

      if (fact.title === "Decentralized Monetary Policy") {
        diveDeeper = {
          explanation: "Bitcoin's monetary policy is set by mathematics and computer code, not by committees of people who might make bad decisions or have conflicts of interest.",
          examples: [
            "Central bank committees: Humans make monetary decisions",
            "Bitcoin protocol: Mathematics makes monetary decisions",
            "Political monetary policy: Can change with elections",
            "Bitcoin policy: Unchangeable mathematical rules"
          ],
          visualDescription: "Decentralized monetary policy is like having a perfectly fair robot manage money instead of politicians who might favor their friends.",
          keyTakeaways: [
            "No human discretion in monetary policy",
            "Rules set by mathematics, not politics",
            "Predictable and unchangeable",
            "Eliminates monetary manipulation"
          ]
        };
      }

      if (fact.title === "Global Settlement Layer") {
        diveDeeper = {
          explanation: "Bitcoin serves as the world's first global settlement layer that works across all borders and time zones. Unlike traditional banking systems that close on weekends, Bitcoin settles transactions 24/7.",
          examples: [
            "Bank transfers: Stop working on weekends and holidays",
            "Bitcoin: Works every day, all day, every year",
            "International wires: Take days and cost hundreds",
            "Bitcoin settlement: Works in minutes across any border"
          ],
          visualDescription: "Bitcoin is like having a global highway that never closes, never has traffic jams, and connects every country without toll booths or border checkpoints.",
          keyTakeaways: [
            "24/7 global settlement system",
            "No weekends or holidays",
            "Works across all borders",
            "Always-on financial infrastructure"
          ]
        };
      }

      if (fact.title === "Honest Price Discovery") {
        diveDeeper = {
          explanation: "Bitcoin creates honest price discovery by removing central bank manipulation and artificial money printing. Prices reflect real supply and demand rather than political interventions.",
          examples: [
            "Stock market: Propped up by money printing",
            "Bitcoin market: Real supply and demand only",
            "Housing prices: Inflated by cheap credit",
            "Bitcoin price: Reflects actual utility and adoption"
          ],
          visualDescription: "Honest price discovery is like having a perfectly accurate scale that always shows true weight, versus a rigged scale that someone can manipulate.",
          keyTakeaways: [
            "Prices reflect real supply and demand",
            "No central bank manipulation",
            "Market discovers true value",
            "Eliminates artificial price distortions"
          ]
        };
      }

      if (fact.title === "Digital Property Rights") {
        diveDeeper = {
          explanation: "Bitcoin establishes true digital property rights for the first time in history. Your bitcoins are mathematically yours and cannot be taken without your permission or private keys.",
          examples: [
            "Digital music: Can be copied and pirated easily",
            "Bitcoin: Cannot be copied or stolen without keys",
            "Online accounts: Companies can delete your data",
            "Bitcoin: Only you control your digital property"
          ],
          visualDescription: "Digital property rights with Bitcoin are like having a safe that only opens with your fingerprint - completely secure and exclusively yours.",
          keyTakeaways: [
            "First true digital property ownership",
            "Cannot be taken without permission",
            "Mathematically enforced ownership",
            "Establishes digital scarcity"
          ]
        };
      }

      if (fact.title === "Intergenerational Wealth Transfer") {
        diveDeeper = {
          explanation: "Bitcoin enables people to pass wealth to future generations without government seizure, inflation erosion, or institutional intermediaries taking fees.",
          examples: [
            "Cash inheritance: Loses value to inflation over decades",
            "Bitcoin: Tends to appreciate over long time periods",
            "Bank accounts: Can be frozen or seized",
            "Bitcoin: Cannot be confiscated if properly stored"
          ],
          visualDescription: "Bitcoin inheritance is like planting a tree that grows stronger over time and cannot be chopped down by anyone except the person who has the key.",
          keyTakeaways: [
            "Preserves wealth across generations",
            "Protected from government seizure",
            "No institutional intermediaries required",
            "Appreciates rather than depreciates over time"
          ]
        };
      }

      if (fact.title === "Monetary Innovation Platform") {
        diveDeeper = {
          explanation: "Bitcoin serves as a foundation for monetary innovation, enabling new financial applications like the Lightning Network, decentralized exchanges, and programmable money features.",
          examples: [
            "Traditional banking: Innovation controlled by banks",
            "Bitcoin: Open platform for anyone to build on",
            "Credit cards: Closed system owned by companies",
            "Lightning Network: Open system built on Bitcoin"
          ],
          visualDescription: "Bitcoin is like the internet for money - a basic protocol that anyone can build amazing applications on top of.",
          keyTakeaways: [
            "Open platform for financial innovation",
            "Enables second-layer solutions",
            "Permissionless development environment",
            "Foundation for next-generation finance"
          ]
        };
      }

      if (fact.title === "Algorithmic Trust") {
        diveDeeper = {
          explanation: "Bitcoin replaces human trust with mathematical algorithms. You don't need to trust banks, governments, or other people - only the math that everyone can verify.",
          examples: [
            "Banking: Must trust the bank to hold your money",
            "Bitcoin: Trust only in verifiable mathematics",
            "Government promises: Can be broken by new leaders",
            "Bitcoin code: Cannot be changed without consensus"
          ],
          visualDescription: "Algorithmic trust is like having a perfectly honest referee that never plays favorites, never lies, and follows the exact same rules every single time.",
          keyTakeaways: [
            "Trust replaced by verifiable mathematics",
            "No human judgment or discretion",
            "Anyone can verify the rules",
            "Eliminates counterparty risk"
          ]
        };
      }

      if (fact.title === "Cypherpunk Vision") {
        diveDeeper = {
          explanation: "Bitcoin fulfills the cypherpunk vision of using cryptography to protect individual privacy and freedom from surveillance and control by governments and corporations.",
          examples: [
            "Cash transactions: Private but disappearing from society",
            "Bitcoin: Digital privacy through cryptographic protection",
            "Bank surveillance: Every transaction tracked and reported",
            "Bitcoin: Pseudonymous transactions with optional privacy"
          ],
          visualDescription: "The cypherpunk vision is like building digital armor that protects your financial privacy and freedom from those who would spy on or control you.",
          keyTakeaways: [
            "Cryptography protects individual freedom",
            "Resists surveillance and control",
            "Preserves financial privacy",
            "Empowers individual sovereignty"
          ]
        };
      }

      if (fact.title === "Time Preference Alignment") {
        diveDeeper = {
          explanation: "Bitcoin encourages low time preference thinking by rewarding people who save and plan for the future rather than consuming everything immediately.",
          examples: [
            "Inflation: Encourages spending money quickly",
            "Bitcoin: Encourages saving for the future",
            "Credit culture: Promotes immediate gratification",
            "Bitcoin culture: Promotes long-term thinking"
          ],
          visualDescription: "Time preference alignment is like choosing to plant an oak tree that will be valuable in 50 years instead of picking flowers that die tomorrow.",
          keyTakeaways: [
            "Rewards long-term thinking",
            "Encourages saving over consumption",
            "Builds wealth over time",
            "Creates positive cultural changes"
          ]
        };
      }

      // Add remaining advanced facts for days 26-29

      if (fact.title === "Hyperbitcoinization Pathway") {
        diveDeeper = {
          explanation: "Hyperbitcoinization describes the process by which Bitcoin gradually replaces other forms of money as the global standard. This happens naturally as people recognize Bitcoin's superior monetary properties.",
          examples: [
            "Historical example: Gold replaced barter systems naturally",
            "Modern process: Bitcoin replacing fiat currency adoption",
            "Venezuela: Citizens choosing Bitcoin over devaluing bolivar",
            "El Salvador: Government adopting Bitcoin as legal tender"
          ],
          visualDescription: "Hyperbitcoinization is like water flowing downhill - it follows the path of least resistance as people naturally choose better money.",
          keyTakeaways: [
            "Natural adoption of superior money",
            "Replaces inferior monetary systems",
            "Driven by economic necessity",
            "Inevitable due to Bitcoin's properties"
          ]
        };
      }

      if (fact.title === "Sound Money Renaissance") {
        diveDeeper = {
          explanation: "Bitcoin brings back sound money principles that existed during the gold standard era, but with modern digital improvements. This renaissance restores economic sanity and long-term thinking.",
          examples: [
            "19th century: Gold standard created economic prosperity",
            "20th century: Fiat money created boom-bust cycles",
            "Bitcoin era: Return to sound money with digital benefits",
            "Economic stability: Predictable money supply rules"
          ],
          visualDescription: "The sound money renaissance is like rediscovering a lost art that once made civilization prosperous and bringing it back with modern improvements.",
          keyTakeaways: [
            "Returns to proven sound money principles",
            "Combines historical wisdom with modern technology",
            "Restores economic stability and growth",
            "Enables long-term economic planning"
          ]
        };
      }

      if (fact.title === "Monetary Optimization") {
        diveDeeper = {
          explanation: "Bitcoin optimizes money for maximum utility by combining the best properties of all previous forms of money while eliminating their weaknesses through mathematical precision.",
          examples: [
            "Gold: Scarce but hard to transport and verify",
            "Cash: Portable but can be counterfeited",
            "Digital payments: Fast but not private or censorship-resistant",
            "Bitcoin: Combines all benefits while eliminating weaknesses"
          ],
          visualDescription: "Monetary optimization is like designing the perfect tool that combines the best features of all previous tools while fixing everything that was broken.",
          keyTakeaways: [
            "Combines best properties of all money types",
            "Eliminates weaknesses through mathematics",
            "Optimized for global digital economy",
            "Represents pinnacle of monetary evolution"
          ]
        };
      }

      if (fact.title === "Economic Sovereignty Movement") {
        diveDeeper = {
          explanation: "Bitcoin enables entire countries and communities to achieve economic sovereignty by providing an alternative to the US dollar-dominated global financial system.",
          examples: [
            "Countries: Can escape dollar dependency",
            "Communities: Can create local Bitcoin economies",
            "Individuals: Can opt out of failing currencies",
            "Nations: Can build independent monetary policy"
          ],
          visualDescription: "Economic sovereignty is like countries building their own roads instead of being forced to use highways controlled by foreign powers.",
          keyTakeaways: [
            "Provides alternative to dollar dominance",
            "Enables true monetary independence",
            "Empowers communities and nations",
            "Creates multipolar financial world"
          ]
        };
      }

      if (fact.title === "Digital Native Currency") {
        diveDeeper = {
          explanation: "Bitcoin is the first currency designed specifically for the digital age, with properties optimized for internet-based commerce and global connectivity.",
          examples: [
            "Physical cash: Great for local trade, bad for internet",
            "Digital bank transfers: Work online but slow and expensive",
            "Bitcoin: Perfect for both local and internet commerce",
            "Global connectivity: Works seamlessly across all digital platforms"
          ],
          visualDescription: "Bitcoin is like having money that was born on the internet and speaks the native language of computers, unlike old money that was awkwardly translated.",
          keyTakeaways: [
            "Designed specifically for digital world",
            "Native internet money protocol",
            "Optimized for global connectivity",
            "Perfect fit for digital economy"
          ]
        };
      }

      if (fact.title === "Proof of Work Philosophy") {
        diveDeeper = {
          explanation: "Proof of work embodies the philosophy that value should be earned through real effort and energy expenditure, not created through printing or promises.",
          examples: [
            "Traditional work: Physical effort creates value",
            "Proof of work: Energy expenditure secures Bitcoin",
            "Fiat printing: Value created without effort",
            "Bitcoin mining: Value earned through real work"
          ],
          visualDescription: "Proof of work is like requiring people to actually build something valuable before they can claim ownership, instead of just printing certificates.",
          keyTakeaways: [
            "Value must be earned through real effort",
            "Energy expenditure proves genuine work",
            "Prevents value creation without cost",
            "Aligns with natural economic principles"
          ]
        };
      }

      // Final facts for days 28-29

      if (fact.title === "Financial Inclusion Revolution") {
        diveDeeper = {
          explanation: "Bitcoin provides financial services to the billions of people worldwide who are excluded from traditional banking systems, giving them access to savings, payments, and economic participation.",
          examples: [
            "Unbanked populations: 1.7 billion people without bank accounts",
            "Bitcoin access: Only needs internet connection and phone",
            "Remittances: Cheaper money transfers to family abroad",
            "Savings protection: Store value without bank requirements"
          ],
          visualDescription: "Bitcoin's financial inclusion is like building bridges that connect isolated islands to the global economy, allowing everyone to participate regardless of location or status.",
          keyTakeaways: [
            "Provides banking services to unbanked billions",
            "Only requires basic technology access",
            "Enables global economic participation",
            "Removes traditional banking barriers"
          ]
        };
      }

      if (fact.title === "Monetary Sovereignty Nations") {
        diveDeeper = {
          explanation: "Bitcoin enables countries to achieve true monetary sovereignty by providing an alternative to the US dollar system that dominates global trade and finance.",
          examples: [
            "SWIFT system: Controlled by US and allies",
            "Bitcoin network: No single country controls it",
            "Dollar sanctions: Can cut countries from global finance",
            "Bitcoin adoption: Creates independent financial systems"
          ],
          visualDescription: "Monetary sovereignty through Bitcoin is like countries building their own trade routes instead of being forced to use roads controlled by foreign powers.",
          keyTakeaways: [
            "Provides alternative to dollar dominance",
            "Enables independent monetary policy",
            "Protects from financial sanctions",
            "Creates multipolar monetary system"
          ]
        };
      }

      if (fact.title === "Future of Human Coordination") {
        diveDeeper = {
          explanation: "Bitcoin represents a new form of human coordination that enables global cooperation without central authorities, pointing toward a future of voluntary, peaceful organization.",
          examples: [
            "Traditional coordination: Requires governments and institutions",
            "Bitcoin coordination: Voluntary participation and consensus",
            "Global projects: Usually need international treaties",
            "Bitcoin network: Naturally coordinated global effort"
          ],
          visualDescription: "Bitcoin coordination is like a global symphony where thousands of musicians play together perfectly without a conductor, creating beautiful music through voluntary harmony.",
          keyTakeaways: [
            "Enables coordination without central authority",
            "Demonstrates voluntary global cooperation",
            "Points toward peaceful future organization",
            "Proves humans can work together naturally"
          ]
        };
      }

      const newFact: DailyFact = { 
        ...fact, 
        id: this.currentFactId++,
        diveDeeper
      };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Comprehensive lesson content covering all fundamental Bitcoin concepts
    const lessons = [
      // Week 1: Foundation Lessons
      {
        title: "What is Bitcoin? Your First Look at Digital Money",
        content: `Bitcoin is like digital cash that you can use online. But unlike regular money, no bank or government controls it.

Think about regular money for a moment. Every dollar bill or coin needs someone in charge. Banks count your money. Governments print new money. Kings used to make coins. Bitcoin is different because no single person or group controls it.

Here's how Bitcoin works. Imagine you want to send money to a friend online. With regular money, a bank has to help you. The bank checks that you have enough money, then moves it to your friend's account. The bank is in charge of everything.

With Bitcoin, thousands of computers around the world work together instead of one bank. These computers keep track of everyone's Bitcoin. When you send Bitcoin to your friend, all these computers agree that the transaction is real. No single computer or person can cheat.

The coolest part is that there will only ever be 21 million Bitcoin. No one can make more, ever. It's like having a limited edition trading card that can never be printed again. This makes Bitcoin special and valuable.

Bitcoin also lets anyone with internet use it. You don't need a bank account or special permission. If you have internet, you can use Bitcoin anywhere in the world.

This changes everything about money. For the first time ever, people can save and send money without trusting banks or governments. You're in complete control of your own money.`,
        summary: "Bitcoin is digital cash that works without banks. Thousands of computers keep it secure, and only 21 million will ever exist.",
        estimatedReadTime: 3,
        dayIndex: 0,
        whyItMatters: "Learning about Bitcoin helps you understand the future of money. Regular money loses value over time. Your savings get smaller every year because of inflation. Bitcoin works differently. It can't be printed like regular money. Understanding Bitcoin now helps you make smart money choices later. This knowledge protects your financial future."
      },

      {
        title: "The Shared Notebook: How Bitcoin Keeps Track of Everything",
        content: `Bitcoin uses something called a blockchain. Think of it like a shared notebook that everyone can see.

Imagine you and your friends have a notebook where you write down every time someone owes money or pays someone back. But this notebook is special. Everyone gets an exact copy of it. When someone wants to add a new entry, everyone has to agree that it's correct before it gets written down.

That's basically how Bitcoin works. The blockchain is like this shared notebook, but instead of your friends, it's thousands of computers around the world that all have the same copy.

When you want to send Bitcoin to someone, here's what happens. Your wallet tells everyone on the network that you want to send some Bitcoin. It's like announcing to the whole room that you're paying someone back.

Then, special people called miners collect all these announcements and put them together. They're like the people who actually write in the notebook. But here's the cool part - they have to solve a really hard math puzzle first to earn the right to write the new page.

The first miner to solve the puzzle gets to add their page to everyone's notebook. They also get some new Bitcoin as a reward for their work. Then everyone else checks to make sure the math is right and the transactions are real.

This happens about every 10 minutes. A new page gets added to the notebook, and the chain of pages keeps growing. That's why it's called a "blockchain" - it's literally a chain of blocks full of transactions.

The really smart thing about this system is that cheating is almost impossible. To change something that was already written, you'd need to control more than half of all the computers in the world. That would cost billions of dollars and tons of electricity.

So the blockchain keeps Bitcoin safe without needing any banks or governments to watch over it.`,
        summary: "The blockchain is like a shared notebook that thousands of computers keep together. New pages are added every 10 minutes after solving math puzzles.",
        estimatedReadTime: 3,
        dayIndex: 1,
        whyItMatters: "Understanding how Bitcoin keeps records helps you trust the system. Regular banks can change their records or lie about what happened. The blockchain makes lying impossible because thousands of computers check everything. This means your Bitcoin is safer than money in banks. You can verify everything yourself instead of trusting others."
      },

      {
        title: "Why Bitcoin is Better Than Regular Money",
        content: `Regular money has some big problems that Bitcoin fixes. Let's talk about why this matters.

First, let's understand what happened to money. Before 1971, dollars were backed by gold. If you had a dollar, you could trade it for real gold. But then the government said "we don't want to do that anymore" and just started printing money whenever they wanted.

This created three big problems that hurt regular people every day.

Problem number one is that your money loses value over time. When the government prints more money, your money becomes worth less. It's like if there were only 100 baseball cards in the world, and then someone printed 100 more. Now your card is worth half as much. Since 1971, the dollar has lost 85% of its value. That means what cost $1 back then would cost $6 today.

Problem number two is that banks and governments control your money. They can freeze your bank account anytime they want. They can stop your payments. They can even take your money if they don't like what you're doing. You don't really control your own money - they do.

Problem number three is that billions of people can't even get bank accounts. If you live in the wrong place or don't have the right paperwork, banks won't help you. Over 2 billion people are locked out of the money system completely.

Bitcoin solves all these problems. Since there will only ever be 21 million Bitcoin, your Bitcoin can't lose value from printing more. Nobody can freeze your Bitcoin or stop your payments because no single person controls it. And anyone with internet can use Bitcoin, no matter where they live or what paperwork they have.

Bitcoin gives you back control of your own money. It protects you from governments printing money and banks controlling your life. For the first time, regular people have money that belongs completely to them.`,
        summary: "Regular money loses value from printing, gives banks control over you, and locks out billions of people. Bitcoin fixes all these problems.",
        estimatedReadTime: 3,
        dayIndex: 2,
        whyItMatters: "Understanding why regular money fails helps you see why Bitcoin matters. Every year, your savings become worth less because of inflation. Banks can control your money and lock you out. Learning this protects you from these problems. Bitcoin gives you a way to escape a broken money system."
      },

      {
        title: "Your Bitcoin Wallet: Like a Digital Key Ring",
        content: `Bitcoin wallets work differently than bank accounts. Let's learn how to keep your Bitcoin safe.

Think of your Bitcoin like it's stored in a locker. The locker is on the shared notebook that everyone can see. But to open your locker, you need a special key. In Bitcoin, this key is called a private key. It's a secret code that only you should know.

Your Bitcoin wallet is like a key ring that holds your secret codes. The wallet doesn't actually store Bitcoin inside it. Instead, it holds the keys that prove the Bitcoin belongs to you. When you want to check how much Bitcoin you have, the wallet looks at the shared notebook to see what's in your lockers.

The most important rule in Bitcoin is "Not your keys, not your coins." This means if you don't control the secret key, you don't really own the Bitcoin. It's like if someone else holds your house keys - they could lock you out anytime they want.

There are different types of wallets for different needs. Hardware wallets are like a safe where you keep your keys completely disconnected from the internet. Phone apps are convenient for small amounts you use every day. Some people even write their keys on paper and hide them. Exchanges are like letting someone else hold your keys for you, which is risky.

The most important thing is backing up your seed phrase. This is usually 12 words that can restore your whole wallet if your phone breaks. Write these words on paper and hide them somewhere safe. Never type them on a computer or tell anyone what they are. If someone gets your seed phrase, they can steal all your Bitcoin.

When you use Bitcoin, you become your own bank. This gives you amazing freedom, but it also means you're responsible for keeping your money safe. Start with small amounts while you learn, then you can store more as you get comfortable.`,
        summary: "Bitcoin wallets hold your secret keys, not your Bitcoin. 'Not your keys, not your coins' means you must control your keys to own your Bitcoin.",
        estimatedReadTime: 3,
        dayIndex: 3,
        whyItMatters: "Learning about Bitcoin wallets protects your money from being stolen or lost. Many people lose their Bitcoin because they don't understand how wallets work. If you keep Bitcoin on an exchange, they control your money. Understanding wallets means you control your own money instead of trusting others."
      },

      {
        title: "Bitcoin Mining: The Digital Gold Rush",
        content: `Bitcoin mining is like a digital gold rush, but instead of digging for gold, people use computers to solve puzzles.

Mining does three important jobs for Bitcoin. First, miners check that all transactions are real and follow the rules. Second, they protect the network from bad actors trying to cheat. Third, they get rewarded with new Bitcoin for doing this work.

Here's how mining works. Thousands of miners around the world compete to solve really hard math puzzles. These puzzles need lots of computer power and electricity to solve. The first miner to solve the puzzle wins the right to add the next page to the shared notebook and gets rewarded with new Bitcoin.

This competition might seem wasteful, but it's actually brilliant. The energy cost makes it super expensive for anyone to attack Bitcoin. To cheat, you'd need to spend more electricity than all the honest miners combined. This would cost billions of dollars, making attacks pointless.

Bitcoin has a special rule about rewards. Every four years, the reward for mining gets cut in half. It started at 50 Bitcoin per block in 2009. Then it dropped to 25 in 2012, then 12.5 in 2016, and now it's 6.25. The next halving will drop it to 3.125.

This shrinking reward makes Bitcoin more valuable over time. It's like if there was a gold mine that produced less gold every four years. Eventually, no new Bitcoin will be made at all, with a maximum of 21 million coins ever.

Mining isn't wasteful energy use. It's like Bitcoin's security system that keeps everyone's money safe. The more energy miners use, the safer Bitcoin becomes for everyone.`,
        summary: "Bitcoin mining uses computer puzzles to secure the network and create new Bitcoin. Rewards get cut in half every four years, making Bitcoin increasingly rare.",
        estimatedReadTime: 3,
        dayIndex: 4,
        whyItMatters: "Understanding Bitcoin mining helps you see why Bitcoin is secure and valuable. Mining makes it almost impossible for anyone to cheat or steal. The halving events make Bitcoin scarcer over time, which helps protect your savings from inflation. This knowledge helps you understand why Bitcoin gets more valuable as time goes on."
      },

      {
        title: "Why Bitcoin is Called Digital Gold",
        content: `People call Bitcoin "digital gold" because it has all the good things about gold, but works even better for the modern world.

Good money has always needed five important features. It must be scarce so there's not too much of it. It must last a long time without breaking. It must be easy to move around. It must break into smaller pieces for different sized purchases. And it must be easy to tell if it's real or fake.

Let's compare Bitcoin to gold on these five features. For scarcity, Bitcoin wins because only 21 million will ever exist. With gold, we don't know how much is left to find, and someday we might even mine gold from asteroids. For lasting power, Bitcoin lasts forever since it's just computer code. Gold can rust or get damaged. For moving around, Bitcoin travels instantly anywhere in the world. Gold is heavy and expensive to ship safely.

For making smaller pieces, Bitcoin easily divides into 100 million tiny pieces called satoshis. Splitting gold requires melting and special equipment. For checking if it's real, Bitcoin uses math that instantly proves it's genuine. Testing gold requires expensive equipment and takes time.

But Bitcoin has extra benefits that gold could never have. You can program Bitcoin to automatically send itself based on rules you set up. You don't need vaults or guards to store it safely. Every transaction is public so everyone can verify what happened. And if you control your private keys, nobody can take your Bitcoin away from you.

As more people learn about these advantages, more people want Bitcoin. But since there will only ever be 21 million, the price tends to go up over time. Each new person who joins makes the network stronger and more valuable.

Bitcoin is like gold's smarter, faster, stronger digital cousin. It keeps all the good parts of gold but fixes all the problems.`,
        summary: "Bitcoin is called digital gold because it has all of gold's good features but works better. It's scarce, durable, portable, divisible, and verifiable.",
        estimatedReadTime: 3,
        dayIndex: 5,
        whyItMatters: "Understanding why Bitcoin is like digital gold helps you see why it's valuable for saving money. Gold has been trusted for thousands of years, but it's hard to use in the modern world. Bitcoin has all the good parts of gold but works better with today's technology. This knowledge helps you understand why Bitcoin protects your wealth."
      },

      {
        title: "Lightning Network: Bitcoin's Fast Lane",
        content: `Bitcoin has two layers that work together like a highway system. The main Bitcoin network is like the interstate highways - very secure but slower. Lightning Network is like the city streets - super fast for everyday trips.

Regular Bitcoin takes about 10 minutes to confirm a transaction. That's perfect for big payments, like buying a car. But what if you want to buy a cup of coffee? Nobody wants to wait 10 minutes to pay for coffee. That's where Lightning Network comes in.

Lightning works by creating shortcuts between people who pay each other often. Imagine you and your favorite coffee shop opening a shared piggy bank. You both put some money in it, and now you can instantly trade money back and forth as many times as you want. When you're done, you count up who owes what and settle the final amount on the main Bitcoin network.

The really cool part is that these shortcuts connect to each other. If you have a shortcut with the coffee shop, and the coffee shop has a shortcut with the grocery store, then you can pay the grocery store by routing the payment through the coffee shop. It's like passing a note through friends to reach someone you don't know directly.

Lightning payments happen in less than a second and cost almost nothing. You can send a penny or a thousand dollars for the same tiny fee. The payments are also more private because they don't get written on the public shared notebook that everyone can see.

People are already using Lightning for lots of cool stuff. Artists get tips online instantly. Stores accept payments right at the cash register. People send money to family in other countries without waiting days for banks. Gamers buy items in games with payments too small for regular Bitcoin.

This two-layer system is brilliant. The main Bitcoin network stays super secure for big, important transactions. Lightning handles all the small, everyday payments instantly. Together, they make Bitcoin work for everything from saving money to buying coffee.`,
        summary: "Lightning Network is Bitcoin's fast payment layer. It enables instant, cheap transactions while keeping the main Bitcoin network secure for big payments.",
        estimatedReadTime: 3,
        dayIndex: 6,
        whyItMatters: "Understanding Lightning Network shows you how Bitcoin can be used for everyday spending. Regular Bitcoin transactions can be slow and expensive for small purchases. Lightning makes Bitcoin work like instant digital cash. This knowledge helps you see how Bitcoin can replace regular money for all your daily needs, not just big savings."
      },

      // Days 7-29: Complete the 30-day curriculum
      {
        title: "What's Wrong with Banks and Why Bitcoin Fixes It",
        content: `Regular banks and money have some serious problems that hurt billions of people every day. Understanding these problems shows why Bitcoin is so important.

The first big problem is that governments keep printing more money, which makes your money worth less over time. When they print new money, it's like stealing value from everyone who already has money, but they don't call it stealing. Since 1971, the dollar has lost 96% of its value. This isn't an accident - governments do this on purpose to make you spend money instead of saving it.

The second problem is that banks won't help everyone. Over 2 billion people can't even get a bank account. Banks want lots of paperwork, minimum amounts of money, and you have to live in the right place. If you don't meet their requirements, you're locked out of the money system completely, even if you have valuable skills to offer.

The third problem is that banks and governments can control your money however they want. They can freeze your account without warning. They can reverse payments after you thought they were done. They can cut off entire groups of people from financial services if they don't like their politics. This has happened to truckers in Canada, people in Russia, and many others.

The fourth problem is that sending money across borders is expensive and slow. Banks charge 5-15% to send money to other countries and take days to do it. This really hurts people who work in one country but need to send money home to their families.

Bitcoin fixes all these problems with its design. Since only 21 million Bitcoin will ever exist, printing more is impossible. Anyone with internet can use Bitcoin, no matter where they live or what paperwork they have. Nobody can freeze your Bitcoin or stop your payments because no single person controls it. And Bitcoin moves across borders instantly for almost no cost.

Bitcoin isn't just better technology - it's money that belongs to the people instead of banks and governments.`,
        summary: "Banks cause inflation, exclude people, control your money, and charge high fees. Bitcoin fixes these problems with fixed supply, open access, and no central control.",
        estimatedReadTime: 3,
        dayIndex: 7,
        whyItMatters: "Understanding bank problems shows you why Bitcoin matters for your life. Banks hurt your money through inflation and control what you can do with it. This affects your family's future and freedom. Learning this helps you make better money choices. Bitcoin gives you a way to avoid these problems and protect your family's wealth."
      },

      {
        title: "How Bitcoin Payments Actually Work",
        content: `When you send Bitcoin, something very different happens than when you send regular money through a bank. Let's break down what really goes on.

With regular money, banks move numbers around in their computers. When you send $20 to a friend, your bank subtracts $20 from your account and adds $20 to your friend's account. The bank controls everything and keeps track of who owns what.

Bitcoin works differently. When you send Bitcoin, you're not moving coins from one account to another. Instead, you're creating a message that proves you have the right to spend some Bitcoin and saying who should get it next. It's like passing ownership of something valuable by showing proof that it belongs to you.

Every Bitcoin payment has a few important parts. First, it points to where you got the Bitcoin you're spending, proving it's really yours. Second, it says which Bitcoin address should receive the Bitcoin and how much. Third, it includes a small fee to pay the miners. Finally, it has your digital signature that proves you control the secret key needed to spend this Bitcoin.

When you send your payment, thousands of computers around the world check to make sure everything is correct. They verify that you actually own the Bitcoin you're trying to spend, that your signature is real, and that you're not trying to spend more than you have. Since thousands of computers all check the same thing, nobody can cheat.

After the payment is verified, it goes into a waiting area called the mempool until a miner includes it in a new block. If you pay a higher fee, miners will prioritize your payment. When lots of people are sending payments, fees go up. When few people are sending payments, fees are cheap.

Once your payment gets included in a block, it becomes part of the permanent record. The more new blocks that get added after yours, the more secure your payment becomes. After six new blocks, your payment is considered completely final and can't be reversed.

This creates something amazing: you can send money to anyone in the world without trusting any bank or government, and it's all secured by math instead of institutions.`,
        summary: "Bitcoin payments create proof messages instead of moving money between accounts. Thousands of computers verify each payment to prevent cheating.",
        estimatedReadTime: 3,
        dayIndex: 8,
        whyItMatters: "Understanding how Bitcoin payments work shows you why they're safer than bank payments. Banks can reverse payments even after you thought they were done. Bitcoin payments are final and can't be taken back by banks or governments. This knowledge helps you trust Bitcoin for important transactions and understand why it's better money."
      },

      {
        title: "The Story of Bitcoin: From Mystery Person to Global Money",
        content: `Bitcoin has an amazing story that starts with a mystery person and ends up changing money forever.

For many years, computer experts tried to create digital money that worked without banks. But every time they tried, they needed someone to be in charge and make sure people didn't cheat. Every attempt failed because having someone in charge meant that person could mess things up.

Then on October 31, 2008, someone using the name Satoshi Nakamoto published a paper called "Bitcoin: A Peer-to-Peer Electronic Cash System." Nobody knows who Satoshi really is - it could be one person or a group of people. This paper explained how to create digital money that didn't need anyone in charge.

On January 3, 2009, Satoshi created the first Bitcoin block. Hidden in this first block was a newspaper headline: "Chancellor on brink of second bailout for banks." This wasn't random - it showed that Bitcoin launched during a financial crisis when banks needed government help. Satoshi was making a point about why we needed better money.

At first, only computer geeks and people who didn't trust governments used Bitcoin. The first time someone bought something real with Bitcoin was on May 22, 2010. A programmer named Laszlo bought two pizzas for 10,000 Bitcoin. Today we call this Bitcoin Pizza Day. Those same Bitcoin would be worth hundreds of millions of dollars now.

Something really interesting happened in 2011. Satoshi Nakamoto disappeared completely. He stopped posting messages and handed control to other developers. But Bitcoin kept working perfectly without him. This proved that Bitcoin really didn't need any single person in charge.

Over the years, Bitcoin hit many big milestones. The first exchange opened in 2010. The mining rewards got cut in half for the first time in 2012. Big companies started buying Bitcoin in 2020. And in 2021, El Salvador became the first country to make Bitcoin official money.

Today, Bitcoin runs on over 15,000 computers worldwide and processes millions of payments every month. It has never been hacked or shut down. What started as an experiment by a mystery person has become a new type of money that works everywhere in the world.`,
        summary: "Bitcoin was created by the mysterious Satoshi Nakamoto in 2009. It went from computer experiment to global money that works without banks or governments.",
        estimatedReadTime: 3,
        dayIndex: 9,
        whyItMatters: "Learning Bitcoin's history helps you understand why it's trustworthy. Bitcoin has worked perfectly for over 15 years without any breaks or hacks. The creator disappeared but Bitcoin kept working, proving no single person controls it. This history shows Bitcoin is reliable technology that protects your money better than banks."
      },

      {
        title: "Why Bitcoin is Slow (And Why That's Actually Smart)",
        content: `Bitcoin only processes about 7 transactions per second worldwide. That might sound slow, but it's actually a brilliant design choice.

Bitcoin could be made faster, but that would make it less secure and less fair. This is like choosing between a race car and a tank. A race car is fast but fragile. A tank is slow but incredibly strong. Bitcoin chose to be like a tank.

There's something called the "blockchain triangle" that explains this. Any digital money system can only be really good at two out of three things: fast, secure, or decentralized. Bitcoin chose secure and decentralized, which means it's slower but much safer.

If Bitcoin tried to be faster by handling more transactions at once, you'd need a super powerful computer to help run the network. Right now, anyone can help run Bitcoin with a regular computer. But if you needed expensive equipment, only rich people could participate. This would make Bitcoin controlled by the wealthy instead of belonging to everyone.

This actually caused a big argument in the Bitcoin community from 2015 to 2017. Some people wanted to make Bitcoin faster by changing the basic rules. Other people said this would ruin what makes Bitcoin special. The people who wanted to keep Bitcoin decentralized won.

The solution is to use layers, just like the internet does. The bottom layer of Bitcoin stays super secure but slow. Then we build faster layers on top of it, like Lightning Network. It's like having secure bank vaults for big money and fast payment apps for daily spending.

Lightning Network can handle millions of transactions per second while still using Bitcoin's security. Other new technologies are being built on top of Bitcoin too. Each layer does what it's best at.

This way, Bitcoin can be both a safe place to store lots of money and a fast way to buy coffee. You choose which layer to use based on what you need. Big important payments use the slow, secure layer. Daily spending uses the fast layers.

Bitcoin's approach means it can grow to serve the whole world while staying secure and belonging to everyone, not just big companies.`,
        summary: "Bitcoin is intentionally slow to stay secure and decentralized. Fast layers like Lightning Network are built on top for everyday payments.",
        estimatedReadTime: 3,
        dayIndex: 10,
        whyItMatters: "Understanding why Bitcoin is slow helps you see why it's trustworthy. Fast payment systems can be hacked or controlled by companies. Bitcoin's slowness makes it impossible to hack or control. Lightning Network gives you speed when you need it while keeping the main system super secure for your savings."
      },

      {
        title: "Does Bitcoin Use Too Much Energy?",
        content: `People often worry that Bitcoin uses too much electricity. But when you look at the full picture, Bitcoin's energy use makes a lot of sense.

Bitcoin uses energy on purpose to stay secure. The more electricity miners use, the harder it becomes for bad actors to attack Bitcoin. To hack Bitcoin, someone would need to use more electricity than all honest miners combined. This would cost billions of dollars, making attacks pointless.

How much energy does Bitcoin actually use? About 0.1% of all electricity in the world. That's less than Christmas lights, clothes dryers, or computer data centers. When you add up all the bank buildings, ATMs, armored trucks, and servers that traditional banking needs, Bitcoin uses way less energy than the system it replaces.

Here's something interesting: most Bitcoin mining now uses clean energy like solar, wind, and water power. Studies show that 50-60% of mining runs on renewable energy. This happens because miners want the cheapest electricity, and clean energy is often the cheapest.

Bitcoin miners actually help the electricity grid work better. When there's extra electricity that nobody needs, miners can use it. When lots of people need electricity, miners can turn off their machines and sell their electricity back to the grid. This helps balance supply and demand.

Bitcoin mining also drives innovation in clean energy. Miners are building solar farms, wind turbines, and hydroelectric plants that help entire communities. They're also using wasted energy, like natural gas that oil companies usually just burn off.

The real question isn't whether Bitcoin uses energy, but whether it's worth it. Bitcoin gives billions of people access to money without needing banks. It protects savings from inflation. It enables instant payments worldwide. For many people, these benefits are definitely worth the energy cost.

Compare this to banking systems that use energy just to maintain buildings and servers, even when nobody is making transactions. Bitcoin's energy creates a money system that works for everyone, everywhere, all the time.`,
        summary: "Bitcoin uses energy for security and mostly runs on clean power. It uses less energy than traditional banking and drives renewable energy innovation.",
        estimatedReadTime: 3,
        dayIndex: 11,
        whyItMatters: "Understanding Bitcoin's energy use helps you answer critics and feel confident about using Bitcoin. Many people worry Bitcoin hurts the environment, but it actually uses clean energy and helps build renewable power systems. This knowledge helps you explain to others why Bitcoin is good for the future and the planet."
      },

      {
        title: "Why Bitcoin Gets More Valuable Over Time",
        content: `Bitcoin has rules built into its code that make it different from any money that has ever existed. These rules make Bitcoin more valuable as time goes on.

Regular money like dollars has a big problem. The government can print as much as they want, whenever they want. When they print more money, your savings become worth less. You have no way to know how much money they'll print tomorrow, next year, or in ten years. This makes it hard to plan for the future.

Bitcoin is completely different. The rules for creating new Bitcoin are written in computer code and can't be changed easily. Everyone knows exactly how many new Bitcoin will be created and when. There will only ever be 21 million Bitcoin, period. No one can change this rule.

Every four years, something special happens called "halving." The amount of new Bitcoin created gets cut in half. This started at 50 Bitcoin every 10 minutes in 2009. It dropped to 25 in 2012, then 12.5 in 2016, and now it's 6.25. Each time this happens, fewer new Bitcoin are created, making Bitcoin more scarce.

This is like a gold mine that produces less gold every four years until it eventually runs out completely. But unlike gold mines, we know exactly when this will happen and how much less will be produced each time.

History shows that when halvings happen, Bitcoin's price tends to go up significantly over the following year or two. This makes sense because there's less new Bitcoin being created but demand stays the same or grows.

Around the year 2140, the last Bitcoin will be mined. After that, no new Bitcoin will ever be created. Miners will only earn money from transaction fees. At this point, Bitcoin will be perfectly scarce - something that has never existed in human history.

This is completely different from everything else we consider valuable. There's always more gold to mine, more land to develop, more stocks to issue. But Bitcoin's scarcity is absolute and guaranteed by math, not promises.

Bitcoin rewards people who save and think long-term instead of spending everything right away. This encourages building wealth instead of consuming everything immediately.`,
        summary: "Bitcoin's halvings reduce new supply every four years until only 21 million will ever exist. This guaranteed scarcity makes Bitcoin more valuable over time.",
        estimatedReadTime: 3,
        dayIndex: 12,
        whyItMatters: "Understanding halving events helps you time your Bitcoin purchases and see why Bitcoin gets more valuable. Every four years, new Bitcoin becomes scarcer, which usually pushes prices higher. This knowledge helps you plan your savings strategy and understand why Bitcoin protects your wealth better than regular money that gets printed endlessly."
      },

      // Days 13-29: Continue with essential Bitcoin topics
      {
        title: "How to Really Own Your Bitcoin",
        content: `There's a big difference between really owning your Bitcoin and just having some website show you a number. Understanding this difference is crucial for your financial security.

Real Bitcoin ownership means you control the secret password (called a private key) that can spend your Bitcoin. When you control this password, you have complete control over your money. No company can freeze your account, steal your money, or stop you from using it. This is completely different from banks where they can freeze your account anytime they want.

When you let someone else hold your Bitcoin (like an exchange), they control the secret password, not you. You're trusting them to give your Bitcoin back when you ask for it. But history shows that many of these companies have been hacked, stolen customer money, or simply gone out of business.

There's a famous saying in Bitcoin: "Not your keys, not your coins." This means if you don't control the secret password, you don't really own the Bitcoin. You just have a promise from someone else that they'll give it back to you.

You have different options for storing your Bitcoin yourself. Hardware wallets are like small computers that keep your secret password completely offline. They're the most secure option. Software wallets on your phone or computer are convenient but slightly less secure. Paper wallets are ultra-secure for long-term storage.

Learning to hold your own Bitcoin takes some practice, but it's not that hard. Start with small amounts while you learn the basics. Practice backing up your seed phrase (the 12 or 24 words that can recover your wallet) and restoring your wallet. Once you're comfortable, you can store larger amounts.

For extra security, you can use something called multi-signature, which requires multiple passwords to spend Bitcoin. For example, you might keep one password on your phone, one on a hardware wallet, and one in a safe. This way, if you lose one password, you can still access your Bitcoin.

Different amounts of Bitcoin need different levels of security. Money you spend daily can stay in a convenient phone wallet. Serious savings should go in more secure storage.

Taking control of your own Bitcoin is the whole point of Bitcoin. Instead of trusting banks and companies, you become your own bank. This gives you true financial freedom that didn't exist before Bitcoin.`,
        summary: "Really owning Bitcoin means controlling your own private keys instead of trusting companies. This gives you complete control over your money.",
        estimatedReadTime: 3,
        dayIndex: 13,
        whyItMatters: "Learning to really own your Bitcoin protects you from losing your money when companies fail. Many people have lost Bitcoin by trusting exchanges that got hacked or went out of business. Controlling your own keys means no company can freeze your money or steal it. This knowledge gives you true financial independence."
      },

      {
        title: "Is Bitcoin Private or Public?",
        content: `Bitcoin is both private and public at the same time, which confuses many people. Understanding this balance helps you use Bitcoin safely and effectively.

Every Bitcoin transaction gets recorded forever on a public ledger that anyone can see. This includes the amount sent, the sending address, and the receiving address. But here's the key: these addresses don't automatically tell you who owns them.

Bitcoin addresses are like random account numbers that don't include your name. When you make a transaction, people can see that Address X sent Y amount to Address Z, but they don't know that Address X belongs to you. It's like seeing a transaction between two random numbers.

This public ledger creates something amazing: anyone can verify that Bitcoin works correctly. You can check the total supply (exactly 21 million), see all transactions, and prove that no one is cheating. No bank or government can hide their money printing like they do with regular money.

You can create unlimited Bitcoin addresses for free. Smart users create a new address for each transaction, making it very hard to link transactions together. It's like having thousands of bank accounts with random numbers that no one knows belong to you.

There are ways to protect your privacy even more. Don't reuse addresses. Use services that mix your Bitcoin with other people's Bitcoin. Connect to the internet through privacy networks like Tor. Most people maintain good privacy just by following basic practices.

Some companies try to figure out who owns which addresses by looking for patterns and combining information from exchanges. But this takes huge resources and expert knowledge. Regular people can maintain privacy with simple precautions.

Different countries have different rules about Bitcoin privacy. Some require exchanges to collect lots of personal information. Others are more privacy-friendly. It's important to understand your local laws.

The public nature of Bitcoin isn't a bug - it's a feature. It means anyone can audit the system to make sure it's fair. You can verify payments without trusting anyone. You can prove exactly how much money exists.

Future improvements will make Bitcoin even more private. New technologies make complex transactions look simple. Lightning Network keeps small payments private. But Bitcoin will always balance privacy for individuals with transparency for verification.

Bitcoin gives you more privacy than banks (which see everything) but requires you to understand how it works. The public ledger means you need to take active steps to protect your privacy.`,
        summary: "Bitcoin transactions are public but addresses are anonymous. This gives you privacy if you use it correctly while keeping the system transparent for everyone.",
        estimatedReadTime: 3,
        dayIndex: 14,
        whyItMatters: "Understanding Bitcoin's privacy helps you use it safely without revealing personal information. You get better privacy than banks while still proving transactions work correctly. This knowledge helps you protect your financial information while enjoying Bitcoin's transparency benefits for checking the system is fair."
      },

      {
        title: "Why Bitcoin Gets Better as More People Use It",
        content: `Bitcoin has a special property: it becomes more valuable and useful as more people start using it. This creates a snowball effect that makes Bitcoin grow faster over time.

This is called a "network effect." Think about phones - the first person with a phone couldn't call anyone, so it was useless. But as more people got phones, each phone became more valuable because you could call more people. Bitcoin works the same way.

When more people and businesses accept Bitcoin, it becomes more useful for everyone who already has it. Each new user makes Bitcoin more valuable for all existing users. This creates a positive feedback loop that keeps growing.

Bitcoin's growth follows a predictable pattern. At first, only a few tech-savvy people used it, so it wasn't very useful. As more people joined, Bitcoin became more useful faster and faster. Eventually, Bitcoin becomes so valuable that not using it puts you at a disadvantage.

There's even a mathematical rule for this called Metcalfe's Law. It says that when you double the number of users, the network's value goes up four times. This helps explain why Bitcoin's price can rise so dramatically during adoption waves.

Different types of people joining Bitcoin help in different ways. Regular people create demand for Bitcoin as money. Businesses make it useful for buying things. Large companies give it credibility. Developers make it work better. Each group makes Bitcoin more valuable for all the others.

Bitcoin is especially valuable in different parts of the world for different reasons. In countries with bad inflation, people use Bitcoin to protect their savings. In places with poor banking, Bitcoin gives people access to financial services. In countries with strict money controls, Bitcoin lets people send money across borders.

Lightning Network makes this network effect even stronger by allowing instant, cheap Bitcoin payments. As more people use Lightning, it becomes more connected and useful for everyone.

When big companies and governments start using Bitcoin, it gives confidence to smaller users. This institutional adoption brings better rules and infrastructure that helps everyone.

Eventually, Bitcoin reaches a tipping point where it's too important to ignore. At this point, people start buying Bitcoin just to avoid being left behind, which makes it grow even faster.

Unlike traditional money that's limited to one country, Bitcoin is global from day one. This makes it the first truly worldwide money that gets better with worldwide adoption.

The more people learn about Bitcoin's real benefits (not just its price), the more stable its growth becomes. Bitcoin is still early in this adoption process, so each new user continues to make it more valuable for everyone.`,
        summary: "Bitcoin gets more valuable as more people use it. This network effect creates a snowball that makes Bitcoin grow faster over time.",
        estimatedReadTime: 3,
        dayIndex: 15,
        whyItMatters: "Understanding network effects helps you see why Bitcoin will keep growing in value. As more people use Bitcoin, it becomes more useful for you too. Early users benefit the most from this growth. This knowledge helps you understand why getting Bitcoin now could be much better than waiting until everyone already has it."
      },

      {
        title: "How Bitcoin Keeps Getting Better",
        content: `Bitcoin is amazing technology that keeps improving over time, but it does so very carefully to avoid breaking what makes it special.

Bitcoin didn't invent any completely new technology. Instead, it brilliantly combined existing technologies that had never worked together before. It uses cryptography to secure transactions, digital signatures to prove ownership, and mining to create agreement without anyone being in charge.

Bitcoin follows a set of rules that everyone must follow. These rules decide how transactions work, how new blocks get created, and how the network stays in agreement. The brilliant part is that following the rules is always more profitable than trying to cheat.

When Bitcoin gets upgraded, it happens very slowly and carefully. Everyone in the community - users, developers, and miners - has to agree before any changes happen. This makes sure improvements don't accidentally break Bitcoin's security or decentralization.

Some major upgrades have already happened. SegWit made transactions more efficient and enabled Lightning Network. Taproot made complex transactions look simple on the blockchain, improving privacy. These upgrades took years of discussion and testing.

Lightning Network is the biggest innovation built on top of Bitcoin. It allows instant, cheap payments while still using Bitcoin's security. Think of it like having a tab at a bar - you make lots of small purchases, then settle up at the end using the main Bitcoin network.

Bitcoin can do more than just send money from one person to another. It can support complex arrangements like requiring multiple signatures to spend money, or locking money until a certain date. But it does this carefully to maintain security.

Bitcoin's code is completely open source, meaning anyone can read it and suggest improvements. This has made Bitcoin one of the most reviewed and secure software projects in history. Thousands of experts have examined every line of code.

Bitcoin is built in layers, like a building. The bottom layer focuses on security and settlement. Higher layers add features like Lightning Network. This lets Bitcoin add new capabilities without risking the foundation.

Future improvements will make Bitcoin even better while keeping what makes it special. We might see better privacy, more smart contract features, and faster processing. But every change must keep Bitcoin secure and decentralized.

Bitcoin's approach to innovation shows that breakthrough technology often comes from combining existing pieces in smart new ways, not necessarily inventing everything from scratch.`,
        summary: "Bitcoin carefully combines existing technologies and keeps improving through slow, careful upgrades that maintain security while adding new features.",
        estimatedReadTime: 3,
        dayIndex: 16,
        whyItMatters: "Understanding Bitcoin's technology helps you trust it more and see why it keeps getting better. Bitcoin improves slowly to stay secure, unlike other cryptocurrencies that break from rushed changes. This knowledge helps you see why Bitcoin is the safest long-term choice and why future improvements will make it even more useful."
      }
    ];

    // Add simplified lessons for days 17-29 to complete the 30-day curriculum
    const additionalLessons = [];
    
    const simplifiedTopics = [
      {
        title: "Bitcoin vs Gold: Digital vs Physical",
        content: `People often compare Bitcoin to gold because both are scarce and valuable. But Bitcoin has several advantages over gold that make it better money for the digital age.

Gold has been valuable for thousands of years because it's scarce, durable, and hard to fake. But gold has problems. It's heavy to carry, hard to divide into small pieces, expensive to store securely, and difficult to verify if it's real.

Bitcoin solves all of gold's problems while keeping the good parts. Bitcoin is perfectly scarce (only 21 million will ever exist), completely durable (it can't rust or decay), easily divisible (you can send tiny fractions), cheap to store (just remember your seed phrase), and easy to verify (the network checks every transaction).

You can send Bitcoin anywhere in the world in minutes. Try sending gold across borders and you'll face customs, fees, and lots of paperwork. Bitcoin doesn't care about borders.

Bitcoin is also more private than gold. When you buy gold, dealers often require identification and report large purchases. Bitcoin can be bought and held privately if you're careful.

The biggest advantage is that Bitcoin can't be confiscated as easily as gold. Throughout history, governments have seized gold from citizens. In 1933, the US government made owning gold illegal and forced people to sell it. With Bitcoin, if you control your own keys, no one can take your Bitcoin without your permission.

Bitcoin is like gold but better: perfectly scarce, instantly transportable, easily divisible, and resistant to confiscation. This is why many people call Bitcoin "digital gold."`,
        summary: "Bitcoin improves on gold's properties while solving its problems: easy transport, divisibility, and resistance to confiscation.",
        whyItMatters: "Comparing Bitcoin to gold helps you understand why Bitcoin is better money. Gold has been valuable for thousands of years, but Bitcoin solves all of gold's problems while keeping the good parts. This knowledge helps you see why Bitcoin is the next step in money's evolution and why digital money beats physical money."
      },
      {
        title: "Why Bitcoin Is Different from Stocks",
        content: `Some people think Bitcoin is just another investment like buying stocks. But Bitcoin is fundamentally different from stocks in important ways.

When you buy a stock, you're buying a piece of a company. The stock's value depends on how well that company does. Companies can go out of business, get sued, or make bad decisions that hurt the stock price.

Bitcoin isn't a company. It's a monetary network that belongs to everyone and no one. There's no CEO who can make bad decisions. There's no single company that can fail. Bitcoin operates according to rules written in code that thousands of people around the world enforce.

Stocks represent ownership in businesses that try to make profit. Bitcoin represents ownership of a new type of money. Money and businesses serve completely different purposes in society.

Companies can issue more stocks anytime they want, diluting your ownership. Bitcoin's supply is fixed at 21 million forever. No one can create more Bitcoin to dilute your holdings.

Bitcoin works 24/7, 365 days a year. Stock markets close nights and weekends. You can send Bitcoin to anyone anywhere at any time.

Bitcoin doesn't depend on any single country's economy or government. Stocks are usually tied to specific companies in specific countries with specific regulations.

Most importantly, Bitcoin gives you direct ownership. When you own Bitcoin with your own keys, you truly own it. When you own stocks, they're usually held by a broker who could potentially restrict your access.

Bitcoin isn't competing with stocks - it's competing with money itself. It's trying to become a better form of money for the digital age.`,
        summary: "Bitcoin is money, not a stock. It has fixed supply, works globally 24/7, and gives you direct ownership unlike traditional investments.",
        whyItMatters: "Understanding that Bitcoin is money, not an investment, changes how you think about it. Stocks go up and down based on company performance, but Bitcoin's value comes from being better money. This knowledge helps you see Bitcoin as a long-term wealth protection tool rather than a risky gamble like stocks."
      },
      {
        title: "How Bitcoin Helps During Economic Crisis",
        content: `When economies face serious problems, traditional money often loses value. Bitcoin can help protect your wealth during these difficult times.

During economic crises, governments usually print lots of money to try to solve problems. This makes each dollar worth less, hurting people who save money. Bitcoin's fixed supply means it can't be inflated away during crises.

In some countries, people lose access to their bank accounts during economic disasters. Banks might limit withdrawals, freeze accounts, or even go out of business. If you control your own Bitcoin, no one can freeze your access to your money.

Hyperinflation is when money loses value extremely fast. This has happened in Venezuela, Zimbabwe, Lebanon, and other countries. People there use Bitcoin to preserve their wealth when their local currency becomes worthless.

Bitcoin works the same everywhere in the world. If you need to leave your country during a crisis, you can take your Bitcoin with you just by remembering your seed phrase. Try carrying gold or cash across borders during an emergency.

During the 2008 financial crisis, many banks failed and required government bailouts. Bitcoin was created partly in response to this crisis. Since Bitcoin has no central authority, it can't fail in the same way banks do.

Capital controls happen when governments restrict how much money you can send out of the country. Bitcoin can bypass these restrictions because it operates on a global network that governments can't fully control.

Bitcoin isn't a magic solution to all economic problems, but it gives individuals a way to protect their wealth when traditional financial systems fail. It's like having a lifeboat when the ship starts sinking.`,
        summary: "Bitcoin helps during economic crisis by protecting against inflation, banking failures, and capital controls with its global, unchangeable properties.",
        whyItMatters: "Learning how Bitcoin protects you during economic crisis helps you prepare for uncertain times. Many people lose their savings when economies collapse, but Bitcoin users can protect their wealth. This knowledge helps you see Bitcoin as financial insurance that works when traditional systems fail."
      },
      {
        title: "Bitcoin and Your Financial Freedom",
        content: `Bitcoin gives you types of financial freedom that weren't possible before. Understanding these freedoms helps you see why Bitcoin matters beyond just making money.

The first freedom is controlling your own money. With Bitcoin, you can be your own bank. No one can freeze your account, deny your transactions, or tell you how to spend your money. This level of control was impossible before Bitcoin.

The second freedom is privacy in your financial life. While Bitcoin isn't completely anonymous, it gives you much more privacy than traditional banking where every transaction is monitored and recorded with your personal information attached.

The third freedom is access to global markets. Bitcoin works the same everywhere in the world. You can send money to anyone, anywhere, anytime, without asking permission from banks or governments. This opens up economic opportunities regardless of where you live.

The fourth freedom is protection from seizure. If you control your Bitcoin keys, no one can take your Bitcoin without your permission. Throughout history, governments have seized gold, frozen bank accounts, and confiscated assets. Bitcoin makes this much harder.

The fifth freedom is escape from inflation. When governments print money, it loses value over time. Bitcoin's fixed supply means your purchasing power can't be inflated away by government policies.

The sixth freedom is financial inclusion. Billions of people worldwide don't have access to basic banking services. All you need for Bitcoin is internet access. No minimum balances, no credit checks, no discrimination.

These freedoms come with responsibility. You must learn to securely manage your own keys, understand how Bitcoin works, and take responsibility for your own financial security.

Bitcoin returns financial power to individuals instead of concentrating it in institutions. This shift toward individual sovereignty is one of Bitcoin's most important innovations.`,
        summary: "Bitcoin provides six key freedoms: self-custody, privacy, global access, seizure resistance, inflation protection, and financial inclusion.",
        whyItMatters: "Understanding Bitcoin's freedoms helps you see why it's revolutionary beyond just price gains. These six freedoms give you power over your money that no one in history has ever had before. This knowledge helps you appreciate why Bitcoin matters for human liberty and why it's worth learning about."
      }
    ];

    // Create lessons for days 17-29 using simplified topics and general concepts
    for (let day = 17; day <= 29; day++) {
      const topicIndex = (day - 17) % simplifiedTopics.length;
      const topic = simplifiedTopics[topicIndex];
      
      additionalLessons.push({
        title: day <= 20 ? topic.title : `Bitcoin Essentials: Day ${day}`,
        content: day <= 20 ? topic.content : `Understanding Bitcoin requires grasping how it changes the relationship between individuals and money.

Traditional money systems put banks and governments in control of your financial life. They decide when you can access your money, where you can send it, and how much it's worth. Bitcoin reverses this relationship by putting you in control.

Bitcoin works because thousands of people around the world run computers that enforce the same rules. These rules can't be changed easily, which protects everyone who uses Bitcoin. No single person or group controls Bitcoin.

The technology behind Bitcoin is complex, but using it can be simple. You don't need to understand how email works to send an email. Similarly, you don't need to understand cryptography to use Bitcoin safely.

Bitcoin's value comes from its usefulness as money. It's scarce, durable, portable, divisible, and recognizable. These properties have made Bitcoin valuable to millions of people worldwide.

Learning about Bitcoin takes time, but it's worth the effort. Bitcoin represents a fundamental shift in how money works. Understanding this shift helps you make better financial decisions for your future.

The most important thing to remember is that Bitcoin gives you options. You can choose to use it or not, store it yourself or with others, and participate in a financial system based on mathematical rules instead of human institutions.

Bitcoin isn't just new technology - it's a new way of thinking about money, ownership, and economic freedom. This new way of thinking is spreading around the world as more people discover Bitcoin's benefits.`,
        summary: day <= 20 ? topic.summary : "Bitcoin fundamentals exploring how this technology changes the relationship between individuals and money systems.",
        estimatedReadTime: 3,
        dayIndex: day,
        whyItMatters: day <= 20 ? (topic as any).whyItMatters : "Understanding Bitcoin fundamentals helps you see why this technology matters for your financial future. Each concept builds on previous lessons to give you complete knowledge about how Bitcoin works and why it's important. This knowledge helps you make informed decisions about using Bitcoin as better money for the digital age."
      });
    }

    // Combine all lessons
    const allLessons = [...lessons, ...additionalLessons];

    allLessons.forEach((lessonData, index) => {
      const lesson: Lesson = {
        id: this.currentLessonId++,
        title: lessonData.title,
        content: lessonData.content,
        summary: lessonData.summary,
        estimatedReadTime: lessonData.estimatedReadTime,
        dayIndex: lessonData.dayIndex,
        imageUrl: null,
        keyPoints: null,
        whyItMatters: (lessonData as any).whyItMatters || null
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
        optionC: "Checking payments and securing the network",
        optionD: "Trading Bitcoin for profit",
        correctAnswer: "C",
        explanation: "Bitcoin mining involves using computer power to check payments, secure the network, and add new blocks to the blockchain. Miners are rewarded with new Bitcoin for this work.",
        category: "Network & Mining",
        difficulty: "beginner"
      }
    ];

    // Create day-specific quiz questions for all days 0-29 with content-specific questions
    const daySpecificQuestions = [
      // Day 0: Understanding Bitcoin (Based on "What is Bitcoin?", "Digital Scarcity", "Why Bitcoin Matters")
      {
        dayIndex: 0,
        question: "According to today's lesson, what problem does Bitcoin solve with digital money?",
        optionA: "Making payments faster",
        optionB: "Stopping people from copying digital money",
        optionC: "Making payments cheaper",
        optionD: "Creating more money",
        correctAnswer: "B",
        explanation: "Bitcoin solves the copying problem - stopping someone from copying digital money and spending it twice, which was the main challenge before Bitcoin.",
        category: "Fundamentals",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "Based on today's content, what makes Bitcoin's scarcity special?",
        optionA: "Banks control the supply",
        optionB: "Government decides how much to print",
        optionC: "Maximum of 21 million coins will ever exist",
        optionD: "Supply changes based on demand",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin has a maximum supply of 21 million coins that will ever exist, creating digital scarcity like digital gold.",
        category: "Fundamentals",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "According to today's lesson, how does Bitcoin give you control over your money?",
        optionA: "Banks manage your account better",
        optionB: "Government protects your money",
        optionC: "No one can freeze your account or stop your payments",
        optionD: "Credit cards become unnecessary",
        correctAnswer: "C",
        explanation: "Today's content explains that Bitcoin gives complete control over your money - no one can freeze your account, reverse payments, or stop you from sending money anywhere.",
        category: "Purpose",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "Based on today's lesson, what makes Bitcoin different from regular digital payments?",
        optionA: "It uses the internet",
        optionB: "It doesn't need banks or middlemen",
        optionC: "It's faster than cash",
        optionD: "It's accepted everywhere",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin is special because it allows direct person-to-person payments without needing banks or other middlemen.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "According to today's content, what inspired Bitcoin's creation?",
        optionA: "Making payments faster",
        optionB: "The 2008 financial crisis and need for money you don't have to trust",
        optionC: "Competing with credit cards",
        optionD: "Creating a new investment asset",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin was created in response to the 2008 financial crisis, designed as digital money that doesn't rely on failing banks.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 0,
        question: "Based on today's lesson, what does 'digital scarcity' mean for Bitcoin?",
        optionA: "Bitcoin is hard to find online",
        optionB: "Only tech experts can use it",
        optionC: "Each Bitcoin is unique and cannot be copied or counterfeited",
        optionD: "Bitcoin websites are rare",
        correctAnswer: "C",
        explanation: "Today's content explains that digital scarcity means each Bitcoin is mathematically unique and cannot be copied, counterfeited, or double-spent, solving a major problem with digital money.",
        category: "Technology",
        difficulty: "intermediate"
      },

      // Day 1: How Bitcoin Works (Based on "The Blockchain" content)
      {
        dayIndex: 1,
        question: "Based on today's blockchain lesson, what makes the blockchain secure?",
        optionA: "Banks check every payment",
        optionB: "Government oversight and rules",
        optionC: "Changing old payments would need controlling over half of all computer power",
        optionD: "Only trusted people can use it",
        correctAnswer: "C",
        explanation: "Today's lesson explains that blockchain security comes from the fact that changing any old payment would need controlling more than half of all computer power worldwide, which is impossible.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 1,
        question: "According to today's lesson, what happens when you send Bitcoin?",
        optionA: "Your bank processes the payment",
        optionB: "Your wallet broadcasts the transaction to thousands of computers",
        optionC: "A central authority approves it",
        optionD: "The government validates it",
        correctAnswer: "B",
        explanation: "Today's blockchain lesson explains that when you send Bitcoin, your wallet creates a transaction and broadcasts it to the entire network, like announcing to thousands of accountants simultaneously.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "Based on today's content, how often does the Bitcoin network create new blocks?",
        optionA: "Every minute",
        optionB: "Every 10 minutes on average",
        optionC: "Every hour",
        optionD: "Whenever needed",
        correctAnswer: "B",
        explanation: "Today's lesson explains that the blockchain process repeats every 10 minutes on average, creating an unstoppable chain of verified transactions.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "According to today's lesson, what makes Bitcoin peer-to-peer?",
        optionA: "It requires banks as intermediaries",
        optionB: "Transactions go directly between people without middlemen",
        optionC: "Only peers can use it",
        optionD: "It needs government approval",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin is peer-to-peer because transactions go directly from your wallet to theirs without banks or other middlemen.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "Based on today's lesson, what makes Bitcoin almost impossible to hack?",
        optionA: "Government protection",
        optionB: "Bank security systems",
        optionC: "Strong computer math that protects transactions",
        optionD: "Physical security guards",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin uses strong computer math to secure payments, making it almost impossible to hack or fake.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 1,
        question: "According to today's content, how many computers worldwide share the Bitcoin blockchain ledger?",
        optionA: "Just a few hundred",
        optionB: "About one thousand",
        optionC: "Thousands of computers worldwide",
        optionD: "Only one central server",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin transactions are recorded on a blockchain shared across thousands of computers worldwide, making it impossible to fake or duplicate Bitcoin.",
        category: "Technology",
        difficulty: "beginner"
      },

      // Day 10: Bitcoin Scalability
      {
        dayIndex: 10,
        question: "How many transactions can Bitcoin's base layer process per second?",
        optionA: "About 7 transactions",
        optionB: "About 100 transactions",
        optionC: "About 1,000 transactions",
        optionD: "Unlimited transactions",
        correctAnswer: "A",
        explanation: "Bitcoin's base layer can process approximately 7 transactions per second due to block size and time constraints.",
        category: "Scalability",
        difficulty: "intermediate"
      },




      // Day 2: Bitcoin vs Traditional Money
      {
        dayIndex: 2,
        question: "What causes inflation in regular money?",
        optionA: "Limited supply",
        optionB: "Printing more money",
        optionC: "High demand",
        optionD: "Digital payments",
        correctAnswer: "B",
        explanation: "Inflation happens when banks print more money, making existing money worth less.",
        category: "Economics",
        difficulty: "beginner"
      },
      {
        dayIndex: 2,
        question: "How does Bitcoin protect against inflation?",
        optionA: "By printing more Bitcoin",
        optionB: "By having a fixed supply cap",
        optionC: "By government backing",
        optionD: "By bank insurance",
        correctAnswer: "B",
        explanation: "Bitcoin's fixed supply of 21 million coins protects against inflation caused by money printing.",
        category: "Economics",
        difficulty: "beginner"
      },
      {
        dayIndex: 2,
        question: "What has happened to the US dollar's purchasing power since 1913?",
        optionA: "It has increased 50%",
        optionB: "It has stayed the same",
        optionC: "It has lost over 96% of its value",
        optionD: "It has doubled in value",
        correctAnswer: "C",
        explanation: "The US dollar has lost over 96% of its purchasing power since 1913 due to inflation.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 2,
        question: "According to today's lesson, what percentage has the US dollar declined since 1971?",
        optionA: "Over 85%",
        optionB: "About 50%",
        optionC: "Less than 25%",
        optionD: "It has increased in value",
        correctAnswer: "A",
        explanation: "Today's lesson states that the purchasing power of the US dollar has declined over 85% since 1971 when the gold standard ended.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 2,
        question: "Based on today's content, how many people worldwide lack access to banking services?",
        optionA: "About 500 million",
        optionB: "Over 2 billion people",
        optionC: "Around 1 billion",
        optionD: "Less than 100 million",
        correctAnswer: "B",
        explanation: "Today's lesson explains that over 2 billion people worldwide lack access to basic banking services, locked out of participating in international commerce.",
        category: "Financial Inclusion",
        difficulty: "beginner"
      },
      {
        dayIndex: 2,
        question: "According to today's lesson, what makes Bitcoin 'open to everyone'?",
        optionA: "Government approval is needed",
        optionB: "Banks must check your identity",
        optionC: "Anyone with internet can use it",
        optionD: "Only certain countries allow it",
        correctAnswer: "C",
        explanation: "Today's content explains that Bitcoin is open to everyone - anyone with internet can use it regardless of where they live or what banks think.",
        category: "Technology",
        difficulty: "beginner"
      },

      // Day 3: Bitcoin Mining & Security

      {
        dayIndex: 3,
        question: "What is proof of work?",
        optionA: "A job certificate",
        optionB: "A security method where computers must solve puzzles",
        optionC: "A Bitcoin wallet type",
        optionD: "A payment fee",
        correctAnswer: "B",
        explanation: "Proof of work is Bitcoin's security method where miners must prove they've done computer work to add new blocks.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 3,
        question: "How often does Bitcoin adjust mining difficulty?",
        optionA: "Every day",
        optionB: "Every week",
        optionC: "Every 2 weeks",
        optionD: "Every month",
        correctAnswer: "C",
        explanation: "Bitcoin automatically adjusts mining difficulty every 2 weeks to maintain consistent 10-minute block times.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 3,
        question: "According to today's lesson, what is the golden rule of Bitcoin?",
        optionA: "Buy low, sell high",
        optionB: "Not your keys, not your coins",
        optionC: "Always use exchanges",
        optionD: "Mine more Bitcoin",
        correctAnswer: "B",
        explanation: "Today's lesson emphasizes Bitcoin's golden rule: 'Not your keys, not your coins' - if you don't control the private keys, you don't truly own the Bitcoin.",
        category: "Security",
        difficulty: "beginner"
      },
      {
        dayIndex: 3,
        question: "Based on today's content, what does a Bitcoin wallet actually contain?",
        optionA: "Physical Bitcoin coins",
        optionB: "The entire blockchain",
        optionC: "Private keys that prove ownership",
        optionD: "Government certificates",
        correctAnswer: "C",
        explanation: "Today's lesson explains that a Bitcoin wallet contains the private keys that prove you own Bitcoin on the blockchain, not the Bitcoin itself.",
        category: "Wallets & Security",
        difficulty: "beginner"
      },
      {
        dayIndex: 3,
        question: "According to today's lesson, how many words are typically in a seed phrase backup?",
        optionA: "6 to 8 words",
        optionB: "12 to 24 words",
        optionC: "30 to 50 words",
        optionD: "100 words or more",
        correctAnswer: "B",
        explanation: "Today's content states that seed phrases are typically 12 to 24 words that can mathematically restore your entire wallet if your device is lost.",
        category: "Security",
        difficulty: "beginner"
      },
      {
        dayIndex: 3,
        question: "Based on today's lesson, why is keeping Bitcoin on exchanges long-term risky?",
        optionA: "Exchanges have high fees",
        optionB: "You don't control the private keys",
        optionC: "Exchanges are slow",
        optionD: "Exchanges don't support Bitcoin",
        correctAnswer: "B",
        explanation: "Today's lesson explains that keeping Bitcoin on exchanges is risky because you're trusting a third party with complete control over your funds - you don't control the private keys.",
        category: "Security",
        difficulty: "intermediate"
      },

      // Day 4: Wallets & Private Keys
      {
        dayIndex: 4,
        question: "What does a Bitcoin wallet actually store?",
        optionA: "Bitcoin coins",
        optionB: "Private keys",
        optionC: "The blockchain",
        optionD: "Transaction history",
        correctAnswer: "B",
        explanation: "A Bitcoin wallet stores your private keys, not Bitcoin itself. Bitcoin exists on the blockchain.",
        category: "Wallets",
        difficulty: "beginner"
      },
      {
        dayIndex: 4,
        question: "What does 'Not your keys, not your coins' mean?",
        optionA: "You need to buy expensive keys",
        optionB: "If you don't control private keys, you don't truly own the Bitcoin",
        optionC: "Keys are more important than coins",
        optionD: "You should give your keys to exchanges",
        correctAnswer: "B",
        explanation: "If you don't control the private keys, you don't truly own the Bitcoin - someone else has control over your funds.",
        category: "Security",
        difficulty: "beginner"
      },
      {
        dayIndex: 4,
        question: "Why is keeping Bitcoin on exchanges risky long-term?",
        optionA: "Exchanges charge high fees",
        optionB: "The exchange controls your private keys",
        optionC: "Bitcoin price is volatile",
        optionD: "Exchanges are illegal",
        correctAnswer: "B",
        explanation: "When Bitcoin is stored on exchanges, the exchange controls your private keys, meaning they have complete control over your funds.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 4,
        question: "According to today's lesson, what are the three critical functions of Bitcoin mining?",
        optionA: "Create money, pay taxes, store data",
        optionB: "Validate transactions, secure network, issue new Bitcoin",
        optionC: "Trade Bitcoin, set prices, manage exchanges",
        optionD: "Store wallets, process payments, collect fees",
        correctAnswer: "B",
        explanation: "Today's lesson explains that mining serves three critical functions: validates transactions, secures the network through energy expenditure, and issues new Bitcoin as rewards.",
        category: "Mining",
        difficulty: "intermediate"
      },
      {
        dayIndex: 4,
        question: "Based on today's content, how much Bitcoin does a miner currently receive per block?",
        optionA: "50 BTC per block",
        optionB: "25 BTC per block", 
        optionC: "6.25 BTC per block",
        optionD: "3.125 BTC per block",
        correctAnswer: "C",
        explanation: "Today's lesson states that miners currently receive 6.25 BTC per block, which will be reduced to 3.125 BTC at the next halving.",
        category: "Mining",
        difficulty: "beginner"
      },
      {
        dayIndex: 4,
        question: "According to today's lesson, how often does Bitcoin's halving cycle occur?",
        optionA: "Every 2 years",
        optionB: "Every 4 years (210,000 blocks)",
        optionC: "Every 6 years",
        optionD: "Every 10 years",
        correctAnswer: "B",
        explanation: "Today's content explains that halving occurs every four years (precisely every 210,000 blocks), automatically cutting the mining reward in half.",
        category: "Economics",
        difficulty: "beginner"
      },

      // Day 5: Store of Value & Digital Gold
      {
        dayIndex: 5,
        question: "Why is Bitcoin often called 'digital gold'?",
        optionA: "It's shiny and yellow",
        optionB: "It has similar properties to gold but improved for the digital age",
        optionC: "It's made from gold",
        optionD: "It's worth the same as gold",
        correctAnswer: "B",
        explanation: "Bitcoin shares gold's valuable properties (scarcity, durability, portability) but improves upon them for digital use.",
        category: "Economics",
        difficulty: "beginner"
      },
      {
        dayIndex: 5,
        question: "How does Bitcoin improve upon gold's portability?",
        optionA: "Bitcoin is lighter",
        optionB: "Bitcoin can be sent globally instantly",
        optionC: "Bitcoin is smaller",
        optionD: "Bitcoin doesn't need storage",
        correctAnswer: "B",
        explanation: "Unlike gold which requires physical transport, Bitcoin can be sent anywhere in the world almost instantly.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 5,
        question: "What makes Bitcoin more divisible than gold?",
        optionA: "Bitcoin can be divided into 100 million satoshis",
        optionB: "Bitcoin is digital",
        optionC: "Bitcoin is cheaper",
        optionD: "Bitcoin doesn't break",
        correctAnswer: "A",
        explanation: "Bitcoin can be divided into 100 million units called satoshis, while dividing gold requires expensive industrial processes.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 5,
        question: "According to today's lesson, how many critical characteristics determine the success of money throughout history?",
        optionA: "Three characteristics",
        optionB: "Five characteristics",
        optionC: "Seven characteristics",
        optionD: "Ten characteristics",
        correctAnswer: "B",
        explanation: "Today's lesson explains that the best forms of money have consistently shared five critical characteristics: scarcity, durability, portability, divisibility, and verifiability.",
        category: "Economics",
        difficulty: "beginner"
      },
      {
        dayIndex: 5,
        question: "Based on today's content, what revolutionary advantage does Bitcoin have that was impossible in the physical world?",
        optionA: "It's heavy and hard to move",
        optionB: "It requires expensive vaults",
        optionC: "It's fully programmable and can be sent automatically",
        optionD: "It needs trusted intermediaries",
        correctAnswer: "C",
        explanation: "Today's lesson highlights that Bitcoin is fully programmable, meaning it can be sent automatically based on predetermined conditions without human intervention - impossible with physical money.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 5,
        question: "According to today's lesson, what happens as more people recognize Bitcoin's superior monetary properties?",
        optionA: "Supply increases to meet demand",
        optionB: "The network becomes less secure",
        optionC: "Demand increases while supply remains fixed, creating upward price pressure",
        optionD: "Bitcoin becomes centralized",
        correctAnswer: "C",
        explanation: "Today's content explains that the network effect means more recognition increases demand while supply remains mathematically fixed at 21 million, creating upward price pressure over time.",
        category: "Economics",
        difficulty: "intermediate"
      },

      // Day 6: Lightning Network
      {
        dayIndex: 6,
        question: "What is the Lightning Network?",
        optionA: "A new cryptocurrency",
        optionB: "A second layer solution for faster Bitcoin payments",
        optionC: "A Bitcoin mining pool",
        optionD: "A Bitcoin exchange",
        correctAnswer: "B",
        explanation: "The Lightning Network is a second layer built on top of Bitcoin that enables faster, cheaper transactions.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 6,
        question: "What problem does the Lightning Network solve?",
        optionA: "Bitcoin's limited supply",
        optionB: "Bitcoin's volatility",
        optionC: "Bitcoin's transaction speed and fees for small payments",
        optionD: "Bitcoin's security",
        correctAnswer: "C",
        explanation: "Lightning Network enables instant, low-cost Bitcoin transactions, making it practical for everyday purchases.",
        category: "Scaling",
        difficulty: "intermediate"
      },
      {
        dayIndex: 6,
        question: "How does Lightning Network maintain Bitcoin's security?",
        optionA: "It uses a different blockchain",
        optionB: "It's built on top of Bitcoin's base layer",
        optionC: "It doesn't need security",
        optionD: "It uses banks",
        correctAnswer: "B",
        explanation: "Lightning Network is built on top of Bitcoin's secure base layer, inheriting Bitcoin's proven security model.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 6,
        question: "According to today's lesson, how do Lightning payments confirm compared to base layer Bitcoin?",
        optionA: "They take 10 minutes like regular Bitcoin",
        optionB: "They confirm in milliseconds",
        optionC: "They take 1 hour",
        optionD: "They never confirm",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Lightning payments confirm in milliseconds rather than minutes, making Bitcoin practical for daily transactions.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 6,
        question: "Based on today's content, how do payment channels work in Lightning Network?",
        optionA: "Each payment is broadcast to the entire network",
        optionB: "Banks process all payments",
        optionC: "Two parties lock Bitcoin and send payments back and forth instantly",
        optionD: "All payments require mining",
        correctAnswer: "C",
        explanation: "Today's lesson describes how two parties can lock Bitcoin in a shared account and send payments back and forth instantly without broadcasting every transaction.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 6,
        question: "According to today's lesson, what applications is Lightning already powering today?",
        optionA: "Only large bank transfers",
        optionB: "Content creator tips, merchant payments, remittances, and gaming purchases",
        optionC: "Only mining operations",
        optionD: "Only government transactions",
        correctAnswer: "B",
        explanation: "Today's content shows Lightning is already powering diverse applications: content creator micropayments, merchant point-of-sale, cross-border remittances, and gaming purchases.",
        category: "Applications",
        difficulty: "beginner"
      },

      // Day 7: Traditional Finance vs Bitcoin
      {
        dayIndex: 7,
        question: "What is a major problem with fiat currencies?",
        optionA: "They are too valuable",
        optionB: "They lose purchasing power over time due to inflation",
        optionC: "They are too secure",
        optionD: "They are too fast",
        correctAnswer: "B",
        explanation: "Fiat currencies lose purchasing power over time due to inflation caused by money printing.",
        category: "Economics",
        difficulty: "beginner"
      },
      {
        dayIndex: 7,
        question: "How many people worldwide lack access to banking?",
        optionA: "100 million",
        optionB: "500 million",
        optionC: "1 billion",
        optionD: "2 billion",
        correctAnswer: "D",
        explanation: "Approximately 2 billion people worldwide lack access to traditional banking services.",
        category: "Global Impact",
        difficulty: "intermediate"
      },
      {
        dayIndex: 7,
        question: "What does Bitcoin require for financial access?",
        optionA: "A bank account",
        optionB: "Government approval",
        optionC: "Only internet access",
        optionD: "A credit score",
        correctAnswer: "C",
        explanation: "Bitcoin only requires internet access, providing financial services to anyone with an internet connection.",
        category: "Inclusion",
        difficulty: "beginner"
      },
      {
        dayIndex: 7,
        question: "According to today's lesson, what major change occurred in 1971 that affected the monetary system?",
        optionA: "Bitcoin was created",
        optionB: "President Nixon ended the gold standard",
        optionC: "Banks were invented",
        optionD: "The internet was created",
        correctAnswer: "B",
        explanation: "Today's content explains that in 1971, President Nixon ended the gold standard, creating the modern fiat money system that Bitcoin addresses.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 7,
        question: "Based on today's lesson, what is 'financial deplatforming'?",
        optionA: "Building financial platforms",
        optionB: "Creating new banking services",
        optionC: "Using financial control as a tool of political power",
        optionD: "Improving banking technology",
        correctAnswer: "C",
        explanation: "Today's lesson explains that financial deplatforming has become a tool of political control, where authorities can cut people off from the financial system based on political considerations.",
        category: "Politics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 7,
        question: "According to today's content, how does Bitcoin address systematic exclusion from the global economy?",
        optionA: "It requires government approval",
        optionB: "It's only available in certain countries",
        optionC: "It operates globally with the same rules everywhere",
        optionD: "It needs traditional banking",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin's global operation means the same rules apply everywhere, eliminating borders and discrimination that exclude people from the global economy.",
        category: "Global Impact",
        difficulty: "beginner"
      },

      // Days 8-29: Additional Bitcoin Education Topics
      // Day 8: Bitcoin Transactions
      {
        dayIndex: 8,
        question: "What information is included in a Bitcoin transaction?",
        optionA: "Only the amount",
        optionB: "Sender, receiver, amount, and fees",
        optionC: "Personal identification",
        optionD: "Bank account numbers",
        correctAnswer: "B",
        explanation: "Bitcoin transactions include sender address, receiver address, amount, and transaction fees.",
        category: "Transactions",
        difficulty: "beginner"
      },
      {
        dayIndex: 8,
        question: "What are Bitcoin transaction fees used for?",
        optionA: "Government taxes",
        optionB: "Company profits",
        optionC: "Incentivizing miners to include transactions in blocks",
        optionD: "Exchange commissions",
        correctAnswer: "C",
        explanation: "Transaction fees incentivize miners to include your transaction in the next block.",
        category: "Fees",
        difficulty: "beginner"
      },
      {
        dayIndex: 8,
        question: "How long does a Bitcoin transaction typically take to confirm?",
        optionA: "A few seconds",
        optionB: "About 10 minutes for first confirmation",
        optionC: "Several hours",
        optionD: "1-2 days",
        correctAnswer: "B",
        explanation: "Bitcoin blocks are mined approximately every 10 minutes, so first confirmation typically takes around 10 minutes.",
        category: "Transactions",
        difficulty: "beginner"
      },
      {
        dayIndex: 8,
        question: "According to today's lesson about transactions, what does a digital signature prove?",
        optionA: "The transaction amount",
        optionB: "That the sender owns the private key and authorizes the transaction",
        optionC: "The receiver's identity",
        optionD: "The current Bitcoin price",
        correctAnswer: "B",
        explanation: "Today's content explains that digital signatures cryptographically prove the sender owns the private key and authorizes the specific transaction.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 8,
        question: "Based on today's lesson, what happens after you broadcast a Bitcoin transaction?",
        optionA: "It immediately appears in your wallet",
        optionB: "Banks process it overnight",
        optionC: "It goes to a memory pool and waits to be included in a block",
        optionD: "Government approves it",
        correctAnswer: "C",
        explanation: "Today's lesson explains that broadcast transactions go to the memory pool (mempool) where they wait to be selected by miners for inclusion in the next block.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 8,
        question: "According to today's content, why might you choose a higher transaction fee?",
        optionA: "To support the government",
        optionB: "To get priority processing from miners",
        optionC: "To hide your identity",
        optionD: "To increase Bitcoin's value",
        correctAnswer: "B",
        explanation: "Today's lesson explains that higher transaction fees incentivize miners to prioritize your transaction for faster inclusion in the next block.",
        category: "Economics",
        difficulty: "beginner"
      },

      // Day 9: Bitcoin History
      {
        dayIndex: 9,
        question: "When was Bitcoin's whitepaper published?",
        optionA: "October 31, 2008",
        optionB: "January 3, 2009",
        optionC: "December 2007",
        optionD: "March 2009",
        correctAnswer: "A",
        explanation: "Bitcoin's whitepaper was published by Satoshi Nakamoto on October 31, 2008.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 9,
        question: "When was the first Bitcoin block (Genesis Block) mined?",
        optionA: "October 31, 2008",
        optionB: "January 3, 2009",
        optionC: "December 31, 2008",
        optionD: "February 2009",
        correctAnswer: "B",
        explanation: "The Genesis Block was mined on January 3, 2009, marking the birth of the Bitcoin network.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 9,
        question: "What was the first recorded Bitcoin purchase?",
        optionA: "A car",
        optionB: "Two pizzas",
        optionC: "A computer",
        optionD: "Coffee",
        correctAnswer: "B",
        explanation: "On May 22, 2010, Laszlo Hanyecz bought two pizzas for 10,000 Bitcoin, now celebrated as Bitcoin Pizza Day.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 9,
        question: "According to today's lesson, what pseudonym did Bitcoin's creator use?",
        optionA: "Anonymous",
        optionB: "Satoshi Nakamoto",
        optionC: "Crypto Creator",
        optionD: "Digital Pioneer",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin was created by someone using the pseudonym Satoshi Nakamoto, whose real identity remains unknown.",
        category: "History",
        difficulty: "beginner"
      },
      {
        dayIndex: 9,
        question: "Based on today's content, what crisis inspired Bitcoin's creation?",
        optionA: "The dot-com bubble",
        optionB: "The 2008 financial crisis",
        optionC: "World War II",
        optionD: "The Great Depression",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin was created in response to the 2008 financial crisis, which revealed serious flaws in the traditional banking system.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 9,
        question: "According to today's lesson, what makes May 22nd special in Bitcoin history?",
        optionA: "The first block was mined",
        optionB: "Satoshi disappeared",
        optionC: "The first commercial Bitcoin transaction (Pizza Day)",
        optionD: "Bitcoin reached $1",
        correctAnswer: "C",
        explanation: "Today's content explains that May 22nd is celebrated as Bitcoin Pizza Day, commemorating the first real-world commercial use of Bitcoin.",
        category: "History",
        difficulty: "intermediate"
      },
      {
        dayIndex: 10,
        question: "What is a second layer solution in Bitcoin?",
        optionA: "A new blockchain",
        optionB: "A system built on top of Bitcoin to increase capacity",
        optionC: "A type of wallet",
        optionD: "A mining pool",
        correctAnswer: "B",
        explanation: "Second layer solutions like Lightning Network are built on top of Bitcoin to enable more transactions.",
        category: "Scaling",
        difficulty: "intermediate"
      },
      {
        dayIndex: 10,
        question: "Why doesn't Bitcoin just increase block size for more transactions?",
        optionA: "It's technically impossible",
        optionB: "Larger blocks would centralize the network",
        optionC: "It would make Bitcoin less secure",
        optionD: "No one wants more transactions",
        correctAnswer: "B",
        explanation: "Larger blocks would require more resources to run nodes, potentially centralizing the network to fewer participants.",
        category: "Decentralization",
        difficulty: "advanced"
      },
      {
        dayIndex: 10,
        question: "According to today's lesson about scalability, how many transactions per second can Bitcoin's base layer process?",
        optionA: "About 7 transactions per second",
        optionB: "About 100 transactions per second",
        optionC: "About 1,000 transactions per second",
        optionD: "Unlimited transactions",
        correctAnswer: "A",
        explanation: "Today's lesson explains that Bitcoin's base layer can process approximately 7 transactions per second due to block size and time constraints.",
        category: "Scalability",
        difficulty: "intermediate"
      },
      {
        dayIndex: 10,
        question: "Based on today's content about scaling solutions, what advantage do second layer solutions provide?",
        optionA: "They replace Bitcoin entirely",
        optionB: "They increase capacity while maintaining base layer security",
        optionC: "They centralize Bitcoin",
        optionD: "They eliminate mining",
        correctAnswer: "B",
        explanation: "Today's lesson explains that second layer solutions increase transaction capacity while maintaining the security of Bitcoin's base layer.",
        category: "Scaling",
        difficulty: "intermediate"
      },
      {
        dayIndex: 10,
        question: "According to today's lesson, why is Bitcoin's conservative approach to base layer changes important?",
        optionA: "It keeps fees high",
        optionB: "It preserves decentralization and security",
        optionC: "It prevents innovation",
        optionD: "It makes Bitcoin slower",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin's conservative approach to base layer changes preserves its core properties of decentralization and security.",
        category: "Philosophy",
        difficulty: "intermediate"
      },

      // Day 11: Bitcoin Energy & Environment
      {
        dayIndex: 11,
        question: "Why does Bitcoin mining consume energy?",
        optionA: "It's wasteful by design",
        optionB: "Energy consumption secures the network",
        optionC: "Miners are inefficient",
        optionD: "It's an accident",
        correctAnswer: "B",
        explanation: "Bitcoin's energy consumption is a security feature - it makes attacking the network extremely expensive.",
        category: "Energy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 11,
        question: "What percentage of Bitcoin mining uses renewable energy?",
        optionA: "About 10%",
        optionB: "About 25%",
        optionC: "About 50-60%",
        optionD: "About 90%",
        correctAnswer: "C",
        explanation: "Studies suggest 50-60% of Bitcoin mining is powered by renewable energy sources.",
        category: "Environment",
        difficulty: "intermediate"
      },
      {
        dayIndex: 11,
        question: "How does Bitcoin mining incentivize renewable energy?",
        optionA: "It doesn't",
        optionB: "Miners seek cheapest energy, often renewables",
        optionC: "Government regulations require it",
        optionD: "Bitcoin protocol demands it",
        correctAnswer: "B",
        explanation: "Miners are incentivized to find the cheapest energy sources, which are increasingly renewable.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 11,
        question: "According to today's lesson about Bitcoin energy, what makes energy consumption a security feature?",
        optionA: "It wastes electricity",
        optionB: "It makes attacking the network extremely expensive",
        optionC: "It powers computers",
        optionD: "It generates heat",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's energy consumption is a security feature because it makes attacking the network extremely expensive and financially prohibitive.",
        category: "Security",
        difficulty: "intermediate"
      },
      {
        dayIndex: 11,
        question: "Based on today's content, why do miners seek out renewable energy sources?",
        optionA: "Government mandates require it",
        optionB: "To help the environment primarily",
        optionC: "Renewable energy is often the cheapest available",
        optionD: "Bitcoin protocol requires renewable energy",
        correctAnswer: "C",
        explanation: "Today's lesson explains that miners seek the cheapest energy sources to maximize profits, which increasingly means renewable energy as it becomes more cost-effective.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 11,
        question: "According to today's lesson, how does Bitcoin mining compare to other industries' energy use?",
        optionA: "Bitcoin uses more energy than all other industries combined",
        optionB: "Bitcoin uses less energy than traditional banking and gold mining",
        optionC: "Bitcoin uses exactly the same amount as banks",
        optionD: "Energy comparison is impossible",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin mining uses significantly less energy than traditional banking systems and gold mining when accounting for their full infrastructure.",
        category: "Comparison",
        difficulty: "intermediate"
      },

      // Day 12: Bitcoin Monetary Policy
      {
        dayIndex: 12,
        question: "What is Bitcoin's current block reward?",
        optionA: "50 Bitcoin",
        optionB: "25 Bitcoin",
        optionC: "6.25 Bitcoin",
        optionD: "3.125 Bitcoin",
        correctAnswer: "D",
        explanation: "As of the 2024 halving, Bitcoin's block reward is 3.125 Bitcoin per block, after the fourth halving.",
        category: "Monetary Policy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 12,
        question: "When will the next Bitcoin halving occur?",
        optionA: "2024",
        optionB: "2025",
        optionC: "2028",
        optionD: "2032",
        correctAnswer: "C",
        explanation: "The next Bitcoin halving is expected in 2028, which will reduce the block reward to 1.5625 Bitcoin.",
        category: "Monetary Policy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 12,
        question: "What happens when all 21 million Bitcoin are mined?",
        optionA: "The network stops working",
        optionB: "Miners are only paid transaction fees",
        optionC: "New Bitcoin continue to be created",
        optionD: "Bitcoin becomes worthless",
        correctAnswer: "B",
        explanation: "When all Bitcoin are mined (around 2140), miners will be compensated only through transaction fees.",
        category: "Future",
        difficulty: "advanced"
      },
      {
        dayIndex: 12,
        question: "According to today's lesson about monetary policy, how often do Bitcoin halvings occur?",
        optionA: "Every 2 years",
        optionB: "Every 4 years (210,000 blocks)",
        optionC: "Every 6 years",
        optionD: "Randomly",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin halvings occur every 4 years (precisely every 210,000 blocks), automatically cutting the mining reward in half.",
        category: "Monetary Policy",
        difficulty: "beginner"
      },
      {
        dayIndex: 12,
        question: "Based on today's content, what makes Bitcoin's monetary policy predictable?",
        optionA: "Government decisions",
        optionB: "Bank committee votes",
        optionC: "Predetermined algorithmic rules",
        optionD: "Market demand",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin's monetary policy is predictable because it follows predetermined algorithmic rules that cannot be changed arbitrarily.",
        category: "Monetary Policy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 12,
        question: "According to today's lesson, what percentage of all Bitcoin will have been mined by 2025?",
        optionA: "About 75%",
        optionB: "About 95%",
        optionC: "About 99%",
        optionD: "100%",
        correctAnswer: "C",
        explanation: "Today's content explains that by 2025, approximately 99% of all Bitcoin will have been mined, with the remaining 1% taking over 100 years to complete.",
        category: "Supply",
        difficulty: "intermediate"
      },

      // Days 13-29: Adding all remaining questions efficiently
      // Day 13: Bitcoin Innovation & Development
      {
        dayIndex: 13,
        question: "What is a Bitcoin Improvement Proposal (BIP)?",
        optionA: "A way to change Bitcoin's price",
        optionB: "A formal proposal for changes to Bitcoin protocol",
        optionC: "A new cryptocurrency",
        optionD: "A trading strategy",
        correctAnswer: "B",
        explanation: "A BIP is a formal proposal that describes potential changes to the Bitcoin protocol and how they should be implemented.",
        category: "Development",
        difficulty: "intermediate"
      },
      {
        dayIndex: 13,
        question: "According to today's lesson, what is SegWit?",
        optionA: "A new cryptocurrency",
        optionB: "A protocol upgrade that fixes transaction malleability",
        optionC: "A mining algorithm",
        optionD: "A wallet type",
        correctAnswer: "B",
        explanation: "Today's lesson explains that SegWit (Segregated Witness) is a protocol upgrade that fixes transaction malleability and enables additional scaling solutions.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 13,
        question: "Based on today's content, what enables Taproot's privacy improvements?",
        optionA: "Hiding all transaction amounts",
        optionB: "Making complex transactions look like simple ones",
        optionC: "Encrypting all data",
        optionD: "Using anonymous addresses",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Taproot makes complex multi-signature and smart contract transactions indistinguishable from simple transactions, improving privacy.",
        category: "Privacy",
        difficulty: "advanced"
      },
      {
        dayIndex: 13,
        question: "According to today's lesson, how does Bitcoin development maintain decentralization?",
        optionA: "One company controls all changes",
        optionB: "Government oversight required",
        optionC: "Open-source development with consensus requirement",
        optionD: "Miners decide everything",
        correctAnswer: "C",
        explanation: "Today's content explains that Bitcoin development remains decentralized through open-source development where changes require broad consensus from the community.",
        category: "Governance",
        difficulty: "intermediate"
      },
      {
        dayIndex: 13,
        question: "Based on today's content, what does 'backwards compatibility' mean in Bitcoin?",
        optionA: "Old versions can still work with new upgrades",
        optionB: "Bitcoin works with other cryptocurrencies",
        optionC: "You can reverse transactions",
        optionD: "Mining equipment never becomes obsolete",
        correctAnswer: "A",
        explanation: "Today's lesson explains that backwards compatibility means older Bitcoin software versions can still function when protocol upgrades are implemented.",
        category: "Technology",
        difficulty: "intermediate"
      },
      {
        dayIndex: 13,
        question: "According to today's lesson, what role do developers play in Bitcoin's future?",
        optionA: "They control Bitcoin's price",
        optionB: "They propose improvements but cannot force adoption",
        optionC: "They can change Bitcoin unilaterally",
        optionD: "They decide mining rewards",
        correctAnswer: "B",
        explanation: "Today's content explains that developers can propose improvements through BIPs, but the community must achieve consensus before any changes are adopted.",
        category: "Governance",
        difficulty: "intermediate"
      },

      // Day 14: Bitcoin Economics & Market Dynamics
      {
        dayIndex: 14,
        question: "What creates Bitcoin's stock-to-flow ratio?",
        optionA: "Government regulation",
        optionB: "The relationship between existing supply and new production",
        optionC: "Market trading volume",
        optionD: "Mining difficulty",
        correctAnswer: "B",
        explanation: "Stock-to-flow ratio measures how many years of current production would be needed to double the existing supply.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 14,
        question: "According to today's lesson, what drives Bitcoin adoption cycles?",
        optionA: "Government announcements only",
        optionB: "Technology improvements, institutional adoption, and market cycles",
        optionC: "Mining difficulty changes",
        optionD: "Social media trends",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin adoption cycles are driven by technological improvements, institutional adoption, and broader market dynamics.",
        category: "Market Dynamics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 14,
        question: "Based on today's content, how does Bitcoin's fixed supply affect its economics?",
        optionA: "It makes Bitcoin worthless",
        optionB: "It creates deflationary pressure as demand increases",
        optionC: "It prevents price changes",
        optionD: "It makes inflation possible",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's fixed 21 million supply creates deflationary pressure when demand increases, unlike inflationary fiat currencies.",
        category: "Monetary Theory",
        difficulty: "intermediate"
      },
      {
        dayIndex: 14,
        question: "According to today's lesson, what is 'number go up' technology?",
        optionA: "A trading strategy",
        optionB: "How Bitcoin's deflationary nature incentivizes holding and adoption",
        optionC: "A price prediction model",
        optionD: "A mining algorithm",
        correctAnswer: "B",
        explanation: "Today's content explains that 'number go up' technology refers to how Bitcoin's deflationary properties create incentives for holding and broader adoption.",
        category: "Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 14,
        question: "Based on today's content, why might institutions adopt Bitcoin?",
        optionA: "Government requirements",
        optionB: "Portfolio diversification and inflation hedge",
        optionC: "It's easier than traditional assets",
        optionD: "To avoid all taxes",
        correctAnswer: "B",
        explanation: "Today's lesson explains that institutions adopt Bitcoin for portfolio diversification and as a hedge against currency debasement and inflation.",
        category: "Institutional Adoption",
        difficulty: "intermediate"
      },
      {
        dayIndex: 14,
        question: "According to today's lesson, what role do halvings play in Bitcoin economics?",
        optionA: "They increase inflation",
        optionB: "They reduce new supply issuance, affecting supply-demand dynamics",
        optionC: "They change mining algorithms",
        optionD: "They reset Bitcoin's price",
        correctAnswer: "B",
        explanation: "Today's content explains that halvings reduce the rate of new Bitcoin issuance, creating supply scarcity that affects market dynamics over time.",
        category: "Monetary Policy",
        difficulty: "intermediate"
      },

      // Day 15: Bitcoin Privacy & Fungibility
      {
        dayIndex: 15,
        question: "What does fungibility mean for money?",
        optionA: "It can be exchanged for other currencies",
        optionB: "Each unit is interchangeable with any other unit",
        optionC: "It can be stored digitally",
        optionD: "It appreciates in value",
        correctAnswer: "B",
        explanation: "Fungibility means that each unit of money is interchangeable with any other unit of the same value.",
        category: "Monetary Properties",
        difficulty: "beginner"
      },
      {
        dayIndex: 15,
        question: "According to today's lesson, how does Bitcoin's transparency affect privacy?",
        optionA: "All transactions are completely anonymous",
        optionB: "All transactions are public but addresses aren't directly linked to identities",
        optionC: "Only miners can see transactions",
        optionD: "Privacy is impossible with Bitcoin",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin transactions are transparent on the blockchain, but addresses aren't automatically linked to real-world identities.",
        category: "Privacy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 15,
        question: "Based on today's content, what is a CoinJoin transaction?",
        optionA: "A way to create new bitcoins",
        optionB: "A privacy technique that mixes multiple transactions together",
        optionC: "A type of smart contract",
        optionD: "A mining pool operation",
        correctAnswer: "B",
        explanation: "Today's lesson explains that CoinJoin is a privacy technique where multiple users combine their transactions to obscure the links between inputs and outputs.",
        category: "Privacy",
        difficulty: "advanced"
      },
      {
        dayIndex: 15,
        question: "According to today's lesson, why might Bitcoin privacy matter?",
        optionA: "To hide illegal activities only",
        optionB: "For financial privacy, security, and protection from surveillance",
        optionC: "To avoid all taxes",
        optionD: "Privacy doesn't matter for Bitcoin",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin privacy matters for legitimate reasons like financial privacy, personal security, and protection from unwanted surveillance.",
        category: "Privacy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 15,
        question: "Based on today's content, what are some best practices for Bitcoin privacy?",
        optionA: "Always use the same address",
        optionB: "Use new addresses for each transaction and avoid address reuse",
        optionC: "Share your private keys",
        optionD: "Only use exchange wallets",
        correctAnswer: "B",
        explanation: "Today's lesson explains that using new addresses for each transaction and avoiding address reuse are important privacy best practices.",
        category: "Privacy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 15,
        question: "According to today's lesson, how does Bitcoin compare to cash for privacy?",
        optionA: "Bitcoin is completely anonymous like cash",
        optionB: "Bitcoin is less private than cash but more private than digital payments",
        optionC: "Bitcoin has no privacy features",
        optionD: "Cash and Bitcoin are identical in privacy",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin offers more privacy than traditional digital payments but less than physical cash due to its transparent ledger.",
        category: "Privacy",
        difficulty: "intermediate"
      }
    ];

    // Create additional questions for days 13-29 with general Bitcoin topics
    const additionalDays = [];
    for (let day = 13; day <= 29; day++) {
      additionalDays.push(
        {
          dayIndex: day,
          question: "What is the fundamental innovation of Bitcoin?",
          optionA: "Digital payments",
          optionB: "Solving the double-spending problem without trusted third parties",
          optionC: "Fast transactions",
          optionD: "Low fees",
          correctAnswer: "B",
          explanation: "Bitcoin's key innovation is solving the double-spending problem in digital currency without requiring trusted intermediaries.",
          category: "Innovation",
          difficulty: "intermediate"
        },
        {
          dayIndex: day,
          question: "What makes Bitcoin censorship-resistant?",
          optionA: "It's anonymous",
          optionB: "It's decentralized across thousands of nodes globally",
          optionC: "It's encrypted",
          optionD: "It's fast",
          correctAnswer: "B",
          explanation: "Bitcoin's decentralized nature across thousands of nodes makes it extremely difficult for any single entity to censor.",
          category: "Decentralization",
          difficulty: "intermediate"
        },
        {
          dayIndex: day,
          question: "Why is Bitcoin considered 'sound money'?",
          optionA: "It makes noise",
          optionB: "It has predictable monetary policy and fixed supply",
          optionC: "It's backed by gold",
          optionD: "It's controlled by banks",
          correctAnswer: "B",
          explanation: "Bitcoin is considered sound money because of its predictable monetary policy and fixed supply cap.",
          category: "Monetary Theory",
          difficulty: "intermediate"
        }
      );
    }

    // Add additional day-specific questions for Days 16-29 to reach 6 questions each
    const daySpecificAdditional = [
      // Day 16: Bitcoin Global Adoption
      {
        dayIndex: 16,
        question: "According to today's lesson about global adoption, which country was first to make Bitcoin legal tender?",
        optionA: "United States",
        optionB: "El Salvador",
        optionC: "Germany",
        optionD: "Japan",
        correctAnswer: "B",
        explanation: "Today's lesson explains that El Salvador became the first country to adopt Bitcoin as legal tender in September 2021.",
        category: "Global Adoption",
        difficulty: "beginner"
      },
      {
        dayIndex: 16,
        question: "Based on today's content, what drives Bitcoin adoption in developing countries?",
        optionA: "Government promotion only",
        optionB: "Financial inclusion and protection from currency debasement",
        optionC: "Faster internet speeds",
        optionD: "Lower taxes",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin adoption in developing countries is driven by need for financial inclusion and protection from local currency instability.",
        category: "Financial Inclusion",
        difficulty: "intermediate"
      },
      {
        dayIndex: 16,
        question: "According to today's lesson, how does Bitcoin help the unbanked population?",
        optionA: "It provides access to financial services with just a smartphone",
        optionB: "It requires traditional bank accounts",
        optionC: "It only works with credit cards",
        optionD: "It needs government approval",
        correctAnswer: "A",
        explanation: "Today's content explains that Bitcoin provides access to financial services for the unbanked through smartphone-based wallets, bypassing traditional banking infrastructure.",
        category: "Financial Inclusion",
        difficulty: "intermediate"
      },

      // Day 17: Bitcoin Store of Value
      {
        dayIndex: 17,
        question: "According to today's lesson, what makes Bitcoin superior to gold as a store of value?",
        optionA: "It's physical and tangible",
        optionB: "It's portable, divisible, and verifiable",
        optionC: "It's controlled by governments",
        optionD: "It's unlimited in supply",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin improves on gold by being easily portable, highly divisible, and mathematically verifiable while maintaining scarcity.",
        category: "Store of Value",
        difficulty: "intermediate"
      },
      {
        dayIndex: 17,
        question: "Based on today's content, how does Bitcoin protect against inflation?",
        optionA: "Government price controls",
        optionB: "Fixed supply cap prevents currency debasement",
        optionC: "Bank interest rates",
        optionD: "Stock market correlation",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's fixed 21 million supply cap protects against inflation by preventing the currency debasement that drives rising prices.",
        category: "Inflation Hedge",
        difficulty: "intermediate"
      },
      {
        dayIndex: 17,
        question: "According to today's lesson, why do institutions view Bitcoin as 'digital gold'?",
        optionA: "It's yellow in color",
        optionB: "It shares gold's scarcity and store of value properties but with digital advantages",
        optionC: "It's mined from the ground",
        optionD: "It's used in jewelry",
        correctAnswer: "B",
        explanation: "Today's content explains that institutions call Bitcoin 'digital gold' because it maintains gold's scarcity and store of value properties while adding digital advantages like portability and divisibility.",
        category: "Digital Gold",
        difficulty: "intermediate"
      },

      // Day 18: Bitcoin and Traditional Assets
      {
        dayIndex: 18,
        question: "According to today's lesson, how does Bitcoin correlation with stocks affect portfolio diversification?",
        optionA: "Bitcoin always moves with stocks",
        optionB: "Bitcoin provides diversification benefits with low long-term correlation",
        optionC: "Bitcoin replaces all other investments",
        optionD: "Correlation doesn't matter",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin provides portfolio diversification benefits due to its low long-term correlation with traditional assets like stocks and bonds.",
        category: "Portfolio Theory",
        difficulty: "intermediate"
      },
      {
        dayIndex: 18,
        question: "Based on today's content, what is Bitcoin's role in a balanced portfolio?",
        optionA: "It should be 100% of holdings",
        optionB: "A small allocation (1-5%) for diversification and asymmetric upside",
        optionC: "It should never be included",
        optionD: "Only during market crashes",
        correctAnswer: "B",
        explanation: "Today's lesson explains that financial advisors often recommend a small Bitcoin allocation (1-5%) for portfolio diversification and potential asymmetric returns.",
        category: "Asset Allocation",
        difficulty: "intermediate"
      },
      {
        dayIndex: 18,
        question: "According to today's lesson, how does Bitcoin perform during currency crises?",
        optionA: "It always crashes too",
        optionB: "It often serves as a safe haven when local currencies fail",
        optionC: "It's unaffected by any events",
        optionD: "It only works in stable countries",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin often serves as a safe haven asset during currency crises, as people seek alternatives to failing local currencies.",
        category: "Safe Haven",
        difficulty: "intermediate"
      },

      // Day 19: Bitcoin Governance and Consensus
      {
        dayIndex: 19,
        question: "According to today's lesson, who controls Bitcoin's development?",
        optionA: "A single company or government",
        optionB: "A decentralized community through consensus",
        optionC: "Only miners",
        optionD: "Exchange operators",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin is controlled by a decentralized community of users, developers, and miners who must reach consensus for any changes.",
        category: "Governance",
        difficulty: "intermediate"
      },
      {
        dayIndex: 19,
        question: "Based on today's content, what is required for Bitcoin protocol changes?",
        optionA: "Simple majority vote",
        optionB: "Broad community consensus and overwhelming support",
        optionC: "Government approval",
        optionD: "Corporate board decision",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin protocol changes require broad consensus from the community, making changes deliberate and conservative.",
        category: "Consensus",
        difficulty: "intermediate"
      },
      {
        dayIndex: 19,
        question: "According to today's lesson, how does Bitcoin prevent centralized control?",
        optionA: "Government oversight",
        optionB: "Open-source code and decentralized network of independent nodes",
        optionC: "Corporate management",
        optionD: "Bank supervision",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin prevents centralized control through open-source code and a decentralized network of thousands of independent nodes worldwide.",
        category: "Decentralization",
        difficulty: "intermediate"
      },

      // Day 20: Bitcoin Security and Cryptography
      {
        dayIndex: 20,
        question: "According to today's lesson, what makes Bitcoin addresses secure?",
        optionA: "Password protection",
        optionB: "Cryptographic key pairs with public and private keys",
        optionC: "Bank verification",
        optionD: "Government encryption",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin security is based on cryptographic key pairs where public keys create addresses and private keys control the funds.",
        category: "Cryptography",
        difficulty: "intermediate"
      },
      {
        dayIndex: 20,
        question: "Based on today's content, what is a Bitcoin private key?",
        optionA: "A username for your account",
        optionB: "A secret number that controls your Bitcoin",
        optionC: "A password for exchanges",
        optionD: "A public identifier",
        correctAnswer: "B",
        explanation: "Today's lesson explains that a private key is a secret number that gives you mathematical control over your Bitcoin - whoever has the private key controls the Bitcoin.",
        category: "Private Keys",
        difficulty: "beginner"
      },
      {
        dayIndex: 20,
        question: "According to today's lesson, how strong is Bitcoin's cryptography?",
        optionA: "Easily breakable",
        optionB: "Protected by the same cryptography that secures online banking and military systems",
        optionC: "Moderately secure",
        optionD: "Only secure for small amounts",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin uses military-grade cryptography (SHA-256 and ECDSA) that would take longer than the age of the universe to break with current technology.",
        category: "Security",
        difficulty: "intermediate"
      },

      // Days 21-29: Complete remaining questions
      // Day 21: Bitcoin Future and Innovation
      {
        dayIndex: 21,
        question: "According to today's lesson, what is the Lightning Network's primary purpose?",
        optionA: "To replace Bitcoin",
        optionB: "To enable instant, low-cost Bitcoin payments",
        optionC: "To mine Bitcoin faster",
        optionD: "To store Bitcoin safely",
        correctAnswer: "B",
        explanation: "Today's lesson explains that the Lightning Network is a second-layer solution that enables instant, low-cost Bitcoin payments for everyday transactions.",
        category: "Layer 2",
        difficulty: "intermediate"
      },
      {
        dayIndex: 21,
        question: "Based on today's content, how might Bitcoin evolve in the next decade?",
        optionA: "It will be replaced by newer cryptocurrencies",
        optionB: "Enhanced privacy features, better scaling, and broader institutional adoption",
        optionC: "Government control will increase",
        optionD: "It will become completely centralized",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's evolution likely includes enhanced privacy features, better scaling solutions, and continued institutional adoption.",
        category: "Future",
        difficulty: "intermediate"
      },
      {
        dayIndex: 21,
        question: "According to today's lesson, what role might Bitcoin play in the future of money?",
        optionA: "A niche digital collectible",
        optionB: "The foundation of a new global monetary system",
        optionC: "Only for criminals",
        optionD: "Government-controlled currency",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin could serve as the foundation of a new global monetary system based on mathematical scarcity rather than political decisions.",
        category: "Monetary System",
        difficulty: "intermediate"
      },

      // Day 22: Bitcoin and Financial Freedom
      {
        dayIndex: 22,
        question: "According to today's lesson, how does Bitcoin provide financial sovereignty?",
        optionA: "Through government backing",
        optionB: "By allowing individuals to control their own money without intermediaries",
        optionC: "Through bank partnerships",
        optionD: "By preventing all transactions",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin provides financial sovereignty by allowing individuals to control their own money without requiring permission from banks or governments.",
        category: "Financial Freedom",
        difficulty: "intermediate"
      },
      {
        dayIndex: 22,
        question: "Based on today's content, what does 'be your own bank' mean?",
        optionA: "Start a banking business",
        optionB: "Take full custody and control of your own money",
        optionC: "Work at a bank",
        optionD: "Avoid all financial services",
        correctAnswer: "B",
        explanation: "Today's lesson explains that 'be your own bank' means taking full custody and control of your own money, eliminating dependence on traditional financial institutions.",
        category: "Self-Custody",
        difficulty: "beginner"
      },
      {
        dayIndex: 22,
        question: "According to today's lesson, how does Bitcoin help people in authoritarian regimes?",
        optionA: "It makes them completely anonymous",
        optionB: "It provides a way to preserve wealth outside government control",
        optionC: "It guarantees safety from prosecution",
        optionD: "It prevents all government monitoring",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin helps people in authoritarian regimes by providing a way to preserve wealth outside direct government control and censorship.",
        category: "Human Rights",
        difficulty: "intermediate"
      },

      // Day 23: Bitcoin Environmental Impact
      {
        dayIndex: 23,
        question: "According to today's lesson, how does Bitcoin mining affect renewable energy development?",
        optionA: "It prevents renewable energy growth",
        optionB: "It incentivizes renewable energy development by providing a profitable use for excess capacity",
        optionC: "It has no effect on renewable energy",
        optionD: "It only uses fossil fuels",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin mining incentivizes renewable energy development by providing a profitable use for excess renewable capacity that would otherwise be wasted.",
        category: "Environmental Impact",
        difficulty: "intermediate"
      },
      {
        dayIndex: 23,
        question: "Based on today's content, why do Bitcoin miners seek stranded energy sources?",
        optionA: "To hide their operations",
        optionB: "Stranded energy is often the cheapest available",
        optionC: "It's required by law",
        optionD: "To avoid competition",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin miners seek stranded energy sources because they're often the cheapest available, making mining more profitable while utilizing otherwise wasted energy.",
        category: "Energy Economics",
        difficulty: "intermediate"
      },
      {
        dayIndex: 23,
        question: "According to today's lesson, how does Bitcoin's energy use compare to traditional banking?",
        optionA: "Bitcoin uses more than all banking combined",
        optionB: "Bitcoin uses significantly less than the traditional banking system",
        optionC: "They use exactly the same amount",
        optionD: "Energy comparison is impossible",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin uses significantly less energy than the traditional banking system when including all infrastructure like branches, ATMs, data centers, and employee transportation.",
        category: "Energy Comparison",
        difficulty: "intermediate"
      },

      // Day 24: Bitcoin Network Effects
      {
        dayIndex: 24,
        question: "According to today's lesson, what creates Bitcoin's network effect?",
        optionA: "Government mandates",
        optionB: "The value increases as more people use and secure the network",
        optionC: "Marketing campaigns",
        optionD: "Celebrity endorsements",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's network effect occurs because the network becomes more valuable and secure as more people use it, miners secure it, and developers improve it.",
        category: "Network Effects",
        difficulty: "intermediate"
      },
      {
        dayIndex: 24,
        question: "Based on today's content, how does Bitcoin's first-mover advantage help it?",
        optionA: "It was marketed first",
        optionB: "It has the largest network, most security, and strongest brand recognition",
        optionC: "It has the lowest fees",
        optionD: "It's the fastest cryptocurrency",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin's first-mover advantage gives it the largest network, highest security, strongest brand recognition, and deepest liquidity.",
        category: "First Mover",
        difficulty: "intermediate"
      },
      {
        dayIndex: 24,
        question: "According to today's lesson, why is Bitcoin's security increasing over time?",
        optionA: "Better passwords are used",
        optionB: "More hash power is securing the network as it grows",
        optionC: "Government protection increases",
        optionD: "Banks are securing it",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin's security increases over time as more miners join the network, adding hash power that makes attacks exponentially more expensive.",
        category: "Security Growth",
        difficulty: "intermediate"
      },

      // Day 25: Bitcoin Market Cycles
      {
        dayIndex: 25,
        question: "According to today's lesson, what typically drives Bitcoin market cycles?",
        optionA: "Random events only",
        optionB: "Halvings, adoption waves, and macroeconomic factors",
        optionC: "Government decisions only",
        optionD: "Social media trends",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin market cycles are typically driven by halvings that reduce supply, adoption waves, and broader macroeconomic factors.",
        category: "Market Cycles",
        difficulty: "intermediate"
      },
      {
        dayIndex: 25,
        question: "Based on today's content, how do Bitcoin halvings affect market cycles?",
        optionA: "They have no effect",
        optionB: "They reduce new supply, often leading to price appreciation over time",
        optionC: "They crash the price immediately",
        optionD: "They double the supply",
        correctAnswer: "B",
        explanation: "Today's lesson explains that halvings reduce the flow of new Bitcoin into the market, often contributing to price appreciation over longer time horizons.",
        category: "Halving Effects",
        difficulty: "intermediate"
      },
      {
        dayIndex: 25,
        question: "According to today's lesson, what should long-term Bitcoin holders focus on?",
        optionA: "Daily price movements",
        optionB: "Long-term adoption trends and technological development",
        optionC: "Social media sentiment",
        optionD: "Trading signals",
        correctAnswer: "B",
        explanation: "Today's content explains that long-term Bitcoin holders should focus on adoption trends, technological development, and the long-term transition to sound money rather than short-term price volatility.",
        category: "Long-term Investing",
        difficulty: "intermediate"
      },

      // Day 26: Bitcoin Regulation and Policy
      {
        dayIndex: 26,
        question: "According to today's lesson, how do different countries approach Bitcoin regulation?",
        optionA: "All countries have identical laws",
        optionB: "Approaches vary widely from bans to legal tender to regulatory clarity",
        optionC: "No country has any Bitcoin laws",
        optionD: "Only one country regulates Bitcoin",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin regulation varies widely by country, from complete bans to legal tender status to efforts to provide regulatory clarity for businesses.",
        category: "Global Regulation",
        difficulty: "intermediate"
      },
      {
        dayIndex: 26,
        question: "Based on today's content, why might governments want to regulate Bitcoin?",
        optionA: "To destroy it completely",
        optionB: "For consumer protection, tax compliance, and financial stability",
        optionC: "To make it completely centralized",
        optionD: "To prevent all innovation",
        correctAnswer: "B",
        explanation: "Today's lesson explains that governments often seek to regulate Bitcoin for legitimate reasons like consumer protection, ensuring tax compliance, and maintaining financial stability.",
        category: "Regulatory Rationale",
        difficulty: "intermediate"
      },
      {
        dayIndex: 26,
        question: "According to today's lesson, how does Bitcoin's decentralized nature affect regulation?",
        optionA: "It makes Bitcoin completely unregulatable",
        optionB: "Governments can regulate businesses and exchanges but not the protocol itself",
        optionC: "It makes regulation unnecessary",
        optionD: "It gives governments complete control",
        correctAnswer: "B",
        explanation: "Today's content explains that while governments can regulate Bitcoin businesses and exchanges, the decentralized protocol itself remains largely outside direct government control.",
        category: "Decentralized Regulation",
        difficulty: "advanced"
      },

      // Day 27: Bitcoin Education and Adoption
      {
        dayIndex: 27,
        question: "According to today's lesson, what is the biggest barrier to Bitcoin adoption?",
        optionA: "Technical complexity",
        optionB: "Education and understanding of Bitcoin's benefits",
        optionC: "Government bans",
        optionD: "High transaction fees",
        correctAnswer: "B",
        explanation: "Today's lesson explains that the biggest barrier to Bitcoin adoption is education - helping people understand Bitcoin's benefits and how it solves real monetary problems.",
        category: "Adoption Barriers",
        difficulty: "intermediate"
      },
      {
        dayIndex: 27,
        question: "Based on today's content, how can Bitcoin education be most effective?",
        optionA: "Technical explanations only",
        optionB: "Focusing on real-world problems Bitcoin solves and simple explanations",
        optionC: "Price predictions only",
        optionD: "Complex mathematical proofs",
        correctAnswer: "B",
        explanation: "Today's lesson explains that effective Bitcoin education focuses on real-world problems Bitcoin solves, using simple explanations that connect to people's daily experiences.",
        category: "Education Strategy",
        difficulty: "intermediate"
      },
      {
        dayIndex: 27,
        question: "According to today's lesson, why is gradual Bitcoin adoption important?",
        optionA: "It prevents all change",
        optionB: "It allows people to learn and build confidence while infrastructure develops",
        optionC: "It keeps prices low",
        optionD: "It maintains government control",
        correctAnswer: "B",
        explanation: "Today's content explains that gradual adoption allows people to learn about Bitcoin, build confidence in using it, and gives time for supporting infrastructure to develop.",
        category: "Gradual Adoption",
        difficulty: "intermediate"
      },

      // Day 28: Bitcoin Community and Culture
      {
        dayIndex: 28,
        question: "According to today's lesson, what characterizes the Bitcoin community?",
        optionA: "Centralized leadership",
        optionB: "Decentralized, open-source collaboration focused on monetary freedom",
        optionC: "Corporate control",
        optionD: "Government oversight",
        correctAnswer: "B",
        explanation: "Today's lesson explains that the Bitcoin community is characterized by decentralized, open-source collaboration with a shared focus on monetary freedom and sound money principles.",
        category: "Community",
        difficulty: "intermediate"
      },
      {
        dayIndex: 28,
        question: "Based on today's content, what does 'HODL' represent in Bitcoin culture?",
        optionA: "A trading strategy",
        optionB: "Long-term belief in Bitcoin's potential to become sound money",
        optionC: "A type of wallet",
        optionD: "A mining technique",
        correctAnswer: "B",
        explanation: "Today's lesson explains that 'HODL' represents the culture of long-term belief in Bitcoin's potential to become sound money, emphasizing time-in-market over market timing.",
        category: "Bitcoin Culture",
        difficulty: "beginner"
      },
      {
        dayIndex: 28,
        question: "According to today's lesson, how does the Bitcoin community approach development?",
        optionA: "Through corporate hierarchies",
        optionB: "Open-source collaboration with rigorous peer review",
        optionC: "Government committees",
        optionD: "Closed-door meetings",
        correctAnswer: "B",
        explanation: "Today's content explains that Bitcoin development happens through open-source collaboration with rigorous peer review, ensuring transparency and community involvement.",
        category: "Development Culture",
        difficulty: "intermediate"
      },

      // Day 29: Bitcoin and Personal Finance
      {
        dayIndex: 29,
        question: "According to today's lesson, how should Bitcoin fit into personal finance planning?",
        optionA: "It should be 100% of someone's wealth",
        optionB: "As part of a diversified strategy based on individual risk tolerance",
        optionC: "Only for the wealthy",
        optionD: "Only for trading",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin should be part of a diversified financial strategy, with allocation based on individual risk tolerance, goals, and financial situation.",
        category: "Personal Finance",
        difficulty: "intermediate"
      },
      {
        dayIndex: 29,
        question: "Based on today's content, what is dollar-cost averaging into Bitcoin?",
        optionA: "Buying all at once",
        optionB: "Regularly purchasing small amounts over time to reduce volatility impact",
        optionC: "Only buying during crashes",
        optionD: "Trading frequently",
        correctAnswer: "B",
        explanation: "Today's lesson explains that dollar-cost averaging involves regularly purchasing small amounts of Bitcoin over time, which helps reduce the impact of short-term price volatility.",
        category: "Investment Strategy",
        difficulty: "beginner"
      },
      {
        dayIndex: 29,
        question: "According to today's lesson, what is the most important Bitcoin safety rule?",
        optionA: "Share private keys with family",
        optionB: "Never share your private keys and always verify receive addresses",
        optionC: "Keep all Bitcoin on exchanges",
        optionD: "Write down passwords publicly",
        correctAnswer: "B",
        explanation: "Today's content emphasizes that the most important safety rule is never sharing your private keys and always verifying receive addresses before sending transactions.",
        category: "Security Best Practices",
        difficulty: "beginner"
      }
    ];

    // Combine all questions
    const allDayQuestions = [...daySpecificQuestions, ...additionalDays, ...daySpecificAdditional];
    
    // Add all day-specific questions
    allDayQuestions.forEach(question => {
      const newQuestion: QuizQuestion = { ...question, id: this.currentQuizQuestionId++ };
      this.quizQuestions.set(newQuestion.id, newQuestion);
    });

    // Day-specific questions are already added above in allDayQuestions

    // For days 30-400, use the base questions (keeping original functionality)
    const quizQuestions: Omit<QuizQuestion, 'id'>[] = [];
    for (let day = 30; day < 400; day++) {
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

    // Weekly topics seed data
    const weeklyTopicsData = [
      {
        weekNumber: 1,
        title: "Bitcoin Foundations: Digital Scarcity and Monetary Revolution",
        description: "Comprehensive exploration of Bitcoin's revolutionary breakthrough in solving digital scarcity, establishing decentralized consensus, and creating the first truly sound digital money in human history.",
        content: [
          {
            title: "The Fundamental Problem: Trust and Double-Spending in Digital Systems",
            content: "Before Bitcoin, every digital monetary system faced an insurmountable challenge known as the double-spending problem. Digital information can be copied perfectly and infinitely - when you send someone a digital photo, you still retain the original. This property, while useful for information sharing, made digital money impossible without trusted intermediaries.\n\nTraditional digital payment systems solved this by having centralized authorities (banks, payment processors, governments) maintain authoritative ledgers. When Alice sends $100 to Bob digitally, the bank decreases Alice's balance and increases Bob's balance in their database. The bank's role as trusted third party prevents Alice from spending the same $100 twice.\n\nHowever, this solution created new problems: single points of failure, censorship vulnerability, high fees, slow settlement times, exclusion of the unbanked, and most critically, the concentration of monetary control in the hands of a few institutions. Every previous attempt at digital money - from DigiCash to e-gold - failed because they relied on trusted third parties who eventually failed, were shut down, or became corrupted.\n\nBitcoin's breakthrough was solving the double-spending problem without requiring any trusted third party. Through an ingenious combination of cryptographic proofs, economic incentives, and distributed consensus, Bitcoin created the first truly peer-to-peer electronic cash system where participants could transact directly without intermediaries.\n\nThis wasn't just a technical achievement - it represented a fundamental paradigm shift from trust-based systems to truth-based systems, where mathematical proof replaced institutional authority as the foundation of monetary exchange.",
            examples: [
              "DigiCash (1989): David Chaum's digital cash system shut down in 1998",
              "e-gold (1996): Digital gold currency seized by US government in 2008", 
              "Liberty Reserve (2006): $6 billion money laundering operation shut down in 2013",
              "Byzantine Generals Problem: Achieving consensus in distributed systems with potentially malicious actors",
              "Double-spending attacks: Theoretical scenarios where same digital token is spent multiple times",
              "Centralized failure points: Banks, payment processors, and governments as single points of control"
            ]
          },
          {
            title: "Cryptographic Security: Mathematical Certainty Over Legal Enforcement",
            content: "Bitcoin's security model represents a fundamental departure from traditional systems that rely on legal frameworks, institutional reputation, and physical enforcement. Instead, Bitcoin uses mathematical proofs that are computationally infeasible to break, creating security through cryptographic certainty rather than legal deterrence.\n\nThe foundation of Bitcoin's security lies in elliptic curve cryptography, specifically the secp256k1 curve. Each Bitcoin address is mathematically derived from a private key - a 256-bit number that represents one of 2^256 possible values. To put this in perspective, there are more possible private keys than there are atoms in the observable universe (estimated at 10^82 atoms vs 2^256 ≈ 10^77 possible keys).\n\nWhen someone controls a private key, they can create digital signatures that mathematically prove ownership of the associated Bitcoin addresses without revealing the private key itself. This signature process uses the Elliptic Curve Digital Signature Algorithm (ECDSA), which provides several critical security properties:\n\n**Unforgeable**: It's computationally impossible to create a valid signature without knowing the private key\n**Non-repudiable**: A valid signature proves the private key holder authorized the transaction\n**Tamper-evident**: Any modification to the signed message invalidates the signature\n**Zero-knowledge**: The signature reveals nothing about the private key itself\n\nBitcoin also employs SHA-256 hashing extensively - a cryptographic function that takes any input and produces a fixed 256-bit output. Even tiny changes to input data result in completely different hash outputs, making it trivial to detect any tampering with transaction data. The probability of finding two different inputs that produce the same SHA-256 hash is approximately 1 in 2^256 - effectively impossible.\n\nThis cryptographic security operates independently of legal systems, governments, or institutional authorities. A Bitcoin transaction's validity can be verified by anyone with basic computing resources, anywhere in the world, without requiring permission from or trust in any authority.",
            examples: [
              "secp256k1 curve: The specific elliptic curve used by Bitcoin, chosen for efficiency and security",
              "Private key entropy: 256 bits of randomness providing 2^128 security level",
              "Digital signatures: ECDSA proofs that transaction was authorized by private key holder",
              "SHA-256 hashing: Cryptographic function used for mining, transaction IDs, and Merkle trees",
              "Address derivation: Mathematical process generating public addresses from private keys",
              "Multi-signature schemes: Requiring multiple private keys to authorize transactions",
              "Hardware security modules: Specialized devices for generating and storing private keys",
              "Cryptographic hash functions: One-way mathematical functions used throughout Bitcoin protocol"
            ]
          },
          {
            title: "Digital Scarcity: Engineering Absolute Scarcity in the Digital Realm",
            content: "Bitcoin achieved something previously thought impossible: creating absolute scarcity in a digital medium. For the first time in human history, we have digital objects that cannot be copied, duplicated, or counterfeited. This breakthrough required solving complex coordination problems and aligning economic incentives across a global network of participants.\n\nThe scarcity mechanism operates through Bitcoin's monetary policy, which is embedded directly in the protocol software and enforced by the entire network. Exactly 21 million bitcoins will ever exist - not 21 million and one, not 20.99 million, but precisely 21,000,000 bitcoins. This limit is mathematically guaranteed and cannot be changed without consensus from the overwhelming majority of network participants.\n\nNew bitcoins are created through the mining process on a predetermined schedule. Initially, 50 bitcoins were created every 10 minutes. Every 210,000 blocks (approximately 4 years), this reward halves: 50 → 25 → 12.5 → 6.25 → 3.125, and so on. This halving continues until approximately 2140, when the last bitcoin will be mined.\n\nThe supply schedule creates several important economic properties:\n\n**Predictable inflation**: Unlike fiat currencies where money supply is determined by central bank policy, Bitcoin's inflation rate is known decades in advance\n**Diminishing inflation**: The inflation rate decreases over time, reaching zero when all 21 million bitcoins are mined\n**Anti-fragile scarcity**: The more people who try to mine Bitcoin, the more difficult it becomes, ensuring the supply schedule remains constant regardless of network size\n**Stock-to-flow ratio**: Bitcoin's ratio of existing supply to new production approaches infinity, making it the hardest money ever created\n\nThis engineered scarcity is maintained through the proof-of-work mining process, where participants expend real-world energy to secure the network and mint new bitcoins. The energy expenditure creates 'unforgeable costliness' - it becomes prohibitively expensive to attack or manipulate Bitcoin's supply schedule.\n\nUnlike physical scarce resources like gold or real estate, Bitcoin's scarcity is transparent, verifiable, and cannot be diluted through new discoveries or technological improvements. Every participant in the network can independently verify the total supply and inflation schedule at any time.",
            examples: [
              "21 million hard cap: Maximum number of bitcoins that will ever exist",
              "Halving events: 2012, 2016, 2020, 2024 - each reducing new supply by 50%",
              "Mining difficulty adjustment: Network automatically adjusts every 2016 blocks",
              "Stock-to-flow model: Measuring scarcity through ratio of existing stock to new production",
              "Monetary inflation schedule: Precisely predictable decades in advance",
              "Genesis block: First Bitcoin block mined January 3, 2009",
              "Block rewards: Current reward of 6.25 BTC per block (as of 2024)",
              "Final bitcoin: Estimated to be mined around year 2140"
            ]
          },
          {
            title: "Decentralization: Achieving Consensus Without Central Authority",
            content: "Bitcoin's most revolutionary innovation isn't its cryptography or scarcity - it's achieving global consensus without any central authority. This breakthrough solved the fundamental problem of coordination in distributed systems, creating a network that operates 24/7/365 without downtime, maintenance windows, or administrative control.\n\nThe decentralization operates at multiple layers:\n\n**Protocol Layer**: No single entity controls Bitcoin's rules. Changes require overwhelming consensus from users, miners, and node operators. This makes Bitcoin extremely resistant to arbitrary changes or political pressure.\n\n**Network Layer**: Over 15,000 full nodes distributed across every continent validate transactions and maintain complete copies of the blockchain. These nodes are operated by individuals, companies, universities, and organizations worldwide.\n\n**Mining Layer**: Hundreds of thousands of mining devices across the globe compete to solve proof-of-work puzzles. Mining operations span from small home setups to industrial facilities powered by renewable energy.\n\n**Development Layer**: Bitcoin's software is open source with hundreds of contributors. No single company or individual controls the codebase, and all changes are publicly reviewed and tested.\n\nThis decentralization provides unprecedented monetary sovereignty:\n\n**Censorship Resistance**: No entity can prevent valid transactions from being processed\n**Seizure Resistance**: Properly secured Bitcoin cannot be confiscated without private key access\n**Shutdown Resistance**: The network continues operating even if major participants disappear\n**Manipulation Resistance**: No single actor can change Bitcoin's monetary policy or transaction history\n\nThe trade-off for this decentralization is efficiency - Bitcoin processes about 7 transactions per second compared to thousands for centralized payment systems. However, this is intentional: Bitcoin prioritizes security and decentralization over speed, serving as a base settlement layer rather than a high-frequency payment system.\n\nDecentralization also creates emergent properties that strengthen over time. As more participants join the network, it becomes more resilient, more valuable, and more difficult to attack or control. This network effect creates a self-reinforcing cycle of growth and security.",
            examples: [
              "Node distribution: 15,000+ full nodes across 100+ countries",
              "Mining decentralization: Hash rate distributed across continents",
              "Development contributors: Hundreds of developers from around the world",
              "Geographic resilience: Network surviving internet outages and government bans",
              "Protocol governance: Consensus-driven upgrade process (Taproot, SegWit)",
              "Client diversity: Multiple independent software implementations",
              "Economic incentives: Game theory aligning individual and network interests",
              "Permissionless participation: Anyone can run a node or mine Bitcoin"
            ]
          },
          {
            title: "Store of Value Properties: Digital Gold for the Internet Age",
            content: "Bitcoin represents the evolution of store of value assets, combining the best properties of traditional monetary technologies while solving their fundamental limitations. To understand Bitcoin's role as a store of value, we must examine how it compares to historical monetary assets and why digital properties matter in an increasingly digital world.\n\n**Historical Context**: Throughout history, humans have used various stores of value - from cattle and shells to precious metals and fiat currencies. Each served their purpose in their respective technological contexts, but all had significant limitations. Cattle could die, shells could be found in abundance, precious metals could be debased, and fiat currencies could be printed infinitely.\n\n**Bitcoin's Monetary Properties**:\n\n• **Scarcity**: Absolutely limited to 21 million units, unlike gold which can be mined indefinitely\n• **Durability**: Digital information doesn't degrade, unlike physical assets\n• **Portability**: Billions of dollars can be transmitted globally in minutes\n• **Divisibility**: Each bitcoin divides into 100 million satoshis for precise transactions\n• **Uniformity**: Every bitcoin is identical and interchangeable\n• **Recognizability**: Easily verified through cryptographic proofs\n• **Resistance to Confiscation**: Cannot be seized without private key access\n\n**Network Effects and Adoption**: Bitcoin's value as a store of value increases with adoption through Metcalfe's Law - the value of a network grows proportionally to the square of its users. As more individuals, institutions, and nations adopt Bitcoin, its liquidity, acceptance, and utility increase exponentially.\n\n**Institutional Adoption**: Major corporations like MicroStrategy, Tesla, and Square have allocated significant portions of their treasury reserves to Bitcoin. Investment firms like Grayscale, Fidelity, and BlackRock offer Bitcoin investment products. Nations like El Salvador have made Bitcoin legal tender, while others accumulate it as a strategic reserve asset.\n\n**Volatility and Time Preference**: Bitcoin's short-term volatility reflects its emergence as a new monetary technology. However, over longer time horizons (4+ years), Bitcoin has consistently outperformed traditional assets. This volatility decreases as market capitalization grows and adoption stabilizes.\n\n**Digital Native Properties**: Unlike traditional stores of value that were adapted for digital use, Bitcoin was designed from the ground up for the digital age. It operates 24/7 globally, settles in minutes to hours rather than days, and requires no physical storage or transport infrastructure.",
            examples: [
              "Corporate adoption: MicroStrategy ($6B+), Tesla ($1.5B), Square ($200M+)",
              "Institutional products: Grayscale Bitcoin Trust, Fidelity Bitcoin Fund",
              "Nation-state adoption: El Salvador legal tender, Ukraine accepting donations",
              "Traditional finance: JP Morgan, Goldman Sachs offering Bitcoin services",
              "Performance metrics: 4-year CAGR consistently outperforming major asset classes",
              "Market capitalization: Growing from $0 to $800B+ in 15 years",
              "Liquidity depth: Daily trading volume exceeding $20 billion",
              "Geographic arbitrage: Price convergence across global exchanges"
            ]
          },
          {
            title: "Network Effects and Future Monetary System",
            content: "Bitcoin's ultimate value proposition extends beyond its technical properties to its role in reshaping the global monetary system. As the first truly global, neutral monetary network, Bitcoin creates unprecedented opportunities for economic coordination and value preservation across borders, cultures, and time periods.\n\n**Monetary Network Effects**: Unlike traditional networks that face diminishing returns, monetary networks exhibit increasing returns to scale. As more people use Bitcoin as money, it becomes more liquid, more accepted, and more valuable, creating a virtuous cycle that strengthens the network. This is particularly powerful because money is the most networked good in any economy.\n\n**Global Reserve Asset**: Bitcoin's properties position it as a potential global reserve asset - a neutral monetary standard that no single nation controls. This could solve many problems with the current dollar-based system, including political weaponization of money, currency wars, and the inherent instability of using one nation's currency as the global standard.\n\n**Technological Infrastructure**: The Bitcoin ecosystem continues expanding with layer-2 solutions like Lightning Network enabling instant, low-cost payments; custody solutions making Bitcoin accessible to institutions; and integration with traditional financial systems through ETFs, futures, and banking products.\n\n**Generational Adoption**: Younger generations, having grown up with digital technology, often find Bitcoin's properties more intuitive than traditional monetary systems. This demographic shift suggests accelerating adoption as digital natives enter their peak earning and investing years.\n\n**Macro Economic Trends**: Global trends favor Bitcoin adoption: increasing government debt, persistent inflation, currency debasement, capital controls, and financial surveillance. Bitcoin provides an alternative that operates outside these systems while preserving individual sovereignty.\n\n**Future Scenarios**: Conservative estimates suggest Bitcoin capturing even a small percentage of global store-of-value markets (bonds, real estate, gold) would result in significant price appreciation. More optimistic scenarios envision Bitcoin as the global monetary standard, potentially worth millions per coin in today's purchasing power.\n\nThe transition to a Bitcoin standard won't happen overnight, but the economic incentives and technological trends point toward increasing adoption across all sectors of the economy.",
            examples: [
              "Lightning Network: Growing to 5,000+ nodes enabling instant payments",
              "ETF approval: BlackRock and other major asset managers filing for Bitcoin ETFs",
              "Central bank interest: Fed, ECB studying Bitcoin and digital currencies",
              "Remittance markets: Bitcoin reducing costs for migrant workers",
              "Emerging market adoption: Nigeria, Philippines, Vietnam leading Bitcoin adoption",
              "Hyperinflation hedges: Citizens in Turkey, Argentina using Bitcoin as savings",
              "Corporate treasuries: Over 100 public companies holding Bitcoin",
              "Infrastructure development: Exchanges, custody, payment processors scaling globally"
            ]
          }
        ],
        category: "Foundation",
        difficulty: "beginner",
        estimatedReadTime: 60,
        relatedDayIndex: 1,
        keyTakeaways: [
          "Bitcoin solved the double-spending problem without trusted third parties through cryptographic proof and distributed consensus",
          "Mathematical security provides certainty independent of legal systems or institutional authority",
          "True digital scarcity creates the hardest money in human history with predictable, decreasing inflation",
          "Decentralization eliminates single points of failure while providing unprecedented monetary sovereignty",
          "Network effects drive exponential value growth as Bitcoin captures share of global store-of-value markets",
          "Bitcoin represents the evolution from trust-based to truth-based monetary systems"
        ],
        practicalApplications: [
          "Evaluate Bitcoin allocation in investment portfolios based on uncorrelated returns and inflation hedge properties",
          "Understand regulatory developments and compliance requirements in your jurisdiction",
          "Calculate dollar-cost averaging strategies for long-term Bitcoin accumulation during volatility",
          "Assess Bitcoin's role in international commerce and cross-border payment solutions",
          "Monitor macroeconomic indicators that historically drive Bitcoin adoption and price movements",
          "Compare Bitcoin's monetary properties to traditional stores of value in personal financial planning"
        ],
        furtherReading: [
          { title: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf", description: "Satoshi Nakamoto's original 9-page vision for peer-to-peer electronic cash" },
          { title: "The Bitcoin Standard", url: "#", description: "Saifedean Ammous on Bitcoin as sound money and comprehensive monetary history" },
          { title: "The Bullish Case for Bitcoin", url: "#", description: "Vijay Boyapati's detailed investment thesis and adoption scenarios" },
          { title: "Gradually, Then Suddenly", url: "#", description: "Parker Lewis essays on Bitcoin adoption and fiat system structural problems" },
          { title: "Mastering Bitcoin", url: "#", description: "Andreas Antonopoulos technical deep-dive into Bitcoin's architecture" }
        ]
      },
      {
        weekNumber: 2,
        title: "Bitcoin as Sound Money: Austrian Economics and Monetary Theory",
        description: "Comprehensive analysis of Bitcoin's monetary properties through Austrian economic theory, comparing it to gold, fiat currencies, and examining why Bitcoin represents the hardest money ever created.",
        content: [
          {
            title: "Austrian Theory of Money",
            content: "Austrian economics explains money's role in economic coordination and why sound money drives prosperity.\n\nLudwig von Mises and Friedrich Hayek showed that money emerges spontaneously from markets as the most marketable commodity - what people readily accept in exchange.\n\nCarl Menger's regression theorem explains money's value origin: it starts as a commodity with non-monetary use before becoming accepted as exchange medium. Bitcoin represents a new category - money valued for superior monetary properties rather than commodity use.\n\n**Key Austrian Principles in Bitcoin:**\n\n• **Subjective Value Theory**: Individual preferences determine value. Bitcoin's value comes from monetary usefulness, not authority decree.\n\n• **Sound Money Properties**: Scarce, durable, divisible, portable, recognizable - emerging from market selection, not government mandate.\n\n• **Calculation Problem**: Central planning fails because prices coordinate activity. Sound money enables accurate signals through stable purchasing power.\n\n• **Time Preference**: People prefer present to future goods. Sound money enables saving without inflation erosion.\n\nBitcoin culminates Austrian theory - voluntary adoption, scarcity-maintained purchasing power, and operation without central control.",
            examples: [
              "Menger's Principles of Economics (1871): Origin of money theory",
              "Mises' Theory of Money and Credit (1912): Regression theorem and sound money",
              "Hayek's Denationalization of Money (1976): Competition in currency",
              "Rothbard's What Has Government Done to Our Money?: Critique of fiat systems",
              "Salerno's Money, Sound and Unsound: Austrian monetary theory applications",
              "Bitcoin emergence: Voluntary adoption without government mandate"
            ]
          },
          {
            title: "Gold vs Bitcoin Properties",
            content: "Sound money serves three functions: medium of exchange, unit of account, and store of value. Gold dominated historically due to superior monetary properties, but Bitcoin improves upon each.\n\n**Property Comparison:**\n\n• **Durability**: Gold lasts millennia without degrading. Bitcoin is more durable - digital information cannot rust or deteriorate, enduring indefinitely while the network exists.\n\n• **Portability**: Gold requires 25kg to move $1 million with significant security. Bitcoin transmits any amount globally in minutes with minimal cost.\n\n• **Divisibility**: Gold division requires tools and creates waste. Bitcoin divides perfectly into 100 million satoshis, enabling precise micro-transactions.\n\n• **Uniformity**: Gold purity varies requiring testing. All bitcoins are identical and interchangeable with protocol-level fungibility.\n\n• **Scarcity**: Gold scarcity depends on mining discoveries and technology. Bitcoin's scarcity is absolute and mathematically guaranteed.\n\n• **Recognizability**: Gold requires expensive verification equipment. Bitcoin transactions are instantly verifiable through cryptographic proofs.\n\n• **Censorship Resistance**: Gold can be confiscated (US 1933 ban). Properly secured Bitcoin cannot be seized without private key access.\n\n• **Programmability**: Gold cannot be programmed. Bitcoin enables complex conditions with multi-signature requirements and time locks.\n\nBitcoin improves every monetary property while eliminating physical limitations.",
            examples: [
              "1933 Executive Order 6102: US government confiscating private gold",
              "Gold standard abandonment: 1971 Nixon shock ending convertibility",
              "Gold assaying: Expensive testing required to verify purity",
              "Bitcoin verification: Instant cryptographic proof of authenticity",
              "Cross-border gold transport: High costs and regulatory restrictions",
              "Bitcoin remittances: Global value transfer in minutes",
              "Gold mining discoveries: Occasionally flooding markets with new supply",
              "Bitcoin supply schedule: Mathematically predetermined and unchangeable"
            ]
          },
          {
            title: "Stock-to-Flow Analysis",
            content: "Stock-to-flow ratio measures monetary hardness by comparing existing supply (stock) to annual production (flow). Higher ratios indicate harder money resistant to inflation.\n\n**Historical Ratios:**\n\n• **Commodities**: Low ratios (1-5 years) because increased demand drives production\n• **Silver**: Ratio around 20-30, suitable for money but limited by industrial use\n• **Gold**: Highest ratio among physical commodities (60-80), explaining 5,000-year monetary history\n• **Fiat**: Effectively zero ratios since they can be printed at will\n\n**Bitcoin's Trajectory:**\n\nBitcoin's stock-to-flow increases with each halving:\n• Pre-2012: S2F 3-4 (similar to silver)\n• 2012-2016: S2F 8-12 (approaching gold)\n• 2016-2020: S2F 25-30 (exceeding silver)\n• 2020-2024: S2F 50-60 (matching gold)\n• 2024-2028: S2F 100+ (exceeding gold)\n• Post-2140: S2F approaches infinity\n\nThis predictable increase creates a monetization timeline where Bitcoin becomes harder money than any substance in history.",
            examples: [
              "PlanB's S2F model: Correlating Bitcoin price with scarcity increases",
              "Gold mining: Annual production around 3,000 tons vs 200,000 ton stock",
              "Bitcoin halving impacts: 2012, 2016, 2020, 2024 supply reductions",
              "Quantitative easing: Fed expanding money supply by trillions",
              "Weimar hyperinflation: Money printing destroying stock-to-flow ratio",
              "Oil price shocks: Demonstrating low S2F commodity volatility",
              "Silver demonetization: Industrial use reducing monetary premium"
            ]
          },
          {
            title: "Gresham's Law and Bitcoin Adoption",
            content: "Gresham's Law states 'bad money drives out good money' under legal tender laws. People hoard good money and spend bad money, explaining Bitcoin adoption patterns.\n\n**Historical Examples:**\nWhen governments debased coins while maintaining face value, people hoarded pure coins and spent debased ones.\n\n**Modern Bitcoin Application:**\nPeople spend depreciating fiat while saving appreciating Bitcoin:\n• **Spend**: Fiat losing purchasing power to inflation\n• **Save**: Bitcoin gaining value through scarcity and adoption\n\nThis creates a transition where Bitcoin serves as store of value while fiat continues as medium of exchange.\n\n**Thiers' Law in Free Markets:**\nIn free markets, 'good money drives out bad money.' Bitcoin adoption follows this in jurisdictions without legal tender restrictions.\n\n**Institutional Patterns:**\nCorporations like MicroStrategy borrow fiat (bad money) to buy Bitcoin (good money), leveraging predictable fiat depreciation.",
            examples: [
              "Roman coin debasement: Silver content reduced from 98% to 5% over centuries",
              "Bimetallic standard failures: Gold-silver ratio manipulations",
              "Weimar Germany: Citizens hoarding foreign currencies and real assets",
              "Venezuela/Argentina: USD and Bitcoin adoption during hyperinflation",
              "MicroStrategy strategy: Borrowing fiat to buy Bitcoin",
              "El Salvador adoption: Legal tender status creating dual currency system",
              "Lightning Network growth: Enabling Bitcoin micropayments"
            ]
          },
          {
            title: "Network Effects",
            content: "Money exhibits powerful network effects - its utility increases exponentially with users. Metcalfe's Law states network value grows proportionally to the square of users.\n\n**Why Money Has Network Effects:**\nMoney facilitates exchange between parties. More acceptance means greater utility. A money accepted by 1,000 people enables 499,500 trading pairs; 2,000 people enables 1,999,000 pairs - four times as many despite only doubling users.\n\n**Bitcoin's Network Acceleration:**\n• **Digital Native**: Designed for global networks, enabling instant worldwide adoption\n• **Open Protocol**: Permissionless innovation in wallets, exchanges, services\n• **Programmable**: Smart contracts enable new use cases\n• **Permissionless Access**: No approval needed to use Bitcoin\n\n**Measurable Growth:**\n• **Active Addresses**: Growing to 100+ million\n• **Transaction Volume**: Billions daily\n• **Hash Rate**: Exponentially growing security\n• **Infrastructure**: Exchanges, custody, payment processors\n\n**Future Scenarios:**\nSmall percentages of existing networks would create enormous effects:\n• 1% of remittances: $8 billion volume\n• 5% of gold market: $600 billion value\n• 10% of reserves: $1.5 trillion holdings",
            examples: [
              "Internet adoption curve: 25 years to reach 4 billion users",
              "Social media networks: Facebook, Twitter demonstrating network effects",
              "Payment networks: Visa, Mastercard value from merchant/consumer adoption",
              "Email protocols: SMTP becoming universal communication standard",
              "TCP/IP adoption: Internet protocol achieving global dominance",
              "Lightning Network: Second-layer scaling preserving network effects",
              "Exchange networks: Coinbase, Binance facilitating Bitcoin adoption",
              "Merchant adoption: PayPal, Square enabling Bitcoin payments"
            ]
          },
          {
            title: "Central Banking and Cantillon Effect",
            content: "The Cantillon Effect describes how new money creation benefits those closest to the source while harming those furthest away through inflation.\n\n**Central Banking Distribution Chain:**\n1. Large banks receive new money first at zero rates\n2. Financial institutions access cheap credit\n3. Asset markets rise with new liquidity\n4. Wealthy asset owners see portfolio gains before price rises\n5. Workers face higher costs while wages lag\n\nThis systematically transfers wealth from savers to asset owners, explaining wealth inequality growth since 1971's gold standard end.\n\n**Quantitative Easing Results:**\nSince 2008, central banks created $20+ trillion, primarily flowing into financial markets:\n• Stock markets hit highs despite uncertainty\n• Real estate became unaffordable\n• Bond yields turned negative\n• Luxury goods appreciated massively\n\n**Bitcoin's Cantillon Resistance:**\n• **No Printing**: 21 million limit prevents artificial inflation\n• **Equal Access**: Distribution through mining, not favoritism\n• **Transparency**: Verifiable supply and distribution\n• **No Preferential Treatment**: Everyone pays market price\n\nBitcoin represents return to incorruptible money that cannot be manipulated for political advantage.",
            examples: [
              "2008 Financial Crisis: Banks receiving bailouts while homeowners foreclosed",
              "COVID-19 Response: Asset prices soaring while unemployment spiked",
              "Japan's Lost Decades: Quantitative easing failing to create broad prosperity",
              "Weimar Republic: Currency printing enriching speculators, impoverishing workers",
              "1970s Inflation: Oil shocks revealing fiat currency vulnerabilities",
              "Swiss Franc Strength: Lower inflation due to monetary restraint",
              "Bitcoin Distribution: Mining rewards based on energy expenditure, not favoritism",
              "Gold Standard Era: Lower wealth inequality under sound money"
            ]
          }
        ],
        category: "Economics",
        difficulty: "intermediate",
        estimatedReadTime: 55,
        relatedDayIndex: 15,
        keyTakeaways: [
          "Austrian economic theory provides the theoretical foundation for understanding Bitcoin as superior money",
          "Bitcoin improves on gold's monetary properties while eliminating physical limitations and confiscation risks",
          "Stock-to-flow analysis shows Bitcoin becoming harder money than gold through predictable halving cycles",
          "Gresham's Law explains Bitcoin adoption patterns as people save good money and spend bad money",
          "Network effects create exponential value growth as Bitcoin adoption reaches critical mass",
          "Bitcoin eliminates the Cantillon Effect by preventing arbitrary money supply increases"
        ],
        practicalApplications: [
          "Apply Austrian economic principles to evaluate Bitcoin's role in personal financial planning",
          "Use stock-to-flow analysis to understand Bitcoin's long-term scarcity trajectory",
          "Implement Gresham's Law strategies by saving in Bitcoin while spending depreciating fiat currencies",
          "Monitor network effect metrics to gauge Bitcoin adoption and infrastructure development",
          "Recognize Cantillon Effect implications when central banks announce monetary policy changes",
          "Compare Bitcoin's monetary properties to traditional assets in portfolio allocation decisions"
        ],
        quizQuestions: [
          {
            question: "According to Austrian economic theory, what is the regression theorem and how does Bitcoin relate to it?",
            options: [
              "Money must be backed by government decree; Bitcoin violates this by being decentralized",
              "Money must start as a commodity with non-monetary value before becoming accepted as money; Bitcoin represents a new category emerging from superior monetary properties",
              "Money must be physical to have value; Bitcoin fails because it's digital",
              "Money must be inflationary to encourage spending; Bitcoin's deflationary nature is problematic"
            ],
            correctAnswer: 1,
            explanation: "Carl Menger's regression theorem states that money must start as a commodity with non-monetary use. Bitcoin appears to violate this but actually represents a new category: money that emerges from its superior monetary properties rather than commodity value."
          },
          {
            question: "What is the stock-to-flow ratio and why is Bitcoin's trajectory significant?",
            options: [
              "It measures price volatility; Bitcoin's high volatility makes it unsuitable as money",
              "It compares existing supply to annual production; Bitcoin's ratio increases with each halving, eventually exceeding gold's to become the hardest money in history",
              "It measures transaction speed; Bitcoin's slow transactions limit its monetary use",
              "It compares market cap to trading volume; Bitcoin's low ratio indicates poor liquidity"
            ],
            correctAnswer: 1,
            explanation: "Stock-to-flow measures monetary hardness by comparing existing supply to new production. Bitcoin's halving mechanism increases this ratio every four years, making it progressively harder money than gold."
          },
          {
            question: "Which monetary property does Bitcoin improve most significantly compared to gold?",
            options: [
              "Durability - Bitcoin lasts longer than gold",
              "Scarcity - Bitcoin has absolute mathematical scarcity while gold's scarcity depends on mining discoveries",
              "Recognition - Bitcoin is more widely recognized than gold",
              "Uniformity - Bitcoin pieces are more identical than gold pieces"
            ],
            correctAnswer: 1,
            explanation: "While Bitcoin improves on multiple properties, its most significant advantage is absolute mathematical scarcity. Only 21 million bitcoin will ever exist, unlike gold where new deposits can be discovered or asteroid mining could theoretically flood the market."
          },
          {
            question: "How do network effects apply to Bitcoin's monetization process?",
            options: [
              "More miners joining the network increases Bitcoin's value",
              "More users adopting Bitcoin increases its utility and value proposition, creating self-reinforcing adoption cycles",
              "More exchanges listing Bitcoin improves its price stability",
              "More developers working on Bitcoin increases its technical capabilities"
            ],
            correctAnswer: 1,
            explanation: "Network effects in money mean that value increases with the number of users. As more individuals, institutions, and nations adopt Bitcoin, its utility grows, which drives more adoption in a self-reinforcing cycle."
          },
          {
            question: "What is the key insight from Austrian time preference theory regarding Bitcoin?",
            options: [
              "People prefer to spend Bitcoin immediately rather than save it",
              "Sound money like Bitcoin allows people to defer consumption and save for the future without losing purchasing power to inflation",
              "Bitcoin's volatility makes it unsuitable for long-term planning",
              "Time preference only applies to physical commodities, not digital assets"
            ],
            correctAnswer: 1,
            explanation: "Austrian time preference theory explains that individuals prefer present goods to future goods. Sound money like Bitcoin enables people to save and defer consumption without losing purchasing power to inflation, unlike fiat currencies."
          }
        ],
        furtherReading: [
          { title: "The Fiat Standard", url: "#", description: "Saifedean Ammous on fiat money's systematic flaws and Bitcoin's Austrian properties" },
          { title: "Layered Money", url: "#", description: "Nik Bhatia on Bitcoin's place in monetary history and layer theory" },
          { title: "The Price of Tomorrow", url: "#", description: "Jeff Booth on deflation, technology, and Bitcoin's deflationary nature" },
          { title: "Principles of Economics", url: "#", description: "Carl Menger's foundational work on money's spontaneous emergence" },
          { title: "What Has Government Done to Our Money?", url: "#", description: "Murray Rothbard's critique of government monetary intervention" }
        ]
      },
      {
        weekNumber: 3,
        title: "Bitcoin Mining and Network Security",
        description: "Understand how Bitcoin mining works, why it's essential for network security, and how proof-of-work creates the most secure financial network ever built.",
        content: [
          {
            title: "The Mining Process: Securing the Network Through Energy",
            content: "Bitcoin mining represents the most revolutionary consensus mechanism ever invented, solving the fundamental problem of achieving agreement in a distributed network without central authority. Mining is simultaneously the process by which new bitcoins are created, transactions are verified, and the network is secured against attacks.\n\nThe mining process works through competitive computation. Every 10 minutes on average, miners worldwide compete to solve a cryptographic puzzle that requires enormous computational effort but produces easily verifiable results. This puzzle involves finding a number (called a nonce) that, when combined with pending transactions and the previous block hash, produces a hash beginning with a specific number of zeros.\n\nThe difficulty of this puzzle automatically adjusts every 2,016 blocks (approximately every two weeks) to maintain the 10-minute average block time regardless of how many miners join or leave the network. This self-regulating mechanism ensures predictable bitcoin issuance and stable block times even as computing power fluctuates dramatically.\n\nWhen a miner successfully solves the puzzle, they broadcast their solution to the network. Other miners and nodes quickly verify the solution and, if valid, accept the new block and begin working on the next puzzle. The winning miner receives newly created bitcoins (currently 6.25 BTC per block) plus transaction fees from all transactions included in their block.\n\nThis process creates several critical security properties: it requires real-world energy expenditure to propose new blocks, making attacks expensive; it provides objective ordering of transactions without human intervention; and it creates economic incentives that align individual profit motives with network security.",
            examples: [
              "SHA-256 double hashing: The cryptographic function miners must repeatedly calculate",
              "Nonce discovery: Finding the random number that produces a valid block hash",
              "Difficulty adjustment: Network automatically maintaining 10-minute average block times",
              "Block rewards: Currently 6.25 BTC per block, halving every 210,000 blocks",
              "Mining pools: Miners collaborating to share rewards and reduce variance",
              "ASIC miners: Specialized hardware designed solely for Bitcoin mining",
              "Hash rate: Total computational power securing the Bitcoin network",
              "Merkle trees: Efficient structure for organizing and verifying transactions"
            ]
          },
          {
            title: "Proof-of-Work: Engineering Security Through Thermodynamics",
            content: "Proof-of-work represents a fundamental breakthrough in computer science and cryptography, creating digital security through physical energy expenditure rather than relying on trusted parties or legal frameworks. This mechanism converts electricity into unforgeable digital gold, establishing Bitcoin as the first thermodynamically secure monetary system.\n\n**The Physics of Bitcoin Security**: Bitcoin mining creates what cryptographer Nick Szabo calls 'unforgeable costliness' - digital objects that require real-world resources to create and cannot be counterfeited. Just as gold requires energy to mine from the earth, bitcoins require energy to mine from mathematics. This physical anchor prevents the infinite replication that plagued previous digital money attempts.\n\n**Game Theory and Attack Economics**: The security model operates on game-theoretic principles where honest behavior is always more profitable than malicious behavior. To successfully attack Bitcoin, an adversary would need to control more computational power than the rest of the network combined (a 51% attack). However, this attack requires enormous costs:\n\n• **Hardware Costs**: Purchasing enough mining equipment costs billions of dollars\n• **Electricity Costs**: Operating this equipment costs millions per day\n• **Opportunity Costs**: Using this power for honest mining would be more profitable\n• **Coordination Challenges**: Maintaining 51% control across geographic and political boundaries\n• **Limited Attack Benefits**: Successful attacks can only reverse recent transactions, not steal bitcoins or mint new ones\n\n**Energy as Information**: Proof-of-work embeds information about energy expenditure directly into the blockchain. Each block header contains cryptographic proof that a specific amount of work was performed. This creates an objective, tamper-evident record that anyone can verify without trusting external authorities.\n\n**Thermodynamic Security**: Unlike other consensus mechanisms that rely on economic penalties or reputation systems, proof-of-work creates irreversible physical commitment. Once energy is expended to mine a block, it cannot be recovered or reused. This irreversibility creates the strongest form of digital security possible - one grounded in the laws of physics rather than human institutions.",
            examples: [
              "51% attack costs: Estimated at $15+ billion in hardware plus $20+ million daily electricity",
              "Hash rate growth: From 10 MH/s in 2009 to 350+ EH/s in 2024",
              "Mining difficulty: Increased over 1 trillion times since Bitcoin's launch",
              "Energy anchor: Physical energy converted to digital security",
              "Longest chain rule: Honest chain always accumulates more work than malicious chains",
              "Nakamoto consensus: First solution to Byzantine Generals Problem without trusted parties",
              "Immutability guarantee: Rewriting history becomes exponentially more expensive over time",
              "Objective truth: Mathematical proof replacing human judgment in consensus"
            ]
          },
          {
            title: "Mining Economics: The Global Energy Arbitrage Market",
            content: "Bitcoin mining has evolved into the world's most sophisticated energy arbitrage market, creating unprecedented incentives for efficient energy use and renewable energy development. Mining economics operate on the principle that the most efficient operations - those with access to the cheapest, most reliable energy - will be most profitable long-term.\n\n**The Mining Difficulty Adjustment**: Bitcoin's difficulty adjustment mechanism creates a self-regulating economic system. When bitcoin prices rise, mining becomes more profitable, attracting new miners and increasing network hash rate. When prices fall, marginal miners become unprofitable and shut down, reducing hash rate. The difficulty adjustment ensures that regardless of these fluctuations, new blocks are found every 10 minutes on average.\n\nThis mechanism creates several important economic dynamics:\n\n• **Elastic Security**: Network security automatically scales with value - a more valuable network attracts more mining power\n• **Miner Capitulation**: Periodic events where inefficient miners exit, strengthening remaining operations\n• **Geographic Distribution**: Mining naturally spreads to locations with cheapest energy\n• **Innovation Pressure**: Constant competition drives efficiency improvements in hardware and operations\n\n**Energy Cost Structure**: Mining profitability depends primarily on electricity costs, which typically represent 60-80% of operating expenses. This creates powerful incentives to find the cheapest energy sources:\n\n• **Stranded Energy**: Miners can monetize energy that cannot be economically transported (remote hydroelectric, geothermal)\n• **Renewable Energy**: Solar and wind farms often have excess capacity that miners can utilize\n• **Load Balancing**: Miners can provide demand response services to electrical grids\n• **Waste Energy**: Flared natural gas and other waste energy sources become economically viable\n\n**Mining Infrastructure Development**: Large-scale mining operations require significant infrastructure investment, creating long-term economic commitments to energy-rich regions. This infrastructure development often brings economic benefits to remote areas through job creation, tax revenue, and energy market stabilization.\n\n**Halving Cycle Economics**: Every four years, the block reward halves, fundamentally altering mining economics. Miners must become increasingly efficient to remain profitable with reduced revenue, driving continuous innovation in hardware and operational efficiency.",
            examples: [
              "Mining farm locations: Texas, Kazakhstan, Iceland utilizing cheap energy",
              "Renewable energy adoption: Miners targeting solar, wind, and hydroelectric power",
              "Grid stabilization: Miners providing demand response services in Texas",
              "Difficulty adjustment examples: 2020 China ban causing 50% hash rate drop and recovery",
              "Mining efficiency trends: From CPUs to GPUs to ASICs, increasing efficiency 1000x+",
              "Halving impacts: 2020 halving from 12.5 to 6.25 BTC reward affecting mining economics",
              "Energy arbitrage: $0.02/kWh industrial rates vs $0.10+ residential rates",
              "Stranded gas monetization: Converting flared gas to electricity for mining"
            ]
          },
          {
            title: "Environmental Impact: Driving Clean Energy Innovation",
            content: "Bitcoin mining's environmental impact represents one of the most misunderstood aspects of the network, often portrayed negatively despite driving significant clean energy innovation and utilization. Understanding the true environmental implications requires examining energy sources, efficiency improvements, and broader systemic effects.\n\n**Energy Source Composition**: The Bitcoin Mining Council's research indicates that over 58% of Bitcoin mining uses renewable energy sources, making it one of the most renewable-energy-intensive industries globally. This percentage continues increasing as miners seek the cheapest long-term energy sources, which are increasingly renewable.\n\n**Renewable Energy Development**: Bitcoin mining provides crucial demand that enables renewable energy projects to achieve economic viability:\n\n• **Baseload Demand**: Solar and wind farms need consistent buyers for excess capacity\n• **Remote Projects**: Mining enables renewable energy development in remote locations\n• **Grid Stability**: Miners can increase or decrease consumption based on grid needs\n• **Stranded Renewables**: Mining monetizes renewable energy that cannot be efficiently transmitted\n\n**Energy Efficiency Improvements**: The competitive mining environment drives continuous efficiency improvements. Modern ASIC miners are thousands of times more efficient than early mining hardware, and efficiency continues improving through:\n\n• **Moore's Law**: Semiconductor improvements increasing computational efficiency\n• **Cooling Innovation**: Immersion cooling and other technologies reducing energy waste\n• **Heat Recovery**: Mining operations capturing waste heat for practical applications\n• **Operations Optimization**: AI and automation improving mining facility efficiency\n\n**Comparative Environmental Analysis**: When compared to traditional financial systems, Bitcoin's environmental impact appears reasonable:\n\n• **Banking System**: Hundreds of thousands of branches, data centers, ATMs, and transport\n• **Gold Mining**: Massive environmental disruption, toxic chemicals, and ongoing extraction\n• **Fiat Currency**: Central banks, commercial banks, payment processors, and supporting infrastructure\n\nBitcoin's energy use secures a global monetary network serving hundreds of millions of users, while traditional systems require proportionally more energy per user and transaction.\n\n**Externality Reduction**: Bitcoin mining can actually reduce environmental externalities by:\n\n• **Methane Capture**: Converting flared gas to electricity prevents methane emissions\n• **Waste Heat Utilization**: Using mining heat for agriculture, heating, and industrial processes\n• **Grid Stabilization**: Providing demand response services that improve grid efficiency\n• **Renewable Energy Investment**: Creating economic incentives for clean energy development",
            examples: [
              "Crusoe Energy: Converting flared gas to mining electricity, reducing methane emissions",
              "Greenidge Generation: Converting coal plant to natural gas for carbon-neutral mining",
              "Core Scientific: Operating 100% renewable mining facilities in Texas",
              "Northern Data: Using Nordic hydroelectric power for sustainable mining",
              "Renewable energy percentage: Over 58% and growing according to Bitcoin Mining Council",
              "Heat reuse projects: Mining farms heating greenhouses and swimming pools",
              "Grid services: Texas miners providing demand response during peak usage",
              "Carbon neutral mining: Several operations achieving net-zero emissions"
            ]
          },
          {
            title: "The Future of Mining: Scaling Security and Sustainability",
            content: "Bitcoin mining continues evolving as the network matures, with innovations in hardware, energy sourcing, and operational efficiency creating a more sustainable and secure monetary network. Understanding future mining trends provides insight into Bitcoin's long-term sustainability and security model.\n\n**Hardware Evolution**: Mining hardware continues advancing through semiconductor improvements and specialized optimizations:\n\n• **Chip Efficiency**: New generation ASICs achieving higher hash rates with lower power consumption\n• **Cooling Innovation**: Immersion cooling enabling higher density operations with less energy waste\n• **Modular Design**: Containerized mining solutions enabling rapid deployment and relocation\n• **AI Integration**: Machine learning optimizing mining operations, maintenance, and energy consumption\n\n**Energy Market Integration**: Mining operations are increasingly integrating with broader energy markets:\n\n• **Demand Response**: Miners providing grid stabilization services during peak demand periods\n• **Energy Storage**: Mining operations paired with battery storage for grid services\n• **Virtual Power Plants**: Distributed mining operations aggregated for grid management\n• **Carbon Credits**: Miners generating carbon credits through renewable energy use and methane capture\n\n**Geographic Decentralization**: Mining continues spreading globally as different regions develop competitive advantages:\n\n• **Renewable Energy Regions**: Areas with abundant hydroelectric, geothermal, or solar resources\n• **Regulatory Friendly Jurisdictions**: Countries embracing Bitcoin mining through favorable policies\n• **Energy Infrastructure**: Regions with excess electrical capacity attracting mining investment\n• **Political Stability**: Long-term mining investments favoring stable regulatory environments\n\n**Security Scaling**: As Bitcoin's value grows, mining security scales proportionally:\n\n• **Hash Rate Growth**: Network security continues increasing with value and adoption\n• **Attack Cost Escalation**: Successful attacks becoming prohibitively expensive\n• **Decentralization Benefits**: Geographic and operator diversity strengthening network resilience\n• **Professional Operations**: Industry maturation improving operational security and reliability\n\n**Sustainable Mining Standards**: The industry is developing standards and certifications for sustainable mining:\n\n• **Renewable Energy Certification**: Verifying clean energy use through blockchain and IoT monitoring\n• **Carbon Accounting**: Accurate measurement and reporting of mining operations' carbon footprints\n• **ESG Compliance**: Meeting institutional investment requirements for environmental responsibility\n• **Industry Collaboration**: Bitcoin Mining Council and similar organizations promoting best practices\n\n**Post-Subsidy Economics**: Looking toward 2140 when block rewards end, mining economics will transition to fee-based revenue, requiring:\n\n• **Transaction Fee Markets**: Development of efficient fee markets to compensate miners\n• **Layer 2 Integration**: Lightning Network and other layers generating additional fee revenue\n• **Security Budget**: Ensuring adequate miner compensation to maintain network security\n• **Economic Incentive Evolution**: Adapting incentive structures for fee-only mining economics",
            examples: [
              "Bitmain S19 XP: Latest generation ASIC achieving 21.5 TH/s at 3010W",
              "Blockstream Mining: Satellite-connected mining enabling remote operations",
              "Marathon Digital: 100% carbon neutral mining operations by end of 2022",
              "Riot Blockchain: Demand response services earning revenue during Texas grid stress",
              "Compass Mining: Hosted mining services enabling retail participation",
              "CleanSpark: AI-optimized mining operations maximizing efficiency",
              "Sustainable Bitcoin Protocol: Industry standard for renewable energy mining",
              "Stratum V2: Next generation mining protocol improving decentralization"
            ]
          }
        ],
        category: "Technical",
        difficulty: "intermediate",
        relatedDayIndex: 8,
        keyTakeaways: [
          "Mining creates the world's most secure financial network through energy expenditure",
          "Proof-of-work economics naturally align security with network value",
          "Bitcoin mining drives innovation in efficient and renewable energy use"
        ],
        practicalApplications: [
          "Understand why Bitcoin transactions are irreversible",
          "Evaluate mining investment opportunities",
          "Assess network security during major events"
        ],
        quizQuestions: [
          {
            question: "What is the primary purpose of Bitcoin mining?",
            options: [
              "To create new bitcoins for profit",
              "To secure the network, process transactions, and reach consensus without central authority",
              "To make transactions faster and cheaper",
              "To reduce Bitcoin's energy consumption"
            ],
            correctAnswer: 1,
            explanation: "Mining serves multiple critical functions: securing the network through energy expenditure, processing and validating transactions, and achieving distributed consensus without central authority. Creating new bitcoins is just one aspect of the mining reward system."
          },
          {
            question: "How does Bitcoin's difficulty adjustment mechanism work?",
            options: [
              "It increases difficulty when Bitcoin price goes up",
              "It adjusts every block based on transaction volume",
              "It automatically adjusts every 2,016 blocks to maintain 10-minute average block times regardless of hash rate changes",
              "It decreases difficulty during high fee periods"
            ],
            correctAnswer: 2,
            explanation: "Bitcoin's difficulty adjusts every 2,016 blocks (approximately every two weeks) to maintain the 10-minute average block time. This self-regulating mechanism ensures predictable block times and bitcoin issuance regardless of how many miners join or leave the network."
          },
          {
            question: "Why is proof-of-work considered more secure than other consensus mechanisms?",
            options: [
              "It uses less energy than alternatives",
              "It requires real-world energy expenditure to propose blocks, making attacks expensive and verifiable",
              "It allows faster transaction processing",
              "It permits more democratic governance decisions"
            ],
            correctAnswer: 1,
            explanation: "Proof-of-work's security comes from requiring real-world energy expenditure to propose new blocks. This makes attacks expensive and easily verifiable by the network. The energy cost creates an objective, external anchor for consensus that doesn't rely on subjective stake or governance."
          },
          {
            question: "What happens to mining economics after all 21 million bitcoins are mined around 2140?",
            options: [
              "Mining will stop because there are no more rewards",
              "The network will switch to proof-of-stake",
              "Miners will be compensated entirely through transaction fees, requiring development of robust fee markets",
              "Block rewards will reset and start over"
            ],
            correctAnswer: 2,
            explanation: "After 2140, when the last bitcoin is mined, mining will continue but be compensated entirely through transaction fees. This requires developing robust fee markets and potentially increased Layer 2 usage to generate sufficient fees to maintain network security."
          }
        ],
        furtherReading: [
          { title: "Bitcoin Mining Council Reports", url: "#", description: "Latest data on mining sustainability" },
          { title: "Unchained Capital Mining Analysis", url: "#", description: "Deep dive into mining economics" }
        ]
      },
      {
        weekNumber: 4,
        title: "Bitcoin Wallets and Self-Custody",
        description: "Master the fundamentals of Bitcoin storage, from private keys to hardware wallets, and learn why 'not your keys, not your coins' is Bitcoin's golden rule.",
        content: [
          {
            title: "Understanding Private Keys and Addresses",
            content: "Your Bitcoin isn't stored in a wallet - it exists on the blockchain. Wallets store private keys that prove ownership of Bitcoin addresses. A private key is a 256-bit number that must be kept secret. From this key, your wallet generates a public key and Bitcoin address. Anyone who controls the private key controls the Bitcoin.",
            examples: ["Seed phrase generation", "Address derivation", "Public/private key cryptography"]
          },
          {
            title: "Types of Bitcoin Wallets",
            content: "Hardware wallets store private keys offline on dedicated devices, providing the highest security for significant amounts. Software wallets offer convenience for daily use but are connected to the internet. Paper wallets are physical storage but require careful handling. Each type serves different security and usability needs.",
            examples: ["Ledger and Trezor devices", "Mobile wallet apps", "Paper wallet generation"]
          },
          {
            title: "Security Best Practices",
            content: "Never share your private keys or seed phrase with anyone. Use hardware wallets for long-term storage. Verify receive addresses on the device screen. Keep multiple backups of your seed phrase in secure, separate locations. Test your backup recovery process with small amounts before storing significant value.",
            examples: ["Seed phrase backup strategies", "Multisig security", "Cold storage techniques"]
          },
          {
            title: "Common Mistakes to Avoid",
            content: "Don't store large amounts on exchanges - they control the private keys, not you. Avoid digital photos of seed phrases. Never enter your seed phrase into websites or software claiming to 'verify' it. Be aware of dust attacks and address reuse privacy implications. Understand that transactions are irreversible.",
            examples: ["Exchange hacks in history", "Phishing attacks", "Irreversible transaction cases"]
          }
        ],
        category: "Security",
        difficulty: "beginner",
        relatedDayIndex: 12,
        keyTakeaways: [
          "Private key control is the fundamental principle of Bitcoin ownership",
          "Hardware wallets provide the best security for significant amounts",
          "Proper backup and recovery procedures are essential for long-term storage"
        ],
        practicalApplications: [
          "Set up secure Bitcoin storage solutions",
          "Create robust backup and recovery procedures",
          "Evaluate wallet security trade-offs for different use cases"
        ],
        furtherReading: [
          { title: "Mastering Bitcoin", url: "#", description: "Andreas Antonopoulos on technical fundamentals" },
          { title: "Glacier Protocol", url: "#", description: "Step-by-step cold storage guide" }
        ]
      },
      {
        weekNumber: 5,
        title: "Lightning Network: Bitcoin's Payment Layer",
        description: "Explore Bitcoin's Lightning Network, understanding how payment channels enable instant, low-cost transactions while maintaining Bitcoin's security guarantees.",
        content: [
          {
            title: "Why Lightning Network Exists",
            content: "Bitcoin's base layer prioritizes security and decentralization over speed, resulting in ~7 transactions per second globally. Lightning Network solves this by moving most transactions to a second layer, while still settling on Bitcoin's main chain. This enables millions of transactions per second with instant finality and minimal fees.",
            examples: ["Base layer transaction limitations", "Payment channel concepts", "Layer 2 scaling solutions"]
          },
          {
            title: "How Payment Channels Work",
            content: "Two parties can open a payment channel by creating a multisig transaction on Bitcoin's main chain. They can then exchange unlimited transactions instantly between themselves, updating the channel balance. When finished, they close the channel and the final balance is settled on the main chain. This reduces one million transactions to just two on-chain transactions.",
            examples: ["Channel opening process", "Off-chain balance updates", "Channel closing settlements"]
          },
          {
            title: "Lightning Network Routing",
            content: "You don't need direct channels with everyone. Lightning routes payments through the network of existing channels. If Alice wants to pay Charlie but only has a channel with Bob, and Bob has a channel with Charlie, the payment can route through Bob. This creates a global network where you can pay anyone with just a few well-connected channels.",
            examples: ["Multi-hop payments", "Routing algorithms", "Network topology"]
          },
          {
            title: "Lightning Applications and Use Cases",
            content: "Lightning enables use cases impossible on the base layer: micropayments for content, streaming money, high-frequency trading, and instant retail payments. It's being used for podcasting tips, gaming rewards, social media monetization, and creating new business models around granular value exchange.",
            examples: ["Podcasting 2.0 value streaming", "Lightning-enabled games", "Instant merchant payments"]
          }
        ],
        category: "Technical",
        difficulty: "intermediate",
        relatedDayIndex: 20,
        keyTakeaways: [
          "Lightning Network scales Bitcoin to millions of transactions per second",
          "Payment channels maintain Bitcoin's security while enabling instant payments",
          "Lightning unlocks new use cases through micropayments and streaming money"
        ],
        practicalApplications: [
          "Set up Lightning wallets and make instant payments",
          "Understand when to use Lightning vs base layer",
          "Explore Lightning-enabled applications and services"
        ],
        furtherReading: [
          { title: "Lightning Network Paper", url: "#", description: "Original Lightning Network whitepaper" },
          { title: "Lightning Labs Blog", url: "#", description: "Latest Lightning Network developments" }
        ]
      },
      {
        weekNumber: 6,
        title: "Central Bank Digital Currencies vs Bitcoin",
        description: "Compare CBDCs with Bitcoin, understanding the fundamental differences in design philosophy, privacy implications, and monetary sovereignty.",
        content: [
          {
            title: "What Are CBDCs?",
            content: "Central Bank Digital Currencies are digital versions of national currencies, issued and controlled by central banks. Unlike Bitcoin, CBDCs are centralized, programmable, and give governments unprecedented control over monetary transactions. They represent the digitization of existing fiat systems, not a new monetary paradigm.",
            examples: ["China's digital yuan", "European Central Bank digital euro", "Federal Reserve research"]
          },
          {
            title: "Programmable Money and Control",
            content: "CBDCs can be programmed with expiration dates, spending restrictions, and automatic taxation. Governments could restrict what you buy, where you spend, or freeze your money instantly. This programmability, while offering some conveniences, fundamentally changes the nature of money from a tool of freedom to a tool of control.",
            examples: ["Expiring stimulus payments", "Geographic spending restrictions", "Automatic tax collection"]
          },
          {
            title: "Privacy and Surveillance Implications",
            content: "CBDCs eliminate financial privacy entirely - every transaction is monitored, recorded, and analyzed by central authorities. Unlike cash, which provides anonymity, or Bitcoin, which offers pseudonymity, CBDCs create a complete surveillance system where your financial life is an open book to governments.",
            examples: ["Social credit score integration", "Political dissent tracking", "Commercial surveillance"]
          },
          {
            title: "Monetary Sovereignty Comparison",
            content: "Bitcoin operates without central control - no one can stop you from using it, freeze your funds, or manipulate its supply. CBDCs represent the opposite: complete central control over monetary policy, individual accounts, and transaction approval. This distinction is fundamental to understanding why Bitcoin and CBDCs serve entirely different purposes.",
            examples: ["Bitcoin censorship resistance", "CBDC account freezing", "Monetary policy differences"]
          }
        ],
        category: "Economics",
        difficulty: "intermediate",
        relatedDayIndex: 25,
        keyTakeaways: [
          "CBDCs digitize government control over money, while Bitcoin eliminates it",
          "Programmable money enables new forms of financial surveillance and control",
          "Bitcoin and CBDCs represent opposing philosophies about monetary sovereignty"
        ],
        practicalApplications: [
          "Evaluate the privacy implications of digital payment systems",
          "Understand why Bitcoin offers unique value in an increasingly digital world",
          "Make informed decisions about financial privacy and sovereignty"
        ],
        furtherReading: [
          { title: "Bank for International Settlements CBDC Reports", url: "#", description: "Official central bank research on CBDCs" },
          { title: "Broken Money", url: "#", description: "Lyn Alden on monetary systems and digital currencies" }
        ]
      }
    ];

    weeklyTopicsData.forEach(topic => {
      const newTopic: WeeklyTopic = { 
        ...topic, 
        id: this.currentWeeklyTopicId++,
        estimatedReadTime: 52,
        createdAt: new Date()
      };
      this.weeklyTopics.set(newTopic.id, newTopic);
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

  // New database-driven content methods
  async getContentDay(dayIndex: number): Promise<ContentDay | undefined> {
    // Day 0 or negative days are not valid
    if (dayIndex <= 0) {
      return undefined;
    }
    const [day] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
    return day;
  }

  async getDailyContentFacts(dayIndex: number): Promise<DailyContentFact[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const facts = await db.select().from(contentFacts)
      .where(eq(contentFacts.dayId, day.id))
      .orderBy(contentFacts.orderIndex);

    // Get dive deeper content for each fact
    const factsWithDiveDeeper: DailyContentFact[] = [];
    for (const fact of facts) {
      const [diveDeeper] = await db.select().from(contentDiveDeeper)
        .where(eq(contentDiveDeeper.factId, fact.id));
      
      factsWithDiveDeeper.push({
        ...fact,
        diveDeeper: diveDeeper || null
      });
    }

    return factsWithDiveDeeper;
  }

  async getContentLesson(dayIndex: number): Promise<ContentLesson | undefined> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return undefined;

    const [lesson] = await db.select().from(contentLessons)
      .where(eq(contentLessons.dayId, day.id));
    return lesson;
  }

  async getContentQuizzes(dayIndex: number): Promise<ContentQuiz[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const quizzes = await db.select().from(contentQuizzes)
      .where(eq(contentQuizzes.dayId, day.id))
      .orderBy(contentQuizzes.orderIndex);
    return quizzes;
  }

  async getDailyContentComplete(dayIndex: number): Promise<DailyContentComplete | null> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return null;

    const [facts, lesson, quizzes, metadata] = await Promise.all([
      this.getDailyContentFacts(dayIndex),
      this.getContentLesson(dayIndex),
      this.getContentQuizzes(dayIndex),
      db.select().from(contentMetadata).where(eq(contentMetadata.dayId, day.id)).then(rows => rows[0] || null)
    ]);

    return {
      day,
      facts,
      lesson: lesson || null,
      quizzes,
      metadata
    };
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
        dayIndex: insertProgress.dayIndex !== undefined ? insertProgress.dayIndex : existing.dayIndex,
        factsViewed: insertProgress.factsViewed !== undefined ? insertProgress.factsViewed : existing.factsViewed,
        lessonCompleted: insertProgress.lessonCompleted !== undefined ? insertProgress.lessonCompleted : existing.lessonCompleted,
        quizCompleted: insertProgress.quizCompleted !== undefined ? insertProgress.quizCompleted : existing.quizCompleted,
        dayCompleted: insertProgress.dayCompleted !== undefined ? insertProgress.dayCompleted : existing.dayCompleted,
        completedAt: insertProgress.completedAt !== undefined ? insertProgress.completedAt : existing.completedAt,
        progressPercentage: insertProgress.progressPercentage || existing.progressPercentage
      };
      this.userProgress.set(key, updated);
      return updated;
    } else {
      const progress: UserProgress = {
        id: this.currentProgressId++,
        userId: insertProgress.userId,
        date: insertProgress.date,
        dayIndex: insertProgress.dayIndex || 0,
        factsViewed: insertProgress.factsViewed || 0,
        lessonCompleted: insertProgress.lessonCompleted || false,
        quizCompleted: insertProgress.quizCompleted || false,
        dayCompleted: insertProgress.dayCompleted || false,
        completedAt: insertProgress.completedAt || null,
        progressPercentage: insertProgress.progressPercentage || 0
      };
      this.userProgress.set(key, progress);
      return progress;
    }
  }

  async getUserProgressByDay(userId: number, dayIndex: number): Promise<UserProgress | undefined> {
    for (const progress of this.userProgress.values()) {
      if (progress.userId === userId && progress.dayIndex === dayIndex) {
        return progress;
      }
    }
    return undefined;
  }

  async isDayCompleted(userId: number, dayIndex: number): Promise<boolean> {
    // Day 0 or negative days are never considered completed
    if (dayIndex <= 0) {
      return false;
    }
    const progress = await this.getUserProgressByDay(userId, dayIndex);
    return progress?.dayCompleted || false;
  }

  async markDayCompleted(userId: number, dayIndex: number): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.createOrUpdateUserProgress({
      userId,
      date: today,
      dayIndex,
      dayCompleted: true,
      completedAt: new Date()
    });
  }

  async getNextAvailableDay(userId: number): Promise<number> {
    const completedDays = await this.getCompletedDays(userId);
    
    // Find the first incomplete day starting from 1
    for (let day = 1; day <= 180; day++) {
      if (!completedDays.includes(day)) {
        return day;
      }
    }
    
    // If all days 1-180 are complete, return current calendar day but cap at 180
    const today = new Date();
    const startDate = new Date('2025-01-01'); // App start date
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysSinceStart, 29);
  }

  async canAccessDay(userId: number, dayIndex: number): Promise<boolean> {
    // Day 0 or negative days are not valid
    if (dayIndex <= 0) {
      return false;
    }

    // Can't access future content beyond current calendar day
    const today = new Date();
    const startDate = new Date('2025-01-01'); // App start date  
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayIndex > daysSinceStart) {
      return false; // Future content not available yet
    }
    
    // Must complete all previous days before accessing this day (starting from Day 1)
    for (let prevDay = 1; prevDay < dayIndex; prevDay++) {
      const isCompleted = await this.isDayCompleted(userId, prevDay);
      if (!isCompleted) {
        return false; // Previous day not completed
      }
    }
    
    return true;
  }

  async getCompletedDays(userId: number): Promise<number[]> {
    const completedDays: number[] = [];
    
    for (const progress of this.userProgress.values()) {
      if (progress.userId === userId && progress.dayCompleted) {
        completedDays.push(progress.dayIndex);
      }
    }
    
    return completedDays.sort((a, b) => a - b);
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
    const allQuestions = Array.from(this.quizQuestions.values());
    const filtered = allQuestions.filter(question => question.dayIndex === dayIndex);
    console.log(`🔍 getDailyQuizQuestions(${dayIndex}): ${filtered.length} questions found. Total questions in storage: ${allQuestions.length}`);
    return filtered;
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
    console.log(`💾 Quiz question ${question.id} stored for Day ${question.dayIndex}. Map size: ${this.quizQuestions.size}`);
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

  // Deep dive topics methods
  async getDailyDeepDive(dayIndex: number): Promise<DeepDiveTopic | undefined> {
    return Array.from(this.deepDiveTopics.values()).find(topic => topic.dayIndex === dayIndex);
  }

  async getAllDeepDiveTopics(): Promise<DeepDiveTopic[]> {
    return Array.from(this.deepDiveTopics.values());
  }

  async createDeepDiveTopic(insertTopic: InsertDeepDiveTopic): Promise<DeepDiveTopic> {
    const topic: DeepDiveTopic = {
      id: this.currentDeepDiveTopicId++,
      dayIndex: insertTopic.dayIndex,
      title: insertTopic.title,
      subtitle: insertTopic.subtitle,
      estimatedReadTime: insertTopic.estimatedReadTime,
      difficulty: insertTopic.difficulty,
      category: insertTopic.category,
      content: insertTopic.content,
      keyTakeaways: insertTopic.keyTakeaways,
      furtherReading: insertTopic.furtherReading,
      createdAt: new Date()
    };
    this.deepDiveTopics.set(topic.id, topic);
    return topic;
  }

  // Weekly topics methods
  async getCurrentWeeklyTopic(): Promise<WeeklyTopic | undefined> {
    // For development/demo purposes, cycle through available topics
    // Calculate current week number since app launch (assuming app launched Jan 1, 2025)
    const launchDate = new Date('2025-01-01');
    const currentDate = new Date();
    const weeksSinceLaunch = Math.floor((currentDate.getTime() - launchDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    // Get all available topics and cycle through them
    const allTopics = Array.from(this.weeklyTopics.values()).sort((a, b) => a.weekNumber - b.weekNumber);
    if (allTopics.length === 0) return undefined;
    
    // If we have the exact week, return it. Otherwise, cycle through available content
    const exactWeek = allTopics.find(topic => topic.weekNumber === weeksSinceLaunch);
    if (exactWeek) return exactWeek;
    
    // Cycle through available topics (currently 1-6)
    const cycleWeek = ((weeksSinceLaunch - 1) % allTopics.length) + 1;
    return allTopics.find(topic => topic.weekNumber === cycleWeek) || allTopics[0];
  }

  async getWeeklyTopic(weekNumber: number): Promise<WeeklyTopic | undefined> {
    return Array.from(this.weeklyTopics.values()).find(topic => topic.weekNumber === weekNumber);
  }

  async getAllWeeklyTopics(): Promise<WeeklyTopic[]> {
    return Array.from(this.weeklyTopics.values()).sort((a, b) => a.weekNumber - b.weekNumber);
  }

  async createWeeklyTopic(insertTopic: InsertWeeklyTopic): Promise<WeeklyTopic> {
    const topic: WeeklyTopic = {
      id: this.currentWeeklyTopicId++,
      weekNumber: insertTopic.weekNumber,
      title: insertTopic.title,
      description: insertTopic.description,
      content: insertTopic.content,
      estimatedReadTime: insertTopic.estimatedReadTime || 30,
      relatedDayIndex: insertTopic.relatedDayIndex || null,
      category: insertTopic.category,
      difficulty: insertTopic.difficulty || "intermediate",
      keyTakeaways: insertTopic.keyTakeaways,
      practicalApplications: insertTopic.practicalApplications || null,
      furtherReading: insertTopic.furtherReading || null,
      createdAt: new Date()
    };
    this.weeklyTopics.set(topic.id, topic);
    return topic;
  }

  // User weekly progress methods
  async getUserWeeklyProgress(userId: number, weekNumber: number): Promise<UserWeeklyProgress | undefined> {
    const key = `${userId}-${weekNumber}`;
    return this.userWeeklyProgress.get(key);
  }

  async createOrUpdateWeeklyProgress(insertProgress: InsertUserWeeklyProgress): Promise<UserWeeklyProgress> {
    const key = `${insertProgress.userId}-${insertProgress.weekNumber}`;
    const existingProgress = this.userWeeklyProgress.get(key);
    
    if (existingProgress) {
      const updated: UserWeeklyProgress = {
        ...existingProgress,
        currentSection: insertProgress.currentSection || existingProgress.currentSection,
        totalSections: insertProgress.totalSections,
        progressPercentage: insertProgress.progressPercentage || existingProgress.progressPercentage,
        bookmarked: insertProgress.bookmarked !== undefined ? insertProgress.bookmarked : existingProgress.bookmarked,
        completedAt: insertProgress.completedAt || existingProgress.completedAt
      };
      this.userWeeklyProgress.set(key, updated);
      return updated;
    }

    const progress: UserWeeklyProgress = {
      id: this.currentWeeklyProgressId++,
      userId: insertProgress.userId,
      weekNumber: insertProgress.weekNumber,
      startedAt: new Date(),
      completedAt: insertProgress.completedAt || null,
      currentSection: insertProgress.currentSection || 0,
      totalSections: insertProgress.totalSections,
      progressPercentage: insertProgress.progressPercentage || 0,
      bookmarked: insertProgress.bookmarked || false
    };
    this.userWeeklyProgress.set(key, progress);
    return progress;
  }

  async updateWeeklyProgress(userId: number, weekNumber: number, currentSection: number, progressPercentage: number): Promise<void> {
    const key = `${userId}-${weekNumber}`;
    const progress = this.userWeeklyProgress.get(key);
    if (progress) {
      progress.currentSection = currentSection;
      progress.progressPercentage = progressPercentage;
      this.userWeeklyProgress.set(key, progress);
    }
  }

  async completeWeeklyTopic(userId: number, weekNumber: number): Promise<void> {
    const key = `${userId}-${weekNumber}`;
    const progress = this.userWeeklyProgress.get(key);
    if (progress) {
      progress.completedAt = new Date();
      progress.progressPercentage = 100;
      this.userWeeklyProgress.set(key, progress);
    }
  }
}

// Simple database storage implementation for essential methods
export class DatabaseStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStreak(userId: number, currentStreak: number, longestStreak: number): Promise<void> {
    await db.update(users)
      .set({ currentStreak, longestStreak })
      .where(eq(users.id, userId));
  }

  async updateUserProgress(userId: number, completedLessons: number, lastActivityDate: string): Promise<void> {
    await db.update(users)
      .set({ completedLessons, lastActivityDate })
      .where(eq(users.id, userId));
  }

  // Content methods using new database structure
  async getContentDay(dayIndex: number): Promise<ContentDay | undefined> {
    if (dayIndex <= 0) return undefined;
    const [day] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
    return day;
  }

  async getDailyContentFacts(dayIndex: number): Promise<DailyContentFact[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const facts = await db.select().from(contentFacts)
      .where(eq(contentFacts.dayId, day.id))
      .orderBy(contentFacts.orderIndex);

    const factsWithDiveDeeper: DailyContentFact[] = [];
    for (const fact of facts) {
      const [diveDeeper] = await db.select().from(contentDiveDeeper)
        .where(eq(contentDiveDeeper.factId, fact.id));
      
      factsWithDiveDeeper.push({
        ...fact,
        diveDeeper: diveDeeper || null
      });
    }

    return factsWithDiveDeeper;
  }

  async getContentLesson(dayIndex: number): Promise<ContentLesson | undefined> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return undefined;

    const [lesson] = await db.select().from(contentLessons)
      .where(eq(contentLessons.dayId, day.id));
    return lesson;
  }

  async getContentQuizzes(dayIndex: number): Promise<ContentQuiz[]> {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const quizzes = await db.select().from(contentQuizzes)
      .where(eq(contentQuizzes.dayId, day.id))
      .orderBy(contentQuizzes.orderIndex);
    return quizzes;
  }

  // Implement remaining required interface methods with database operations
  async getDailyFacts(dayIndex: number): Promise<DailyFact[]> {
    // Map to old interface for compatibility
    const facts = await this.getDailyContentFacts(dayIndex);
    return facts.map(f => ({ id: f.id, dayIndex: f.dayId, title: f.title, content: f.content, category: f.category, icon: f.icon }));
  }

  async getAllDailyFacts(): Promise<DailyFact[]> {
    const facts = await db.select().from(contentFacts);
    return facts.map(f => ({ id: f.id, dayIndex: f.dayId, title: f.title, content: f.content, category: f.category, icon: f.icon }));
  }

  async createDailyFact(fact: InsertDailyFact): Promise<DailyFact> {
    const [created] = await db.insert(contentFacts).values({
      dayId: fact.dayIndex,
      title: fact.title,
      content: fact.content,
      category: fact.category,
      icon: fact.icon || '💡',
      orderIndex: 0,
      createdAt: new Date()
    }).returning();
    return { id: created.id, dayIndex: created.dayId, title: created.title, content: created.content, category: created.category, icon: created.icon };
  }

  async getLesson(dayIndex: number): Promise<Lesson | undefined> {
    const lesson = await this.getContentLesson(dayIndex);
    if (!lesson) return undefined;
    return {
      id: lesson.id,
      dayIndex: lesson.dayId,
      title: lesson.title,
      content: lesson.content,
      keyTakeaways: lesson.keyTakeaways,
      whyItMatters: lesson.whyItMatters || '',
      estimatedReadTime: lesson.estimatedReadTime
    };
  }

  async getAllLessons(): Promise<Lesson[]> {
    const lessons = await db.select().from(contentLessons);
    return lessons.map(l => ({
      id: l.id,
      dayIndex: l.dayId,
      title: l.title,
      content: l.content,
      keyTakeaways: l.keyTakeaways,
      whyItMatters: l.whyItMatters || '',
      estimatedReadTime: l.estimatedReadTime
    }));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(contentLessons).values({
      dayId: lesson.dayIndex,
      title: lesson.title,
      content: lesson.content,
      keyTakeaways: lesson.keyTakeaways,
      whyItMatters: lesson.whyItMatters,
      estimatedReadTime: lesson.estimatedReadTime,
      createdAt: new Date()
    }).returning();
    return {
      id: created.id,
      dayIndex: created.dayId,
      title: created.title,
      content: created.content,
      keyTakeaways: created.keyTakeaways,
      whyItMatters: created.whyItMatters || '',
      estimatedReadTime: created.estimatedReadTime
    };
  }

  // User progress methods (simplified implementations)
  async getUserProgress(userId: number, date: string): Promise<UserProgress | undefined> {
    // Simplified implementation - would need userProgress table
    return undefined;
  }

  async getUserProgressByDay(userId: number, dayIndex: number): Promise<UserProgress | undefined> {
    return undefined;
  }

  async getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]> {
    return [];
  }

  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    // Mock implementation
    return {
      id: 1,
      userId: progress.userId,
      date: progress.date,
      dayIndex: progress.dayIndex,
      factsViewed: progress.factsViewed,
      lessonCompleted: progress.lessonCompleted,
      progressPercentage: progress.progressPercentage
    };
  }

  async isDayCompleted(userId: number, dayIndex: number): Promise<boolean> {
    return false;
  }

  async markDayCompleted(userId: number, dayIndex: number): Promise<void> {
    // Mock implementation
  }

  async getNextAvailableDay(userId: number): Promise<number> {
    return 1;
  }

  async canAccessDay(userId: number, dayIndex: number): Promise<boolean> {
    return true;
  }

  async getCompletedDays(userId: number): Promise<number[]> {
    return [];
  }

  // Quiz methods using new database structure
  async getDailyQuizQuestions(dayIndex: number): Promise<QuizQuestion[]> {
    const quizzes = await this.getContentQuizzes(dayIndex);
    return quizzes.map(q => ({
      id: q.id,
      dayIndex: q.dayId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    const quizzes = await db.select().from(contentQuizzes);
    return quizzes.map(q => ({
      id: q.id,
      dayIndex: q.dayId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [created] = await db.insert(contentQuizzes).values({
      dayId: question.dayIndex,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      orderIndex: 0,
      createdAt: new Date()
    }).returning();
    return {
      id: created.id,
      dayIndex: created.dayId,
      question: created.question,
      options: created.options,
      correctAnswer: created.correctAnswer,
      explanation: created.explanation
    };
  }

  // Mock implementations for other required methods
  async getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]> { return []; }
  async submitQuizAnswer(answer: InsertUserQuizAnswer): Promise<UserQuizAnswer> { 
    return { id: 1, userId: answer.userId, questionId: answer.questionId, selectedAnswer: answer.selectedAnswer, isCorrect: answer.isCorrect, date: answer.date };
  }
  async getUserQuizScore(userId: number, date: string): Promise<{ correct: number; total: number; percentage: number }> {
    return { correct: 0, total: 0, percentage: 0 };
  }

  // Mock implementations for remaining interface methods  
  async getKnowledgeAreas(): Promise<KnowledgeArea[]> { return []; }
  async updateKnowledgeAreaProgress(areaId: number, completedLessons: number): Promise<void> {}
  async getConvictionContent(dayIndex: number): Promise<ConvictionContent[]> { return []; }
  async getAllConvictionContent(): Promise<ConvictionContent[]> { return []; }
  async createConvictionContent(content: InsertConvictionContent): Promise<ConvictionContent> { 
    return { id: 1, dayIndex: content.dayIndex, title: content.title, content: content.content, category: content.category };
  }
  async getTreasuryCompanies(): Promise<TreasuryCompany[]> { return []; }
  async getTreasuryCompanyById(id: number): Promise<TreasuryCompany | undefined> { return undefined; }
  async createTreasuryCompany(company: InsertTreasuryCompany): Promise<TreasuryCompany> {
    return { id: 1, name: company.name, bitcoinHeld: company.bitcoinHeld, lastUpdated: company.lastUpdated };
  }
  async updateTreasuryCompany(id: number, updates: Partial<InsertTreasuryCompany>): Promise<TreasuryCompany | undefined> { return undefined; }
  async getSovereignAdoptions(): Promise<SovereignAdoption[]> { return []; }
  async getSovereignAdoptionById(id: number): Promise<SovereignAdoption | undefined> { return undefined; }
  async getSovereignAdoptionsByType(adoptionType: string): Promise<SovereignAdoption[]> { return []; }
  async createSovereignAdoption(adoption: InsertSovereignAdoption): Promise<SovereignAdoption> {
    return { id: 1, country: adoption.country, adoptionType: adoption.adoptionType, description: adoption.description, dateAdopted: adoption.dateAdopted };
  }
  async updateSovereignAdoption(id: number, updates: Partial<InsertSovereignAdoption>): Promise<SovereignAdoption | undefined> { return undefined; }
  async getCurrentBitcoinPrice(): Promise<BitcoinPrice | undefined> { return undefined; }
  async getBitcoinPriceHistory(hours: number): Promise<BitcoinPrice[]> { return []; }
  async createBitcoinPrice(price: InsertBitcoinPrice): Promise<BitcoinPrice> {
    return { id: 1, price: price.price, timestamp: price.timestamp };
  }
  async getDailyDeepDive(dayIndex: number): Promise<DeepDiveTopic | undefined> { return undefined; }
  async getAllDeepDiveTopics(): Promise<DeepDiveTopic[]> { return []; }
  async createDeepDiveTopic(topic: InsertDeepDiveTopic): Promise<DeepDiveTopic> {
    return { id: 1, dayIndex: topic.dayIndex, title: topic.title, content: topic.content };
  }
  async getCurrentWeeklyTopic(): Promise<WeeklyTopic | undefined> { return undefined; }
  async getWeeklyTopic(weekNumber: number): Promise<WeeklyTopic | undefined> { return undefined; }
  async getAllWeeklyTopics(): Promise<WeeklyTopic[]> { return []; }
  async createWeeklyTopic(topic: InsertWeeklyTopic): Promise<WeeklyTopic> {
    return { id: 1, weekNumber: topic.weekNumber, title: topic.title, content: topic.content };
  }
  async getUserWeeklyProgress(userId: number, weekNumber: number): Promise<UserWeeklyProgress | undefined> { return undefined; }
  async createOrUpdateWeeklyProgress(progress: InsertUserWeeklyProgress): Promise<UserWeeklyProgress> {
    return { id: 1, userId: progress.userId, weekNumber: progress.weekNumber, currentSection: progress.currentSection, progressPercentage: progress.progressPercentage, completed: progress.completed };
  }
  async updateWeeklyProgress(userId: number, weekNumber: number, currentSection: number, progressPercentage: number): Promise<void> {}
  async completeWeeklyTopic(userId: number, weekNumber: number): Promise<void> {}
  async getDailyContentComplete(dayIndex: number): Promise<DailyContentComplete | null> { return null; }
}

// Create a hybrid storage that uses database for content, memory for other features
class HybridStorage extends MemStorage {
  // Override content methods to use database
  async getContentDay(dayIndex: number) {
    if (dayIndex <= 0) return undefined;
    const [day] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
    return day;
  }

  async getDailyContentFacts(dayIndex: number) {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const facts = await db.select().from(contentFacts)
      .where(eq(contentFacts.dayId, day.id))
      .orderBy(contentFacts.orderIndex);

    const factsWithDiveDeeper = [];
    for (const fact of facts) {
      const [diveDeeper] = await db.select().from(contentDiveDeeper)
        .where(eq(contentDiveDeeper.factId, fact.id));
      
      factsWithDiveDeeper.push({
        ...fact,
        diveDeeper: diveDeeper || null
      });
    }

    return factsWithDiveDeeper;
  }

  async getContentLesson(dayIndex: number) {
    const day = await this.getContentDay(dayIndex);
    if (!day) return undefined;

    const [lesson] = await db.select().from(contentLessons)
      .where(eq(contentLessons.dayId, day.id));
    return lesson;
  }

  async getContentQuizzes(dayIndex: number) {
    const day = await this.getContentDay(dayIndex);
    if (!day) return [];

    const quizzes = await db.select().from(contentQuizzes)
      .where(eq(contentQuizzes.dayId, day.id))
      .orderBy(contentQuizzes.orderIndex);
    return quizzes;
  }
}

export const storage = new HybridStorage();
