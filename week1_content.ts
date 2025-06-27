// Week 1: "What Is Money Really?" - Complete Content Structure

// Daily Facts for Week 1
const week1Facts = [
  // Day 1: What is Money?
  {
    title: "What Is Money?",
    content: "Money is anything that people agree has value and can be used to trade for goods and services.",
    category: "Money Basics",
    icon: "coins",
    dayIndex: 1
  },
  {
    title: "Medium of Exchange",
    content: "Money allows us to trade without bartering. Instead of trading chickens for shoes, we use money as an in-between step.",
    category: "Money Functions",
    icon: "refresh-cw",
    dayIndex: 1
  },
  {
    title: "Store of Value", 
    content: "Good money keeps its value over time. You should be able to save money today and buy similar things with it years later.",
    category: "Money Functions",
    icon: "piggy-bank",
    dayIndex: 1
  },

  // Day 2: Functions of Money
  {
    title: "Unit of Account",
    content: "Money gives us a way to measure and compare the value of different things. It's like a ruler for value.",
    category: "Money Functions",
    icon: "calculator",
    dayIndex: 2
  },
  {
    title: "Divisibility",
    content: "Good money can be divided into smaller pieces. You need to make change, so money must come in different denominations.",
    category: "Money Properties",
    icon: "scissors",
    dayIndex: 2
  },
  {
    title: "Portability",
    content: "Money needs to be easy to carry and transport. Heavy stones might be valuable, but they make terrible money for daily use.",
    category: "Money Properties",
    icon: "truck",
    dayIndex: 2
  },

  // Day 3: History of Money
  {
    title: "Barter Systems",
    content: "Before money, people traded goods directly. But this required both people to want what the other had - a rare coincidence.",
    category: "Money History",
    icon: "handshake",
    dayIndex: 3
  },
  {
    title: "Commodity Money",
    content: "Humans discovered that certain items like shells, beads, and metals worked well as money because they were scarce and durable.",
    category: "Money History",
    icon: "gem",
    dayIndex: 3
  },
  {
    title: "Gold Standard",
    content: "For thousands of years, gold was the best money because it was scarce, durable, and couldn't be created easily.",
    category: "Money History",
    icon: "star",
    dayIndex: 3
  },

  // Day 4: Problems with Traditional Money
  {
    title: "Inflation",
    content: "When governments print more money, each dollar becomes worth less. This is why things cost more over time - your money loses value.",
    category: "Money Problems",
    icon: "trending-down",
    dayIndex: 4
  },
  {
    title: "Central Control",
    content: "Traditional money is controlled by governments and banks. They can print more, freeze accounts, or stop transactions at will.",
    category: "Money Problems",
    icon: "building-2",
    dayIndex: 4
  },
  {
    title: "Counterfeiting",
    content: "Physical money can be copied or faked. Throughout history, people have tried to create fake coins and bills to steal value.",
    category: "Money Problems",
    icon: "alert-triangle",
    dayIndex: 4
  },

  // Day 5: Digital Money Emergence  
  {
    title: "Digital Payments",
    content: "As the internet grew, we needed digital ways to send money. But early attempts all required banks or companies to be in the middle.",
    category: "Digital Evolution",
    icon: "smartphone",
    dayIndex: 5
  },
  {
    title: "Double Spending Problem",
    content: "Digital files can be copied perfectly. How do you stop someone from copying digital money and spending it twice?",
    category: "Digital Challenges",
    icon: "copy",
    dayIndex: 5
  },
  {
    title: "Need for Digital Cash",
    content: "The internet needed a form of money that worked like physical cash - private, instant, and without requiring permission from banks.",
    category: "Digital Evolution",
    icon: "wifi",
    dayIndex: 5
  },

  // Day 6: Trust in Money Systems
  {
    title: "Trust Requirements",
    content: "All money systems require trust. With banks, you trust them not to lose your money. With gold, you trust it will stay valuable.",
    category: "Trust & Money",
    icon: "shield",
    dayIndex: 6
  },
  {
    title: "Counterparty Risk",
    content: "When you trust someone else with your money, you have counterparty risk - the risk that they might fail, steal, or block your access.",
    category: "Trust & Money",
    icon: "users",
    dayIndex: 6
  },
  {
    title: "Mathematical Trust",
    content: "What if money could work based on mathematical rules instead of trusting people? Rules that no one could break or change?",
    category: "Trust & Money",
    icon: "lock",
    dayIndex: 6
  },

  // Day 7: Why Bitcoin Matters
  {
    title: "Trustless Money",
    content: "Bitcoin is the first money that works without requiring trust in any person, bank, or government. It uses math and code instead of trust.",
    category: "Bitcoin Introduction",
    icon: "cpu",
    dayIndex: 7
  },
  {
    title: "Digital Scarcity",
    content: "Bitcoin solved the double spending problem and created true digital scarcity. Only 21 million bitcoins will ever exist.",
    category: "Bitcoin Properties",
    icon: "diamond",
    dayIndex: 7
  },
  {
    title: "Financial Sovereignty",
    content: "With Bitcoin, you can be your own bank. No one can freeze your account, reverse your payments, or stop you from sending money.",
    category: "Bitcoin Benefits",
    icon: "key",
    dayIndex: 7
  }
];

// Daily Lessons for Week 1
const week1Lessons = [
  {
    title: "What Is Money Really? - Day 1",
    content: `Imagine you're living thousands of years ago, and you've just grown the most beautiful apples anyone has ever seen. Your neighbor has crafted the warmest, most comfortable shoes in the village. You want those shoes, but your neighbor doesn't want apples - they need grain for bread. What do you do?

This simple problem has puzzled humans throughout history and led to one of humanity's greatest inventions: money. Money isn't just pieces of paper or metal coins - it's a solution to the fundamental challenge of how people can trade and cooperate with each other.

At its core, money is anything that people in a community agree has value and can be used to exchange for goods and services. It's a shared belief system that makes complex societies possible. Without money, every trade would require the perfect coincidence of wants - you'd need to find someone who has what you want and wants what you have, at the exact same time.

Money serves three essential functions that make our modern world possible. First, it acts as a medium of exchange, allowing us to break the complex chain of bartering into simple transactions. Instead of trading apples for grain for shoes, you can sell your apples for money, then use that money to buy shoes directly. Second, money serves as a store of value, letting you save your hard work today to benefit from it tomorrow. Finally, money works as a unit of account, giving us a consistent way to measure and compare the value of different things.

The story of money is really the story of human cooperation and trust. Every form of money, from seashells to gold to paper bills, works because a community of people agrees to believe in its value. This shared belief creates the foundation for trade, savings, investment, and the complex economic systems that power our world.

Understanding what money really is helps us appreciate why the invention of Bitcoin represents such a revolutionary moment in human history - it's not just a new type of money, but a completely new way of creating trust and cooperation without needing to rely on any central authority.`,
    estimatedReadTime: 8,
    dayIndex: 1
  },
  
  {
    title: "Functions of Money - Day 2", 
    content: `Yesterday we discovered that money is fundamentally about solving the problem of trade and cooperation. Today, let's explore the three magical functions that make money so powerful in human society.

Think of money as a Swiss Army knife for economic activity. Just as that versatile tool serves multiple purposes, money performs three distinct but interconnected functions that make our complex economy possible.

The first function is serving as a medium of exchange. Imagine trying to buy coffee without money - you'd need to find a coffee shop owner who happens to want whatever you have to offer, whether that's web design services, homemade bread, or vintage baseball cards. Money eliminates this "double coincidence of wants" problem by giving everyone a universally accepted item to trade. When you sell your services for money, you're essentially converting your specialized skills into a universal trading token that any coffee shop will accept.

The second function is acting as a store of value. Money allows you to save your efforts today and use them in the future. If you work extra hours this month, you can store that extra value as money and spend it next month on vacation. Good money maintains its purchasing power over time, so the money you save today will buy roughly the same amount of goods tomorrow. This storage function makes long-term planning and investment possible.

The third function is serving as a unit of account - essentially being a measuring stick for value. Just as we use inches to measure length and pounds to measure weight, we use money to measure economic value. This lets us compare the value of completely different things: Is a new phone worth more than a weekend vacation? Money gives us the common measurement system to make these comparisons and decisions.

These three functions work together like a three-legged stool - each supports the others. Money works as a medium of exchange because people trust it as a store of value. It serves as a store of value because it's widely accepted as a medium of exchange. And both functions depend on money serving as a reliable unit of account that people can use to make economic calculations.

Understanding these functions helps us evaluate different forms of money throughout history and appreciate why some succeeded while others failed.`,
    estimatedReadTime: 8,
    dayIndex: 2
  },

  {
    title: "History of Money - Day 3",
    content: `The history of money reads like an epic adventure story, filled with innovation, discovery, and the constant human quest to find better ways to trade and store value. Each chapter represents humanity learning from the limitations of previous money forms and creating something better.

Our story begins tens of thousands of years ago with simple barter systems. Early humans traded directly - meat for tools, furs for grain, crafted items for raw materials. But barter had serious limitations. You needed to find someone who wanted exactly what you had and had exactly what you wanted. Imagine being a spear-maker who needed grain, but the grain farmer needed pottery, not spears. You'd have to find a potter who wanted spears, trade for pottery, then trade the pottery for grain. This complex chain of trades made simple transactions incredibly difficult.

The next chapter saw the emergence of commodity money - items that had value in themselves but also served as money. Different cultures chose different commodities based on what was locally scarce and durable. Pacific Islander cultures used beautiful shells, Native American tribes used beads and furs, and various societies used cattle, salt, or precious stones. These commodity monies solved many of barter's problems because they were widely desired and could be stored for future use.

The discovery and adoption of precious metals, particularly gold and silver, marked a revolutionary chapter in money's evolution. Metals offered advantages that previous commodity monies couldn't match: they were durable (lasting centuries without degrading), divisible (could be melted and reformed into any size), portable (high value in small amounts), and naturally scarce (difficult to find and extract). Gold became the ultimate form of money because it was the most chemically stable and scarce of all metals.

For over 2,000 years, gold reigned as the world's premier money. The Roman Empire used gold coins, medieval kingdoms based their currencies on gold content, and even as recently as the 1970s, major countries backed their paper money with gold reserves. This "gold standard" provided stability and trust because everyone knew paper money could be exchanged for actual gold.

However, the story took a dramatic turn in the 20th century when governments decided to abandon gold backing and create "fiat" money - currency that has value simply because governments say it does. This change gave governments unlimited power to create new money, but it also introduced new problems like inflation and currency debasement.

Today, we stand at the beginning of a new chapter in money's evolution: the digital age. Just as each previous era improved upon the limitations of what came before, Bitcoin represents the next step in this ancient human quest for better money.`,
    estimatedReadTime: 8,
    dayIndex: 3
  },

  {
    title: "Problems with Traditional Money - Day 4",
    content: `After thousands of years of monetary evolution, you might think we'd have perfected money by now. But traditional money systems, especially modern fiat currencies, come with serious problems that affect everyone's financial life, often in ways they don't even realize.

The most insidious problem is inflation - the gradual erosion of money's purchasing power over time. When central banks create new money, they don't create new goods and services to match. More money chasing the same amount of stuff means prices rise. This might seem like a small inconvenience, but inflation is actually a hidden tax that quietly steals wealth from savers and workers. The dollar you earn today will buy less food, housing, and energy in the future. This forces people into risky investments just to maintain their purchasing power, turning everyone into unwilling speculators.

Central control creates another fundamental problem. A small group of officials at central banks has enormous power to manipulate the money supply, interest rates, and economic conditions for entire nations. These decisions affect billions of people, yet they're made behind closed doors by unelected officials using economic theories that often prove wrong. When these officials make mistakes - and they inevitably do - the consequences ripple through the entire economy, destroying savings, businesses, and livelihoods.

Traditional money also suffers from counterparty risk - the risk that institutions holding or processing your money might fail, steal, or restrict your access. Banks can freeze accounts, governments can seize assets, payment processors can block transactions, and financial institutions can collapse, taking customer funds with them. Your access to your own money depends on the continued operation and goodwill of multiple intermediaries, each representing a potential point of failure.

Counterfeiting represents another persistent threat. Despite sophisticated anti-counterfeiting measures, fake bills and coins continue to circulate, undermining trust in the money system. The same technologies that make modern life convenient also make counterfeiting easier and more sophisticated.

Perhaps most importantly, traditional money systems exclude billions of people from the global economy. Opening a bank account requires documentation, minimum balances, and approval from institutions. Cross-border payments are slow, expensive, and often impossible for people in certain countries. This financial exclusion perpetuates poverty and inequality on a global scale.

These problems aren't bugs in the system - they're fundamental features of any money controlled by central authorities. The inflation that erodes your savings provides easy financing for government spending. The central control that creates economic instability also provides power to political and financial elites. The counterparty risks that threaten your access to money also create profitable intermediary businesses.

Understanding these problems helps us appreciate why the world needs a fundamentally different approach to money - one that solves these issues through mathematical rules rather than trusted institutions.`,
    estimatedReadTime: 8,
    dayIndex: 4
  },

  {
    title: "Digital Money Emergence - Day 5",
    content: `As the internet transformed how we communicate, work, and live, it became increasingly obvious that we needed a form of money designed for the digital age. But creating digital money that actually works proved to be one of computer science's most challenging problems.

The internet made information free to copy and share instantly across the globe. This amazing property revolutionized communication, entertainment, education, and commerce. But it also created a fundamental problem for digital money: how do you prevent someone from copying digital money and spending it multiple times? This challenge, known as the "double spending problem," stumped computer scientists for decades.

Early attempts at digital money required trusted third parties to solve the double spending problem. Companies like DigiCash and e-gold created systems where a central authority kept track of who owned what, preventing double spending by maintaining authoritative records. But these systems suffered from the same problems as traditional banking - central points of failure, high fees, regulatory capture, and the need to trust human institutions.

The deeper challenge was philosophical: how could digital money replicate the properties that made physical cash so useful? Physical cash has natural scarcity - you can't photocopy a dollar bill and have two real dollars. It provides privacy - transactions don't leave digital trails. It works without intermediaries - you can hand cash directly to someone without involving banks. And it's censorship-resistant - no authority can prevent a cash transaction from happening.

Creating digital cash that matched these properties seemed impossible. Digital files can be copied perfectly, digital transactions leave permanent records, and digital systems apparently required central servers that authorities could control or shut down. Many brilliant computer scientists tried and failed to create truly decentralized digital money.

Meanwhile, the need for better digital payments grew more urgent. E-commerce exploded, but online payments remained clunky, expensive, and limited. International transfers took days and cost significant fees. Small online transactions were impossible because payment processing fees exceeded the transaction values. Digital natives increasingly lived their lives online but remained dependent on analog financial systems designed for the pre-internet era.

The world needed digital money that combined the convenience and speed of digital communication with the security, privacy, and decentralization of physical cash. It needed to work globally without requiring permission from any authority. It needed to be programmable, enabling new types of financial applications impossible with physical money. And it needed to solve the double spending problem without relying on trusted third parties.

This perfect digital money seemed like a fantasy until 2008, when an anonymous inventor named Satoshi Nakamoto published a solution that combined cryptography, computer networks, and game theory in a way that finally made trustless digital money possible.`,
    estimatedReadTime: 8,
    dayIndex: 5
  },

  {
    title: "Trust in Money Systems - Day 6",
    content: `Every money system throughout history has been built on trust, but the nature of that trust varies dramatically and determines whether the money system ultimately succeeds or fails. Understanding different types of trust helps us appreciate what makes Bitcoin so revolutionary.

Traditional trust in money systems is personal and institutional. When you use dollars, you trust that the U.S. government will continue to exist and honor its currency. You trust that the Federal Reserve will manage the money supply responsibly. You trust that banks will safeguard your deposits and process transactions accurately. You trust that payment networks will operate reliably and fairly. This web of trust involves dozens of institutions and thousands of individuals, each representing a potential point of failure.

This institutional trust has served humanity reasonably well for centuries, but it comes with significant downsides. Institutions can be corrupted, captured by special interests, or simply make honest mistakes with catastrophic consequences. The 2008 financial crisis demonstrated how misplaced trust in financial institutions can destroy the savings and livelihoods of millions of innocent people. Even when institutions operate honestly, they extract fees, impose restrictions, and create dependencies that limit financial freedom.

Commodity money like gold operated on a different type of trust - trust in physical properties and natural scarcity. When people used gold as money, they didn't need to trust any institution. They could verify gold's authenticity through simple tests, confident that its chemical properties made counterfeiting essentially impossible. They trusted that gold's natural scarcity meant no one could arbitrarily create more, protecting their savings from inflation. This physical trust proved remarkably durable, with gold serving as money for over 2,000 years.

But even gold-based trust had limitations. Storing and transporting gold safely required trusted intermediaries. Verifying gold's purity and weight required expertise and equipment. As economies grew more complex, the practical limitations of physical gold led to the adoption of gold-backed paper money, which gradually evolved into the fully fiat systems we use today.

Bitcoin introduces an entirely new form of trust: mathematical trust. Instead of trusting people or institutions, Bitcoin users trust mathematical proofs and cryptographic algorithms. The system's rules are encoded in mathematics and enforced by computers running software that anyone can inspect. No human authority can override these mathematical rules or change them arbitrarily.

This mathematical trust offers unprecedented reliability. Mathematical proofs don't lie, become corrupt, or change their minds. Cryptographic algorithms work the same way regardless of politics, geography, or human opinion. The mathematical limit of 21 million bitcoins cannot be changed by any central bank, government, or majority vote - it's enforced by the same mathematical principles that secure internet communications and military systems.

Moving from institutional trust to mathematical trust represents one of the most significant advances in monetary technology since the invention of coinage. It's the foundation that makes all of Bitcoin's other properties possible.`,
    estimatedReadTime: 8,
    dayIndex: 6
  },

  {
    title: "Why Bitcoin Matters - Day 7",
    content: `After six days of exploring money's nature, history, and problems, we arrive at Bitcoin - a revolutionary invention that solves fundamental issues that have plagued money systems for centuries. Bitcoin matters because it represents the first successful implementation of digital money that works without requiring trust in any central authority.

Bitcoin's breakthrough lies in solving the double spending problem through pure mathematics and cryptography, without needing trusted intermediaries. Every Bitcoin transaction is secured by the same cryptographic principles that protect military communications and online banking. The system prevents double spending not through human oversight, but through a global network of computers that maintain a synchronized record of every transaction ever made.

This mathematical foundation enables Bitcoin to possess properties that no previous money could achieve. Bitcoin is genuinely scarce - only 21 million bitcoins will ever exist, and this limit is enforced by code that no authority can change. It's perfectly divisible - each bitcoin can be split into 100 million units called satoshis, enabling precise transactions of any size. It's completely portable - you can store a billion dollars worth of Bitcoin in your head by memorizing a twelve-word phrase, then access it anywhere in the world with an internet connection.

Bitcoin offers unprecedented financial sovereignty. When you hold Bitcoin properly, you truly own it in a way that's impossible with traditional money. No bank can freeze your account, no government can seize your assets without your private keys, and no payment processor can block your transactions. You can send Bitcoin to anyone, anywhere in the world, at any time, without asking permission from any authority. This isn't just theoretical freedom - it's practical financial independence.

The implications extend far beyond individual users. Bitcoin provides financial access to the billions of people excluded from traditional banking systems. A farmer in rural Africa with just a smartphone can participate in the global economy on equal terms with a banker in New York. Bitcoin enables entirely new types of applications - programmable money that can automatically execute complex financial agreements, micropayments that make new business models possible, and savings that can't be inflated away by monetary manipulation.

Bitcoin also represents a form of peaceful protest against monetary authoritarianism. Every person who chooses to save in Bitcoin rather than fiat currency is voting for a monetary system based on mathematical rules rather than political discretion. This opt-out mechanism provides a safety valve for societies suffering from monetary mismanagement and a competitive pressure for traditional monetary authorities to act more responsibly.

Perhaps most importantly, Bitcoin demonstrates that we don't need to accept the flaws and limitations of traditional money as permanent features of the human condition. We can have money that's scarce but not controlled by any authority, money that's digital but still works like cash, money that's global but not dependent on any government or corporation.

Bitcoin matters because it proves that better money is possible, and it gives everyone the freedom to choose that better money today.`,
    estimatedReadTime: 8,
    dayIndex: 7
  }
];

// Weekly Deep Dive Topic for Week 1
const week1WeeklyTopic = {
  weekNumber: 1,
  title: "What Is Money Really? - Value, Trade, and Monetary History",
  description: "A comprehensive exploration of money's fundamental nature, examining how humans solved the problems of trade and value storage throughout history, leading to the revolutionary invention of Bitcoin.",
  category: "Foundations",
  difficulty: "Beginner",
  estimatedReadTime: 45,
  content: [
    {
      title: "The Problem Money Solves",
      content: "Money exists to solve one of humanity's oldest problems: how to facilitate trade and cooperation in complex societies. Without money, every exchange requires a 'double coincidence of wants' - both parties must have what the other wants. Money eliminates this problem by serving as a universal medium of exchange.",
      examples: [
        "A farmer who grows apples but needs shoes must find a shoemaker who wants apples",
        "A carpenter who builds furniture but needs grain must find a grain farmer who needs furniture",
        "These coincidences are rare, making barter extremely inefficient for complex societies"
      ]
    },
    {
      title: "Money's Three Essential Functions",
      content: "All successful forms of money perform three crucial functions that work together to enable economic activity: medium of exchange, store of value, and unit of account. Each function supports and reinforces the others.",
      examples: [
        "Medium of Exchange: Allows indirect trading through a commonly accepted intermediate good",
        "Store of Value: Enables saving present labor for future consumption",
        "Unit of Account: Provides a measuring stick for comparing values of different goods and services"
      ]
    },
    {
      title: "Properties of Good Money",
      content: "Throughout history, the best forms of money have shared certain properties that make them effective for their three functions. These properties explain why some items succeeded as money while others failed.",
      examples: [
        "Scarcity: Limited supply maintains value over time",
        "Durability: Must not degrade or become unusable",
        "Portability: Easy to transport and transfer",
        "Divisibility: Can be broken into smaller units for precise transactions",
        "Verifiability: Easy to authenticate as genuine",
        "Fungibility: Each unit is equivalent to every other unit"
      ]
    },
    {
      title: "Evolution from Barter to Digital",
      content: "Money has evolved through distinct stages, each solving problems of the previous stage while introducing new challenges. This evolution continues today with digital money innovations.",
      examples: [
        "Barter: Direct exchange of goods, limited by double coincidence of wants",
        "Commodity Money: Items with intrinsic value (shells, beads, cattle)",
        "Metal Money: Precious metals offering superior monetary properties",
        "Representative Money: Paper backed by commodities like gold",
        "Fiat Money: Government-issued currency without commodity backing",
        "Digital Money: Electronic representations of value, leading to cryptocurrency"
      ]
    }
  ],
  keyTakeaways: [
    "Money is humanity's solution to the fundamental problem of facilitating trade and cooperation",
    "Successful money must function as medium of exchange, store of value, and unit of account",
    "The best money throughout history has been scarce, durable, portable, divisible, verifiable, and fungible",
    "Money has evolved through stages, with each advancement solving problems of previous forms",
    "Understanding money's fundamental nature helps evaluate new monetary innovations like Bitcoin"
  ],
  practicalApplications: [
    "Evaluate any proposed form of money by checking if it fulfills all three functions effectively",
    "Assess monetary properties when choosing how to store value for the future",
    "Understand why certain assets (like gold) have served as money across cultures and centuries",
    "Recognize the trade-offs involved in different monetary systems and their implications"
  ],
  furtherReading: [
    {
      title: "The Bitcoin Standard by Saifedean Ammous",
      description: "Comprehensive analysis of money's history and Bitcoin's monetary properties",
      difficulty: "Intermediate"
    },
    {
      title: "What Has Government Done to Our Money? by Murray Rothbard", 
      description: "Classic examination of money's origins and government intervention in monetary systems",
      difficulty: "Beginner"
    },
    {
      title: "The Ascent of Money by Niall Ferguson",
      description: "Historical survey of financial systems and money's role in civilization",
      difficulty: "Beginner"
    }
  ]
};

// Quiz Questions for Week 1
const week1QuizQuestions = [
  // Day 1 Quiz
  {
    dayIndex: 1,
    question: "What is the primary problem that money solves?",
    options: [
      "Making things more expensive",
      "The double coincidence of wants in barter systems", 
      "Creating inflation",
      "Helping governments control the economy"
    ],
    correctAnswer: 1,
    explanation: "Money's primary function is solving the 'double coincidence of wants' problem - the difficulty of finding someone who has what you want AND wants what you have in a barter system."
  },
  {
    dayIndex: 1,
    question: "Which of these is NOT one of money's three main functions?",
    options: [
      "Medium of exchange",
      "Store of value", 
      "Unit of account",
      "Government control mechanism"
    ],
    correctAnswer: 3,
    explanation: "Money's three essential functions are medium of exchange, store of value, and unit of account. Government control is not a fundamental function of money."
  },
  
  // Day 2 Quiz
  {
    dayIndex: 2,
    question: "What does 'divisibility' mean as a property of money?",
    options: [
      "Money can be physically broken",
      "Money can be split into smaller denominations for precise transactions",
      "Money divides people into classes",
      "Money can be divided among governments"
    ],
    correctAnswer: 1,
    explanation: "Divisibility means money can be broken down into smaller units to make change and facilitate transactions of varying sizes."
  },
  {
    dayIndex: 2,
    question: "Why is portability important for money?",
    options: [
      "So money looks nice",
      "So governments can track it",
      "So it can be easily carried and transported for trade",
      "So it can be hidden easily"
    ],
    correctAnswer: 2,
    explanation: "Portability allows money to be easily transported, making trade and commerce practical across distances."
  },

  // Day 3 Quiz  
  {
    dayIndex: 3,
    question: "What made gold superior to other forms of commodity money?",
    options: [
      "It was the prettiest metal",
      "It was scarce, durable, and chemically stable", 
      "Governments preferred it",
      "It was easy to find"
    ],
    correctAnswer: 1,
    explanation: "Gold became premier money because it was naturally scarce, didn't degrade over time, and was chemically stable, making it reliable for storing value."
  },
  {
    dayIndex: 3,
    question: "What was the main limitation of barter systems?",
    options: [
      "People were too greedy",
      "There weren't enough goods to trade",
      "It required finding someone who wanted what you had AND had what you wanted",
      "It was illegal"
    ],
    correctAnswer: 2,
    explanation: "Barter required a 'double coincidence of wants' - both parties needed to want what the other offered, which was rare and made trade inefficient."
  },

  // Day 4 Quiz
  {
    dayIndex: 4,
    question: "What is inflation?",
    options: [
      "When things get physically bigger",
      "When the money supply increases, causing prices to rise and money to lose purchasing power",
      "When people save too much money",
      "When businesses make too much profit"
    ],
    correctAnswer: 1,
    explanation: "Inflation occurs when the money supply increases faster than goods and services, causing prices to rise and reducing money's purchasing power."
  },
  {
    dayIndex: 4,
    question: "What is counterparty risk?",
    options: [
      "The risk of meeting unfriendly people",
      "The risk that someone you trust with your money might fail, steal, or block your access",
      "The risk of making bad investments",
      "The risk of natural disasters"
    ],
    correctAnswer: 1,
    explanation: "Counterparty risk is the risk that institutions or people you trust with your money (banks, governments, etc.) might fail, act maliciously, or restrict your access."
  },

  // Day 5 Quiz
  {
    dayIndex: 5,
    question: "What is the 'double spending problem' in digital money?",
    options: [
      "Spending money twice on the same thing",
      "The challenge of preventing someone from copying digital money and spending it multiple times",
      "Spending more money than you have", 
      "Two people spending the same physical coin"
    ],
    correctAnswer: 1,
    explanation: "The double spending problem is the challenge of preventing digital money from being copied and spent multiple times, since digital files can be duplicated perfectly."
  },
  {
    dayIndex: 5,
    question: "Why did early digital money systems require trusted third parties?",
    options: [
      "To make money more expensive",
      "To prevent double spending by maintaining authoritative records of who owns what",
      "To make the systems more complicated",
      "Because governments required it"
    ],
    correctAnswer: 1,
    explanation: "Early digital money needed trusted intermediaries to maintain official records preventing double spending, since there was no other way to ensure digital money wasn't copied."
  },

  // Day 6 Quiz
  {
    dayIndex: 6,
    question: "What type of trust does Bitcoin use?",
    options: [
      "Trust in governments",
      "Trust in banks",
      "Mathematical trust through cryptographic proofs",
      "Trust in popular opinion"
    ],
    correctAnswer: 2,
    explanation: "Bitcoin uses mathematical trust - relying on cryptographic proofs and mathematical algorithms rather than trusting human institutions."
  },
  {
    dayIndex: 6,
    question: "What was the main advantage of gold's 'physical trust' model?",
    options: [
      "Gold was shiny and pretty",
      "Gold's physical properties made counterfeiting nearly impossible and provided natural scarcity",
      "Governments liked gold better",
      "Gold was easier to carry than other metals"
    ],
    correctAnswer: 1,
    explanation: "Gold's physical trust worked because its chemical properties made it nearly impossible to counterfeit and its natural scarcity meant no one could arbitrarily create more."
  },

  // Day 7 Quiz
  {
    dayIndex: 7,
    question: "How does Bitcoin solve the double spending problem?",
    options: [
      "By using banks to track transactions",
      "Through a global network of computers maintaining a synchronized record of all transactions",
      "By making digital copies impossible",
      "By requiring government permission for each transaction"
    ],
    correctAnswer: 1,
    explanation: "Bitcoin solves double spending through a decentralized network of computers that maintain a shared, synchronized ledger of all transactions, eliminating the need for trusted intermediaries."
  },
  {
    dayIndex: 7,
    question: "What makes Bitcoin 'trustless'?",
    options: [
      "No one can be trusted to use it",
      "It works through mathematical rules and cryptographic proofs rather than requiring trust in people or institutions",
      "It's too complicated to trust",
      "Only criminals use it"
    ],
    correctAnswer: 1,
    explanation: "Bitcoin is 'trustless' because it relies on mathematical proofs and cryptographic algorithms that work automatically, eliminating the need to trust any human authority or institution."
  }
];

export {
  week1Facts,
  week1Lessons, 
  week1WeeklyTopic,
  week1QuizQuestions
};