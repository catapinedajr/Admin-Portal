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
  weeklyTopics,
  userWeeklyProgress,
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
  type InsertDeepDiveTopic,
  type WeeklyTopic,
  type InsertWeeklyTopic,
  type UserWeeklyProgress,
  type InsertUserWeeklyProgress
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

    // Add more facts for days 17-29 to complete the 30-day curriculum
    const additionalFactDays = [];
    for (let day = 17; day <= 29; day++) {
      additionalFactDays.push(
        {
          title: "Sound Money Principles",
          content: "Bitcoin returns to sound money principles that reward saving and long-term thinking, unlike fiat currencies that encourage consumption.",
          category: "Economics",
          icon: "coins",
          dayIndex: day
        },
        {
          title: "Financial Sovereignty",
          content: "Bitcoin enables true financial sovereignty where individuals control their wealth without depending on banks or governments.",
          category: "Freedom",
          icon: "crown",
          dayIndex: day
        },
        {
          title: "Global Currency",
          content: "Bitcoin operates as the first truly global currency, working the same way everywhere without borders or discrimination.",
          category: "Global",
          icon: "earth",
          dayIndex: day
        }
      );
    }

    // Combine all facts
    const allFacts = [...facts, ...additionalFactDays];

    // Create facts with comprehensive dive deeper content
    allFacts.forEach(fact => {
      let diveDeeper = null;
      
      // Add dive deeper content based on the fact title
      if (fact.title === "What is Bitcoin?") {
        diveDeeper = {
          explanation: "Bitcoin is the first successful digital money that works without any central authority. Unlike traditional money that requires banks or governments to control it, Bitcoin uses a network of thousands of computers worldwide to maintain security and verify transactions. This creates a new type of money that belongs to everyone and no one at the same time.",
          examples: [
            "Traditional money: Banks control your account and can freeze it anytime",
            "Bitcoin: You control your own money with your private keys",
            "Traditional money: Governments can print unlimited amounts",
            "Bitcoin: Only 21 million will ever exist, no exceptions"
          ],
          visualDescription: "Imagine Bitcoin as a global ledger book that thousands of people keep copies of. When someone makes a transaction, all the copies get updated simultaneously. No single person can change the book because everyone else would notice the difference.",
          keyTakeaways: [
            "Bitcoin works without banks or governments controlling it",
            "Only 21 million Bitcoin will ever exist",
            "You can use Bitcoin anywhere in the world with internet",
            "Thousands of computers keep Bitcoin secure and honest"
          ]
        };
      }

      if (fact.title === "Bitcoin is Limited") {
        diveDeeper = {
          explanation: "Bitcoin's 21 million coin limit is written into its code and enforced by thousands of computers worldwide. Unlike government currencies that lose value when more is printed, Bitcoin becomes more scarce over time as demand grows but supply stays fixed.",
          examples: [
            "US Dollar: Government printed 40% of all existing dollars in 2020-2021",
            "Bitcoin: Exactly 21 million coins, decreasing inflation every 4 years",
            "Venezuelan Bolívar: Lost 99% of its value due to money printing",
            "Bitcoin: Maintains scarcity through mathematical certainty"
          ],
          visualDescription: "Think of Bitcoin like a limited edition collectible where the total number is fixed forever. Even if millions of people want it, no more can ever be created, making each one more valuable over time.",
          keyTakeaways: [
            "Fixed supply of 21 million protects against inflation",
            "No government or organization can create more Bitcoin",
            "Scarcity is enforced by mathematical code, not human promises",
            "Your Bitcoin can't be diluted by money printing"
          ]
        };
      }

      if (fact.title === "You Own Your Bitcoin") {
        diveDeeper = {
          explanation: "When you control your Bitcoin private keys, you have complete ownership that no one can take away. This is different from traditional banking where the bank actually owns your account and can freeze or restrict it at any time.",
          examples: [
            "Traditional banking: Bank holds your money and controls access",
            "Bitcoin: You hold your own money with your private keys",
            "Traditional accounts: Banks can freeze or restrict your account",
            "Bitcoin: Only you can access your money if you control your keys"
          ],
          visualDescription: "Imagine having a digital safe that only you know the combination to, and that can't be broken into or controlled by anyone else, no matter what laws they pass or what they threaten.",
          keyTakeaways: [
            "Private key control means true ownership",
            "No institution can freeze or seize your Bitcoin",
            "You are your own bank with complete control",
            "Ownership is enforced by mathematics, not laws"
          ]
        };
      }
      
      if (fact.title === "The Shared Notebook") {
        diveDeeper = {
          explanation: "The blockchain is like a notebook that everyone can read but no one can erase or fake. Every page (block) contains a list of transactions, and each page references the previous page, creating an unbreakable chain. This design makes it impossible to change history without everyone noticing.",
          examples: [
            "Traditional banking: Only the bank sees your transaction history",
            "Bitcoin blockchain: Everyone can verify every transaction ever made",
            "Traditional systems: Banks can change records in their private databases",
            "Bitcoin: Once written, transaction records can never be changed"
          ],
          visualDescription: "Picture a notebook where every page is numbered and references the previous page number. If someone tries to tear out or change an old page, the page numbers won't match up, and everyone will know something's wrong.",
          keyTakeaways: [
            "Blockchain is a permanent record that can't be changed",
            "Everyone can verify transactions independently",
            "No single entity controls the blockchain",
            "Transparency creates trust without requiring institutions"
          ]
        };
      }

      if (fact.title === "Your Money Keeps Its Value") {
        diveDeeper = {
          explanation: "Bitcoin's 21 million coin limit is written into its code and enforced by thousands of computers worldwide. Unlike government currencies that lose value when more is printed, Bitcoin becomes more scarce over time as demand grows but supply stays fixed.",
          examples: [
            "US Dollar: Government printed 40% of all existing dollars in 2020-2021",
            "Bitcoin: Exactly 21 million coins, decreasing inflation every 4 years",
            "Venezuelan Bolívar: Lost 99% of its value due to money printing",
            "Bitcoin: Maintains scarcity through mathematical certainty"
          ],
          visualDescription: "Think of Bitcoin like a limited edition collectible where the total number is fixed forever. Even if millions of people want it, no more can ever be created, making each one more valuable over time.",
          keyTakeaways: [
            "Fixed supply of 21 million protects against inflation",
            "No government or organization can create more Bitcoin",
            "Scarcity is enforced by mathematical code, not human promises",
            "Your Bitcoin can't be diluted by money printing"
          ]
        };
      }

      if (fact.title === "Digital Puzzle Solving") {
        diveDeeper = {
          explanation: "Bitcoin mining is like a global lottery where miners compete to solve mathematical puzzles. The winner gets to add the next block of transactions and earn new Bitcoin. This process secures the network because changing old transactions would require re-solving all the puzzles, which costs enormous amounts of energy.",
          examples: [
            "Traditional banking: Banks verify transactions using trusted employees",
            "Bitcoin: Miners verify transactions by solving energy-intensive puzzles",
            "Traditional systems: Security depends on physical vaults and guards",
            "Bitcoin: Security comes from the total energy cost to attack the network"
          ],
          visualDescription: "Imagine thousands of people racing to solve crossword puzzles. The first person to solve it correctly gets a prize and the right to write the next page in the global transaction book. To cheat, someone would need to solve puzzles faster than everyone else combined.",
          keyTakeaways: [
            "Mining secures Bitcoin by making attacks extremely expensive",
            "Miners compete to process transactions and earn rewards",
            "Energy expenditure creates real-world security for digital money",
            "The more miners participate, the more secure Bitcoin becomes"
          ]
        };
      }

      if (fact.title === "Your Digital Wallet") {
        diveDeeper = {
          explanation: "A Bitcoin wallet is like a digital safe that only you can open. Your private key is like the combination - anyone who knows it can access your Bitcoin. Your public key is like your email address - you can share it with others so they can send you Bitcoin.",
          examples: [
            "Traditional banking: Bank holds your money and controls access",
            "Bitcoin wallet: You hold your own money with your private keys",
            "Traditional accounts: Banks can freeze or restrict your account",
            "Bitcoin: Only you can access your money if you control your keys"
          ],
          visualDescription: "Picture a mailbox where you give people your address (public key) so they can send you mail (Bitcoin), but only you have the key (private key) to open the mailbox and access what's inside.",
          keyTakeaways: [
            "Private keys give you complete control over your Bitcoin",
            "Losing your private key means losing access to your Bitcoin forever",
            "Public keys are safe to share for receiving Bitcoin",
            "Not your keys, not your coins - control is everything"
          ]
        };
      }

      if (fact.title === "How to Send Bitcoin") {
        diveDeeper = {
          explanation: "Sending Bitcoin is like mailing a letter, but instead of writing an address on an envelope, you're broadcasting a signed message to thousands of computers worldwide. These computers verify your signature and update everyone's copy of the ledger to show the transaction.",
          examples: [
            "Traditional transfer: Bank moves numbers between internal accounts",
            "Bitcoin: Cryptographic proof broadcasts to global network",
            "Traditional: Banks can reverse or block transactions",
            "Bitcoin: Transactions are final once confirmed by the network"
          ],
          visualDescription: "Imagine announcing to a room full of accountants that you're transferring money to someone. Each accountant writes down the transaction in their ledger. The transaction is only valid if the majority of accountants agree it's legitimate.",
          keyTakeaways: [
            "Bitcoin transactions are broadcast to the entire network",
            "Digital signatures prove you authorized the transaction",
            "Transactions are irreversible once confirmed",
            "No intermediary needed - direct peer-to-peer transfer"
          ]
        };
      }

      if (fact.title === "The Great Halving") {
        diveDeeper = {
          explanation: "Every four years, the amount of new Bitcoin created gets cut in half automatically. This is programmed into Bitcoin's code and creates increasing scarcity over time. It's like if gold miners could only find half as much gold every four years, making existing gold more valuable.",
          examples: [
            "2009-2012: 50 new Bitcoin every 10 minutes",
            "2012-2016: 25 new Bitcoin every 10 minutes",
            "2016-2020: 12.5 new Bitcoin every 10 minutes",
            "2020-2024: 6.25 new Bitcoin every 10 minutes"
          ],
          visualDescription: "Picture a faucet that drips valuable coins. Every four years, the faucet automatically adjusts to drip at half the previous rate. Eventually, the faucet will stop dripping entirely, but people will still value the coins that already exist.",
          keyTakeaways: [
            "Bitcoin becomes more scarce every four years automatically",
            "Halving is built into the code, not controlled by humans",
            "Reduced new supply often increases Bitcoin's value",
            "Around 2140, no new Bitcoin will be created ever"
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
            "First money system that works without central control",
            "Solves problems that have existed throughout monetary history",
            "Gives individuals unprecedented financial sovereignty",
            "Represents a fundamental evolution in how money works"
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
        dayIndex: 0
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
        dayIndex: 1
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
        dayIndex: 2
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
        dayIndex: 3
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
        dayIndex: 4
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
        dayIndex: 5
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
        dayIndex: 6
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
        dayIndex: 7
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
        dayIndex: 8
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
        dayIndex: 9
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
        dayIndex: 10
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
        dayIndex: 11
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
        dayIndex: 12
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
        dayIndex: 13
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
        dayIndex: 14
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
        dayIndex: 15
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
        dayIndex: 16
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
        summary: "Bitcoin improves on gold's properties while solving its problems: easy transport, divisibility, and resistance to confiscation."
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
        summary: "Bitcoin is money, not a stock. It has fixed supply, works globally 24/7, and gives you direct ownership unlike traditional investments."
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
        summary: "Bitcoin helps during economic crisis by protecting against inflation, banking failures, and capital controls with its global, unchangeable properties."
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
        summary: "Bitcoin provides six key freedoms: self-custody, privacy, global access, seizure resistance, inflation protection, and financial inclusion."
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
        dayIndex: day
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
        whyItMatters: null
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

    // Create day-specific quiz questions for all days 0-29 with content-specific questions
    const daySpecificQuestions = [
      // Day 0: Understanding Bitcoin (Based on "What is Bitcoin?", "Digital Scarcity", "Why Bitcoin Matters")
      {
        dayIndex: 0,
        question: "According to today's lesson, what problem does Bitcoin solve regarding digital money?",
        optionA: "Making transactions faster",
        optionB: "The double-spending problem",
        optionC: "Reducing transaction fees",
        optionD: "Creating more money",
        correctAnswer: "B",
        explanation: "Bitcoin solves the double-spending problem - preventing someone from copying digital money and spending it twice, which was the main challenge before Bitcoin.",
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
        question: "According to today's lesson, how does Bitcoin give you financial control?",
        optionA: "Banks manage your account better",
        optionB: "Government protects your money",
        optionC: "No one can freeze your account or stop your transactions",
        optionD: "Credit cards become unnecessary",
        correctAnswer: "C",
        explanation: "Today's content explains that Bitcoin gives complete control over your money - no one can freeze your account, reverse transactions, or stop you from sending money anywhere.",
        category: "Purpose",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "Based on today's lesson, what makes Bitcoin different from traditional digital payments?",
        optionA: "It uses the internet",
        optionB: "It doesn't require banks or middlemen",
        optionC: "It's faster than cash",
        optionD: "It's accepted everywhere",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin is revolutionary because it allows direct person-to-person transactions without requiring banks or other middlemen.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "According to today's content, what inspired Bitcoin's creation?",
        optionA: "Making payments faster",
        optionB: "The 2008 financial crisis and need for trustless money",
        optionC: "Competing with credit cards",
        optionD: "Creating a new investment asset",
        correctAnswer: "B",
        explanation: "Today's lesson explains that Bitcoin was created in response to the 2008 financial crisis, designed as trustless digital money that doesn't rely on failing financial institutions.",
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
        optionA: "Banks verify every transaction",
        optionB: "Government oversight and regulation",
        optionC: "Changing past transactions would require controlling over half of all mining power",
        optionD: "Only trusted parties can access it",
        correctAnswer: "C",
        explanation: "Today's lesson explains that blockchain security comes from the fact that changing any past transaction would require controlling more than half of all mining power worldwide, which is economically impossible.",
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
        question: "Based on today's cryptography lesson, what makes Bitcoin virtually impossible to hack?",
        optionA: "Government protection",
        optionB: "Bank security systems",
        optionC: "Advanced mathematics called cryptography",
        optionD: "Physical security guards",
        correctAnswer: "C",
        explanation: "Today's lesson explains that Bitcoin uses advanced mathematics called cryptography to secure transactions, making it virtually impossible to hack or counterfeit.",
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
        question: "What causes inflation in traditional currencies?",
        optionA: "Limited supply",
        optionB: "Printing more money",
        optionC: "High demand",
        optionD: "Digital transactions",
        correctAnswer: "B",
        explanation: "Inflation occurs when central banks print more money, reducing the value of existing currency.",
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
        question: "According to today's lesson, what makes Bitcoin 'permissionless'?",
        optionA: "Government approval is required",
        optionB: "Banks must verify your identity",
        optionC: "Anyone with internet access can participate",
        optionD: "Only certain countries allow it",
        correctAnswer: "C",
        explanation: "Today's content explains that Bitcoin's permissionless nature means anyone with internet access can participate regardless of location, politics, or institutional approval.",
        category: "Technology",
        difficulty: "beginner"
      },

      // Day 3: Bitcoin Mining & Security

      {
        dayIndex: 3,
        question: "What is proof of work?",
        optionA: "A job certificate",
        optionB: "A security method requiring computational effort",
        optionC: "A Bitcoin wallet type",
        optionD: "A transaction fee",
        correctAnswer: "B",
        explanation: "Proof of work is Bitcoin's security method where miners must prove they've done computational work to add new blocks.",
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
    const quizQuestions = [];
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
    
    // Find the first incomplete day starting from 0
    for (let day = 0; day < 30; day++) {
      if (!completedDays.includes(day)) {
        return day;
      }
    }
    
    // If all days 0-29 are complete, return current calendar day but cap at 29
    const today = new Date();
    const startDate = new Date('2025-01-01'); // App start date
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysSinceStart, 29);
  }

  async canAccessDay(userId: number, dayIndex: number): Promise<boolean> {
    // Can't access future content beyond current calendar day
    const today = new Date();
    const startDate = new Date('2025-01-01'); // App start date  
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayIndex > daysSinceStart) {
      return false; // Future content not available yet
    }
    
    // Must complete all previous days before accessing this day
    for (let prevDay = 0; prevDay < dayIndex; prevDay++) {
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

export const storage = new MemStorage();
