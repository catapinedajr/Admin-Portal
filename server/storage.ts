import { 
  users, 
  dailyFacts, 
  lessons, 
  userProgress, 
  knowledgeAreas,
  type User, 
  type InsertUser, 
  type DailyFact, 
  type InsertDailyFact,
  type Lesson,
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type KnowledgeArea,
  type InsertKnowledgeArea
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dailyFacts: Map<number, DailyFact>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<string, UserProgress>; // key: userId-date
  private knowledgeAreas: Map<number, KnowledgeArea>;
  private currentUserId: number;
  private currentFactId: number;
  private currentLessonId: number;
  private currentProgressId: number;
  private currentKnowledgeAreaId: number;

  constructor() {
    this.users = new Map();
    this.dailyFacts = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.knowledgeAreas = new Map();
    this.currentUserId = 1;
    this.currentFactId = 1;
    this.currentLessonId = 1;
    this.currentProgressId = 1;
    this.currentKnowledgeAreaId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed daily facts - including traditional finance comparisons
    const facts = [
      {
        title: "Bitcoin's Total Supply",
        content: "Bitcoin has a maximum supply of 21 million coins. This fixed supply makes it deflationary, unlike traditional currencies that can be printed indefinitely.",
        category: "BitcoinBasics",
        icon: "coins",
        dayIndex: 0
      },
      {
        title: "Did You Know: Money Printing",
        content: "The Federal Reserve can create new dollars out of thin air through 'quantitative easing.' When they do this, it dilutes the value of dollars you hold, reducing your purchasing power over time.",
        category: "TraditionalFinance",
        icon: "bolt",
        dayIndex: 0
      },
      {
        title: "Block Time",
        content: "A new Bitcoin block is mined approximately every 10 minutes. This consistent timing helps maintain network stability and predictable transaction processing.",
        category: "Mining",
        icon: "cube",
        dayIndex: 0
      },
      {
        title: "Satoshi Nakamoto",
        content: "Bitcoin was created by an anonymous person or group using the pseudonym Satoshi Nakamoto. Their true identity remains unknown to this day.",
        category: "History",
        icon: "user-secret",
        dayIndex: 1
      },
      {
        title: "Did You Know: Banking Hours",
        content: "Traditional banks operate only during business hours and close on weekends and holidays. Bitcoin transactions happen 24/7/365, never stopping for any reason.",
        category: "TraditionalFinance",
        icon: "gem",
        dayIndex: 1
      },
      {
        title: "Blockchain Security",
        content: "Bitcoin's blockchain has never been successfully hacked in its 15+ year history. Its security comes from cryptographic hashing and distributed consensus.",
        category: "Security",
        icon: "shield-alt",
        dayIndex: 1
      },
      {
        title: "Digital Scarcity",
        content: "Bitcoin was the first digital asset to solve the double-spending problem without requiring a trusted third party, creating true digital scarcity.",
        category: "Technology",
        icon: "gem",
        dayIndex: 2
      },
      {
        title: "Did You Know: Currency Debasement",
        content: "Since 1971, when the US left the gold standard, the dollar has lost over 85% of its purchasing power. A cup of coffee that cost 25 cents then costs $5+ today.",
        category: "TraditionalFinance",
        icon: "bolt",
        dayIndex: 2
      },
      {
        title: "Energy Consumption",
        content: "Bitcoin mining uses energy equivalent to a small country, but much of this comes from renewable sources and helps stabilize power grids.",
        category: "Environment",
        icon: "bolt",
        dayIndex: 2
      },
      {
        title: "Did You Know: Bank Bailouts",
        content: "In 2008, taxpayers bailed out major banks with $700+ billion. These same institutions caused the crisis through risky lending. Bitcoin eliminates the need for 'too big to fail' banks.",
        category: "TraditionalFinance",
        icon: "shield-alt",
        dayIndex: 3
      },
      {
        title: "Peer-to-Peer Transactions",
        content: "Bitcoin allows direct transactions between people anywhere in the world without needing banks or payment processors as intermediaries.",
        category: "Technology",
        icon: "user-secret",
        dayIndex: 3
      },
      {
        title: "Halving Events",
        content: "Every 4 years, Bitcoin's mining reward is cut in half, reducing the rate of new Bitcoin creation. This built-in scarcity mechanism is programmed into the code.",
        category: "Economics",
        icon: "coins",
        dayIndex: 3
      },
      {
        title: "Did You Know: Inflation Tax",
        content: "When governments print money, it's essentially a hidden tax on savers. Your cash loses value while prices rise, transferring wealth from regular people to those who receive the new money first.",
        category: "TraditionalFinance",
        icon: "bolt",
        dayIndex: 4
      },
      {
        title: "Global Accessibility",
        content: "Anyone with internet access can use Bitcoin, regardless of their country, credit score, or banking history. No permission required from any authority.",
        category: "Accessibility",
        icon: "gem",
        dayIndex: 4
      },
      {
        title: "Transaction Finality",
        content: "Bitcoin transactions are irreversible once confirmed. No chargebacks, no freezing of funds by banks - true digital cash with final settlement.",
        category: "Technology",
        icon: "shield-alt",
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
}

export const storage = new MemStorage();
