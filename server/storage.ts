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
    this.bitcoinPrices = new Map();
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
    this.currentBitcoinPriceId = 1;
    this.currentQuizQuestionId = 1;
    this.currentQuizAnswerId = 1;
    this.currentDeepDiveTopicId = 1;
    this.currentWeeklyTopicId = 1;
    this.currentWeeklyProgressId = 1;

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
        dayIndex: 0
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
        options: [
          "The need for physical storage of value",
          "The coincidence of wants problem in barter systems", 
          "The difficulty of counting large numbers",
          "The problem of transportation costs"
        ],
        correctAnswer: 1,
        explanation: "Money solves the coincidence of wants problem - the difficulty of finding someone who has what you want AND wants what you have at the same time."
      },
      {
        dayIndex: 1,
        question: "Which of these is NOT one of the three main functions of money?",
        options: [
          "Medium of exchange",
          "Store of value", 
          "Unit of account",
          "Source of entertainment"
        ],
        correctAnswer: 3,
        explanation: "The three main functions of money are: medium of exchange, store of value, and unit of account. Entertainment is not a function of money."
      },
      {
        dayIndex: 2,
        question: "What happens when governments create new money faster than economic growth?",
        options: [
          "Economic prosperity increases",
          "Inflation occurs and existing money loses value",
          "Interest rates automatically decrease", 
          "International trade becomes easier"
        ],
        correctAnswer: 1,
        explanation: "When the money supply increases faster than economic growth, inflation occurs and each unit of existing money becomes less valuable."
      },
      {
        dayIndex: 3,
        question: "What is the key characteristic that made gold valuable as money throughout history?",
        options: [
          "Its beautiful appearance",
          "Its use in jewelry",
          "Its natural scarcity and durability",
          "Its religious significance"
        ],
        correctAnswer: 2,
        explanation: "Gold became valuable as money because it is naturally scarce, durable, portable, divisible, and recognizable - key properties of good money."
      },
      {
        dayIndex: 4,
        question: "What does 'trust-minimized' money mean?",
        options: [
          "Money that requires trusting many institutions",
          "Money that works through mathematical rules rather than institutional trust",
          "Money that cannot be trusted at all",
          "Money that requires maximum trust from users"
        ],
        correctAnswer: 1,
        explanation: "Trust-minimized money like Bitcoin relies on mathematical rules and economic incentives rather than trusting specific institutions or authorities."
      },
      {
        dayIndex: 5,
        question: "How does money function as a 'unit of account'?",
        options: [
          "It provides a standard way to measure and compare values",
          "It helps people save for the future",
          "It enables direct exchange without barter", 
          "It prevents inflation from occurring"
        ],
        correctAnswer: 0,
        explanation: "As a unit of account, money provides a standard measurement for comparing the value of different goods and services, like using dollars to price everything."
      },
      {
        dayIndex: 6,
        question: "What is required for any money system to function effectively?",
        options: [
          "Government backing and legal enforcement",
          "Physical form that can be touched",
          "Community agreement and shared trust",
          "Complex mathematical algorithms"
        ],
        correctAnswer: 2,
        explanation: "All money systems, from seashells to gold to digital currencies, require community agreement and shared trust that others will accept the money in exchange."
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

    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "default_user",
      currentStreak: 7,
      longestStreak: 21,
      completedLessons: 1,
      lastActivityDate: new Date().toISOString(),
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
    const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 52 + 1;
    return Array.from(this.weeklyTopics.values()).find(topic => topic.weekNumber === currentWeek);
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