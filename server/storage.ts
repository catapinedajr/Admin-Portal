import { users, type User, type InsertUser, dailyFacts, type DailyFact, type InsertDailyFact, lessons, type Lesson, type InsertLesson, userProgress, type UserProgress, type InsertUserProgress, knowledgeAreas, type KnowledgeArea, type InsertKnowledgeArea, convictionContent, type ConvictionContent, type InsertConvictionContent, treasuryCompanies, type TreasuryCompany, type InsertTreasuryCompany, sovereignAdoption, type SovereignAdoption, type InsertSovereignAdoption, bitcoinPrice, type BitcoinPrice, type InsertBitcoinPrice, quizQuestions, type QuizQuestion, type InsertQuizQuestion, userQuizAnswers, type UserQuizAnswer, type InsertUserQuizAnswer, deepDiveTopics, type DeepDiveTopic, type InsertDeepDiveTopic, weeklyTopics, type WeeklyTopic, type InsertWeeklyTopic, userWeeklyProgress, type UserWeeklyProgress, type InsertUserWeeklyProgress } from "@shared/schema";

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
    // Week 1: What Is Money Really? - Facts from Grok curriculum
    const facts = [
      {
        title: "The Barter Struggle",
        content: "Barter systems required a 'double coincidence of wants,' meaning both parties had to want what the other offered. This inefficiency led to the creation of money as a shared medium of exchange.",
        category: "History",
        icon: "coins",
        dayIndex: 1
      },
      {
        title: "Gold's Appeal",
        content: "Gold became money because it's rare, durable, divisible, and hard to counterfeit. Its universal value made it a trusted medium for centuries.",
        category: "History",
        icon: "gem",
        dayIndex: 2
      },
      {
        title: "Coin Innovation", 
        content: "Coins, first minted in Lydia around 600 BCE, standardized trade by guaranteeing weight and purity, making transactions faster and more reliable.",
        category: "History",
        icon: "coins",
        dayIndex: 3
      },
      {
        title: "Paper's Rise",
        content: "Paper money, starting in ancient China, replaced heavy coins with lightweight notes backed by gold or silver, but overprinting led to inflation.",
        category: "History",
        icon: "file-text",
        dayIndex: 4
      },
      {
        title: "Digital Shift",
        content: "Most modern money is digital, existing as data in bank systems, but centralization makes it vulnerable to control and failure.",
        category: "Technology",
        icon: "credit-card",
        dayIndex: 5
      },
      {
        title: "Inflation's Sting",
        content: "Inflation occurs when too much money chases too few goods, reducing money's value. Bitcoin's fixed supply aims to prevent this.",
        category: "Economics",
        icon: "trending-down",
        dayIndex: 6
      },
      {
        title: "Money Evolving",
        content: "Money has evolved from shells to digital, each form solving and creating problems. Bitcoin is the next step, decentralizing trust.",
        category: "Future",
        icon: "zap",
        dayIndex: 7
      }
    ];

    facts.forEach(fact => {
      const newFact: DailyFact = { ...fact, id: this.currentFactId++ };
      this.dailyFacts.set(newFact.id, newFact);
    });

    // Week 1: What Is Money Really? - Foundation lessons from Grok curriculum
    const lessons = [
      {
        title: "The Barter Problem",
        content: `Imagine you're a farmer with a basket of apples, but you need shoes. You visit the cobbler, who wants fish instead. Now what?

In a small village long ago, people traded goods directly. You'd swap apples for bread, or a chicken for a blanket. This was barter, the earliest form of exchange. But it had a big problem: the "double coincidence of wants." You needed to find someone who had what you wanted and wanted what you had. If the cobbler didn't like apples, you were stuck. You might spend days wandering, trading apples for fish, then fish for shoes. It was slow, inefficient, and frustrating.

Picture the village market on trading day. Farmers brought grain, craftsmen carried tools, weavers displayed cloth. Everyone had something valuable, but matching needs was like solving a complex puzzle. The wheat farmer needed pottery, but the potter wanted wool. The weaver had wool but needed grain. Round and round they'd go, creating complicated chains of trade that often fell apart when one person changed their mind.

As communities grew larger, barter became nearly impossible. You couldn't know everyone in a big city, and even if you did, finding the exact person who wanted your goods and had what you needed was like finding a needle in a haystack. Trade slowed, specialization became difficult, and economic growth stagnated. People spent more time arranging trades than actually producing valuable goods.

The solution came gradually as people discovered certain items everyone seemed to want. These might be beautiful shells from distant oceans, rare stones, or useful metals. When everyone accepted these special items, trading became much easier. You could sell your apples for shells, then use those shells to buy shoes. No more complex chains, no more frustrated searching. This was the birth of money—a shared medium of exchange that made commerce possible.

Money fundamentally changed human civilization. It enabled specialization because people could focus on what they did best, knowing they could trade their products for anything they needed. It allowed for the accumulation of wealth and the planning of future transactions. Most importantly, it created trust between strangers because they all agreed on money's value.

Bitcoin takes this ancient story and applies it to the digital age. Just as shells solved the barter problem thousands of years ago, Bitcoin solves the problems of digital trade in our interconnected world. It provides a universal medium of exchange that works across borders, operates without central control, and can't be counterfeited or controlled by any single authority.`,
        summary: "The barter system's inefficiencies led to the creation of money as a shared medium of exchange, with Bitcoin serving as digital money for our modern world.",
        estimatedReadTime: 8,
        dayIndex: 1
      },
      {
        title: "The Value of Trust",
        content: `Picture a merchant in ancient Mesopotamia, holding a clay tablet promising grain. Why does he accept it?

In ancient times, traders used shells, beads, or even promises written on clay as money. But why did anyone accept these things? Trust. The merchant believed the clay tablet could be traded for grain later because the issuer was reliable. Money has always been about shared belief. Gold became popular because it was rare, durable, and hard to fake. People trusted its value across cultures. But gold was heavy, so governments issued paper notes backed by gold. Over time, even the gold backing disappeared, leaving money backed only by trust in governments.

Think about the bustling markets of ancient Babylon. Merchants from distant lands gathered with goods from across the known world. A trader from the north brought furs, another from the south carried spices, and a third offered precious stones. But how could they agree on value? The solution was shared trust in certain objects—perhaps stamped metal discs that everyone recognized as valuable.

This trust wasn't blind faith. It was built on observable qualities. Gold shone with a distinctive luster that was hard to fake. It didn't rust or tarnish like other metals. It could be divided into smaller pieces without losing value. Most importantly, it was scarce enough to remain valuable but not so rare as to be useless for trade. These physical properties created natural trust that transcended language barriers and cultural differences.

As civilizations grew more sophisticated, the burden of carrying heavy gold became problematic. Ingenious bankers and governments began issuing paper certificates that represented claims on gold stored in vaults. These paper notes were lighter and more convenient, but they required a new kind of trust—faith that the issuer would actually have gold when you wanted to redeem your paper. This worked well as long as institutions remained trustworthy.

The modern era brought a dramatic change. In 1971, the United States ended the gold standard, meaning dollars were no longer backed by physical gold. Other countries followed suit. Suddenly, all major currencies were "fiat money"—valuable only because governments said so and people agreed to accept them. This system worked because of institutional trust, but it also created new vulnerabilities. Governments could print money at will, potentially destroying value through inflation.

Bitcoin represents a return to trustless money, but in a revolutionary way. Instead of trusting governments or institutions, Bitcoin users trust mathematics and computer code. The network's rules are written in code that can't be changed without broad consensus. No central authority can print more Bitcoin beyond the predetermined supply limit of 21 million coins. The trust is built into the system itself, not dependent on any human institution or promise.

This shift from institutional trust to mathematical trust is profound. With traditional money, you must trust banks not to freeze your account, governments not to inflate the currency, and payment processors not to block your transactions. With Bitcoin, the code guarantees these protections automatically.`,
        summary: "Money's value has always depended on trust, evolving from gold's physical properties to government promises, and now to Bitcoin's mathematical certainty.",
        estimatedReadTime: 8,
        dayIndex: 2
      },
      {
        title: "The Rise of Coins",
        content: `You're in a bustling ancient market, clutching a shiny metal disc. Why is it special?

Long ago, traders grew tired of weighing shells or grain for every deal. Around 600 BCE, a kingdom called Lydia (modern-day Turkey) created the first coins—small, stamped pieces of gold and silver. These coins were special because they were uniform, stamped with a king's mark, guaranteeing their weight and purity. Suddenly, trading was faster. You didn't need to haggle over how much gold was "enough" for a cow; the coin's stamp said it all. Coins spread across the ancient world, revolutionizing commerce and enabling empires to flourish.

Picture the moment when King Croesus of Lydia first issued standardized coins. Before this innovation, every transaction required careful weighing and testing of precious metals. Merchants carried scales and testing stones to verify that the gold they received was genuine. Disagreements were common, and fraud was rampant. Some unscrupulous traders would mix cheaper metals with gold, making transactions risky and slow.

The genius of coins lay in their standardization. Each coin represented a precise amount of precious metal, verified by the royal mint. The stamp wasn't just decoration—it was a guarantee backed by the king's reputation and power. If someone tried to pass off fake coins, they faced severe punishment. This royal backing created the first truly standardized money, where one coin of a particular type was identical to every other coin of that type.

The innovation spread rapidly across the Mediterranean world. Greek city-states adopted coinage, each developing distinctive designs that became symbols of their power and culture. The owl coins of Athens, bearing the image of Athena, became so trusted that they were accepted far beyond Athens' borders. Roman coins eventually dominated much of the known world, carrying images of emperors and symbols of Roman power to distant lands.

Coins transformed commerce in ways their creators never imagined. Long-distance trade became more practical because traders no longer needed to carry scales and testing equipment. Large transactions became simpler because counting coins was faster than weighing metal. Most importantly, coins enabled the development of more sophisticated economic systems, including banking, credit, and international trade networks.

However, coins weren't perfect. They could be "debased"—mixed with cheaper metals to stretch the supply while maintaining the same appearance. Governments sometimes did this to fund wars or public works, effectively stealing value from coin holders. Coins were also heavy and bulky for large transactions, and they could be lost, stolen, or counterfeited by skilled criminals.

Bitcoin takes the coin concept and perfects it in the digital realm. Like ancient coins, Bitcoin provides standardization—every Bitcoin follows identical rules and has identical properties. Like royal stamps, Bitcoin's cryptographic signatures provide unforgeable proof of authenticity. But unlike physical coins, Bitcoin can't be debased, counterfeited, or physically stolen from someone who properly secures their private keys.

The standardization that made Lydian coins revolutionary is built into Bitcoin's very code, ensuring that this digital money maintains its integrity across a global network without requiring any central authority's guarantee.`,
        summary: "Coins standardized trade by guaranteeing weight and purity through royal stamps, with Bitcoin now providing similar standardization through cryptographic proof.",
        estimatedReadTime: 8,
        dayIndex: 3
      },
      {
        title: "Paper Promises",
        content: `You're a trader in medieval China, handed a lightweight paper note. Is it really money?

In ancient China, carrying heavy copper coins was a hassle. By the 7th century, merchants started leaving coins with trusted warehouses, receiving paper receipts instead. These receipts could be traded like money—light, easy, and convenient. This was the start of paper currency. By the Song Dynasty, the government issued official paper money, backed by gold or silver. Europe followed centuries later, with banks issuing notes redeemable for gold. But governments soon discovered they could print more notes than they had gold to back them, leading to inflation and economic instability.

Imagine a wealthy merchant in Tang Dynasty China preparing for a long journey along the Silk Road. His cargo of silk and spices was valuable, but he also needed to carry payment for goods he would purchase along the way. Hundreds of copper coins would add dangerous weight to his caravan and attract bandits. The solution was ingenious—deposit the coins with a trusted merchant house and receive a paper certificate instead.

These early paper notes worked because of reputation and relationships. The merchant houses that issued them were well-known and had been in business for generations. Their word was their bond, and their survival depended on honoring their paper promises. Traders could carry these lightweight certificates across vast distances, then redeem them for coins at the destination or trade them to others who trusted the issuing house.

The Chinese government eventually recognized the brilliance of this system and began issuing official paper money. These notes were backed by government promises to exchange them for precious metals. The convenience was remarkable—a handful of paper could represent wealth that would otherwise require a cart full of metal. Trade flourished, and the Chinese economy grew more sophisticated as paper money reduced transaction costs and enabled larger, more complex deals.

When European explorers like Marco Polo encountered Chinese paper money, they were amazed. Europe was still struggling with heavy gold and silver coins. It took centuries for Europeans to adopt paper currency, and when they did, it followed the Chinese model—banks and governments issued notes backed by promises to pay gold or silver on demand.

However, paper money created new temptations and problems. Governments discovered they could print more notes than they had metal to back them, especially during wars or economic crises. This fractional backing meant that if everyone tried to redeem their paper for gold at once, there wouldn't be enough gold to go around. Gradually, governments printed more and more unbacked paper, causing inflation as the money supply grew faster than the underlying economy.

The ultimate break came in the 20th century when governments abandoned the gold standard entirely. Paper money became "fiat currency"—valuable only because governments declared it legal tender and people agreed to accept it. While this system provided flexibility for economic policy, it also gave governments unlimited power to create new money, potentially devaluing existing money through inflation.

Bitcoin represents a return to limited, backed money, but in digital form. Unlike paper promises that can be broken, Bitcoin's code provides mathematical certainty about its supply and rules. The "backing" comes not from government promises but from the energy and computational power securing the network.`,
        summary: "Paper money began as convenient receipts for stored coins but evolved into unbacked government promises, while Bitcoin provides mathematical certainty.",
        estimatedReadTime: 8,
        dayIndex: 4
      },
      {
        title: "Digital Dollars",
        content: `You swipe a card to buy coffee. Where's the money, really?

Today, most money isn't coins or paper—it's digital. When you swipe a card, numbers move from your bank account to the coffee shop's. No cash changes hands, just data in a bank's computer. Digital money is convenient but fragile. Banks can freeze accounts, governments can track transactions, and hackers can steal data. In 2008, the financial crisis showed how banks' bad bets could crash the system, eroding trust. Enter Bitcoin: a digital currency not controlled by banks or governments, but by math and code.

Picture your last trip to the grocery store. You probably paid with a credit card, debit card, or mobile app. The cashier scanned your items, you tapped or swiped your card, and within seconds the transaction was complete. But what actually happened? No physical money changed hands. Instead, your bank's computer reduced your account balance by the purchase amount, while the store's bank increased their account by the same amount. The "money" was just information moving between databases.

This digital transformation of money happened gradually, then suddenly. Banks started using computers in the 1960s, credit cards became common in the 1970s and 1980s, and online banking emerged in the 1990s. Today, the vast majority of all money exists only as digital entries in bank databases. Physical cash represents less than 10% of the total money supply in most developed countries.

Digital money brought tremendous convenience. You can pay bills from your phone, send money across the country instantly, and carry the equivalent of thousands of dollars without the bulk and security risks of physical cash. Businesses can process payments faster, track transactions automatically, and reduce the costs associated with handling physical currency.

However, this convenience came with hidden costs and vulnerabilities. Your digital money exists only as long as your bank says it does. Banks can freeze accounts for any reason, governments can order asset seizures, and technical failures can make your money temporarily unavailable. The 2008 financial crisis revealed how interconnected and fragile this system really is—when major banks failed, even insured deposits were at risk.

The digital money system also eliminated financial privacy. Every transaction creates a digital trail that banks, governments, and potentially hackers can monitor. Unlike cash transactions that are private by default, digital payments are tracked and recorded by default. This surveillance capability, while useful for preventing some crimes, also enables unprecedented monitoring of personal financial behavior.

Bitcoin emerged from the 2008 crisis as a response to these problems. It maintains the convenience of digital money while eliminating the need to trust banks or governments. Bitcoin transactions are verified by a global network of computers rather than a central authority. Your Bitcoin is truly yours—no bank can freeze it, no government can seize it without your private keys, and no institution can prevent you from sending it to anyone, anywhere in the world.

The Bitcoin network operates 24/7 without holidays, weekends, or system maintenance windows. Unlike bank systems that can go offline, Bitcoin's distributed nature means the network continues functioning even if thousands of computers disconnect.`,
        summary: "Digital money brought convenience but also centralized control and surveillance, while Bitcoin provides digital benefits without institutional dependency.",
        estimatedReadTime: 8,
        dayIndex: 5
      },
      {
        title: "Money's Flaws",
        content: `You're in Venezuela, where a loaf of bread costs a wheelbarrow of cash. What went wrong?

In 2018, Venezuela's currency collapsed. Hyperinflation hit 1,000,000%, making money worthless. People carried stacks of bills for basic goods. This wasn't new—Germany in the 1920s saw similar chaos. The culprit? Governments printing too much money, diluting its value. Modern money also faces other flaws: banks charge fees, cross-border payments are slow, and billions lack access to financial systems. Bitcoin offers fixes. Its supply is capped at 21 million, preventing inflation. It works globally without banks, and anyone with internet can use it. While Bitcoin has challenges like price volatility, it addresses money's fundamental flaws.

Picture Maria, a teacher in Caracas, Venezuela, in 2018. On Monday, her monthly salary could buy groceries for her family. By Friday, that same salary could barely buy a single meal. This wasn't fiction—this was the reality of hyperinflation. The Venezuelan government, facing economic crisis, decided to print more money to pay its bills. As more money flooded the market, each bolivar became worth less and less.

Hyperinflation isn't unique to Venezuela. Germany experienced it in the 1920s when the government printed money to pay war reparations. Zimbabwe saw it in the 2000s, eventually abandoning its own currency entirely. The pattern is always the same: governments facing financial pressure choose to print money rather than reduce spending or raise taxes, destroying the currency's value in the process.

But hyperinflation is just the most extreme example of modern money's problems. Even in stable countries, central banks routinely create new money, causing gradual inflation that erodes purchasing power over time. What cost $1 in 1970 costs about $7 today—not because goods became more valuable, but because dollars became less valuable as the money supply expanded.

Traditional money systems also exclude billions of people. According to the World Bank, over 1.7 billion adults lack access to basic financial services. They can't open bank accounts, get loans, or safely store their savings. Banks find it unprofitable to serve poor or remote populations, leaving these people economically marginalized. Even those with bank access face high fees for basic services like international transfers, which can cost 10% or more of the amount sent.

Cross-border payments in the traditional system are painfully slow and expensive. Sending money from New York to London might take several days and cost $50 in fees, despite being nothing more than database entries. The money doesn't physically travel—banks simply adjust their ledgers—yet the process involves multiple intermediaries, each taking a fee and adding delay.

Financial surveillance represents another hidden cost of modern money. Every transaction creates a permanent record that governments and corporations can access. While this can help prevent crime, it also eliminates financial privacy and enables unprecedented monitoring of personal behavior. In authoritarian countries, this surveillance capability can be used to suppress dissent or control populations.

Bitcoin addresses each of these flaws systematically. Its supply is mathematically limited to 21 million coins, making money printing impossible. Anyone with internet access can use Bitcoin without permission from banks or governments. International transfers happen directly between users, typically completing within minutes for fees under $1. While Bitcoin transactions are recorded on a public ledger, users can maintain privacy through careful practices, and the system cannot be shut down by any single authority.

Bitcoin isn't perfect—its price can be volatile, and it requires technical knowledge to use safely. But it directly addresses the fundamental flaws that plague traditional money systems.`,
        summary: "Modern money suffers from inflation, exclusion, high fees, and surveillance, while Bitcoin's design directly addresses these fundamental problems.",
        estimatedReadTime: 8,
        dayIndex: 6
      },
      {
        title: "Money's Future",
        content: `You're in 2030, paying for groceries with a phone scan. Is it Bitcoin?

Money has always evolved—from shells to coins, paper to digital. Each step solved old problems but created new ones. Today's digital dollars are fast but centralized, vulnerable to control and failure. Bitcoin proposes a future where money is decentralized, like the internet itself. No single government or bank can shut it down. Its fixed supply could protect against inflation. Imagine a world where anyone, anywhere, can send value instantly, without fees or permissions. This future isn't guaranteed, but Bitcoin offers a glimpse of what money could become in a truly connected world.

Imagine waking up in 2030 and living through a day in this potential future. You check your phone and see your savings have grown overnight, not because of interest payments from a bank, but because you hold a currency that can't be inflated away. Your money is truly yours—no institution can freeze it, no government can seize it, and no company can prevent you from spending it however you choose.

You buy coffee at a local shop by scanning a QR code with your phone. The payment settles instantly, costs virtually nothing in fees, and works the same whether you're paying someone next door or on the other continent. The shop owner receives the payment immediately without waiting days for bank clearance or paying credit card processing fees. Neither of you needed permission from any financial institution to make this transaction.

Throughout history, money has evolved to meet society's changing needs. When barter became too cumbersome, people adopted commodity money like shells and beads. When carrying heavy gold became impractical, coins provided standardization and portability. When coins became too bulky for large transactions, paper money offered convenience. When paper became too slow for modern commerce, digital money provided speed.

Each evolution solved previous problems while introducing new ones. Commodity money eliminated barter's inefficiencies but could be counterfeited. Coins standardized value but could be debased. Paper money eased transport but enabled inflation. Digital money provided speed but centralized control. The pattern suggests that money's evolution isn't finished—we're ready for the next step.

Bitcoin represents a potential future where money is both global and decentralized. Like the internet, which works everywhere without being controlled by any single entity, Bitcoin could provide a universal money system that serves everyone equally. No country's economic policies could devalue your savings, no bank's business decisions could freeze your account, and no company's terms of service could restrict your transactions.

This future would particularly benefit the billions of people currently excluded from traditional finance. A farmer in rural Kenya could receive payment from a customer in Germany as easily as someone in Manhattan pays someone in Brooklyn. Small business owners wouldn't lose 3-5% of revenue to credit card fees. Families sending money to relatives abroad wouldn't pay exorbitant transfer fees to wire services.

However, this future isn't guaranteed. Bitcoin faces challenges including technological scalability, regulatory uncertainty, environmental concerns about energy use, and the complexity of educating users about proper security practices. Traditional financial institutions and governments have powerful incentives to resist change that reduces their control and profit margins.

The ultimate outcome depends on whether Bitcoin can overcome these challenges while maintaining its core properties of decentralization, scarcity, and censorship resistance. If it succeeds, we might look back at today's financial system the way we now view sending letters instead of emails—a quaint relic of a less connected time.`,
        summary: "Money's evolution continues toward a decentralized future where Bitcoin could provide global, instant, permissionless value transfer without institutional control.",
        estimatedReadTime: 8,
        dayIndex: 7
      }
    ];

    lessons.forEach(lesson => {
      const newLesson: Lesson = { ...lesson, id: this.currentLessonId++, imageUrl: null };
      this.lessons.set(newLesson.id, newLesson);
    });

    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "default_user",
      currentStreak: 7,
      longestStreak: 7,
      completedLessons: 7,
      lastActivityDate: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // All the other methods would continue here...
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      currentStreak: 0,
      longestStreak: 0,
      completedLessons: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async getDailyFacts(dayIndex: number): Promise<DailyFact[]> {
    return Array.from(this.dailyFacts.values()).filter(fact => fact.dayIndex === dayIndex);
  }

  async getAllDailyFacts(): Promise<DailyFact[]> {
    return Array.from(this.dailyFacts.values());
  }

  async getLesson(dayIndex: number): Promise<Lesson | undefined> {
    for (const lesson of this.lessons.values()) {
      if (lesson.dayIndex === dayIndex) {
        return lesson;
      }
    }
    return undefined;
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  // Stub implementations for other required methods
  async updateUserStreak(): Promise<void> {}
  async updateUserProgress(): Promise<void> {}
  async createDailyFact(): Promise<DailyFact> { throw new Error("Not implemented"); }
  async createLesson(): Promise<Lesson> { throw new Error("Not implemented"); }
  async getUserProgress(): Promise<UserProgress | undefined> { return undefined; }
  async getUserProgressForWeek(): Promise<UserProgress[]> { return []; }
  async createOrUpdateUserProgress(): Promise<UserProgress> { throw new Error("Not implemented"); }
  async getKnowledgeAreas(): Promise<KnowledgeArea[]> { return []; }
  async updateKnowledgeAreaProgress(): Promise<void> {}
  async getConvictionContent(): Promise<ConvictionContent[]> { return []; }
  async getAllConvictionContent(): Promise<ConvictionContent[]> { return []; }
  async createConvictionContent(): Promise<ConvictionContent> { throw new Error("Not implemented"); }
  async getTreasuryCompanies(): Promise<TreasuryCompany[]> { return []; }
  async getTreasuryCompanyById(): Promise<TreasuryCompany | undefined> { return undefined; }
  async createTreasuryCompany(): Promise<TreasuryCompany> { throw new Error("Not implemented"); }
  async updateTreasuryCompany(): Promise<TreasuryCompany | undefined> { return undefined; }
  async getSovereignAdoptions(): Promise<SovereignAdoption[]> { return []; }
  async getSovereignAdoptionById(): Promise<SovereignAdoption | undefined> { return undefined; }
  async getSovereignAdoptionsByType(): Promise<SovereignAdoption[]> { return []; }
  async createSovereignAdoption(): Promise<SovereignAdoption> { throw new Error("Not implemented"); }
  async updateSovereignAdoption(): Promise<SovereignAdoption | undefined> { return undefined; }
  async getCurrentBitcoinPrice(): Promise<BitcoinPrice | undefined> { return undefined; }
  async getBitcoinPriceHistory(): Promise<BitcoinPrice[]> { return []; }
  async createBitcoinPrice(): Promise<BitcoinPrice> { throw new Error("Not implemented"); }
  async getDailyQuizQuestions(): Promise<QuizQuestion[]> { return []; }
  async getAllQuizQuestions(): Promise<QuizQuestion[]> { return []; }
  async createQuizQuestion(): Promise<QuizQuestion> { throw new Error("Not implemented"); }
  async getUserQuizAnswers(): Promise<UserQuizAnswer[]> { return []; }
  async submitQuizAnswer(): Promise<UserQuizAnswer> { throw new Error("Not implemented"); }
  async getUserQuizScore(): Promise<{ correct: number; total: number; percentage: number }> { return { correct: 0, total: 0, percentage: 0 }; }
  async getDailyDeepDive(): Promise<DeepDiveTopic | undefined> { return undefined; }
  async getAllDeepDiveTopics(): Promise<DeepDiveTopic[]> { return []; }
  async createDeepDiveTopic(): Promise<DeepDiveTopic> { throw new Error("Not implemented"); }
  async getCurrentWeeklyTopic(): Promise<WeeklyTopic | undefined> { return undefined; }
  async getWeeklyTopic(): Promise<WeeklyTopic | undefined> { return undefined; }
  async getAllWeeklyTopics(): Promise<WeeklyTopic[]> { return []; }
  async createWeeklyTopic(): Promise<WeeklyTopic> { throw new Error("Not implemented"); }
  async getUserWeeklyProgress(): Promise<UserWeeklyProgress | undefined> { return undefined; }
  async createOrUpdateWeeklyProgress(): Promise<UserWeeklyProgress> { throw new Error("Not implemented"); }
  async updateWeeklyProgress(): Promise<void> {}
  async completeWeeklyTopic(): Promise<void> {}
}

export const storage = new MemStorage();