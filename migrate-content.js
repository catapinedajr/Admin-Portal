import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Sample lesson content from backup - I'll manually extract a few key lessons
const lessons = [
  {
    dayIndex: 2,
    title: "Eggs are how much!? Understanding Money Problems",
    content: `You walk into the grocery store and see eggs cost $6. Your grandfather remembers when eggs were 30 cents. What happened to our money?

Every country controls its own money. When things get expensive or when emergencies happen, governments print more money. This sounds helpful, but it creates a hidden problem that quietly steals from everyone.

Think of money like tickets to a concert. If there are 100 people and 100 tickets, each ticket is valuable. But if the concert organizer suddenly prints 200 more tickets, now there are 300 tickets for 100 seats. Each ticket becomes less valuable.

This is exactly what happens with regular money. When governments print more dollars, each dollar you own becomes worth less. The groceries cost the same amount of work to produce, but you need more dollars to buy them because there are more dollars competing for the same stuff.

Bitcoin fixes this problem because nobody can print more Bitcoin. Ever. There will only be 21 million Bitcoin in existence. When demand goes up, the price goes up instead of someone printing more Bitcoin to meet demand.

This is why Bitcoin matters for your daily life. While your savings get quietly diluted by money printing, Bitcoin protects your purchasing power by staying rare.`,
    keyTakeaways: [
      "Money printing makes existing money worth less",
      "Higher prices are often caused by more money, not more expensive goods",
      "Bitcoin has a fixed supply of 21 million coins forever",
      "Fixed supply protects your money from losing value"
    ],
    whyItMatters: "Understanding inflation protects you from losing money without realizing it. Every year, your savings become worth less because governments print more money. Bitcoin gives you a way to protect your purchasing power by owning money that can't be printed.",
    estimatedReadTime: 3
  },
  {
    dayIndex: 3,
    title: "Your Bitcoin Wallet: Like a Digital Key Ring",
    content: `Bitcoin wallets work differently than bank accounts. Let's learn how to keep your Bitcoin safe.

Think of your Bitcoin like it's stored in a locker. The locker is on the shared notebook that everyone can see. But to open your locker, you need a special key. In Bitcoin, this key is called a private key. It's a secret code that only you should know.

Your Bitcoin wallet is like a key ring that holds your secret codes. The wallet doesn't actually store Bitcoin inside it. Instead, it holds the keys that prove the Bitcoin belongs to you. When you want to check how much Bitcoin you have, the wallet looks at the shared notebook to see what's in your locker.

This is different from a bank account. With a bank account, the bank holds your money and gives you access to it. With Bitcoin, you hold the keys and have complete control. This is powerful, but it also means you're responsible for keeping your keys safe.

The most important rule in Bitcoin is: "Not your keys, not your coins." If someone else controls your private keys, they control your Bitcoin. This is why many people move their Bitcoin off exchanges and into their own wallets.

When you use Bitcoin, you become your own bank. This gives you amazing freedom, but it also means you're responsible for keeping your money safe. Start with small amounts while you learn, then you can store more as you get comfortable.`,
    keyTakeaways: [
      "Bitcoin wallets hold your secret keys, not your Bitcoin",
      "Your private keys prove you own specific Bitcoin", 
      "The wallet checks the shared notebook to show your balance",
      "Not your keys, not your coins - you must control your keys"
    ],
    whyItMatters: "Learning about Bitcoin wallets protects your money from being stolen or lost. Many people lose their Bitcoin because they don't understand how wallets work. If you keep Bitcoin on an exchange, they control your money. Understanding wallets means you control your own money instead of trusting others.",
    estimatedReadTime: 3
  },
  {
    dayIndex: 4,
    title: "Bitcoin Mining: The Digital Gold Rush",
    content: `Bitcoin mining is like a digital gold rush, but instead of digging for gold, people use computers to solve puzzles.

Mining does three important jobs for Bitcoin. First, miners check that all transactions are real and follow the rules. Second, they protect the network from bad actors trying to cheat. Third, they get rewarded with new Bitcoin for doing this work.

Here's how it works. When you send Bitcoin to someone, that transaction gets put into a waiting area with thousands of other transactions. Miners compete to solve a math puzzle that lets them process a group of transactions. The first miner to solve the puzzle gets to add those transactions to the permanent record and earns new Bitcoin as a reward.

The puzzles are designed to be hard to solve but easy to check. Think of it like a crossword puzzle that takes hours to complete, but once someone shows you the answer, you can verify it's correct in seconds. This makes it expensive to attack Bitcoin because you'd need to solve puzzles faster than thousands of other miners combined.

As more miners join the network, the puzzles automatically get harder. This keeps new Bitcoin being created at a steady rate - about every 10 minutes. Every four years, the reward gets cut in half, making Bitcoin more rare over time.

The energy miners use isn't waste - it's what keeps Bitcoin secure. Just like banks need security guards and steel vaults, Bitcoin uses electricity to create digital security that nobody can break.`,
    keyTakeaways: [
      "Miners verify transactions and keep Bitcoin secure",
      "Mining rewards create new Bitcoin every 10 minutes",
      "Energy use protects Bitcoin from attacks",
      "Mining rewards get cut in half every four years"
    ],
    whyItMatters: "Understanding mining shows you why Bitcoin is secure and why it uses energy. Mining isn't just about creating new Bitcoin - it's about protecting everyone's money. The energy use creates real security that makes Bitcoin trustworthy without needing banks or governments.",
    estimatedReadTime: 3
  }
];

async function restoreContent() {
  const client = await pool.connect();
  
  try {
    console.log('Starting content restoration...');
    
    for (const lesson of lessons) {
      // Check if content_days already exists
      const existingDay = await client.query(
        'SELECT id FROM content_days WHERE day_index = $1',
        [lesson.dayIndex]
      );
      
      let dayId;
      if (existingDay.rows.length > 0) {
        dayId = existingDay.rows[0].id;
        // Update existing day
        await client.query(
          'UPDATE content_days SET title = $2 WHERE id = $1',
          [dayId, lesson.title]
        );
      } else {
        // Insert new day
        const dayResult = await client.query(
          'INSERT INTO content_days (day_index, title, theme, reading_level, cultural_stage, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [lesson.dayIndex, lesson.title, 'Bitcoin Education', 'beginner', 'curious', true]
        );
        dayId = dayResult.rows[0].id;
      }
      
      // Check if lesson exists
      const existingLesson = await client.query(
        'SELECT id FROM content_lessons WHERE day_id = $1',
        [dayId]
      );
      
      if (existingLesson.rows.length > 0) {
        // Update existing lesson
        await client.query(
          'UPDATE content_lessons SET title = $2, content = $3, key_takeaways = $4, why_it_matters = $5, estimated_read_time = $6 WHERE day_id = $1',
          [dayId, lesson.title, lesson.content, JSON.stringify(lesson.keyTakeaways), lesson.whyItMatters, lesson.estimatedReadTime]
        );
      } else {
        // Insert new lesson
        await client.query(
          'INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters, estimated_read_time) VALUES ($1, $2, $3, $4, $5, $6)',
          [dayId, lesson.title, lesson.content, JSON.stringify(lesson.keyTakeaways), lesson.whyItMatters, lesson.estimatedReadTime]
        );
      }
      
      console.log(`Restored lesson for Day ${lesson.dayIndex}: ${lesson.title}`);
    }
    
    console.log('Successfully restored lesson content');
    
  } catch (error) {
    console.error('Error restoring content:', error);
    throw error;
  } finally {
    client.release();
  }
}

restoreContent().catch(console.error);