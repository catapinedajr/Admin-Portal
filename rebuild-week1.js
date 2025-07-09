const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { contentDays, contentSetUpQuestions, contentLessons, contentQuizzes } = require('./shared/schema');
const ws = require('ws');

const neonConfig = { webSocketConstructor: ws };
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Framework-compliant Week 1 content designed to pass validation
const week1Content = [
  {
    dayIndex: 1,
    title: "Your Money is Being Stolen (And You Don't Even Know It)",
    setupQuestions: [
      "Why does your grocery bill keep getting bigger?",
      "What happens when governments create new money?",
      "How can you protect your purchasing power?"
    ],
    lessonContent: "You work hard for your paycheck. But something steals from you daily. This thief makes your money worth less. This thief is inflation. Governments need money for wars and bailouts. They don't raise taxes. They create new money from nothing. In 2020, the U.S. created massive amounts of new money. What happens when you add more money? More dollars chasing goods means higher prices. Your grocery bill doubles. Your rent triples. Your salary grows 3% yearly. You get poorer with raises. A $50,000 salary today buys what $30,000 bought in 2000. Bitcoin solves this problem. Unlike dollars, only 21 million Bitcoin will exist. No government can print more Bitcoin. No bank can create Bitcoin from nothing. Bitcoin is digital money for people who want control.",
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
    ],
    keyTakeaways: [
      "Inflation steals purchasing power silently",
      "Bitcoin has fixed supply preventing devaluation",
      "Working professionals need inflation protection"
    ],
    whyItMatters: "This matters because inflation silently reduces your purchasing power every year, and understanding Bitcoin's fixed supply helps you evaluate whether it deserves a place in your financial planning."
  },
  {
    dayIndex: 2,
    title: "Why Your Coffee Costs $5 (When It Used to Cost $3)",
    setupQuestions: [
      "Why do prices keep going up?",
      "What happens to your savings over time?",
      "How does Bitcoin protect against rising prices?"
    ],
    lessonContent: "Everything costs more than it used to. Coffee was $3 five years ago. Now it's $5. Gas doubled. Rent doubled. Food doubled. Your money buys less stuff. This happens because governments print money. They create new dollars constantly. More dollars means higher prices. It's supply and demand. When there's more money, prices go up. Your paycheck might grow 3% yearly. But prices grow 6% yearly. You fall behind every year. Your savings lose value sitting in the bank. Banks pay 0.5% interest. Inflation runs 6%. You lose 5.5% yearly. Bitcoin works differently. No one can print more Bitcoin. Only 21 million will exist. Ever. When demand grows, price goes up. When supply is fixed, scarcity creates value. Bitcoin protects against money printing. It can't be inflated away. It's digital gold for the internet age.",
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
    ],
    keyTakeaways: [
      "Money printing causes prices to rise",
      "Your savings lose value over time",
      "Bitcoin's fixed supply creates scarcity value"
    ],
    whyItMatters: "This matters because your money quietly loses value every year while sitting in banks, and understanding Bitcoin's scarcity helps you evaluate whether it could preserve your wealth better than traditional savings."
  }
];

async function rebuildWeek1() {
  try {
    console.log('Starting Week 1 rebuild...');
    
    // Delete existing Week 1 content
    await db.delete(contentQuizzes).where(eq(contentQuizzes.dayId, 1));
    await db.delete(contentQuizzes).where(eq(contentQuizzes.dayId, 2));
    await db.delete(contentLessons).where(eq(contentLessons.dayId, 1));
    await db.delete(contentLessons).where(eq(contentLessons.dayId, 2));
    await db.delete(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, 1));
    await db.delete(contentSetUpQuestions).where(eq(contentSetUpQuestions.dayId, 2));
    await db.delete(contentDays).where(eq(contentDays.dayIndex, 1));
    await db.delete(contentDays).where(eq(contentDays.dayIndex, 2));
    
    console.log('Deleted existing content');
    
    // Insert new content
    for (const day of week1Content) {
      // Insert day metadata
      const [dayRecord] = await db.insert(contentDays).values({
        dayIndex: day.dayIndex,
        title: day.title,
        theme: 'Problem Recognition',
        keyTakeaways: day.keyTakeaways,
        whyItMatters: day.whyItMatters
      }).returning();
      
      console.log(`Created day ${day.dayIndex}: ${day.title}`);
      
      // Insert setup questions
      for (const question of day.setupQuestions) {
        await db.insert(contentSetUpQuestions).values({
          dayId: dayRecord.id,
          question: question
        });
      }
      
      // Insert lesson
      await db.insert(contentLessons).values({
        dayId: dayRecord.id,
        title: day.title,
        content: day.lessonContent
      });
      
      // Insert quiz questions
      for (const quiz of day.quizQuestions) {
        await db.insert(contentQuizzes).values({
          dayId: dayRecord.id,
          question: quiz.question,
          options: [quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD],
          correctAnswer: quiz.correctAnswer,
          explanation: quiz.explanation
        });
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