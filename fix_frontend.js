// Clean Week 1 getFactDeepDive function
const getFactDeepDive = (factTitle) => {
  const deepDives = {
    "What Is Money?": {
      explanation: "Money is any item or system that a community agrees has value and can be exchanged for goods and services. Throughout history, societies have used everything from seashells to gold to paper bills as money. The key is community agreement and trust that others will accept it.",
      examples: [
        "Ancient civilizations used salt, cattle, and grain as money",
        "Island societies used large stone wheels or rare shells",
        "Gold became popular because it's scarce, durable, and portable",
        "Paper money works because governments guarantee its value"
      ],
      visualDescription: "Imagine money as a shared language that lets people communicate value. Just like everyone agrees what words mean, communities agree what has value for trade.",
      keyTakeaways: [
        "Money is based on community agreement and trust",
        "It solves the problem of trading without perfect coincidence of wants",
        "Different societies have used many different forms of money",
        "The best money shares certain properties like scarcity and durability"
      ]
    },
    "Medium of Exchange": {
      explanation: "A medium of exchange eliminates the need for barter by providing something everyone will accept in trade. Instead of trading apples for shoes directly, you can sell apples for money, then use that money to buy shoes from anyone who accepts it.",
      examples: [
        "You sell your artwork for dollars, then use dollars to buy groceries",
        "A farmer sells wheat for money, then buys tools with that money",
        "Without money, the farmer would need to find someone who wants wheat AND has tools to trade",
        "Money breaks complex multi-party trades into simple two-party exchanges"
      ],
      visualDescription: "Think of money as a universal translator for value. Just as a translator helps people who speak different languages communicate, money helps people who produce different things trade with each other.",
      keyTakeaways: [
        "Eliminates the need for perfect coincidence of wants in trading",
        "Makes complex economic systems possible",
        "Must be widely accepted to function effectively",
        "Enables specialization by making trade efficient"
      ]
    },
    "Store of Value": {
      explanation: "A store of value allows you to save your purchasing power for the future. Good money holds its value over time, so the work you do today can benefit you tomorrow, next month, or next year.",
      examples: [
        "You work overtime this month and save money for a vacation next year",
        "A farmer saves money from harvest season to buy seeds for next year",
        "Your grandmother saved money in a bank account for decades",
        "People buy gold during uncertain times to preserve wealth"
      ],
      visualDescription: "Imagine money as a time machine for your work. It lets you capture the value of work you do today and transport it to the future when you need it.",
      keyTakeaways: [
        "Enables people to save for future needs and goals",
        "Must maintain value over time to function properly",
        "Poor stores of value lose purchasing power through inflation",
        "Essential for long-term planning and investment"
      ]
    },
    "Inflation": {
      explanation: "Inflation occurs when the money supply increases faster than economic growth, causing each unit of money to buy less over time. When governments print more money, it dilutes the value of existing money, like adding water to soup - you get more volume but less flavor per spoonful.",
      examples: [
        "In the 1970s, coffee cost 25 cents - today it costs $3 or more",
        "Your grandfather could buy a house for $20,000 - today it costs $400,000",
        "Venezuela printed so much money that people used wheelbarrows to carry cash",
        "Germany's 1920s hyperinflation made money so worthless people used it as wallpaper"
      ],
      visualDescription: "Picture inflation like a leak in your savings bucket. Even if you're not spending money, its purchasing power slowly drips away as prices rise around you.",
      keyTakeaways: [
        "Erodes the purchasing power of saved money over time",
        "Caused by increasing money supply faster than economic growth",
        "Hurts savers and people on fixed incomes the most",
        "Can become extreme hyperinflation in worst cases"
      ]
    },
    "Central Control": {
      explanation: "Traditional money systems are controlled by central authorities like governments and central banks who can change the rules, print more money, freeze accounts, or stop transactions. This centralized control means your money's value and accessibility depends on their decisions.",
      examples: [
        "The Federal Reserve can print trillions of dollars during crises",
        "Banks can freeze your account if they suspect unusual activity",
        "Governments can seize assets or block international transfers",
        "Currency controls can prevent people from exchanging their money"
      ],
      visualDescription: "Imagine your money as being stored in someone else's house. You might think it's yours, but the house owner can change the locks, limit your access, or even take some of it whenever they want.",
      keyTakeaways: [
        "Central authorities have ultimate control over traditional money",
        "They can inflate away value by printing more money",
        "Your access to your own money depends on their permission",
        "This creates dependency and systemic risk for users"
      ]
    },
    "Unit of Account": {
      explanation: "A unit of account provides a standard way to measure and compare the value of different goods and services. It's like having a universal ruler for value that everyone understands and can use.",
      examples: [
        "Instead of remembering that 1 cow = 10 chickens = 100 apples, you can price everything in dollars",
        "Businesses can compare profits across different product lines using the same currency",
        "You can budget and plan by knowing rent costs $1,000 and groceries cost $200 per month",
        "International trade becomes easier when everyone uses recognized currency values"
      ],
      visualDescription: "Think of money as a measuring tape for value. Just as we use inches or centimeters to measure length, we use dollars or other currencies to measure economic value.",
      keyTakeaways: [
        "Simplifies complex value comparisons",
        "Enables accounting, budgeting, and financial planning",
        "Must be stable and widely understood to work effectively",
        "Essential for business operations and economic calculation"
      ]
    },
    "Trust & Agreement": {
      explanation: "Money is fundamentally a social technology based on shared belief and trust. Throughout history, communities have agreed that certain objects have value and can be used for trade, from shells to gold to digital numbers.",
      examples: [
        "Pacific islanders used large stone wheels as money because the community agreed they had value",
        "Gold became popular worldwide because many cultures independently recognized its properties",
        "Modern paper money works because governments back it and people trust the system",
        "Credit cards work because merchants trust the bank will process the payment"
      ],
      visualDescription: "Imagine money as a social contract written in the language of trust. Everyone signs this invisible agreement that certain things have value and can be exchanged.",
      keyTakeaways: [
        "All money systems require community agreement to function",
        "Trust can be built through scarcity, backing, or institutional guarantees",
        "When trust breaks down, money systems can collapse rapidly",
        "New forms of money must establish trust to gain adoption"
      ]
    }
  };
  return deepDives[factTitle];
};