import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Framework-compliant Week 1 content
const week1Content = [
  {
    dayIndex: 1,
    title: "Your Money is Being Stolen (And You Don't Even Know It)",
    theme: "Problem Recognition",
    setupQuestions: [
      "Why does your grocery bill keep getting bigger?",
      "What happens when governments create new money?",
      "How can you protect your purchasing power?"
    ],
    lessonContent: "You work hard for your paycheck. But something steals from you daily. This thief makes your money worth less. This thief is inflation. Governments need money for wars and bailouts. They don't raise taxes. They create new money from nothing. In 2020, the U.S. created massive amounts of new money. What happens when you add more money? More dollars chasing goods means higher prices. Your grocery bill doubles. Your rent triples. Your salary grows 3% yearly. You get poorer with raises. A $50,000 salary today buys what $30,000 bought in 2000. Bitcoin solves this problem. Unlike dollars, only 21 million Bitcoin will exist. No government can print more Bitcoin. No bank can create Bitcoin from nothing. Bitcoin is digital money for people who want control.",
    keyTakeaways: [
      "Inflation steals purchasing power silently",
      "Bitcoin has fixed supply preventing devaluation", 
      "Working professionals need inflation protection"
    ],
    whyItMatters: "This matters because inflation silently reduces your purchasing power every year, and understanding Bitcoin's fixed supply helps you evaluate whether it deserves a place in your financial planning.",
    quizQuestions: [
      {
        question: "What is the main cause of inflation?",
        optionA: "Higher wages for workers",
        optionB: "Governments creating new money",
        optionC: "Increased business profits", 
        optionD: "Supply chain problems",
        correctAnswer: "B",
        explanation: "Inflation happens when governments create new money from nothing. Bitcoin's fixed supply prevents this problem."
      },
      {
        question: "What makes Bitcoin different from dollars?",
        optionA: "Bitcoin supply increases every year",
        optionB: "Bitcoin has a fixed supply of 21 million coins",
        optionC: "Bitcoin supply is controlled by banks",
        optionD: "Bitcoin supply depends on government policy",
        correctAnswer: "B", 
        explanation: "Unlike dollars that can be printed endlessly, Bitcoin has a fixed limit of 21 million coins making it scarce."
      },
      {
        question: "What happens when you get a 3% raise but inflation is higher?",
        optionA: "Your purchasing power increases",
        optionB: "Your purchasing power stays the same",
        optionC: "Your purchasing power decreases",
        optionD: "It depends on spending habits",
        correctAnswer: "C",
        explanation: "When inflation exceeds your raise, you can buy less despite earning more dollars. Bitcoin protects purchasing power."
      },
      {
        question: "How much new money did the U.S. create in 2020?",
        optionA: "The same as every year",
        optionB: "Double the previous year", 
        optionC: "More than existed twenty years ago",
        optionD: "Less than in 2008",
        correctAnswer: "C",
        explanation: "In 2020, the U.S. created more dollars than existed twenty years earlier. Bitcoin prevents this with fixed supply."
      }
    ]
  },
  {
    dayIndex: 2,
    title: "Why Your Coffee Costs $5 (When It Used to Cost $3)",
    theme: "Problem Recognition",
    setupQuestions: [
      "Why do prices keep going up?",
      "What happens to your savings over time?",
      "How does Bitcoin protect against rising prices?"
    ],
    lessonContent: "Everything costs more than it used to. Coffee was $3 five years ago. Now it's $5. Gas doubled. Rent doubled. Food doubled. Your money buys less stuff. This happens because governments print money. They create new dollars constantly. More dollars means higher prices. It's supply and demand. When there's more money, prices go up. Your paycheck might grow 3% yearly. But prices grow 6% yearly. You fall behind every year. Your savings lose value sitting in the bank. Banks pay 0.5% interest. Inflation runs 6%. You lose 5.5% yearly. Bitcoin works differently. No one can print more Bitcoin. Only 21 million will exist. Ever. When demand grows, price goes up. When supply is fixed, scarcity creates value. Bitcoin protects against money printing. It can't be inflated away. It's digital gold for the internet age.",
    keyTakeaways: [
      "Money printing causes prices to rise",
      "Your savings lose value over time",
      "Bitcoin's fixed supply creates scarcity value"
    ],
    whyItMatters: "This matters because your money quietly loses value every year while sitting in banks, and understanding Bitcoin's scarcity helps you evaluate whether it could preserve your wealth better than traditional savings.",
    quizQuestions: [
      {
        question: "What causes prices to rise over time?",
        optionA: "Businesses becoming greedy",
        optionB: "Governments printing more money",
        optionC: "Workers demanding higher wages",
        optionD: "Global supply shortages",
        correctAnswer: "B",
        explanation: "When governments print more money, more dollars chase the same goods, causing prices to rise. Bitcoin's fixed supply prevents this."
      },
      {
        question: "If your salary grows 3% but prices grow 6%, what happens?",
        optionA: "You can buy more things",
        optionB: "You can buy the same amount",
        optionC: "You can buy less things",
        optionD: "It depends on what you buy",
        correctAnswer: "C",
        explanation: "When prices rise faster than wages, your purchasing power decreases. Bitcoin's scarcity helps protect against this erosion."
      },
      {
        question: "How many Bitcoin will exist?",
        optionA: "21 million maximum",
        optionB: "100 million maximum",
        optionC: "Unlimited supply",
        optionD: "Supply increases with demand",
        correctAnswer: "A",
        explanation: "Bitcoin has a fixed supply of 21 million coins maximum. This scarcity makes it valuable as money printing increases."
      },
      {
        question: "What happens to savings in a bank account?",
        optionA: "They grow with inflation",
        optionB: "They stay the same value",
        optionC: "They lose value to inflation",
        optionD: "They're protected from inflation",
        correctAnswer: "C",
        explanation: "Bank savings earn less interest than inflation rates, so they lose purchasing power over time. Bitcoin offers scarcity protection."
      }
    ]
  },
  {
    dayIndex: 3,
    title: "Banks Are Getting Rich Off Your Money",
    theme: "Problem Recognition",
    setupQuestions: [
      "How do banks make money from your deposits?",
      "Why do you pay fees to access your own money?",
      "How does Bitcoin eliminate banking middlemen?"
    ],
    lessonContent: "Banks don't work for you. They work for themselves. You deposit your money. They pay you 0.5% interest. Then they lend your money to others. They charge 6% interest on loans. They keep the 5.5% difference. This is called fractional reserve banking. Banks also charge you fees. Monthly maintenance fees. ATM fees. Overdraft fees. Wire transfer fees. They make money from your money. Then they charge you to use it. Bitcoin works differently. No bank controls your Bitcoin. You control your own money. No monthly fees. No overdraft fees. No wire transfer fees. Bitcoin transactions cost pennies. Not dollars. You can send Bitcoin anywhere instantly. No bank approval needed. No business hours. No holidays. Bitcoin is peer-to-peer money. You send directly to anyone. Banks can't stop you. They can't freeze your account. They can't charge you fees. Bitcoin gives you financial freedom.",
    keyTakeaways: [
      "Banks profit from your deposits and charge fees",
      "Bitcoin eliminates banking middlemen completely",
      "You control your money with Bitcoin"
    ],
    whyItMatters: "This matters because traditional banks extract wealth from your deposits while charging you fees, and understanding Bitcoin's peer-to-peer system helps you evaluate whether you need banks at all.",
    quizQuestions: [
      {
        question: "How do banks make money from your deposits?",
        optionA: "They invest in stocks",
        optionB: "They lend your money at higher interest rates",
        optionC: "They charge government fees",
        optionD: "They print more money",
        correctAnswer: "B",
        explanation: "Banks pay you low interest then lend your money at higher rates, keeping the difference. Bitcoin eliminates this middleman extraction."
      },
      {
        question: "What makes Bitcoin different from banking?",
        optionA: "Bitcoin has higher fees",
        optionB: "Bitcoin requires bank approval",
        optionC: "Bitcoin is peer-to-peer with no middlemen",
        optionD: "Bitcoin has business hours",
        correctAnswer: "C",
        explanation: "Bitcoin allows direct peer-to-peer transactions without banks as middlemen. No fees, no approval needed, available 24/7."
      },
      {
        question: "How much do Bitcoin transactions typically cost?",
        optionA: "Same as wire transfers",
        optionB: "Pennies, not dollars",
        optionC: "Monthly maintenance fees",
        optionD: "Percentage of transaction amount",
        correctAnswer: "B",
        explanation: "Bitcoin transactions cost pennies compared to expensive bank wire transfers and fees. Much more affordable for users."
      },
      {
        question: "What is fractional reserve banking?",
        optionA: "Banks keep all deposits in vaults",
        optionB: "Banks lend out most of your deposits",
        optionC: "Banks only lend to businesses",
        optionD: "Banks don't charge interest",
        correctAnswer: "B",
        explanation: "Banks keep only a fraction of deposits and lend the rest, profiting from the interest difference. Bitcoin eliminates this system."
      }
    ]
  },
  {
    dayIndex: 4,
    title: "Your Savings Are Shrinking Every Day",
    theme: "Problem Recognition",
    setupQuestions: [
      "What happens when inflation beats your savings rate?",
      "Why do rich people buy assets instead of saving cash?",
      "How does Bitcoin protect against currency devaluation?"
    ],
    lessonContent: "Your savings account is losing money. Banks pay 0.5% interest yearly. Inflation runs 6% yearly. You lose 5.5% purchasing power annually. A $10,000 savings account loses $550 yearly. In ten years, it buys $4,500 worth of stuff. Your money shrinks while sitting there. Rich people don't save cash. They buy assets. Stocks, real estate, gold. Assets go up with inflation. Cash goes down with inflation. Poor people save cash. Rich people buy assets. This creates wealth inequality. Bitcoin is a new asset class. It's digital property. Limited to 21 million coins. No government can print more. No bank can create more. Bitcoin price rises with demand. Limited supply meets growing demand. This creates scarcity value. Bitcoin protects against currency devaluation. It's property, not currency. You own digital real estate. Not depreciating dollars.",
    keyTakeaways: [
      "Savings accounts lose purchasing power to inflation",
      "Rich people buy assets, poor people save cash",
      "Bitcoin is digital property with limited supply"
    ],
    whyItMatters: "This matters because traditional savings lose value to inflation while assets protect wealth, and understanding Bitcoin as digital property helps you evaluate whether it could preserve your purchasing power better than cash.",
    quizQuestions: [
      {
        question: "What happens when inflation is 6% but savings earn 0.5%?",
        optionA: "You gain 5.5% purchasing power",
        optionB: "You lose 5.5% purchasing power",
        optionC: "Your money stays the same",
        optionD: "You gain 6.5% purchasing power",
        correctAnswer: "B",
        explanation: "When inflation exceeds savings rates, you lose purchasing power. Bitcoin's scarcity can protect against this erosion."
      },
      {
        question: "What do rich people buy instead of saving cash?",
        optionA: "More cash in different banks",
        optionB: "Government bonds only",
        optionC: "Assets like stocks and real estate",
        optionD: "Gold and silver coins",
        correctAnswer: "C",
        explanation: "Rich people buy assets that appreciate with inflation. Bitcoin represents a new digital asset class with scarcity properties."
      },
      {
        question: "How many Bitcoin will ever exist?",
        optionA: "21 million maximum",
        optionB: "100 million maximum",
        optionC: "Unlimited supply",
        optionD: "Supply increases with demand",
        correctAnswer: "A",
        explanation: "Bitcoin has a fixed supply of 21 million coins, making it scarce digital property that can't be inflated away."
      },
      {
        question: "What is Bitcoin best described as?",
        optionA: "Digital currency for spending",
        optionB: "Digital property with limited supply",
        optionC: "Government-backed money",
        optionD: "Bank-issued digital cash",
        correctAnswer: "B",
        explanation: "Bitcoin is digital property with a fixed supply of 21 million coins, making it scarce like real estate or gold."
      }
    ]
  },
  {
    dayIndex: 5,
    title: "Why the Rich Keep Getting Richer",
    theme: "Problem Recognition",
    setupQuestions: [
      "Why do asset prices rise faster than wages?",
      "How does money printing benefit asset owners?",
      "Why is Bitcoin access important for working professionals?"
    ],
    lessonContent: "The rich get richer. The poor get poorer. This isn't accident. It's system design. When governments print money, asset prices rise. Stocks go up. Real estate goes up. Gold goes up. But wages stay flat. Rich people own assets. Poor people own wages. Money printing makes assets more expensive. But wages don't keep up. This creates wealth inequality. A house cost $100,000 in 2000. Now it costs $500,000. Did houses get better? No. Money got worse. Rich people owned the house. They got richer. Working people earned wages. They got poorer. Bitcoin changes this game. Bitcoin is digital property. Anyone can buy it. Not just rich people. You can buy $10 of Bitcoin. You can buy $10,000 of Bitcoin. No minimum. No restrictions. No bank approval. Bitcoin gives working professionals asset access. You can own digital property. Not just earn wages.",
    keyTakeaways: [
      "Money printing inflates asset prices faster than wages",
      "Rich people own assets, poor people earn wages",
      "Bitcoin gives everyone access to digital property"
    ],
    whyItMatters: "This matters because money printing systematically benefits asset owners over wage earners, and understanding Bitcoin as accessible digital property helps you evaluate whether it could level the playing field for working professionals.",
    quizQuestions: [
      {
        question: "What happens to asset prices when money is printed?",
        optionA: "They stay the same",
        optionB: "They go down",
        optionC: "They go up",
        optionD: "They become worthless",
        correctAnswer: "C",
        explanation: "Money printing inflates asset prices because more money chases the same assets. Bitcoin benefits from this as digital property."
      },
      {
        question: "Why did house prices rise from $100,000 to $500,000?",
        optionA: "Houses got much better",
        optionB: "Money got worse through printing",
        optionC: "Population doubled",
        optionD: "Construction costs increased",
        correctAnswer: "B",
        explanation: "Money printing devalued dollars, making assets like houses more expensive in dollar terms. Bitcoin offers similar scarcity protection."
      },
      {
        question: "What's the minimum amount of Bitcoin you can buy?",
        optionA: "One full Bitcoin only",
        optionB: "$1,000 minimum",
        optionC: "Any amount, even $10",
        optionD: "Depends on your bank",
        correctAnswer: "C",
        explanation: "Bitcoin is divisible, so anyone can buy any amount. This gives working professionals access to digital property."
      },
      {
        question: "What advantage does Bitcoin give working professionals?",
        optionA: "Higher wages",
        optionB: "Better jobs",
        optionC: "Access to digital property",
        optionD: "Government benefits",
        correctAnswer: "C",
        explanation: "Bitcoin gives working professionals access to digital property ownership, not just wage earning. This helps close the wealth gap."
      }
    ]
  },
  {
    dayIndex: 6,
    title: "The Money System is Rigged Against You",
    theme: "Problem Recognition",
    setupQuestions: [
      "Who benefits most from money printing?",
      "Why do you pay taxes but billionaires don't?",
      "How does Bitcoin create a fairer system?"
    ],
    lessonContent: "The money system is rigged. Billionaires get loans at 0% interest. You pay 6% interest. Banks get bailouts. You pay taxes. Government prints money. Assets go up. Your wages stay flat. This isn't fair. It's designed this way. Rich people get new money first. They buy assets cheaply. Then prices rise. Working people get new money last. They buy assets expensively. This is called the Cantillon Effect. People closest to money printing benefit most. People furthest from money printing suffer most. You work for money. Rich people create money. Different rules for different people. Bitcoin fixes this. Bitcoin has same rules for everyone. No special treatment. No bailouts. No money printing. Everyone plays by same rules. Rich or poor. Bitcoin transactions work the same. Bitcoin supply stays the same. Bitcoin access stays the same. Fair money for fair people.",
    keyTakeaways: [
      "Traditional money system favors those closest to printing",
      "Working people get new money last, pay highest prices",
      "Bitcoin has same rules for everyone"
    ],
    whyItMatters: "This matters because the current monetary system systematically disadvantages working people through the Cantillon Effect, and understanding Bitcoin's fair rules helps you evaluate whether it could provide more equitable financial access.",
    quizQuestions: [
      {
        question: "What is the Cantillon Effect?",
        optionA: "Everyone gets new money equally",
        optionB: "People closest to money printing benefit most",
        optionC: "Money printing helps poor people",
        optionD: "Inflation affects everyone the same",
        correctAnswer: "B",
        explanation: "The Cantillon Effect means people closest to money creation benefit most, while distant people suffer. Bitcoin eliminates this unfairness."
      },
      {
        question: "Who gets new money first in the current system?",
        optionA: "Working people",
        optionB: "Students",
        optionC: "Banks and wealthy people",
        optionD: "Small businesses",
        correctAnswer: "C",
        explanation: "Banks and wealthy people get new money first through loans and bailouts. Bitcoin gives equal access to everyone."
      },
      {
        question: "What interest rate do billionaires get on loans?",
        optionA: "Same as everyone else",
        optionB: "Higher than working people",
        optionC: "Close to 0%",
        optionD: "They don't get loans",
        correctAnswer: "C",
        explanation: "Wealthy people get ultra-low interest rates while working people pay high rates. Bitcoin eliminates this unfair advantage."
      },
      {
        question: "How does Bitcoin treat different people?",
        optionA: "Rich people get special privileges",
        optionB: "Same rules for everyone",
        optionC: "Poor people get advantages",
        optionD: "Depends on your bank",
        correctAnswer: "B",
        explanation: "Bitcoin has identical rules for everyone regardless of wealth. No special treatment, no bailouts, no money printing."
      }
    ]
  },
  {
    dayIndex: 7,
    title: "There's a Better Way to Store Your Wealth",
    theme: "Problem Recognition",
    setupQuestions: [
      "What if money couldn't be printed?",
      "How would fixed supply money change everything?",
      "Why do millions of professionals choose Bitcoin?"
    ],
    lessonContent: "There's a better way. Imagine money that can't be printed. Money that can't be inflated. Money that can't be manipulated. Money that works for you. This money exists. It's called Bitcoin. Bitcoin solves every problem we've discussed. No inflation. No bank fees. No money printing. No rigged system. Bitcoin is fixed supply money. Only 21 million coins. Forever. No government can change this. No bank can change this. No billionaire can change this. Math controls Bitcoin. Not politics. Code controls Bitcoin. Not corruption. You control your Bitcoin. Not banks. Bitcoin is money designed for the people. By the people. Millions of professionals already use Bitcoin. Doctors, lawyers, engineers, teachers. They're protecting their wealth. They're taking control. They're opting out of the rigged system. Bitcoin gives you financial freedom. Real freedom. Not fake freedom. You can join them. Or stay in the rigged system. Your choice.",
    keyTakeaways: [
      "Bitcoin is fixed supply money that can't be manipulated",
      "Math and code control Bitcoin, not politics",
      "Millions of professionals already use Bitcoin"
    ],
    whyItMatters: "This matters because Bitcoin offers a mathematically sound alternative to the manipulated traditional money system, and understanding why millions of professionals choose Bitcoin helps you evaluate whether it could provide the financial freedom you deserve.",
    quizQuestions: [
      {
        question: "What controls Bitcoin's supply?",
        optionA: "Government policies",
        optionB: "Bank decisions",
        optionC: "Math and code",
        optionD: "Billionaire preferences",
        correctAnswer: "C",
        explanation: "Bitcoin's supply is controlled by mathematical code, not human manipulation. This makes it predictable and fair."
      },
      {
        question: "How many Bitcoin will exist?",
        optionA: "21 million forever",
        optionB: "Increases with demand",
        optionC: "Decreases over time",
        optionD: "Depends on government",
        correctAnswer: "A",
        explanation: "Bitcoin has a fixed supply of 21 million coins forever. No one can change this mathematical limit."
      },
      {
        question: "Who uses Bitcoin?",
        optionA: "Only criminals",
        optionB: "Only tech people",
        optionC: "Millions of professionals",
        optionD: "Only billionaires",
        correctAnswer: "C",
        explanation: "Millions of professionals including doctors, lawyers, and engineers use Bitcoin to protect their wealth from inflation."
      },
      {
        question: "What does Bitcoin give you?",
        optionA: "Higher wages",
        optionB: "Financial freedom",
        optionC: "Government benefits",
        optionD: "Bank partnerships",
        correctAnswer: "B",
        explanation: "Bitcoin gives you financial freedom by letting you control your own money without banks or government interference."
      }
    ]
  }
];

async function rebuildWeek1() {
  try {
    console.log('Starting Week 1 rebuild with framework-compliant content...');
    
    // Insert new content
    for (const day of week1Content) {
      // Insert day metadata
      const dayResult = await db.execute(`
        INSERT INTO content_days (day_index, title, theme, key_takeaways, why_it_matters)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [day.dayIndex, day.title, day.theme, day.keyTakeaways, day.whyItMatters]);
      
      const dayId = dayResult.rows[0].id;
      console.log(`Created day ${day.dayIndex}: ${day.title}`);
      
      // Insert setup questions
      for (const question of day.setupQuestions) {
        await db.execute(`
          INSERT INTO content_set_up_questions (day_id, question)
          VALUES ($1, $2)
        `, [dayId, question]);
      }
      
      // Insert lesson
      await db.execute(`
        INSERT INTO content_lessons (day_id, title, content)
        VALUES ($1, $2, $3)
      `, [dayId, day.title, day.lessonContent]);
      
      // Insert quiz questions
      for (const quiz of day.quizQuestions) {
        await db.execute(`
          INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation)
          VALUES ($1, $2, $3, $4, $5)
        `, [dayId, quiz.question, [quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD], quiz.correctAnswer, quiz.explanation]);
      }
    }
    
    console.log('Week 1 rebuild completed successfully!');
    
  } catch (error) {
    console.error('Error rebuilding Week 1:', error);
  } finally {
    await pool.end();
  }
}

rebuildWeek1();