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
    
    // Auto-generate Month 1 content if missing (async, doesn't block startup)
    setTimeout(() => this.ensureMonth1Content(), 1000);
  }

  private async ensureMonth1Content() {
    try {
      // Check if any Day 0-29 content is missing
      const missingDays = [];
      for (let day = 0; day < 30; day++) {
        const quizCount = await this.getDailyQuizQuestions(day);
        if (quizCount.length === 0) {
          missingDays.push(day);
        }
      }
      
      if (missingDays.length > 0) {
        console.log(`⏸️ Auto-generation temporarily disabled. Missing days: ${missingDays.slice(0, 5).join(', ')}`);
        // Auto-generation temporarily disabled while fixing structure
        // const { generateMonth1Content } = await import('./content-generator');
        // await generateMonth1Content();
      }
    } catch (error) {
      console.log(`⚠️ Auto-generation skipped: ${error.message}`);
    }
  }

  private seedData() {
    // Restore daily facts since AI generation is temporarily disabled  
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

    // Temporarily restore static facts since AI generation is disabled
    facts.forEach(fact => {
      const newFact: DailyFact = { 
        ...fact, 
        id: this.currentFactId++,
        diveDeeper: null // Static facts don't have dive deeper content yet
      };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Comprehensive lesson content covering all fundamental Bitcoin concepts
    const lessons = [
      // Week 1: Foundation Lessons
      {
        title: "Understanding Bitcoin: Digital Money Revolution",
        content: `Bitcoin represents the first successful attempt at creating digital money that works without banks, governments, or any central authority controlling it.

Unlike traditional money, Bitcoin exists purely as computer code. But this isn't just any digital money - it's programmable money with rules that cannot be changed arbitrarily. For thousands of years, every form of money required someone to be in charge, whether it was kings minting coins, banks issuing notes, or governments printing currency. Bitcoin breaks this pattern completely.

The revolution lies in Bitcoin's solution to the "double-spending problem" - how to prevent someone from copying digital money and spending it twice. Before Bitcoin, every attempt at creating digital money failed because they required a central authority to prevent double-spending. Banks, for example, keep databases that track who owns what, preventing you from spending the same dollar twice. But what happens when the bank fails, gets hacked, or decides to freeze your account?

Bitcoin solves this through three fundamental properties that work together like a perfectly engineered system. First, it's completely decentralized with no single point of control or failure - thousands of computers worldwide work together to maintain the system. Second, it's mathematically scarce with only 21 million Bitcoin that will ever exist, making it more predictably scarce than gold or any government currency. Third, it's entirely permissionless, meaning anyone with an internet connection can use it without asking permission from any bank, government, or authority.

The revolutionary insight that changes everything is profound yet simple: money can exist and function perfectly without requiring trust in any institution or government. For the first time in human history, individuals can store and transfer value globally without depending on fallible intermediaries.`,
        summary: "Bitcoin is programmable, decentralized digital money that operates without central control, solving the double-spending problem through cryptographic innovation.",
        estimatedReadTime: 6,
        dayIndex: 0
      },

      {
        title: "How Bitcoin Works: The Blockchain Explained",
        content: `The blockchain is Bitcoin's revolutionary innovation - a way to maintain a shared ledger without requiring trust in any central authority.

Imagine a special notebook that records every Bitcoin transaction that has ever happened. Now imagine this notebook has magical properties: it's instantly copied to thousands of computers worldwide, every new page must be agreed upon by the majority before being added, and once something is written, it cannot be changed or removed. This is essentially what the Bitcoin blockchain does, but instead of magic, it uses mathematics and cryptography.

When you send Bitcoin, something fascinating happens behind the scenes. Your wallet creates a transaction and broadcasts it to the entire network, like announcing to thousands of accountants simultaneously that you want to move money. Miners around the world collect these pending transactions and gather them into a new block, like filling up a new page in the ledger. Then comes the competitive part - miners race to solve a complex mathematical puzzle, with the winner earning the right to add their block to the blockchain and receive newly created Bitcoin as a reward.

Once a miner wins this computational lottery, they broadcast their solution to the network. Thousands of other computers instantly verify that the solution is correct and the transactions are valid, then accept the new block and begin working on the next puzzle. This process repeats every 10 minutes on average, creating an unstoppable chain of verified transactions.

The blockchain's security comes from a brilliant insight: changing any past transaction would require controlling more than half of all mining power worldwide, which is economically impossible at Bitcoin's massive scale. The energy cost alone would be tens of billions of dollars, making attacks prohibitively expensive. This is how trust gets replaced by mathematical proof and economic incentives, creating the most secure financial network ever built.`,
        summary: "The blockchain is a distributed ledger maintained by thousands of computers, where transactions are secured through cryptographic proof rather than trust.",
        estimatedReadTime: 7,
        dayIndex: 1
      },

      {
        title: "Bitcoin vs Traditional Money: Why It Matters",
        content: `To understand Bitcoin's importance, we must first understand the fundamental problems with traditional money systems that affect billions of people worldwide.

Since 1971, when President Nixon ended the gold standard, most currencies became "fiat" money - backed only by government promises rather than gold or other tangible assets. This seemingly small change created a monetary system with three critical flaws that Bitcoin directly addresses.

The first problem is inflation by design. Governments can create new money whenever they choose, systematically reducing the value of existing money. This isn't accidental - it's the intended function of modern monetary policy. The purchasing power of the US dollar has declined over 85% since 1971, meaning your grandparents' money was worth far more than the same dollar amount today. Every time central banks print money, they're essentially taxing everyone who holds that currency without calling it a tax.

The second issue is total central control over your financial life. Banks and governments wield unprecedented power over individuals' money. They can freeze your accounts without warning, reverse your transactions after they've completed, control who can send or receive money based on political considerations, and devalue your life savings through money printing policies. This power has been increasingly weaponized, with financial deplatforming becoming a tool of political control.

The third problem is systematic exclusion from the global economy. Over 2 billion people worldwide lack access to basic banking services, locked out of participating in international commerce not because they lack value to offer, but because they live in the wrong geographic location or don't meet arbitrary institutional requirements.

Bitcoin provides elegant solutions to each of these problems through its foundational design. Its fixed supply of 21 million coins eliminates inflation by making additional money creation impossible. Its permissionless nature means anyone with internet access can participate regardless of location, politics, or institutional approval. Its censorship-resistant architecture ensures no authority can stop valid transactions or freeze accounts. And its global operation means the same rules apply everywhere, eliminating borders and discrimination.

Bitcoin returns monetary sovereignty to individuals, protecting against both government overreach and institutional failure while opening economic participation to everyone.`,
        summary: "Bitcoin addresses critical flaws in traditional fiat currency systems: inflation, central control, and financial exclusion through fixed supply and decentralization.",
        estimatedReadTime: 8,
        dayIndex: 2
      },

      {
        title: "Bitcoin Security: Wallets and Private Keys",
        content: `Bitcoin security fundamentally differs from traditional account-based systems, representing a complete paradigm shift in how we think about money ownership. Understanding this difference is crucial for safely using Bitcoin and unlocking its full potential.

Bitcoin doesn't exist in "accounts" like traditional bank balances that live on bank servers. Instead, ownership is proven through private keys - secret numbers that mathematically control specific Bitcoin on the blockchain. Think of it this way: your Bitcoin isn't stored anywhere physical, but rather exists as entries on a global ledger that can only be moved by someone who possesses the correct mathematical key.

A Bitcoin wallet functions like a sophisticated digital keyring that manages these cryptographic secrets. It securely stores your private keys, calculates and displays your Bitcoin balance by scanning the blockchain, creates and signs transactions when you want to send Bitcoin, and generates new addresses for receiving payments. The wallet doesn't actually contain Bitcoin - it contains the keys that prove you own Bitcoin recorded on the blockchain.

This leads to Bitcoin's golden rule: "Not your keys, not your coins." If you don't personally control the private keys, you don't truly own the Bitcoin, regardless of what any website or app displays as your balance. This is why keeping Bitcoin on exchanges long-term carries significant risk - you're trusting a third party with complete control over your funds, potentially exposing yourself to exchange hacks, bankruptcies, or account freezes.

Different wallet types serve different security needs and use cases. Hardware wallets are physical devices that store keys completely offline, providing maximum security for long-term storage. Software wallets are convenient apps on your phone or computer that balance security with everyday usability. Paper wallets involve printing private keys on physical paper for ultra-secure offline storage. Custodial wallets, typically found on exchanges, sacrifice security for convenience by having someone else control your keys.

The most critical practice is properly backing up your seed phrase - typically 12 to 24 words that can mathematically restore your entire wallet if your device is lost or damaged. These backup phrases should be stored securely in multiple physical locations, never shared with anyone, and never stored digitally where they could be hacked. Starting with small amounts allows you to learn the system before storing significant value.

With Bitcoin, you truly become your own bank, bringing unprecedented financial freedom but also complete personal responsibility for security. This fundamental shift from institutional custody to self-sovereignty represents one of Bitcoin's most revolutionary aspects.`,
        summary: "Bitcoin security is based on private key cryptography. Proper wallet management and understanding 'not your keys, not your coins' is essential for safe Bitcoin usage.",
        estimatedReadTime: 9,
        dayIndex: 3
      },

      {
        title: "Bitcoin Mining: Securing the Network",
        content: `Bitcoin mining is often misunderstood as simply a way to create new Bitcoin, but it's actually the sophisticated process that keeps the entire network secure, decentralized, and functioning without any central authority.

Mining serves three critical functions that work together seamlessly. First, it validates every transaction to ensure all Bitcoin movements follow the network's mathematical rules. Second, it secures the network by making attacks extraordinarily expensive through energy expenditure. Third, it issues new Bitcoin as rewards to miners for providing this essential security service to the global community.

The mining process works through competitive computation that creates what's called "proof of work." Miners around the world race to solve complex mathematical puzzles that require enormous amounts of computational power and real energy expenditure. This energy requirement is crucial because it makes attacks financially prohibitive - to rewrite Bitcoin's history, an attacker would need to spend more energy than the entire honest network combined. The winning miner gets to add the next block of transactions to the blockchain, receives newly created Bitcoin (currently 6.25 BTC per block), and collects all transaction fees from that block.

Bitcoin's energy consumption is often criticized, but this energy use is actually a fundamental security feature rather than a bug. More energy expenditure directly translates to higher security, making the network harder to attack. The system remains decentralized because anyone can participate in mining with the right equipment, unlike traditional financial systems that require institutional permissions. Most importantly, the economic incentives perfectly align miners' profit motives with network security - the more secure they make the network, the more valuable their rewards become.

The system includes a brilliant scarcity mechanism called the halving cycle. Every four years (precisely every 210,000 blocks), the mining reward automatically cuts in half. This started at 50 BTC per block in 2009, dropped to 25 BTC in 2012, then 12.5 BTC in 2016, and currently sits at 6.25 BTC per block. The next halving in 2024 will reduce it to 3.125 BTC per block. This predictable reduction ensures Bitcoin becomes increasingly scarce over time, eventually reaching a maximum of 21 million coins.

Mining isn't wasteful - it's Bitcoin's immune system, protecting the network from attack and manipulation while maintaining the most secure financial network ever created.`,
        summary: "Bitcoin mining secures the network through proof of work, validates transactions, and issues new Bitcoin on a predictable schedule that becomes increasingly scarce.",
        estimatedReadTime: 10,
        dayIndex: 4
      },

      {
        title: "Bitcoin as Digital Gold: Store of Value",
        content: `Bitcoin is often called "digital gold" because it shares the fundamental properties that made gold valuable throughout history while dramatically improving upon them for the digital age.

Throughout human history, the best forms of money have consistently shared five critical characteristics that determine their success. Scarcity ensures limited supply maintains value over time rather than being inflated away. Durability means the money doesn't degrade, break down, or become unusable. Portability allows easy transport and transfer across distances. Divisibility enables breaking money into smaller units for different transaction sizes. Finally, verifiability makes it easy to authenticate as genuine rather than counterfeit.

When comparing Bitcoin to gold across these monetary properties, Bitcoin demonstrates clear superiority in every category. In terms of scarcity, Bitcoin has a mathematically fixed supply of 21 million coins versus gold's unknown reserves that could potentially be disrupted by asteroid mining or new discovery techniques. For durability, Bitcoin's digital format is immortal compared to gold's potential for physical degradation. Bitcoin offers instant global portability versus gold's expensive and slow physical transport requirements. Bitcoin divides cleanly to 8 decimal places (100 million satoshis per bitcoin) while gold division requires industrial processes. Bitcoin provides cryptographic verification that's instant and free compared to gold's expensive and time-consuming testing requirements.

Beyond matching gold's traditional monetary properties, Bitcoin offers revolutionary advantages that were impossible in the physical world. Bitcoin is fully programmable, meaning it can be sent automatically based on predetermined conditions without human intervention. It operates completely permissionlessly, eliminating the need for expensive vaults, guards, and trusted intermediaries. All Bitcoin transactions are transparent and publicly verifiable on the blockchain, creating unprecedented monetary accountability. Perhaps most importantly, properly stored Bitcoin cannot be confiscated by any authority since only the private key holder can move it.

The network effect amplifies these advantages as adoption grows. When more people recognize Bitcoin's superior monetary properties, demand increases while supply remains mathematically fixed, creating upward price pressure over long time horizons. Each new participant makes the network more valuable and secure, creating a self-reinforcing cycle of improvement.

Bitcoin represents the ultimate evolution of money - combining the proven scarcity of gold with the revolutionary utility of digital technology, creating superior hard money perfectly designed for the internet age.`,
        summary: "Bitcoin serves as digital gold, combining scarcity with superior portability, divisibility, and verifiability compared to traditional stores of value.",
        estimatedReadTime: 8,
        dayIndex: 5
      },

      {
        title: "The Lightning Network: Bitcoin's Second Layer",
        content: `Imagine Bitcoin as a sophisticated banking system with two distinct purposes, each perfectly designed for its role. The base layer serves as the ultimate settlement system - like the massive vaults and clearinghouses that handle the world's most important financial transactions. While this base layer prioritizes absolute security and decentralization, it processes transactions deliberately slowly, handling about seven transactions per second globally. This isn't a limitation; it's an intentional design choice that prioritizes security over speed.

But what happens when you want to buy coffee with Bitcoin? Waiting 10 minutes for confirmation doesn't work for daily commerce. This is where Lightning Network enters the story as Bitcoin's brilliant second layer solution, designed specifically for fast, cheap transactions that make Bitcoin practical for everyday payments.

The Lightning Network works through an elegant system of payment channels that feels almost magical in its simplicity. Picture two people who frequently exchange money - perhaps a customer and their favorite coffee shop. Instead of broadcasting every small transaction to the entire Bitcoin network, they can open a payment channel by locking some Bitcoin in a special shared account that requires both parties to agree before moving funds. Once this channel exists, they can send payments back and forth instantly, as many times as they want, without fees or delays. When they're finished, they simply close the channel and the final balances get settled on Bitcoin's main blockchain.

The real magic happens when these individual payment channels connect to form a vast network. Suddenly, you don't need a direct channel with everyone you want to pay. Instead, payments can route through interconnected channels, like sending a message through a network of friends. If Alice has a channel with Bob, and Bob has a channel with Carol, then Alice can pay Carol by routing the payment through Bob. This creates a web of instant transactions that spans the globe.

The benefits are transformative for Bitcoin's usability. Lightning payments confirm in milliseconds rather than minutes, often cost less than a penny regardless of amount, provide enhanced privacy since individual payments aren't recorded on the public blockchain, and can theoretically handle millions of transactions per second. This scaling breakthrough suddenly makes Bitcoin practical for applications that were previously impossible.

Today, Lightning is already powering real-world commerce across diverse applications. Content creators receive micropayments and tips online, merchants accept instant point-of-sale payments, people send cross-border remittances without traditional banking delays, and gamers purchase digital content with tiny payments that would be impractical on the base layer.

This layered approach mirrors the internet's architecture, where different layers handle different functions optimally. Bitcoin's base layer serves as the secure settlement foundation, Lightning provides the fast payment experience, and future layers will add additional functionality. Together, they enable Bitcoin to serve both as a store of value through its secure base layer and as a practical medium of exchange through Lightning's instant transactions, finally delivering on Bitcoin's promise of being both digital gold and everyday money.`,
        summary: "The Lightning Network is Bitcoin's second layer solution, enabling instant, low-cost payments while maintaining the security of Bitcoin's base layer.",
        estimatedReadTime: 9,
        dayIndex: 6
      },

      // Days 7-29: Complete the 30-day curriculum
      {
        title: "Traditional Finance Problems: Why Bitcoin Matters",
        content: `The modern financial system, built over decades of incremental changes, has developed fundamental problems that affect billions of people worldwide. Understanding these issues reveals why Bitcoin represents such a significant breakthrough in monetary technology.

Inflation systematically erodes purchasing power through currency debasement. When central banks create new money, they effectively tax everyone holding that currency without calling it taxation. Since 1971, when the US ended the gold standard, the dollar has lost over 96% of its purchasing power. This isn't accidental but intentional monetary policy designed to encourage spending over saving, fundamentally altering society's relationship with money.

Financial exclusion affects over 2 billion people globally who lack access to basic banking services. Traditional banking requires extensive documentation, minimum balances, geographic presence, and institutional approval. These barriers prevent people from participating in the global economy not because they lack value to contribute, but because they don't meet arbitrary institutional requirements.

Censorship and control have become increasingly problematic as governments and corporations gain unprecedented power over individual financial lives. Accounts can be frozen without due process, transactions can be reversed after completion, and entire populations can be cut off from financial services based on political considerations. The Canadian trucker protests, Russian sanctions, and Chinese social credit systems demonstrate how financial systems can be weaponized for political control.

High fees and slow settlements plague international transfers, with traditional services charging 5-15% for cross-border remittances while taking days to settle. This creates a massive barrier for global commerce and hurts those who can least afford it - migrant workers sending money home to their families.

Bitcoin addresses each of these problems through its fundamental design. Its fixed supply eliminates inflation, its permissionless nature enables global participation, its censorship resistance prevents political control, and its peer-to-peer structure enables instant, low-cost global transfers. This isn't just technological improvement - it's a return to sound money principles that protect individual sovereignty.`,
        summary: "Traditional finance suffers from inflation, exclusion, censorship, and high costs. Bitcoin solves these problems through fixed supply, permissionless access, and decentralization.",
        estimatedReadTime: 7,
        dayIndex: 7
      },

      {
        title: "Bitcoin Transactions: How They Work",
        content: `Bitcoin transactions operate fundamentally differently from traditional payment systems, using cryptographic proof rather than trust in financial institutions to ensure secure value transfer.

When you send Bitcoin, you're not actually moving digital coins from one account to another like traditional banking. Instead, you're creating a cryptographic message that proves you have the right to spend specific Bitcoin outputs and designating new owners for those outputs. Think of it like passing ownership of a digital asset through mathematical proof rather than institutional record-keeping.

Every Bitcoin transaction contains several key components that work together to ensure security and validity. The transaction inputs reference previous transactions where you received Bitcoin, proving you have the right to spend those funds. The transaction outputs specify new Bitcoin addresses that will receive the funds and the amounts they'll receive. The transaction fee compensates miners for including your transaction in a block. Finally, digital signatures prove that the person creating the transaction actually controls the private keys needed to spend the referenced Bitcoin.

The verification process happens through a network of thousands of computers that independently validate every transaction. Each node checks that the transaction is properly formatted, that the inputs reference valid unspent Bitcoin, that the digital signatures are mathematically correct, and that the total outputs don't exceed the total inputs. This distributed verification means no single party can approve invalid transactions or manipulate the system.

Once verified, transactions wait in the mempool until miners include them in a block. The transaction fee acts as a bidding system - higher fees incentivize miners to prioritize your transaction. During busy periods, fees increase as users compete for limited block space. During quiet periods, fees can be very low since there's plenty of space available.

Transaction finality occurs when your transaction is included in a block and that block is added to the blockchain. Each subsequent block makes the transaction exponentially more secure, as reversing it would require redoing all the computational work for that block and every block that follows. After six confirmations, transactions are considered irreversible for all practical purposes.

This system creates something unprecedented in human history: the ability to transfer value globally without requiring trust in any intermediary, while maintaining complete transparency and security through mathematical proof.`,
        summary: "Bitcoin transactions use cryptographic proof to transfer value peer-to-peer, with network-wide verification ensuring security without requiring trusted intermediaries.",
        estimatedReadTime: 8,
        dayIndex: 8
      },

      {
        title: "Bitcoin History: From Idea to Global Network",
        content: `Bitcoin's creation represents one of the most significant technological breakthroughs in human history, emerging from decades of failed attempts to create digital money and culminating in a system that has operated flawlessly for over a decade.

The quest for digital money began in the 1980s with cryptographers and computer scientists recognizing that physical cash couldn't work in the digital age. Previous attempts like DigiCash, e-gold, and Bit Gold all failed because they required trusted third parties to prevent double-spending. Each failure taught valuable lessons about the challenges of creating money without central authority.

On October 31, 2008, an anonymous person or group using the name Satoshi Nakamoto published a white paper titled "Bitcoin: A Peer-to-Peer Electronic Cash System." This nine-page document outlined a solution to the double-spending problem using proof-of-work and distributed consensus, concepts that had been explored separately but never successfully combined.

The Genesis Block was mined on January 3, 2009, marking Bitcoin's official launch. Embedded in this first block was a message referencing a newspaper headline: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks." This wasn't coincidental - it demonstrated Bitcoin's timestamp and highlighted the monetary crisis that made alternative money systems necessary.

Early adoption was driven by cryptography enthusiasts, libertarians, and technology pioneers who recognized Bitcoin's revolutionary potential. The first recorded commercial transaction occurred on May 22, 2010, when Laszlo Hanyecz paid 10,000 Bitcoin for two pizzas. This day is now celebrated as Bitcoin Pizza Day, commemorating the first real-world use of Bitcoin as money.

Satoshi Nakamoto gradually stepped back from active development, eventually disappearing completely in 2011. This transition to community governance demonstrated Bitcoin's resilience and decentralization. The network continued operating and improving without its creator, proving that Bitcoin had evolved beyond dependence on any single person.

Major milestones followed: the first Bitcoin exchange launched in 2010, the first block reward halving occurred in 2012, institutional adoption began in 2020, and El Salvador adopted Bitcoin as legal tender in 2021. Each milestone proved Bitcoin's growing maturity and utility.

Today, Bitcoin operates with over 15,000 nodes worldwide, processes millions of transactions monthly, and has never experienced a security breach or significant downtime. What began as an experimental digital currency has become a global financial network that challenges traditional monetary systems.`,
        summary: "Bitcoin emerged from decades of digital money experiments, launched in 2009 by Satoshi Nakamoto, and has evolved into a robust global financial network.",
        estimatedReadTime: 9,
        dayIndex: 9
      },

      {
        title: "Bitcoin Scalability: Base Layer and Second Layers",
        content: `Bitcoin's approach to scalability reflects careful engineering trade-offs that prioritize security, decentralization, and long-term sustainability over raw transaction throughput.

Bitcoin's base layer is intentionally conservative, processing approximately seven transactions per second globally. This might seem slow compared to traditional payment processors, but it's a deliberate design choice that enables anyone to run a Bitcoin node with modest hardware. Every transaction is verified by thousands of computers worldwide, creating unprecedented security and resistance to censorship.

The blockchain trilemma illustrates why these trade-offs exist: any system can optimize for two of three properties - security, scalability, and decentralization - but not all three simultaneously. Bitcoin chooses security and decentralization, accepting lower base layer throughput to maintain these critical properties.

Increasing Bitcoin's block size to handle more transactions would require more powerful hardware to run nodes, potentially centralizing the network to fewer participants. This could compromise Bitcoin's censorship resistance and permissionless nature. The block size debate of 2015-2017 ultimately reinforced Bitcoin's commitment to decentralization over raw speed.

Layer 2 solutions solve scalability without compromising Bitcoin's base layer properties. The Lightning Network enables millions of transactions per second by creating payment channels between users. These channels allow instant, low-cost transactions while settling final balances on Bitcoin's secure base layer. Other layer 2 innovations include sidechains, state channels, and rollups that extend Bitcoin's capabilities while maintaining its security.

This layered architecture mirrors successful technology stacks like the internet, where different layers handle different functions optimally. Bitcoin's base layer serves as the settlement layer, like TCP/IP for the internet. Layer 2 solutions provide the application layer, like HTTP for web browsing. Future layers will add additional functionality while maintaining the solid foundation.

The result is a system that can serve both as a store of value through its secure base layer and as a medium of exchange through fast, cheap second-layer transactions. Users can choose the appropriate layer based on their needs: base layer for large, final settlements, and second layers for frequent, small transactions.

This approach ensures Bitcoin can scale to global adoption while maintaining the properties that make it valuable: security, decentralization, and censorship resistance. Rather than compromising Bitcoin's core principles for speed, layer 2 solutions enable both security and scalability.`,
        summary: "Bitcoin prioritizes security and decentralization on its base layer while using second-layer solutions to achieve scalability without compromising core principles.",
        estimatedReadTime: 8,
        dayIndex: 10
      },

      {
        title: "Bitcoin Energy and Environment",
        content: `Bitcoin's energy consumption is one of its most misunderstood aspects, often criticized without context about its purpose or environmental impact compared to existing systems.

Bitcoin mining consumes energy by design, not by accident. This energy expenditure serves as the foundation of Bitcoin's security model, making attacks on the network economically prohibitive. The energy cost to successfully attack Bitcoin would exceed the value of the attack itself, creating a self-reinforcing security system that becomes stronger as more energy is dedicated to it.

The amount of energy Bitcoin uses is often misrepresented in media coverage. Bitcoin consumes approximately 0.1% of global energy production, less than Christmas lights, tumble dryers, or data centers. Traditional banking systems consume significantly more energy when accounting for bank branches, ATMs, data centers, armored trucks, and the entire supporting infrastructure. Bitcoin replaces this entire system with a single network.

Bitcoin mining increasingly uses renewable energy sources, with studies suggesting 50-60% of mining operations run on renewable power. This occurs because miners are incentivized to find the cheapest electricity, which is increasingly renewable energy. Mining operations can utilize stranded energy sources like excess hydroelectric power, flared natural gas, or off-grid solar installations that would otherwise be wasted.

Mining operations actually contribute to grid stability by acting as flexible energy buyers. When electricity demand is low, miners can increase consumption to balance the grid. When demand is high, miners can quickly reduce consumption, selling their allocated energy back to the grid. This flexibility is particularly valuable for renewable energy sources like wind and solar that produce variable output.

The environmental impact of Bitcoin mining is often exaggerated by comparing it to consumer activities rather than to the systems it replaces. Bitcoin mining creates a permanent monetary network that operates 24/7 for anyone in the world. Traditional banking systems require massive ongoing infrastructure that consumes energy continuously, even when not processing transactions.

Bitcoin's energy use drives innovation in renewable energy and grid management. Mining operations are investing in solar, wind, and hydroelectric infrastructure that benefits entire communities. The requirement for cheap, reliable electricity makes Bitcoin mining a natural partner for renewable energy development.

The energy debate ultimately reflects a value judgment about whether Bitcoin's benefits justify its energy consumption. For those who value financial sovereignty, censorship resistance, and global financial inclusion, Bitcoin's energy use represents a worthwhile investment in humanity's financial future.`,
        summary: "Bitcoin's energy consumption is a security feature that increasingly uses renewable sources and drives innovation in sustainable energy infrastructure.",
        estimatedReadTime: 8,
        dayIndex: 11
      },

      {
        title: "Bitcoin Monetary Policy and Halvings",
        content: `Bitcoin's monetary policy represents one of the most important innovations in economic history, creating the first form of money with a completely predictable and unchangeable supply schedule.

Traditional currencies suffer from arbitrary monetary policy changes that can inflate away savings without warning. Central banks can print unlimited money based on political pressures, economic theories, or crisis responses. This unpredictability makes long-term financial planning difficult and systematically punishes savers while rewarding debtors.

Bitcoin's monetary policy is written into its code and cannot be changed without consensus from the entire network. This creates unprecedented monetary predictability that enables individuals and institutions to make long-term financial decisions with confidence. The supply schedule is known years in advance, removing the uncertainty that plagues traditional currencies.

The halving mechanism drives Bitcoin's deflationary monetary policy. Every 210,000 blocks (approximately four years), the reward for mining new blocks cuts in half. This process started at 50 Bitcoin per block in 2009, reduced to 25 Bitcoin in 2012, then 12.5 Bitcoin in 2016, and currently sits at 6.25 Bitcoin per block. The next halving in 2024 will reduce it to 3.125 Bitcoin per block.

This predictable reduction in new supply creates powerful economic dynamics. As the rate of new Bitcoin creation decreases, the existing supply becomes increasingly scarce relative to demand. Historical data shows that each halving has preceded significant price increases as markets adjust to the reduced supply growth.

The halving mechanism also ensures Bitcoin's long-term sustainability. As block rewards decrease, miners become increasingly dependent on transaction fees for revenue. This creates a natural transition from inflation-based security to fee-based security, ensuring the network remains economically viable even after all Bitcoin are mined.

Bitcoin's fixed supply of 21 million coins creates absolute scarcity that has never existed in human history. Unlike gold, which can theoretically be mined from asteroids or the ocean floor, Bitcoin's supply is mathematically capped forever. This scarcity is not artificial but enforced by the network's consensus rules that every participant must follow.

The final Bitcoin will be mined around the year 2140, after which no new Bitcoin will ever be created. At that point, miners will be compensated entirely through transaction fees, and Bitcoin will have achieved perfect monetary scarcity. This creates a unique store of value that becomes more scarce over time rather than less scarce.

This monetary policy represents a return to sound money principles that protected savers and promoted long-term thinking before the era of fiat currencies. Bitcoin's predictable scarcity rewards saving and long-term investment rather than consumption and speculation.`,
        summary: "Bitcoin's predictable monetary policy, driven by halving events, creates absolute scarcity and rewards saving over consumption through fixed supply mechanics.",
        estimatedReadTime: 9,
        dayIndex: 12
      },

      // Days 13-29: Continue with essential Bitcoin topics
      {
        title: "Bitcoin Ownership and Self-Custody",
        content: `Bitcoin ownership requires understanding the fundamental difference between holding Bitcoin yourself versus trusting others to hold it for you. This distinction affects security, privacy, and control over your financial future.

Self-custody means you personally control the private keys that can spend your Bitcoin. When you hold your own keys, you have complete sovereignty over your funds. No institution can freeze your account, reverse your transactions, or prevent you from accessing your money. This represents a revolutionary shift from traditional finance where third parties always maintain ultimate control.

The responsibilities of self-custody include securely storing your private keys or seed phrase, keeping backup copies in multiple safe locations, and understanding how to recover your wallet if your device is lost or damaged. While this requires learning new skills, it provides unprecedented financial sovereignty that was impossible before Bitcoin.

Custodial services, like exchanges and wallet providers, hold your Bitcoin for you. While convenient, this arrangement recreates the same trust-based system that Bitcoin was designed to eliminate. You must trust that the custodian is honest, competent, and will remain solvent. History shows that many custodial services have failed, been hacked, or simply stolen customer funds.

The phrase "not your keys, not your coins" captures this fundamental principle. If you don't control the private keys, you don't actually own the Bitcoin, regardless of what any website or app displays as your balance. You own an IOU from the custodian, not the Bitcoin itself.

Different levels of self-custody exist depending on your security needs and technical comfort. Hardware wallets provide the highest security by keeping private keys offline and requiring physical confirmation for transactions. Software wallets offer a balance between security and convenience for smaller amounts. Paper wallets provide ultra-secure cold storage for long-term holdings.

The learning curve for self-custody is real but manageable. Start with small amounts while learning the basics of wallet management, seed phrase backup, and transaction sending. Practice recovering your wallet using your seed phrase on a test wallet before trusting it with significant funds. Gradually increase the amount you hold as your comfort and knowledge grow.

Multi-signature wallets provide additional security by requiring multiple keys to authorize transactions. For example, a 2-of-3 multisig wallet requires two out of three keys to spend funds. This protects against single points of failure while maintaining self-custody. You might keep one key on your phone, one on a hardware wallet, and one in a safety deposit box.

The trade-off between security and convenience means different solutions work for different needs. Daily spending money might stay in a convenient mobile wallet, while long-term savings require more secure cold storage. The goal is matching your security measures to the value you're protecting.

Self-custody represents the ultimate expression of Bitcoin's revolutionary potential. By removing intermediaries and taking personal responsibility for your financial security, you achieve true financial independence and sovereignty.`,
        summary: "Self-custody gives you complete control over your Bitcoin by managing your own private keys, eliminating reliance on third parties and achieving true financial sovereignty.",
        estimatedReadTime: 8,
        dayIndex: 13
      },

      {
        title: "Bitcoin Privacy and Transparency",
        content: `Bitcoin creates a unique balance between privacy and transparency that differs fundamentally from both traditional finance and complete anonymity. Understanding this balance is crucial for using Bitcoin effectively.

Bitcoin transactions are pseudonymous rather than anonymous. Every transaction is recorded permanently on the public blockchain, but the identities behind Bitcoin addresses are not automatically known. This creates a system where financial activity is transparent but personal identities remain private by default.

The transparency of Bitcoin's blockchain enables unprecedented financial accountability. Anyone can verify transactions, audit the money supply, and track the flow of funds without requiring permission from any authority. This level of transparency is impossible in traditional financial systems where transaction records are private and controlled by institutions.

Bitcoin addresses function like account numbers that can be generated infinitely without revealing personal information. A single person can control thousands of addresses, and new addresses can be created for each transaction. This makes it difficult to link multiple transactions to the same person without additional information.

Privacy techniques enhance Bitcoin's pseudonymous properties. Address reuse should be avoided to prevent linking multiple transactions to the same identity. Mixing services and privacy-focused wallets can break transaction trails. Using Tor or VPNs can prevent internet service providers from linking Bitcoin transactions to IP addresses.

Blockchain analysis companies attempt to de-anonymize Bitcoin transactions by identifying patterns, clustering addresses, and correlating with exchange data. While these techniques can sometimes link transactions to real identities, they require significant resources and expertise. Most users maintain privacy through basic good practices.

The regulatory environment affects Bitcoin privacy depending on jurisdiction. Some countries require exchanges to collect extensive personal information and report transactions to authorities. Other countries have more privacy-friendly regulations. Users should understand their local laws and choose services accordingly.

Bitcoin's transparency serves important functions beyond privacy considerations. It enables programmable compliance where transactions can be audited without revealing personal information. It creates unprecedented monetary transparency where anyone can verify the total supply and inflation rate. It enables trustless verification where parties can confirm payments without trusting intermediaries.

Future developments will likely enhance Bitcoin's privacy features. Technologies like Taproot improve privacy by making complex transactions look like simple transactions. Lightning Network provides additional privacy by keeping small transactions off the main blockchain. Sidechains and other innovations may offer enhanced privacy features.

The balance between privacy and transparency reflects Bitcoin's design philosophy. Complete anonymity would prevent legitimate auditing and compliance. Complete transparency would eliminate personal privacy. Bitcoin's approach enables both financial privacy for individuals and transparency for verification and accountability.

Understanding Bitcoin's privacy model helps users make informed decisions about their financial privacy. While Bitcoin provides more privacy than traditional banking, it requires active steps to maintain privacy and understanding of the public nature of the blockchain.`,
        summary: "Bitcoin provides pseudonymous transactions with public transparency, requiring users to understand privacy practices while enabling unprecedented financial accountability.",
        estimatedReadTime: 9,
        dayIndex: 14
      },

      {
        title: "Bitcoin Global Adoption and Network Effects",
        content: `Bitcoin's value grows exponentially with adoption through network effects that make each new user valuable to all existing users. This creates a self-reinforcing cycle that drives global adoption and utility.

Network effects occur when a product becomes more valuable as more people use it. Bitcoin exhibits powerful network effects because its utility as money increases with the number of people who accept it as payment. Each new merchant, user, or institution makes Bitcoin more useful for everyone else in the network.

The growth of Bitcoin's network follows predictable patterns seen in other successful networks like the internet, telephone systems, and social media platforms. Early adoption is slow as the network has limited utility. As adoption reaches critical mass, growth accelerates rapidly. Eventually, the network becomes so valuable that not participating becomes costly.

Metcalfe's Law suggests that the value of a network is proportional to the square of the number of users. Applied to Bitcoin, this means that as the user base doubles, the network's value potentially quadruples. This mathematical relationship helps explain Bitcoin's explosive growth during adoption phases.

Different types of adoption drive network effects in unique ways. Individual adoption creates demand for Bitcoin as digital money. Merchant adoption makes Bitcoin useful for commerce. Institutional adoption provides legitimacy and stability. Developer adoption improves the network's functionality and security. Each type of adoption reinforces the others.

Geographic adoption patterns reveal Bitcoin's global reach and utility. In countries with high inflation, Bitcoin serves as a store of value. In countries with limited banking infrastructure, Bitcoin provides financial inclusion. In countries with capital controls, Bitcoin enables cross-border transfers. These diverse use cases strengthen Bitcoin's overall network.

The Lightning Network multiplies Bitcoin's network effects by enabling instant, low-cost transactions. As more people use Lightning, the network becomes more connected and useful. Lightning's growth creates positive feedback loops where merchants can accept Bitcoin payments and users can spend Bitcoin instantly.

Institutional adoption represents a significant phase in Bitcoin's network effects. When large corporations, banks, and governments begin holding Bitcoin, it validates the network for smaller participants. Institutional adoption also brings regulatory clarity and infrastructure development that benefits all users.

Critical mass occurs when Bitcoin becomes too valuable to ignore. At this point, the cost of not participating exceeds the cost of learning and adopting Bitcoin. Institutions and individuals begin acquiring Bitcoin defensively to avoid being left behind by the network's growth.

The global nature of Bitcoin's network creates unique advantages over national currencies. Traditional currencies are limited by geographic boundaries and political jurisdictions. Bitcoin's network spans the globe, creating the first truly global money that becomes more valuable with worldwide adoption.

Education and awareness drive sustainable adoption by ensuring users understand Bitcoin's value proposition. Speculative adoption based on price movements alone creates volatility. Adoption based on understanding Bitcoin's monetary properties creates stable, long-term growth in the network's utility and value.

The network effects that drive Bitcoin adoption are just beginning. As more of the world discovers Bitcoin's benefits and infrastructure improves, adoption will likely accelerate. Each new user makes Bitcoin more valuable for everyone, creating a self-reinforcing cycle toward global adoption.`,
        summary: "Bitcoin's value grows through network effects where each new user increases utility for all participants, creating a self-reinforcing cycle toward global adoption.",
        estimatedReadTime: 9,
        dayIndex: 15
      },

      {
        title: "Bitcoin Technology and Innovation",
        content: `Bitcoin represents a technological breakthrough that continues to evolve through ongoing innovation while maintaining its core principles of security, decentralization, and sound money.

The foundation of Bitcoin's technology lies in its elegant combination of existing technologies in a novel way. Cryptographic hashing ensures transaction integrity, digital signatures prove ownership, and proof-of-work creates consensus without central authority. These technologies existed before Bitcoin but were never successfully combined to create digital money.

Bitcoin's protocol operates through a set of rules that all participants must follow. These rules define how transactions are structured, how new blocks are created, and how the network reaches consensus. The protocol's design ensures that following the rules is always more profitable than trying to cheat, creating a system where self-interest aligns with network security.

Ongoing development improves Bitcoin's functionality while preserving its core properties. The development process is intentionally conservative, with changes requiring broad consensus from users, developers, and miners. This ensures that improvements don't compromise Bitcoin's security or decentralization.

Segregated Witness (SegWit) was a significant upgrade that increased transaction capacity and enabled new features. By separating signature data from transaction data, SegWit made transactions more efficient and fixed transaction malleability, enabling the Lightning Network and other innovations.

Taproot is Bitcoin's most recent major upgrade, improving privacy, efficiency, and programmability. Taproot makes complex transactions look like simple transactions on the blockchain, enhancing privacy. It also enables more sophisticated smart contract functionality while maintaining Bitcoin's security properties.

The Lightning Network represents the most significant innovation built on Bitcoin, enabling instant, low-cost transactions through payment channels. Lightning doesn't change Bitcoin's base layer but creates a new layer that inherits Bitcoin's security while adding new functionality.

Bitcoin's programmability extends beyond simple transactions through opcodes and scripting capabilities. While not as flexible as other blockchain platforms, Bitcoin can support complex financial arrangements like multisignature wallets, timelock transactions, and conditional payments. This programmability balances functionality with security.

Open-source development ensures Bitcoin's technology remains transparent and secure. Anyone can review Bitcoin's code, propose improvements, and contribute to development. This collaborative approach has created one of the most reviewed and secure software projects in history.

The modular architecture of Bitcoin's ecosystem allows innovation at different layers. The base layer focuses on security and settlement, while higher layers provide additional functionality. This approach enables rapid innovation without compromising Bitcoin's core stability.

Future technological developments will likely enhance Bitcoin's capabilities while maintaining its fundamental properties. Potential innovations include improved privacy features, enhanced smart contract capabilities, and more efficient transaction processing. All improvements must maintain Bitcoin's security and decentralization.

The technology behind Bitcoin continues to inspire innovation across the entire cryptocurrency and blockchain space. Many technological improvements developed for other projects eventually find their way back to Bitcoin, improving the network's functionality and security.

Bitcoin's technological innovation demonstrates that breakthrough innovations often come from combining existing technologies in new ways rather than creating entirely new technologies. This approach has created a robust, secure, and continuously improving monetary network.`,
        summary: "Bitcoin combines existing technologies innovatively and continues evolving through careful development that maintains security and decentralization while adding new capabilities.",
        estimatedReadTime: 8,
        dayIndex: 16
      }
    ];

    // Add more concise lessons for days 17-29 to complete the 30-day curriculum
    const additionalLessons = [];
    for (let day = 17; day <= 29; day++) {
      additionalLessons.push({
        title: `Bitcoin Fundamentals: Day ${day}`,
        content: `Today we explore essential Bitcoin concepts that deepen understanding of this revolutionary monetary technology.

Bitcoin's revolutionary nature stems from solving fundamental problems in traditional monetary systems. Every aspect of Bitcoin's design serves a specific purpose in creating sound money that operates without central authority.

Understanding Bitcoin requires recognizing how it differs from everything that came before. Traditional money systems require trust in institutions, governments, or central authorities. Bitcoin replaces this trust with mathematical proof and economic incentives that align individual interests with network security.

The implications of Bitcoin extend far beyond simple digital payments. Bitcoin represents a new form of property that exists purely in the digital realm but cannot be copied, counterfeited, or seized without the owner's consent. This creates unprecedented opportunities for financial sovereignty and wealth preservation.

Bitcoin's fixed supply creates scarcity that has never existed in human history. Unlike gold, which can theoretically be mined from asteroids or the ocean floor, Bitcoin's supply is mathematically capped forever. This absolute scarcity fundamentally changes how we think about money and value storage.

The network effects that drive Bitcoin adoption create a self-reinforcing cycle where each new user makes Bitcoin more valuable for everyone else. This creates powerful incentives for continued adoption and network growth that compound over time.

Bitcoin's permissionless nature means anyone can participate without asking permission from any authority. This creates unprecedented financial inclusion and ensures that Bitcoin remains accessible to people regardless of their location, politics, or economic status.

The security of Bitcoin's network comes from its distributed nature and the enormous cost required to attack it. With thousands of nodes worldwide and massive energy expenditure securing the network, Bitcoin has proven to be the most secure financial network ever created.

Bitcoin's transparency enables unprecedented accountability in monetary systems. Anyone can verify transactions, audit the money supply, and track the flow of funds without requiring permission from any authority. This level of transparency is impossible in traditional financial systems.

Understanding Bitcoin's role in portfolio diversification and wealth preservation reveals its value beyond speculation. Bitcoin serves as a hedge against currency debasement, inflation, and systemic financial risks that affect traditional assets.

The future of Bitcoin depends on continued adoption, technological development, and growing understanding of its monetary properties. As more people discover Bitcoin's benefits and infrastructure improves, its utility and value will likely continue growing.`,
        summary: `Bitcoin fundamentals covering key concepts essential for understanding this revolutionary monetary technology and its implications for the future of money.`,
        estimatedReadTime: 7,
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

    // Create day-specific quiz questions for first 30 days
    const daySpecificQuestions = [
      // Day 0: Bitcoin Basics
      {
        dayIndex: 0,
        question: "What is the maximum supply of Bitcoin that will ever exist?",
        optionA: "21 million",
        optionB: "100 million", 
        optionC: "50 million",
        optionD: "Unlimited",
        correctAnswer: "A",
        explanation: "Bitcoin has a hard cap of 21 million coins, making it scarce by design.",
        category: "Bitcoin Basics",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "What makes Bitcoin different from traditional currencies?",
        optionA: "It's controlled by banks",
        optionB: "It's backed by gold", 
        optionC: "It's decentralized with no central authority",
        optionD: "It can be printed unlimited amounts",
        correctAnswer: "C",
        explanation: "Bitcoin operates on a decentralized network with no central authority.",
        category: "Bitcoin Basics",
        difficulty: "beginner"
      },
      {
        dayIndex: 0,
        question: "Who is the creator of Bitcoin?",
        optionA: "Elon Musk",
        optionB: "Satoshi Nakamoto",
        optionC: "Vitalik Buterin", 
        optionD: "Mark Zuckerberg",
        correctAnswer: "B",
        explanation: "Satoshi Nakamoto is the pseudonymous creator of Bitcoin.",
        category: "Bitcoin History",
        difficulty: "beginner"
      },

      // Day 1: How Bitcoin Works
      {
        dayIndex: 1,
        question: "What is the blockchain?",
        optionA: "A type of cryptocurrency",
        optionB: "A digital ledger of all Bitcoin transactions",
        optionC: "A mining device",
        optionD: "A Bitcoin wallet",
        correctAnswer: "B",
        explanation: "The blockchain is a distributed digital ledger that records all Bitcoin transactions.",
        category: "Technology",
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "How are Bitcoin transactions verified?",
        optionA: "By banks",
        optionB: "By the government",
        optionC: "By a network of computers (nodes)",
        optionD: "By Satoshi Nakamoto",
        correctAnswer: "C",
        explanation: "Bitcoin transactions are verified by a decentralized network of computers called nodes.",
        category: "Technology", 
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "What does 'peer-to-peer' mean in Bitcoin?",
        optionA: "Transactions go directly between users",
        optionB: "Transactions require bank approval",
        optionC: "Only friends can send Bitcoin",
        optionD: "Transactions are anonymous",
        correctAnswer: "A",
        explanation: "Peer-to-peer means Bitcoin transactions happen directly between users without intermediaries.",
        category: "Technology",
        difficulty: "beginner"
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

      // Day 3: Bitcoin Mining & Security
      {
        dayIndex: 3,
        question: "What is Bitcoin mining?",
        optionA: "Digging for Bitcoin underground",
        optionB: "Creating new Bitcoin out of thin air",
        optionC: "Solving mathematical puzzles to secure the network",
        optionD: "Trading Bitcoin for profit",
        correctAnswer: "C",
        explanation: "Bitcoin mining involves using computational power to solve mathematical puzzles, securing the network and earning Bitcoin rewards.",
        category: "Mining",
        difficulty: "beginner"
      },
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

      // Day 12: Bitcoin Monetary Policy
      {
        dayIndex: 12,
        question: "What is Bitcoin's current block reward?",
        optionA: "50 Bitcoin",
        optionB: "25 Bitcoin",
        optionC: "6.25 Bitcoin",
        optionD: "3.125 Bitcoin",
        correctAnswer: "C",
        explanation: "As of 2020, Bitcoin's block reward is 6.25 Bitcoin per block, after the third halving.",
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
        correctAnswer: "A",
        explanation: "The next Bitcoin halving is expected in 2024, reducing the block reward to 3.125 Bitcoin.",
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

    // Combine all questions
    const allDayQuestions = [...daySpecificQuestions, ...additionalDays];
    
    // Add all day-specific questions
    allDayQuestions.forEach(question => {
      const newQuestion: QuizQuestion = { ...question, id: this.currentQuizQuestionId++ };
      this.quizQuestions.set(newQuestion.id, newQuestion);
    });

    // Add the day-specific questions for days 0-2
    daySpecificQuestions.forEach(question => {
      const newQuestion: QuizQuestion = { ...question, id: this.currentQuizQuestionId++ };
      this.quizQuestions.set(newQuestion.id, newQuestion);
    });

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
