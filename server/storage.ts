import { 
  users, 
  dailyFacts, 
  lessons, 
  userProgress, 
  knowledgeAreas,
  convictionContent,
  treasuryCompanies,
  sovereignAdoption,
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
  type InsertBitcoinPrice
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
  private currentUserId: number;
  private currentFactId: number;
  private currentLessonId: number;
  private currentProgressId: number;
  private currentKnowledgeAreaId: number;
  private currentConvictionContentId: number;
  private currentTreasuryCompanyId: number;
  private currentSovereignAdoptionId: number;
  private currentBitcoinPriceId: number;

  constructor() {
    this.users = new Map();
    this.dailyFacts = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.knowledgeAreas = new Map();
    this.convictionContent = new Map();
    this.treasuryCompanies = new Map();
    this.sovereignAdoptions = new Map();
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

    this.seedData();
  }

  private seedData() {
    // Seed daily facts - structured as: Bitcoin Basics, Use Case, Traditional Finance comparison
    const facts = [
      // Day 0 - Basics, Use Case, Traditional Finance
      {
        title: "Bitcoin's Total Supply",
        content: "Bitcoin has a maximum supply of 21 million coins. This fixed supply makes it deflationary, unlike traditional currencies that can be printed indefinitely.",
        category: "BitcoinBasics",
        icon: "coins",
        dayIndex: 0
      },
      {
        title: "Peer-to-Peer Money",
        content: "Bitcoin allows you to send money directly to anyone, anywhere in the world, without needing a bank or payment processor as an intermediary.",
        category: "UseCase",
        icon: "user-secret",
        dayIndex: 0
      },
      {
        title: "Did You Know: Money Printing",
        content: "The Federal Reserve can create new dollars out of thin air through 'quantitative easing.' When they do this, it dilutes the value of dollars you hold, reducing your purchasing power over time.",
        category: "TraditionalFinance",
        icon: "bolt",
        dayIndex: 0
      },
      
      // Day 1 - Basics, Use Case, Traditional Finance
      {
        title: "Block Time Consistency",
        content: "A new Bitcoin block is mined approximately every 10 minutes. This consistent timing helps maintain network stability and predictable transaction processing.",
        category: "BitcoinBasics",
        icon: "cube",
        dayIndex: 1
      },
      {
        title: "24/7 Global Access",
        content: "Bitcoin transactions happen 24/7/365, never stopping for weekends, holidays, or bank hours. True financial freedom that never sleeps.",
        category: "UseCase",
        icon: "gem",
        dayIndex: 1
      },
      {
        title: "Did You Know: Banking Hours",
        content: "Traditional banks operate only during business hours and close on weekends and holidays. Need to send money on Sunday? You'll have to wait until Monday.",
        category: "TraditionalFinance",
        icon: "building",
        dayIndex: 1
      },
      
      // Day 2 - Basics, Use Case, Traditional Finance
      {
        title: "Blockchain Security",
        content: "Bitcoin's blockchain has never been successfully hacked in its 15+ year history. Its security comes from cryptographic hashing and distributed consensus.",
        category: "BitcoinBasics",
        icon: "shield-alt",
        dayIndex: 2
      },
      {
        title: "Borderless Payments",
        content: "Send Bitcoin to anyone, anywhere in the world, for the same low fee. No currency exchanges, international wire fees, or waiting days for settlement.",
        category: "UseCase",
        icon: "gem",
        dayIndex: 2
      },
      {
        title: "Did You Know: Currency Debasement",
        content: "Since 1971, when the US left the gold standard, the dollar has lost over 85% of its purchasing power. A cup of coffee that cost 25 cents then costs $5+ today.",
        category: "TraditionalFinance",
        icon: "dollar-sign",
        dayIndex: 2
      },
      
      // Day 3 - Basics, Use Case, Traditional Finance
      {
        title: "Digital Scarcity",
        content: "Bitcoin was the first digital asset to solve the double-spending problem without requiring a trusted third party, creating true digital scarcity.",
        category: "BitcoinBasics",
        icon: "gem",
        dayIndex: 3
      },
      {
        title: "Financial Sovereignty",
        content: "With Bitcoin, you truly own your money. No one can freeze your account, reverse your transactions, or tell you how to spend your funds.",
        category: "UseCase",
        icon: "shield-alt",
        dayIndex: 3
      },
      {
        title: "Did You Know: Bank Bailouts",
        content: "In 2008, taxpayers bailed out major banks with $700+ billion. These same institutions caused the crisis through risky lending. Bitcoin eliminates the need for 'too big to fail' banks.",
        category: "TraditionalFinance",
        icon: "alert-triangle",
        dayIndex: 3
      },
      
      // Day 4 - Basics, Use Case, Traditional Finance  
      {
        title: "Halving Events",
        content: "Every 4 years, Bitcoin's mining reward is cut in half, reducing the rate of new Bitcoin creation. This built-in scarcity mechanism is programmed into the code.",
        category: "BitcoinBasics",
        icon: "coins",
        dayIndex: 4
      },
      {
        title: "Store of Value",
        content: "Bitcoin serves as 'digital gold' - a way to preserve purchasing power over time without relying on banks or government monetary policy.",
        category: "UseCase",
        icon: "gem",
        dayIndex: 4
      },
      {
        title: "Did You Know: Inflation Tax",
        content: "When governments print money, it's essentially a hidden tax on savers. Your cash loses value while prices rise, transferring wealth from regular people to those who receive the new money first.",
        category: "TraditionalFinance",
        icon: "bolt",
        dayIndex: 4
      }
    ];

    facts.forEach(fact => {
      const newFact: DailyFact = { ...fact, id: this.currentFactId++ };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Seed lessons
    const lessonContent = `Bitcoin mining is the process by which new bitcoins are entered into circulation and how the Bitcoin network is secured. But what does this actually mean?

## The Mining Process

Think of Bitcoin mining like a global competition. Thousands of computers around the world compete to solve complex mathematical puzzles. The first computer to solve the puzzle gets to add the next "block" of transactions to the blockchain and receives a reward in bitcoin.

## Why Mining Matters

Mining serves two crucial purposes:
- It validates and secures transactions on the network
- It introduces new bitcoins into circulation in a controlled way

**Key Takeaway:** Mining is what makes Bitcoin decentralized and secure. No single authority controls it – it's maintained by a network of miners worldwide.`;

    const lesson: Lesson = {
      id: this.currentLessonId++,
      title: "What is Bitcoin Mining?",
      content: lessonContent,
      summary: "Learn how Bitcoin mining secures the network and creates new bitcoins through a decentralized competition of computers solving mathematical puzzles.",
      estimatedReadTime: 5,
      dayIndex: 0,
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop"
    };
    this.lessons.set(lesson.id, lesson);

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
}

export const storage = new MemStorage();
