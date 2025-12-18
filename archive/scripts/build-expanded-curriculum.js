#!/usr/bin/env node

import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure neon
const neonConfig = { webSocketConstructor: ws };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Expanded 90-day curriculum structure
const expandedCurriculum = {
  // WEEK 1-2: The Money Problem (Days 1-14)
  week1_2: {
    theme: "Understanding Why Current Money is Broken",
    days: [
      {
        day: 1,
        title: "Banks Control Your Money",
        lesson_title: "The Permission Economy - Why You Need Bank Approval",
        content: "You wake up, check your bank account, and see your money sitting there. But here's the truth: that money isn't really yours. It's a promise from the bank that they'll give it to you when you ask. And they can break that promise anytime they want.\n\nEvery time you want to use your money, you're asking permission. Want to wire money to family? The bank decides if that's okay. Want to spend your own money on something they don't like? They can freeze your account. Want to access your money on the weekend? Too bad, banks are closed.\n\nThis isn't freedom. This is financial imprisonment disguised as convenience. You work hard for your money, but once it goes into their system, you become a beggar asking for permission to use what's rightfully yours.\n\nThe 2022 Canadian Freedom Convoy showed this perfectly. Peaceful protesters had their bank accounts frozen by government order. Their money, their savings, their ability to buy food - gone with a phone call. No trial, no appeal, just financial punishment.\n\nThere has to be a better way. What if you could truly own your money, without needing anyone's permission to use it?",
        key_takeaways: [
          "Banks control access to your money, not you",
          "Every financial action requires permission from intermediaries", 
          "Account freezes can happen without warning or trial",
          "True ownership means no one can deny you access"
        ],
        reading_level: "8th_grade",
        estimated_read_time: 3
      },
      {
        day: 2,
        title: "Governments Print Money Away",
        lesson_title: "The Invisible Tax - How Money Printing Steals Your Wealth",
        content: "Imagine you're saving for a house. You work overtime, skip vacations, and carefully save $50,000. Then someone with a magic machine starts making copies of money. Suddenly, your $50,000 buys less house than it did yesterday. This isn't imagination - this is reality.\n\nGovernments have printing presses, and they use them constantly. In 2020 alone, the US government created over $7 trillion from thin air. That's more money in one year than existed in the entire economy just decades ago. While you're working hard to earn money, they're creating it with keystrokes.\n\nEvery new dollar they print makes your dollars worth less. It's like adding water to milk - the more water you add, the weaker the milk becomes. This hidden tax hits the poor hardest. Rich people own stocks and real estate that rise with inflation. Working people see their savings become worthless.\n\nThe worst part? They tell you it's good for you. They call it 'economic stimulus' or 'quantitative easing.' But it's really wealth transfer from savers to borrowers, from workers to those who control the money printer.\n\nWhat if there was money that couldn't be printed? Money with a supply limit written in unbreakable code?",
        key_takeaways: [
          "Money printing is an invisible tax on your savings",
          "Governments created trillions in new money recently",
          "Inflation hurts savers and workers the most",
          "Fixed supply money would protect your purchasing power"
        ],
        reading_level: "8th_grade",
        estimated_read_time: 3
      },
      {
        day: 3,
        title: "Sending Money is Broken",
        lesson_title: "The Email Test - Why Money Moves Slower Than Messages",
        content: "Here's a simple test: Send an email to someone in Japan right now. It arrives instantly. Now try sending them $100. You'll discover that moving money is stuck in the 1970s while everything else lives in the digital age.\n\nYour international wire transfer will take 3-5 business days, cost $25-50 in fees, and require forms, phone calls, and banker approval. The money will bounce between multiple banks, each taking a cut and adding delay. And if you try this on a Friday evening? Your money waits until Monday because banks need their beauty sleep.\n\nThis isn't just inconvenient - it's economically devastating. Small businesses can't compete globally when payments take a week to settle. Families can't send emergency funds when Western Union charges 10% fees. Workers can't receive wages instantly when banks control the payment rails.\n\nThe technology to send value instantly exists - we use it for emails, messages, and cat videos. But money is trapped in a system designed when computers filled entire rooms and the internet didn't exist.\n\nImagine if money moved like email: instantly, globally, with no intermediaries taking cuts or causing delays. This isn't fantasy - this is exactly what Bitcoin does, 24 hours a day, 365 days a year.",
        key_takeaways: [
          "International money transfers take days and cost fortunes",
          "The banking system operates on outdated 1970s technology",
          "Payment delays hurt businesses and families economically",
          "Money should move as easily as email messages"
        ],
        reading_level: "8th_grade", 
        estimated_read_time: 3
      }
      // Continue with remaining days...
    ]
  },
  
  // WEEK 3-4: Bitcoin as the Solution (Days 15-28)
  week3_4: {
    theme: "Introducing Bitcoin's Revolutionary Approach",
    days: [
      {
        day: 15,
        title: "Money Like Email",
        lesson_title: "The Internet of Money - How Bitcoin Breaks Banking Barriers",
        content: "In 1971, the first email was sent between two computers. People thought it was a neat trick, but why would anyone need electronic mail when the postal service worked fine? Fifty years later, physical mail seems ancient and email powers the global economy.\n\nBitcoin is email for money. Just like email eliminated the need for physical letters, Bitcoin eliminates the need for financial intermediaries. You can send value directly to anyone, anywhere, instantly.\n\nWhen you send an email, you don't need permission from the post office. The message goes directly from your computer to the recipient's computer. Bitcoin works the same way - value goes directly from your wallet to the recipient's wallet, with no bank in the middle.\n\nThe network never sleeps, never takes holidays, and never asks for paperwork. Send $1 or $1 million to Tokyo on Christmas morning - Bitcoin doesn't care. The transaction will confirm in about 10 minutes, compared to traditional banking's 3-5 day international transfers.\n\nJust like email seemed impossible before the internet, Bitcoin seems impossible before you understand it. But once you see money moving like email, the old banking system looks as outdated as sending physical letters.",
        key_takeaways: [
          "Bitcoin enables direct value transfer like email enables direct messaging",
          "No intermediaries needed - payments go peer-to-peer",
          "The network operates 24/7 without human intervention",
          "Digital money moves at internet speed, not banking speed"
        ],
        reading_level: "8th_grade",
        estimated_read_time: 3
      }
      // Continue with remaining days...
    ]
  },

  // WEEK 5-6: How Bitcoin Actually Works (Days 29-42)
  week5_6: {
    theme: "Technical Understanding Made Simple",
    days: [
      {
        day: 29,
        title: "The Shared Digital Notebook",
        lesson_title: "Everyone Has the Same Ledger - No Single Point of Control",
        content: "Imagine a notebook that tracks who owns what money. In the traditional system, banks keep their own private notebooks, and you have to trust they're honest. Bitcoin flips this completely - everyone has the exact same notebook.\n\nThere are over 15,000 computers worldwide, each keeping an identical copy of every Bitcoin transaction ever made. When someone sends Bitcoin, all these computers update their notebooks at the same time. If one computer tries to cheat by writing false information, the other 14,999 computers reject it.\n\nThis shared ledger means no single entity controls Bitcoin. Banks can't manipulate the records because they don't control the notebook. Governments can't print more Bitcoin because the code won't let them. Hackers can't change transaction history because they'd need to control thousands of computers simultaneously.\n\nEvery 10 minutes, all computers agree on the latest page of transactions and add it to their notebooks. This creates an unchangeable history of every Bitcoin that has ever moved. It's like having 15,000 witnesses to every financial transaction, making fraud virtually impossible.\n\nThis is why Bitcoin works without trust - the math and network consensus replace the need to trust any individual or institution.",
        key_takeaways: [
          "Thousands of computers maintain identical transaction records",
          "No single entity can control or manipulate the ledger",
          "Network consensus replaces the need for trusted intermediaries",
          "Every transaction is verified by thousands of independent computers"
        ],
        reading_level: "8th_grade",
        estimated_read_time: 3
      }
      // Continue with remaining days...
    ]
  }
};

async function createExpandedCurriculumTables() {
  const client = await pool.connect();
  
  try {
    console.log('Creating expanded curriculum tracking tables...');
    
    // Create expanded curriculum days table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expanded_curriculum_days (
        id SERIAL PRIMARY KEY,
        day_number INTEGER UNIQUE NOT NULL,
        week_theme TEXT NOT NULL,
        title TEXT NOT NULL,
        lesson_title TEXT NOT NULL,
        content TEXT NOT NULL,
        key_takeaways JSONB NOT NULL,
        reading_level TEXT NOT NULL,
        estimated_read_time INTEGER NOT NULL,
        original_source_day INTEGER,
        original_source_type TEXT, -- 'lesson', 'fact', 'dive_deeper'
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create curriculum comparison table
    await client.query(`
      CREATE TABLE IF NOT EXISTS curriculum_comparison (
        id SERIAL PRIMARY KEY,
        comparison_type TEXT NOT NULL, -- 'current_vs_expanded'
        current_structure JSONB NOT NULL,
        expanded_structure JSONB NOT NULL,
        benefits_analysis JSONB NOT NULL,
        implementation_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
}

async function insertExpandedCurriculum() {
  const client = await pool.connect();
  
  try {
    console.log('Inserting expanded curriculum data...');
    
    // Clear existing data
    await client.query('DELETE FROM expanded_curriculum_days');
    
    // Insert sample weeks
    for (const [weekKey, weekData] of Object.entries(expandedCurriculum)) {
      for (const day of weekData.days) {
        await client.query(`
          INSERT INTO expanded_curriculum_days (
            day_number, week_theme, title, lesson_title, content, 
            key_takeaways, reading_level, estimated_read_time,
            original_source_day, original_source_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          day.day,
          weekData.theme,
          day.title,
          day.lesson_title,
          day.content,
          JSON.stringify(day.key_takeaways),
          day.reading_level,
          day.estimated_read_time,
          Math.ceil(day.day / 3), // Rough mapping to original days
          'expanded_from_fact'
        ]);
      }
    }

    // Insert comparison analysis
    await client.query(`
      INSERT INTO curriculum_comparison (
        comparison_type, current_structure, expanded_structure, benefits_analysis
      ) VALUES ($1, $2, $3, $4)
    `, [
      'current_vs_expanded',
      JSON.stringify({
        days: 30,
        lessons: 30,
        facts: 90,
        total_concepts: 120,
        redundancy_issue: "Facts preview lessons creating overlap"
      }),
      JSON.stringify({
        days: 90,
        micro_lessons: 90,
        total_concepts: 90,
        content_efficiency: "Each fact becomes standalone lesson",
        extension_factor: "3x course length from same content"
      }),
      JSON.stringify({
        retention: "One concept per day improves understanding",
        engagement: "Smaller daily commitment increases completion",
        value: "3x longer course perceived as more valuable",
        habit: "21+ days builds stronger learning habits",
        revenue: "Extended course duration increases subscription value"
      })
    ]);

    console.log('Sample curriculum data inserted successfully!');
    
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    client.release();
  }
}

async function generateFullCurriculum() {
  console.log('Generating complete 90-day expanded curriculum...');
  
  // This would contain the full expansion logic
  // For now, let's create a framework showing the approach
  
  const fullOutline = {
    "Week 1-2: Money Problems (Days 1-14)": [
      "Banks Control Your Money",
      "Governments Print Money Away", 
      "Sending Money is Broken",
      "You Don't Really Own Your Money",
      "The Weekend Money Problem",
      "The Permission Economy",
      "International Wire Transfer Hell",
      "Bank Fees Are Wealth Extraction",
      "Account Freezes Without Warning",
      "Financial Surveillance State",
      "Currency Devaluation History",
      "The Inflation Tax Explained",
      "Why Banks Get Rich While You Get Poor",
      "There Has to Be a Better Way"
    ],
    
    "Week 3-4: Bitcoin Solution (Days 15-28)": [
      "Money Like Email",
      "You Control Your Secret Code",
      "No Bank Can Freeze Bitcoin", 
      "Only 21 Million Ever",
      "Written in Unbreakable Code",
      "Works 24/7 Never Closes",
      "Your Own Bank",
      "Peer-to-Peer Payments",
      "Censorship Resistance",
      "Global Access",
      "No Permission Required",
      "Mathematical Guarantees",
      "Network Effects",
      "Digital Scarcity"
    ],

    "Week 5-6: How It Works (Days 29-42)": [
      "The Shared Digital Notebook",
      "Digital Signatures Prove Ownership",
      "Transactions Become Permanent",
      "The Mining Network",
      "Proof of Work Security", 
      "The Chain of Blocks",
      "Bitcoin Since 2009",
      "Network Consensus",
      "Cryptographic Hashing",
      "Public Key Cryptography",
      "Transaction Verification",
      "Block Construction",
      "Difficulty Adjustment",
      "Network Immutability"
    ],

    "Week 7-12: Advanced Concepts (Days 43-84)": [
      // This would continue the pattern through all 90 days
      "Wallet Types and Security",
      "Private Key Management", 
      "Seed Phrase Recovery",
      "Hardware Wallets",
      "Hot vs Cold Storage",
      "Multi-signature Security",
      // ... continue to day 84
    ],

    "Week 13: Integration & Mastery (Days 85-90)": [
      "Putting It All Together",
      "Common Misconceptions Debunked",
      "Bitcoin vs Traditional Finance",
      "Your Bitcoin Journey Ahead",
      "Advanced Topics Preview",
      "Month 2 Economics Preparation"
    ]
  };

  return fullOutline;
}

// Main execution
async function main() {
  console.log('Building Expanded 90-Day Curriculum Database...\n');
  
  await createExpandedCurriculumTables();
  await insertExpandedCurriculum();
  
  const fullOutline = await generateFullCurriculum();
  
  console.log('\n=== FULL 90-DAY EXPANSION OUTLINE ===');
  for (const [section, days] of Object.entries(fullOutline)) {
    console.log(`\n${section}:`);
    days.forEach((day, index) => {
      console.log(`  ${String(index + 1).padStart(2, '0')}. ${day}`);
    });
  }

  console.log('\n=== DATABASE QUERY EXAMPLES ===');
  console.log('View expanded curriculum:');
  console.log('SELECT day_number, title, lesson_title, week_theme FROM expanded_curriculum_days ORDER BY day_number;');
  console.log('\nView curriculum comparison:');
  console.log('SELECT * FROM curriculum_comparison;');
  
  await pool.end();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}