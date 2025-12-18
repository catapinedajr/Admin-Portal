import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const newContent = [
  {
    dayIndex: 2,
    title: "Eggs are how much!? Understanding Money Problems",
    content: `You walk into the grocery store and see eggs cost $6. Your grandfather remembers when eggs were 30 cents. What happened?

Every country controls its own money. When governments need money for emergencies or want to help the economy, they print more money. This sounds helpful, but it creates a hidden problem.

Think of money like concert tickets. If there are 100 people and 100 tickets, each ticket is valuable. But if someone suddenly prints 200 more tickets, now there are 300 tickets for 100 seats. Each ticket becomes less valuable.

This is exactly what happens with regular money. When governments print more dollars, each dollar you own becomes worth less. The groceries cost the same amount of work to produce, but you need more dollars to buy them.

Bitcoin fixes this problem because nobody can print more Bitcoin. Ever. There will only be 21 million Bitcoin in existence. When demand goes up, the price goes up instead of someone printing more to meet demand.

This is why Bitcoin matters for your daily life. While your savings get quietly diluted by money printing, Bitcoin protects your purchasing power by staying rare.`,
    keyTakeaways: [
      "Money printing makes existing money worth less",
      "Higher prices are often caused by more money, not more expensive goods", 
      "Bitcoin has a fixed supply of 21 million coins forever",
      "Fixed supply protects your money from losing value"
    ],
    whyItMatters: "Understanding inflation protects you from losing money without realizing it. Every year, your savings become worth less because governments print more money. Bitcoin gives you a way to protect your purchasing power."
  },
  {
    dayIndex: 3,
    title: "Your Bitcoin Wallet: Like a Digital Safe",
    content: `Bitcoin wallets work differently than bank accounts. Let's learn how to keep your Bitcoin safe.

Think of your Bitcoin like it's stored in a locker. The locker is on a shared notebook that everyone can see. But to open your locker, you need a special key called a private key.

Your Bitcoin wallet is like a key ring that holds your secret codes. The wallet doesn't store Bitcoin inside it. Instead, it holds the keys that prove the Bitcoin belongs to you.

This is different from a bank account. With a bank account, the bank holds your money. With Bitcoin, you hold the keys and have complete control.

The most important rule in Bitcoin is: "Not your keys, not your coins." If someone else controls your private keys, they control your Bitcoin.

When you use Bitcoin, you become your own bank. This gives you freedom, but it also means you're responsible for keeping your money safe. Start with small amounts while you learn.`,
    keyTakeaways: [
      "Bitcoin wallets hold your secret keys, not your Bitcoin",
      "Your private keys prove you own specific Bitcoin",
      "Not your keys, not your coins - you must control your keys",
      "You become your own bank with Bitcoin"
    ],
    whyItMatters: "Learning about Bitcoin wallets protects your money from being stolen or lost. Many people lose Bitcoin because they don't understand how wallets work. Understanding wallets means you control your own money."
  },
  {
    dayIndex: 4,
    title: "Bitcoin Mining: Digital Gold Rush",
    content: `Bitcoin mining is like a digital gold rush, but instead of digging for gold, people use computers to solve puzzles.

Mining does three important jobs. First, miners check that all transactions are real. Second, they protect the network from bad actors. Third, they get rewarded with new Bitcoin.

When you send Bitcoin to someone, that transaction goes into a waiting area with thousands of others. Miners compete to solve a math puzzle that lets them process these transactions.

The puzzles are hard to solve but easy to check. Think of a crossword puzzle that takes hours to complete, but once someone shows you the answer, you can verify it's correct in seconds.

As more miners join, the puzzles get harder automatically. This keeps new Bitcoin being created at a steady rate - about every 10 minutes. Every four years, the reward gets cut in half.

The energy miners use isn't waste - it's what keeps Bitcoin secure. Just like banks need security guards, Bitcoin uses electricity to create digital security.`,
    keyTakeaways: [
      "Miners verify transactions and keep Bitcoin secure",
      "Mining rewards create new Bitcoin every 10 minutes",
      "Energy use protects Bitcoin from attacks",
      "Mining rewards get cut in half every four years"
    ],
    whyItMatters: "Understanding mining shows you why Bitcoin is secure and why it uses energy. The energy creates real security that makes Bitcoin trustworthy without needing banks or governments."
  },
  {
    dayIndex: 5,
    title: "How Bitcoin Payments Work",
    content: `When you send Bitcoin, something different happens than with regular money. Let's see how Bitcoin payments actually work.

With regular money, you tell your bank to move money from your account to someone else's account. The bank updates their records and the money moves. The bank controls everything.

With Bitcoin, you create a message that says "I want to send X Bitcoin to this address." You sign this message with your private key to prove it's really you. Then you broadcast this message to thousands of computers around the world.

These computers check your signature and make sure you have enough Bitcoin. If everything looks good, they add your transaction to the permanent record book that everyone shares.

The whole process takes about 10 minutes for the first confirmation. But once it's confirmed, the transaction can never be reversed or cancelled. Your Bitcoin has moved permanently.

This is peer-to-peer money. You sent Bitcoin directly to another person without any middleman. No bank, no payment company, no government got involved.`,
    keyTakeaways: [
      "Bitcoin transactions go directly person-to-person",
      "Your signature proves you approved the transaction",
      "Thousands of computers verify each transaction",
      "Once confirmed, transactions can never be reversed"
    ],
    whyItMatters: "Understanding how Bitcoin payments work shows you why it's revolutionary. For the first time, you can send money directly to anyone in the world without asking permission from banks or governments."
  }
];

async function rebuildContent() {
  const client = await pool.connect();
  
  try {
    console.log('Rebuilding content for Days 2-5...');
    
    for (const content of newContent) {
      // Insert content_days
      const dayResult = await client.query(
        'INSERT INTO content_days (day_index, title, theme, reading_level, cultural_stage, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [content.dayIndex, content.title, 'Bitcoin Education', 'beginner', 'curious', true]
      );
      
      const dayId = dayResult.rows[0].id;
      
      // Insert content_lessons
      await client.query(
        'INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters, estimated_read_time) VALUES ($1, $2, $3, $4, $5, $6)',
        [dayId, content.title, content.content, JSON.stringify(content.keyTakeaways), content.whyItMatters, 3]
      );
      
      console.log(`✓ Created Day ${content.dayIndex}: ${content.title}`);
    }
    
    console.log('\n✅ Successfully rebuilt content for Days 2-5!');
    
  } catch (error) {
    console.error('Error rebuilding content:', error);
  } finally {
    client.release();
  }
}

rebuildContent().catch(console.error);