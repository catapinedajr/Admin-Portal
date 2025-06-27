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
  type InsertDeepDiveTopic,

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
  private currentDeepDiveTopicId: number;


  constructor() {
    this.users = new Map();
    this.dailyFacts = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.knowledgeAreas = new Map();
    this.convictionContent = new Map();
    this.treasuryCompanies = new Map();
    this.sovereignAdoptions = new Map();
    this.bitcoinPrices = new Map();
    this.quizQuestions = new Map();
    this.userQuizAnswers = new Map();
    this.deepDiveTopics = new Map();

    
    this.currentUserId = 1;
    this.currentFactId = 1;
    this.currentLessonId = 1;
    this.currentProgressId = 1;
    this.currentKnowledgeAreaId = 1;
    this.currentConvictionContentId = 1;
    this.currentTreasuryCompanyId = 1;
    this.currentSovereignAdoptionId = 1;
    this.currentBitcoinPriceId = 1;
    this.currentQuizQuestionId = 1;
    this.currentQuizAnswerId = 1;
    this.currentDeepDiveTopicId = 1;


    this.seedData();
  }

  private seedData() {
    // Week 1: What Is Money Really? - Daily Facts
    const facts = [
      {
        title: "What Is Money?",
        content: "Money is any item or system that a community agrees has value and can be exchanged for goods and services. It's a social technology that solves the problem of trading without perfect coincidence of wants.",
        dayIndex: 0,
        category: "fundamentals",
        icon: "💰"
      },
      {
        title: "Medium of Exchange",
        content: "Money allows people to trade without needing to find someone who wants exactly what they have. Instead of bartering apples for shoes directly, you can sell apples for money, then buy shoes.",
        dayIndex: 1,
        category: "functions",
        icon: "🔄"
      },
      {
        title: "Store of Value",
        content: "Good money preserves purchasing power over time, allowing you to save your work today and use it tomorrow. Poor stores of value lose purchasing power through inflation.",
        dayIndex: 2,
        category: "functions",
        icon: "🏦"
      },
      {
        title: "Inflation",
        content: "When the money supply increases faster than economic growth, each unit of money buys less over time. This is why your grandparents could buy a house for $20,000 that costs $400,000 today.",
        dayIndex: 3,
        category: "problems",
        icon: "📈"
      },
      {
        title: "Central Control",
        content: "Traditional money is controlled by central banks and governments who can print more money, freeze accounts, and control who can participate in the financial system.",
        dayIndex: 4,
        category: "problems",
        icon: "🏛️"
      },
      {
        title: "Unit of Account",
        content: "Money provides a standard way to measure and compare the value of different goods and services, like using dollars to price everything instead of remembering complex barter ratios.",
        dayIndex: 5,
        category: "functions",
        icon: "📊"
      },
      {
        title: "Trust & Agreement",
        content: "All money systems require community agreement and trust to function. From seashells to gold to paper bills, money works because people believe others will accept it.",
        dayIndex: 6,
        category: "fundamentals",
        icon: "🤝"
      }
    ];

    facts.forEach(fact => {
      const newFact: DailyFact = { ...fact, id: this.currentFactId++ };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Week 1: What Is Money Really? - Complete lesson set
    const lessons = [
      {
        title: "What Is Money Really? - Day 1",
        content: `Imagine you're living thousands of years ago, and you've just grown the most beautiful apples anyone has ever seen. Your neighbor has crafted the warmest, most comfortable shoes in the village. You want those shoes, but your neighbor doesn't want apples - they need grain for bread. What do you do?

This simple problem has puzzled humans throughout history and led to one of humanity's greatest inventions: money. Money isn't just pieces of paper or metal coins - it's a solution to the fundamental challenge of how people can trade and cooperate with each other.

At its core, money is anything that people in a community agree has value and can be used to exchange for goods and services. It's a shared belief system that makes complex societies possible. Without money, every trade would require the perfect coincidence of wants - you'd need to find someone who has what you want and wants what you have, at the exact same time.

Money serves three essential functions that make our modern world possible. First, it acts as a medium of exchange, allowing us to break the complex chain of bartering into simple transactions. Instead of trading apples for grain for shoes, you can sell your apples for money, then use that money to buy shoes directly. Second, money serves as a store of value, letting you save your hard work today to benefit from it tomorrow. Finally, money works as a unit of account, giving us a consistent way to measure and compare the value of different things.

The story of money is really the story of human cooperation and trust. Every form of money, from seashells to gold to paper bills, works because a community of people agrees to believe in its value. This shared belief creates the foundation for trade, savings, investment, and the complex economic systems that power our world.

Understanding what money really is helps us appreciate why the invention of Bitcoin represents such a revolutionary moment in human history - it's not just a new type of money, but a completely new way of creating trust and cooperation without needing to rely on any central authority.`,
        summary: "Money solves the fundamental problem of trade by serving as a medium of exchange, store of value, and unit of account based on shared community agreement.",
        estimatedReadTime: 8,
        dayIndex: 0,
        imageUrl: null
      },
      {
        title: "Medium of Exchange - Day 2",
        content: `Picture walking into a busy marketplace hundreds of years ago. A farmer wants to buy cloth from a weaver, but the weaver doesn't need vegetables - she needs pottery. The farmer must first find a potter who wants vegetables, trade for pottery, then find the weaver again. This exhausting process could take hours or even days for a single transaction.

This is exactly why communities around the world independently discovered the need for a medium of exchange. When everyone agrees that a particular item has value and will be accepted by others, that item becomes money. It breaks the complex chain of direct bartering into simple, efficient transactions.

The medium of exchange function is what transforms a community from struggling with complicated barter systems to flowing with efficient trade. Instead of remembering hundreds of exchange rates between different goods, everyone only needs to know the price of items in terms of the agreed-upon money. The farmer sells vegetables for money, then uses that money to buy cloth directly from the weaver.

Throughout history, different communities have used shells, beads, cattle, salt, precious metals, and paper as their medium of exchange. What matters isn't the physical form - what matters is that everyone in the community agrees to accept it in trade. This shared agreement creates a network effect that makes trade exponentially more efficient for everyone involved.

Modern digital payments have taken this concept even further. Whether you're using a credit card, mobile payment app, or bank transfer, you're participating in this same fundamental function that has driven human civilization for thousands of years. The technology changes, but the core purpose remains the same: enabling efficient exchange without the complications of direct barter.

This is why the medium of exchange function is often considered the most important role of money. Without it, complex societies simply cannot exist. It's the foundation that makes all other economic activity possible.`,
        summary: "Money as a medium of exchange eliminates the inefficiencies of barter by providing a commonly accepted item that facilitates all trades.",
        estimatedReadTime: 7,
        dayIndex: 1,
        imageUrl: null
      },
      {
        title: "Store of Value - Day 3", 
        content: `A hardworking blacksmith in ancient times faces a dilemma. He's just completed a major project and earned enough to support his family for months. But how can he preserve this wealth? Fresh food will spoil, tools might rust, and livestock require constant care. He needs something that will hold its value over time - a reliable store of value.

This fundamental need has driven humans to seek out money that can preserve purchasing power across time. Good money allows you to convert your current work into future consumption. It's like a battery for human effort - you charge it up with your labor today and discharge it when you need to buy something tomorrow, next month, or next year.

The store of value function explains why certain materials became money throughout history. Gold and silver emerged as preferred money in many cultures not just because they were scarce and durable, but because they maintained their purchasing power over generations. A Roman gold coin from 2,000 years ago still has significant value today, demonstrating remarkable durability as a store of value.

However, not all money serves this function equally well. When governments create new money faster than economic growth, inflation erodes the store of value function. This is why your grandparents could buy a house for what seems like an impossibly small amount by today's standards - the money they earned and saved lost purchasing power over time.

Understanding this function helps explain many of the financial challenges people face today. When inflation runs higher than wage growth, people working the same jobs find their savings buying less each year. This erosion of purchasing power can trap people in a cycle where they're constantly working harder just to maintain the same standard of living.

The store of value function is crucial for enabling long-term thinking and planning. It allows people to save for major purchases, prepare for emergencies, and build wealth over time. Without reliable store of value, societies tend to focus on immediate consumption rather than long-term investment and growth.`,
        summary: "Money must preserve purchasing power over time, allowing people to save their work today for future consumption and enabling long-term economic planning.",
        estimatedReadTime: 7,
        dayIndex: 2,
        imageUrl: null
      },
      {
        title: "Understanding Inflation - Day 4",
        content: `Your grandmother tells stories of buying candy for a nickel and gasoline for 25 cents per gallon. You might wonder: were things really that cheap, or has something fundamental changed about money? The answer lies in understanding one of the most important economic forces affecting everyone's daily life: inflation.

Inflation occurs when the general price level of goods and services rises over time, which means each unit of money buys less than it did before. It's like a hidden tax that silently erodes the purchasing power of everyone holding that money. What cost one dollar in 1950 would cost over ten dollars today - not because goods became more valuable, but because the dollar became less valuable.

The primary cause of sustained inflation is the expansion of the money supply faster than economic growth. When central banks and governments create new money, they increase the total amount of money chasing the same amount of goods and services. This additional money doesn't create more wealth - it just dilutes the value of existing money, similar to how adding water to a glass of orange juice makes it weaker.

This process affects different people in dramatically different ways. Those who own assets like real estate, stocks, or precious metals often see their wealth increase along with inflation. But people who save in cash or earn fixed wages find their purchasing power steadily decreasing. This creates a wealth gap where asset owners benefit while savers and wage earners struggle.

Inflation also distorts economic decision-making throughout society. When people expect their money to lose value over time, they're incentivized to spend immediately rather than save. This reduces the capital available for productive investment and encourages speculation over long-term thinking. Businesses struggle to plan for the future when they can't predict what their costs or revenues will be worth.

Understanding inflation is crucial for making informed financial decisions. It explains why simply keeping money in a savings account may not preserve wealth over time, and why many people seek alternatives that can maintain purchasing power despite monetary expansion.`,
        summary: "Inflation erodes money's purchasing power when new money is created faster than economic growth, affecting savers and wage earners most severely.",
        estimatedReadTime: 8,
        dayIndex: 3,
        imageUrl: null
      },
      {
        title: "Central Control of Money - Day 5",
        content: `Every paper bill in your wallet carries a promise from a central authority - typically a government or central bank. This promise represents one of the most significant changes in monetary history: the shift from naturally scarce money like gold to artificially controlled money managed by institutions.

For most of human history, money emerged naturally from market processes. Communities gravitated toward materials that were scarce, durable, and divisible. No central authority needed to declare that gold or silver was money - people chose these materials because they possessed the best monetary properties available. The supply of these natural moneys was constrained by physical reality, not human decisions.

Modern fiat currency systems represent a fundamental departure from this natural selection process. Instead of money being chosen by market participants, it's imposed by legal tender laws that require citizens to accept government-issued currency. The supply of this money is no longer constrained by natural scarcity but by the discretion of central bankers and politicians.

This centralized control creates new possibilities and new risks. Central banks can respond to economic crises by creating money quickly, potentially preventing deflationary spirals. However, this same power can be used to finance government spending through monetary expansion, effectively taxing all money holders through inflation without their explicit consent.

The concentration of monetary control also creates single points of failure in the financial system. When central authorities make mistakes in monetary policy, the effects ripple through the entire economy. Historical examples include hyperinflation in Germany during the 1920s, Zimbabwe in the 2000s, and Venezuela more recently - all cases where central mismanagement destroyed the store of value function of money.

Perhaps most significantly, centralized money systems can exclude people from participation. Banks can freeze accounts, governments can impose capital controls, and individuals can be cut off from the financial system entirely. This power over money becomes power over people's ability to trade, save, and participate in economic life.

Understanding central control helps explain why some people seek alternatives that operate independently of centralized institutions.`,
        summary: "Modern money is controlled by central authorities rather than emerging naturally, creating both capabilities and risks from concentrated monetary power.",
        estimatedReadTime: 8,
        dayIndex: 4,
        imageUrl: null
      },
      {
        title: "Unit of Account - Day 6",
        content: `Imagine trying to run a business in a world without a common unit of account. You'd need to remember that one chicken equals three loaves of bread, two loaves equal one pair of shoes, five pairs of shoes equal one goat, and so on. The mental complexity would be overwhelming, and comparing the value of different goods would require elaborate calculations.

This is exactly the problem that money solves in its role as a unit of account. By providing a single standard of measurement for value, money dramatically simplifies economic calculation and comparison. Just as we use meters to measure distance and kilograms to measure weight, we use monetary units to measure and compare economic value.

The unit of account function enables sophisticated economic coordination that would be impossible otherwise. Businesses can calculate profits and losses, compare the efficiency of different investments, and make rational decisions about resource allocation. Consumers can easily compare prices across different products and vendors to make informed purchasing decisions.

This function becomes particularly important in complex economies with thousands of different goods and services. Without a common unit of account, price discovery would be incredibly difficult. Instead of needing to know millions of possible exchange rates between different items, everyone only needs to know each item's price in terms of the common monetary unit.

The unit of account function also enables long-term contracts and planning. Employment agreements, loan contracts, insurance policies, and business partnerships all rely on the ability to specify future payments in terms of a stable unit of account. This predictability enables people to make commitments and plans extending far into the future.

However, when money fails as a unit of account due to rapid inflation or instability, economic calculation becomes distorted. Businesses struggle to distinguish between real profits and monetary illusions. Long-term contracts become nearly impossible to negotiate fairly. The entire process of economic coordination breaks down.

A reliable unit of account is essential for any advanced economy. It provides the measurement standard that makes complex economic calculation possible and enables the sophisticated coordination required for modern civilization.`,
        summary: "Money provides a standard measurement for comparing values, enabling economic calculation, price discovery, and long-term planning in complex economies.",
        estimatedReadTime: 7,
        dayIndex: 5,
        imageUrl: null
      },
      {
        title: "Trust and Agreement - Day 7",
        content: `At the heart of every monetary system lies a remarkable social phenomenon: collective belief. Whether we're talking about ancient shells, medieval gold coins, or modern digital payments, money only works because a community of people agrees to trust and accept it. This shared trust is perhaps the most fascinating aspect of how money functions in human society.

Consider how extraordinary this really is. You accept pieces of paper with pictures and numbers printed on them in exchange for real goods and services - not because the paper has inherent value, but because you trust that others will also accept these pieces of paper. This creates a network effect where the value of money increases as more people use and accept it.

This trust can be based on different foundations. Sometimes it's backed by the intrinsic value of the monetary material itself, like gold or silver. Sometimes it's backed by the promise of a government or institution to redeem the money for something of value. And sometimes it's backed purely by the collective agreement that the money has value, with no other backing required.

The fragility of this trust becomes apparent during monetary crises. When people lose confidence in a particular form of money, its value can collapse rapidly despite having worked perfectly well for years or even decades. Historical examples include the collapse of various paper currencies, bank runs when people lose faith in financial institutions, and hyperinflation when trust in government monetary management evaporates.

Building and maintaining monetary trust requires consistent behavior over time. Money that maintains stable purchasing power, remains widely accepted, and operates according to predictable rules tends to strengthen trust. Money that experiences wild volatility, faces acceptance issues, or operates under constantly changing rules tends to weaken trust.

The digital age has introduced new dimensions to monetary trust. Instead of trusting institutions alone, some new forms of money ask us to trust mathematical algorithms and decentralized networks. This represents a different approach to solving the trust problem - one based on transparency and mathematical verification rather than institutional promises.

Understanding the role of trust in money helps explain why monetary transitions can be so slow and difficult, and why established money systems tend to persist even when superior alternatives exist.`,
        summary: "All money systems depend on collective trust and agreement within communities, creating network effects but also vulnerabilities when confidence is lost.",
        estimatedReadTime: 8,
        dayIndex: 6,
        imageUrl: null
      }
    ];

    lessons.forEach(lesson => {
      const newLesson: Lesson = { ...lesson, id: this.currentLessonId++ };
      this.lessons.set(newLesson.id, newLesson);
    });

    // Knowledge areas for Week 1: What Is Money Really?
    const knowledgeAreas = [
      {
        id: 1,
        title: "Money Fundamentals",
        description: "Understanding the basic concept and functions of money",
        completedLessons: 1,
        totalLessons: 7,
        category: "Foundation"
      }
    ];

    knowledgeAreas.forEach(area => {
      const newArea: KnowledgeArea = { ...area, id: this.currentKnowledgeAreaId++ };
      this.knowledgeAreas.set(newArea.id, newArea);
    });

    // Week 1: What Is Money Really? - Quiz Questions
    const quizQuestions = [
      {
        dayIndex: 0,
        question: "What is the fundamental problem that money solves?",
        optionA: "The need for physical storage of value",
        optionB: "The coincidence of wants problem in barter systems",
        optionC: "The difficulty of counting large numbers",
        optionD: "The problem of transportation costs",
        correctAnswer: "B",
        explanation: "Money solves the coincidence of wants problem - the difficulty of finding someone who has what you want AND wants what you have at the same time.",
        category: "fundamentals",
        difficulty: "beginner"
      },
      {
        dayIndex: 1,
        question: "Which of these is NOT one of the three main functions of money?",
        optionA: "Medium of exchange",
        optionB: "Store of value",
        optionC: "Unit of account", 
        optionD: "Source of entertainment",
        correctAnswer: "D",
        explanation: "The three main functions of money are: medium of exchange, store of value, and unit of account. Entertainment is not a function of money.",
        category: "functions",
        difficulty: "beginner"
      },
      {
        dayIndex: 2,
        question: "What happens when governments create new money faster than economic growth?",
        optionA: "Economic prosperity increases",
        optionB: "Inflation occurs and existing money loses value",
        optionC: "Interest rates automatically decrease",
        optionD: "International trade becomes easier",
        correctAnswer: "B",
        explanation: "When the money supply increases faster than economic growth, inflation occurs and each unit of existing money becomes less valuable.",
        category: "problems",
        difficulty: "beginner"
      },
      {
        dayIndex: 3,
        question: "What is the key characteristic that made gold valuable as money throughout history?",
        optionA: "Its beautiful appearance",
        optionB: "Its use in jewelry",
        optionC: "Its natural scarcity and durability",
        optionD: "Its religious significance",
        correctAnswer: "C",
        explanation: "Gold became valuable as money because it is naturally scarce, durable, portable, divisible, and recognizable - key properties of good money.",
        category: "history",
        difficulty: "beginner"
      },
      {
        dayIndex: 4,
        question: "What does 'trust-minimized' money mean?",
        optionA: "Money that requires trusting many institutions",
        optionB: "Money that works through mathematical rules rather than institutional trust",
        optionC: "Money that cannot be trusted at all",
        optionD: "Money that requires maximum trust from users",
        correctAnswer: "B",
        explanation: "Trust-minimized money like Bitcoin relies on mathematical rules and economic incentives rather than trusting specific institutions or authorities.",
        category: "concepts",
        difficulty: "intermediate"
      },
      {
        dayIndex: 5,
        question: "How does money function as a 'unit of account'?",
        optionA: "It provides a standard way to measure and compare values",
        optionB: "It helps people save for the future",
        optionC: "It enables direct exchange without barter",
        optionD: "It prevents inflation from occurring",
        correctAnswer: "A",
        explanation: "As a unit of account, money provides a standard measurement for comparing the value of different goods and services, like using dollars to price everything.",
        category: "functions",
        difficulty: "beginner"
      },
      {
        dayIndex: 6,
        question: "What is required for any money system to function effectively?",
        optionA: "Government backing and legal enforcement",
        optionB: "Physical form that can be touched",
        optionC: "Community agreement and shared trust",
        optionD: "Complex mathematical algorithms",
        correctAnswer: "C",
        explanation: "All money systems, from seashells to gold to digital currencies, require community agreement and shared trust that others will accept the money in exchange.",
        category: "fundamentals",
        difficulty: "beginner"
      }
    ];

    quizQuestions.forEach(question => {
      const newQuestion: QuizQuestion = { 
        ...question, 
        id: this.currentQuizQuestionId++,
        createdAt: new Date()
      };
      this.quizQuestions.set(newQuestion.id, newQuestion);
    });

    // Week 1: What Is Money Really? - Weekly Topic
    const weeklyTopic = {
      weekNumber: 1,
      title: "What Is Money Really?",
      description: "Understanding the fundamental nature, functions, and evolution of money in human society",
      content: {
        introduction: "This week we explore the foundational concepts of money through stories and examples that reveal what money really is and why it matters in our daily lives.",
        sections: [
          {
            title: "The Great Barter Experiment",
            content: "Imagine you're living in a small mountain village where money doesn't exist. You're a talented baker who makes the most delicious bread for miles around. Your neighbor Sarah grows beautiful apples, while Tom down the road is the village's only shoemaker. Life seems simple enough until you realize you need new shoes.\n\nYou approach Tom with a loaf of your finest bread, hoping to trade for a pair of sturdy boots. But Tom shakes his head - he's on a strict diet and has no interest in bread. What he really wants are Sarah's crisp apples. So you trek over to Sarah's orchard, bread in hand, ready to trade bread for apples so you can then trade apples for shoes.\n\nBut Sarah presents another problem. She loves your bread, but she's already got more than she can eat. What she desperately needs is a new hammer from the blacksmith. Now you're stuck in a chain: you need to find someone who wants bread AND has a hammer, trade bread for hammer, trade hammer to Sarah for apples, then finally trade apples to Tom for shoes.\n\nThis exhausting dance happens every time anyone wants to trade anything. The blacksmith wants vegetables from the farmer, but the farmer wants cloth from the weaver, who wants bread from you. Everyone spends more time negotiating trades than actually producing goods. This is the coincidence of wants problem, and it's exactly why human communities invented money.\n\nMoney breaks these chains. Instead of needing perfect matches, you can sell your bread to anyone for money, then use that money to buy shoes from Tom, regardless of what Tom wants. It's like having a universal translator for economic desires."
          },
          {
            title: "Money's Three Superpowers",
            content: "Let's follow Maria, a talented carpenter who's about to discover why money is so much more than just coins and bills. Maria lives in a world where money exists, but she's never really thought about what makes it so powerful.\n\nFirst, Maria discovers money's role as a **medium of exchange**. Every morning, she stops by the local café and trades a few dollars for coffee. The café owner doesn't need furniture, but he accepts Maria's money because he knows he can use it to buy supplies from anyone else. This seems simple until Maria visits her cousin in a remote village where they still barter. There, getting coffee requires finding someone who wants furniture AND sells coffee. When that fails, she has to find complex chains of people willing to trade. A simple coffee becomes a day-long negotiation. Money eliminates this hassle by creating a universal language for trade.\n\nNext, Maria learns about money as a **store of value** when she decides to save for a new workshop. Instead of stockpiling lumber that might rot or tools that might rust, she saves money. Money allows her to store today's work for future use. She can spend weeks building cabinets now, save the payment, and use that stored value to buy materials months later when she's ready to expand. It's like having a time machine for her economic effort.\n\nBut the carpenter faces a problem when she tries to bid on a large commercial project. How much should she charge for building 50 custom desks? This is where money's third function becomes crucial: **unit of account**. Money gives Maria a measuring stick for value. She can calculate her material costs, labor time, and desired profit all in the same units. The client can compare her bid to other contractors using the same measuring system. Imagine if Maria quoted in terms of chickens, her competitor in terms of wheat, and a third contractor in terms of hours of blacksmith work. Decision-making would be impossible.\n\nMaria discovers that when any of these functions break down, economic life becomes chaos. During a local currency crisis, people lost confidence in money as a medium of exchange and reverted to inefficient barter. When inflation soared, money failed as a store of value, and everyone rushed to spend immediately rather than save. When exchange rates fluctuated wildly, money became useless as a unit of account, making long-term contracts nearly impossible to price fairly."
          },
          {
            title: "The Trust Game That Never Ends",
            content: "Meet David, who runs a small bookstore in a college town. Every day, he participates in an invisible game of trust that makes our entire economy possible, though he's never thought about it this way.\n\nWhen a student pays for a textbook with a $20 bill, David accepts it without question. But why? That piece of paper has no intrinsic value - it's not edible, can't shelter him from rain, and makes terrible clothing. David accepts it because he trusts that tomorrow, the coffee shop will accept it from him. The coffee shop owner accepts it because she trusts the baker will take it. This creates an endless circle of trust that powers our economic life.\n\nThis trust creates what economists call network effects, though David experiences it more simply. When he first opened his bookstore, he considered accepting Bitcoin as payment. But only a handful of customers had ever heard of it, and even fewer used it regularly. The pizza place next door didn't accept Bitcoin, nor did his landlord or suppliers. So David stuck with dollars - not because they're superior money, but because everyone else in his network already used them. Money becomes more useful as more people use it, creating a snowball effect that makes dominant moneys even more dominant.\n\nBut David also learned how fragile this trust can be. During a visit to his grandfather in Venezuela, he watched the local currency collapse in real time. People who had accepted bolívars their entire lives suddenly refused them, preferring to trade directly for goods or seek alternative currencies. His grandfather's lifetime of savings, stored in bolívar-denominated bank accounts, became nearly worthless within months. The trust that makes money work can evaporate surprisingly quickly when people lose confidence in the system.\n\nThis taught David that money's power comes not from government decree or gold backing, but from the collective belief of a community. When that belief weakens, even the most established currencies can fail. It also explains why new forms of money often emerge during crises - when people lose faith in existing systems, they become willing to experiment with alternatives that promise better properties or greater reliability."
          },
          {
            title: "The Modern Money Dilemma",
            content: "Sarah is a financial advisor who's been helping families plan for retirement for over 20 years. Recently, she's been having conversations that would have seemed impossible when she started her career. Clients are asking questions that reveal deep concerns about the very nature of money itself.\n\nLast week, a young couple came to her office worried about inflation eating away at their savings. They had diligently saved $50,000 over five years, only to watch their purchasing power steadily decline as prices rose faster than their bank account interest. 'Why does money lose value just by sitting there?' they asked. Sarah had to explain that modern currency systems are designed to inflate - central banks actually target 2-3% inflation annually, meaning their money is supposed to lose value over time.\n\nThis is completely backwards from historical money, Sarah realized. For most of human history, good money maintained or increased its purchasing power. But today's fiat currencies work differently. The government can create new money whenever it wants, whether to fund spending, stimulate the economy, or respond to crises. Every new dollar created makes existing dollars slightly less valuable.\n\nSarah's older clients remember when things worked differently. Her client Robert, now 75, often talks about his first job in 1965 when gasoline cost 30 cents per gallon and a new car was $2,000. He saved money in a simple savings account and watched his purchasing power grow over time. 'Money used to reward savers,' he tells Sarah. 'Now it punishes them.'\n\nThe situation has created a strange world where Sarah must advise clients to avoid holding too much cash - the very thing most people think of as 'safe' money. Instead, she guides them toward stocks, real estate, and other assets that might maintain value as currency depreciates. This works for wealthy clients who can navigate complex investments, but creates huge disadvantages for people who need to save in simple, liquid forms.\n\nSarah has also watched technology begin to challenge traditional banking in ways that seemed impossible just a decade ago. Clients send money internationally using apps that bypass traditional wire transfers. Some experiment with digital currencies that operate without government control. Others ask about 'programmable money' that can automatically execute complex financial agreements.\n\nThese innovations highlight how much our current system relies on intermediaries - banks, payment processors, clearinghouses - that add costs, delays, and potential points of failure. Sarah wonders whether we're witnessing the early stages of a transformation as significant as the move from gold to paper money, or from barter to coin-based systems.\n\nWhat concerns Sarah most is the growing disconnect between money's intended functions and how it actually works. Money is supposed to be a reliable store of value, but her clients' savings lose purchasing power every year. It's meant to be a stable unit of account, but prices denominated in dollars fluctuate unpredictably. These problems aren't bugs in the system - they're features of how modern monetary policy operates.\n\nThroughout history, when existing money failed to serve people's needs, communities found alternatives. Sarah suspects we may be living through another such transition, where new forms of money emerge to address the shortcomings of current systems. The question isn't whether change will come, but what form it will take and how quickly people will adapt."
          }
        ]
      },
      category: "Foundation",
      difficulty: "Beginner",
      estimatedReadTime: 25,
      keyTakeaways: [
        "Money solves the coincidence of wants problem that makes barter inefficient",
        "The three functions of money enable complex economic coordination",
        "Trust and community agreement are essential for any money system",
        "Inflation erodes money's store of value function over time",
        "Central control creates both capabilities and risks in monetary systems"
      ],
      relatedDayIndex: 0,
      practicalApplications: [
        "Understanding why your savings might lose purchasing power over time",
        "Recognizing how inflation affects different groups differently",
        "Appreciating the role of trust in financial systems",
        "Making informed decisions about storing value long-term"
      ],
      furtherReading: [
        {
          title: "The Denationalization of Money",
          author: "F.A. Hayek",
          difficulty: "Advanced",
          description: "Classic work on competing currencies and monetary theory"
        },
        {
          title: "What Has Government Done to Our Money?",
          author: "Murray Rothbard", 
          difficulty: "Intermediate",
          description: "Analysis of government intervention in monetary systems"
        }
      ],
      quizQuestions: [
        {
          question: "What are the three main functions of money?",
          options: ["Medium of exchange, store of value, unit of account", "Saving, spending, investing", "Buying, selling, trading", "Past, present, future"],
          correctAnswer: 0,
          explanation: "Money serves three essential functions: medium of exchange (facilitating trade), store of value (preserving wealth over time), and unit of account (measuring value)."
        }
      ]
    };

    const newWeeklyTopic: WeeklyTopic = {
      ...weeklyTopic,
      id: this.currentWeeklyTopicId++,
      createdAt: new Date()
    };
    this.weeklyTopics.set(newWeeklyTopic.id, newWeeklyTopic);

    // Create default user starting fresh at Day 1
    const defaultUser: User = {
      id: 1,
      username: "default_user",
      currentStreak: 0,
      longestStreak: 0,
      completedLessons: 0, // Reset to Day 1 
      lastActivityDate: null,
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
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

  // Daily facts methods
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

  // Lessons methods
  async getLesson(dayIndex: number): Promise<Lesson | undefined> {
    return Array.from(this.lessons.values()).find(lesson => lesson.dayIndex === dayIndex);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.currentLessonId++
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  // Knowledge areas methods
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

  // Stub implementations for remaining methods
  async getUserProgress(userId: number, date: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${date}`);
  }

  async getUserProgressForWeek(userId: number, startDate: string): Promise<UserProgress[]> {
    return [];
  }

  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const key = `${insertProgress.userId}-${insertProgress.date}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        ...insertProgress
      };
      this.userProgress.set(key, updated);
      return updated;
    }
    
    const progress: UserProgress = {
      ...insertProgress,
      id: this.currentProgressId++,
      createdAt: new Date()
    };
    this.userProgress.set(key, progress);
    return progress;
  }

  async getConvictionContent(dayIndex: number): Promise<ConvictionContent[]> {
    return [];
  }

  async getAllConvictionContent(): Promise<ConvictionContent[]> {
    return [];
  }

  async createConvictionContent(insertContent: InsertConvictionContent): Promise<ConvictionContent> {
    const content: ConvictionContent = {
      ...insertContent,
      id: this.currentConvictionContentId++,
      createdAt: new Date()
    };
    this.convictionContent.set(content.id, content);
    return content;
  }

  async getTreasuryCompanies(): Promise<TreasuryCompany[]> {
    return [];
  }

  async getTreasuryCompanyById(id: number): Promise<TreasuryCompany | undefined> {
    return this.treasuryCompanies.get(id);
  }

  async createTreasuryCompany(insertCompany: InsertTreasuryCompany): Promise<TreasuryCompany> {
    const company: TreasuryCompany = {
      ...insertCompany,
      id: this.currentTreasuryCompanyId++,
      createdAt: new Date()
    };
    this.treasuryCompanies.set(company.id, company);
    return company;
  }

  async updateTreasuryCompany(id: number, updates: Partial<InsertTreasuryCompany>): Promise<TreasuryCompany | undefined> {
    const company = this.treasuryCompanies.get(id);
    if (company) {
      const updated: TreasuryCompany = {
        ...company,
        ...updates
      };
      this.treasuryCompanies.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getSovereignAdoptions(): Promise<SovereignAdoption[]> {
    return [];
  }

  async getSovereignAdoptionById(id: number): Promise<SovereignAdoption | undefined> {
    return this.sovereignAdoptions.get(id);
  }

  async getSovereignAdoptionsByType(adoptionType: string): Promise<SovereignAdoption[]> {
    return Array.from(this.sovereignAdoptions.values()).filter(adoption => adoption.adoptionType === adoptionType);
  }

  async createSovereignAdoption(insertAdoption: InsertSovereignAdoption): Promise<SovereignAdoption> {
    const adoption: SovereignAdoption = {
      ...insertAdoption,
      id: this.currentSovereignAdoptionId++,
      createdAt: new Date()
    };
    this.sovereignAdoptions.set(adoption.id, adoption);
    return adoption;
  }

  async updateSovereignAdoption(id: number, updates: Partial<InsertSovereignAdoption>): Promise<SovereignAdoption | undefined> {
    const adoption = this.sovereignAdoptions.get(id);
    if (adoption) {
      const updated: SovereignAdoption = {
        ...adoption,
        ...updates
      };
      this.sovereignAdoptions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getCurrentBitcoinPrice(): Promise<BitcoinPrice | undefined> {
    const prices = Array.from(this.bitcoinPrices.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return prices[0];
  }

  async getBitcoinPriceHistory(hours: number): Promise<BitcoinPrice[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.bitcoinPrices.values()).filter(price => price.timestamp >= cutoff);
  }

  async createBitcoinPrice(insertPrice: InsertBitcoinPrice): Promise<BitcoinPrice> {
    const price: BitcoinPrice = {
      ...insertPrice,
      id: this.currentBitcoinPriceId++,
      createdAt: new Date()
    };
    this.bitcoinPrices.set(price.id, price);
    return price;
  }

  async getDailyQuizQuestions(dayIndex: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(q => q.dayIndex === dayIndex);
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const question: QuizQuestion = {
      ...insertQuestion,
      id: this.currentQuizQuestionId++,
      createdAt: new Date()
    };
    this.quizQuestions.set(question.id, question);
    return question;
  }

  async getUserQuizAnswers(userId: number, date: string): Promise<UserQuizAnswer[]> {
    return Array.from(this.userQuizAnswers.values()).filter(answer => 
      answer.userId === userId && answer.date === date
    );
  }

  async submitQuizAnswer(insertAnswer: InsertUserQuizAnswer): Promise<UserQuizAnswer> {
    const key = `${insertAnswer.userId}-${insertAnswer.questionId}-${insertAnswer.date}`;
    const answer: UserQuizAnswer = {
      ...insertAnswer,
      id: this.currentQuizAnswerId++,
      createdAt: new Date()
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

  async getDailyDeepDive(dayIndex: number): Promise<DeepDiveTopic | undefined> {
    return Array.from(this.deepDiveTopics.values()).find(topic => topic.dayIndex === dayIndex);
  }

  async getAllDeepDiveTopics(): Promise<DeepDiveTopic[]> {
    return Array.from(this.deepDiveTopics.values());
  }

  async createDeepDiveTopic(insertTopic: InsertDeepDiveTopic): Promise<DeepDiveTopic> {
    const topic: DeepDiveTopic = {
      ...insertTopic,
      id: this.currentDeepDiveTopicId++,
      createdAt: new Date()
    };
    this.deepDiveTopics.set(topic.id, topic);
    return topic;
  }

  async getCurrentWeeklyTopic(): Promise<WeeklyTopic | undefined> {
    // For Week 1 curriculum, always return Week 1 content
    return Array.from(this.weeklyTopics.values()).find(topic => topic.weekNumber === 1);
  }

  async getWeeklyTopic(weekNumber: number): Promise<WeeklyTopic | undefined> {
    return Array.from(this.weeklyTopics.values()).find(topic => topic.weekNumber === weekNumber);
  }

  async getAllWeeklyTopics(): Promise<WeeklyTopic[]> {
    return Array.from(this.weeklyTopics.values());
  }

  async createWeeklyTopic(insertTopic: InsertWeeklyTopic): Promise<WeeklyTopic> {
    const topic: WeeklyTopic = {
      ...insertTopic,
      id: this.currentWeeklyTopicId++,
      createdAt: new Date()
    };
    this.weeklyTopics.set(topic.id, topic);
    return topic;
  }

  async getUserWeeklyProgress(userId: number, weekNumber: number): Promise<UserWeeklyProgress | undefined> {
    const key = `${userId}-${weekNumber}`;
    return this.userWeeklyProgress.get(key);
  }

  async createOrUpdateWeeklyProgress(insertProgress: InsertUserWeeklyProgress): Promise<UserWeeklyProgress> {
    const key = `${insertProgress.userId}-${insertProgress.weekNumber}`;
    const existing = this.userWeeklyProgress.get(key);
    
    if (existing) {
      const updated: UserWeeklyProgress = {
        ...existing,
        ...insertProgress
      };
      this.userWeeklyProgress.set(key, updated);
      return updated;
    }
    
    const progress: UserWeeklyProgress = {
      ...insertProgress,
      id: this.currentWeeklyProgressId++,
      createdAt: new Date()
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
      progress.isCompleted = true;
      progress.progressPercentage = 100;
      this.userWeeklyProgress.set(key, progress);
    }
  }
}

export const storage = new MemStorage();