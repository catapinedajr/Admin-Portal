import { db } from "./db";
import { contentDays, contentFacts, contentLessons, contentQuizzes, contentDiveDeeper } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function insertClaudeDay1Content() {
  try {
    console.log('🗑️ Removing existing Day 1 data...');
    
    // Get existing day 1 content
    const [existingDay] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, 1));
    
    if (existingDay) {
      // Get all facts for this day first
      const existingFacts = await db.select().from(contentFacts).where(eq(contentFacts.dayId, existingDay.id));
      
      // Delete in correct order due to foreign key constraints
      await db.delete(contentQuizzes).where(eq(contentQuizzes.dayId, existingDay.id));
      
      // Delete dive deeper content for each fact
      for (const fact of existingFacts) {
        await db.delete(contentDiveDeeper).where(eq(contentDiveDeeper.factId, fact.id));
      }
      
      await db.delete(contentLessons).where(eq(contentLessons.dayId, existingDay.id));
      await db.delete(contentFacts).where(eq(contentFacts.dayId, existingDay.id));
      await db.delete(contentDays).where(eq(contentDays.id, existingDay.id));
      console.log('✓ Removed existing Day 1 data');
    }
    
    console.log('💾 Inserting Claude-quality Day 1 content...');
    
    // 1. Create content day
    const [contentDay] = await db.insert(contentDays).values({
      dayIndex: 1,
      title: "Day 1: Understanding Bitcoin: Your First Step Into Digital Money",
      readingLevel: "9th_grade",
      culturalStage: "normie",
      theme: "Bitcoin Basics",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    console.log(`✓ Created content day with ID: ${contentDay.id}`);
    
    // 2. Insert daily facts with dive deeper content
    const facts = [
      {
        title: "Bitcoin is Digital Money",
        content: "Bitcoin is a new type of money that exists only on computers. Unlike cash in your wallet, you can't touch Bitcoin, but you can still use it to buy things.",
        category: "basic",
        diveDeeper: {
          explanation: "Bitcoin represents a completely new way to think about money. Traditional money is controlled by banks and governments, but Bitcoin is controlled by math and computer code. This means no single person or organization can print more Bitcoin or take it away from you.",
          examples: ["You can send Bitcoin to anyone in the world instantly", "No bank can freeze your Bitcoin account", "Bitcoin works 24/7, even on weekends and holidays", "Only you control your Bitcoin with your private key"],
          visualDescription: "Imagine a digital wallet on your phone that holds invisible coins. These coins are protected by the strongest computer security in the world, making them safer than cash in your physical wallet.",
          keyTakeaways: ["Bitcoin exists only as computer data", "No government or bank controls it", "You are your own bank with Bitcoin", "Math and code keep Bitcoin secure"]
        }
      },
      {
        title: "Fixed Supply Forever",
        content: "There will only ever be 21 million Bitcoin. No one can create more, unlike regular money where governments can print as much as they want.",
        category: "economics",
        diveDeeper: {
          explanation: "Unlike traditional money where central banks can print unlimited amounts, Bitcoin has a hard cap built into its code. This fixed supply is like digital gold - scarce and valuable because it can't be inflated away.",
          examples: ["The US printed 40% of all dollars in just 4 years (2020-2024)", "Bitcoin's supply increases by only 1.7% per year and decreasing", "After 2140, no new Bitcoin will ever be created", "This scarcity makes Bitcoin valuable over time"],
          visualDescription: "Picture a vault with exactly 21 million gold coins. Once they're all taken out, that's it - no more will ever be made. Bitcoin works the same way, but the vault is made of computer code instead of steel.",
          keyTakeaways: ["Only 21 million Bitcoin will ever exist", "Governments can't print more Bitcoin", "Scarcity makes Bitcoin valuable", "Your Bitcoin can't be inflated away"]
        }
      },
      {
        title: "Send Money Anywhere",
        content: "You can send Bitcoin to anyone in the world instantly, just like sending an email. No banks needed, no waiting days for transfers.",
        category: "technology",
        diveDeeper: {
          explanation: "Traditional bank transfers can take days, cost high fees, and don't work on weekends. Bitcoin transfers happen 24/7 and settle much faster than traditional banking systems. It's like having a global payment system that never sleeps.",
          examples: ["Send $1000 to Japan in 30 minutes vs 3-5 business days", "No bank holidays - Bitcoin works on Christmas and weekends", "Transaction fees often under $1 vs $25+ for wire transfers", "No forms to fill out or banks to call"],
          visualDescription: "Think of Bitcoin like email for money. Just as you can email anyone instantly anywhere in the world, you can send Bitcoin the same way - fast, direct, and without asking permission from anyone.",
          keyTakeaways: ["Bitcoin transfers work 24/7 worldwide", "Faster than traditional bank transfers", "Lower fees than wire transfers", "No bank approval needed"]
        }
      }
    ];
    
    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      
      const [savedFact] = await db.insert(contentFacts).values({
        dayId: contentDay.id,
        title: fact.title,
        content: fact.content,
        category: fact.category,
        icon: "💡",
        orderIndex: i,
        createdAt: new Date()
      }).returning();
      
      // Insert dive deeper content
      await db.insert(contentDiveDeeper).values({
        factId: savedFact.id,
        explanation: fact.diveDeeper.explanation,
        examples: fact.diveDeeper.examples,
        visualDescription: fact.diveDeeper.visualDescription,
        keyTakeaways: fact.diveDeeper.keyTakeaways,
        createdAt: new Date()
      });
      
      console.log(`✓ Saved daily fact ${i + 1}: "${fact.title}" with dive deeper content`);
    }
    
    // 3. Insert lesson
    const lessonContent = `Imagine you're holding a twenty-dollar bill. You can see it, touch it, and hand it to a friend. Now imagine money that you can't touch but is more secure than cash in your wallet. That's Bitcoin.

Bitcoin is like a combination of gold and email. It's valuable like gold because there's a limited amount, but you can send it instantly like an email. Think of it as digital gold that you can email to anyone in the world.

Here's how it works in simple terms: Picture a giant notebook that everyone in the world can see but no one can erase or change. Every time someone sends Bitcoin, it gets written in this notebook. Thousands of computers around the world keep copies of this notebook, making sure everything matches up perfectly.

When you own Bitcoin, you have a special secret code (like a password) that proves the Bitcoin belongs to you. This code is so complex that even the world's most powerful computers would need millions of years to guess it. That's what makes Bitcoin secure.

Unlike regular money, no government or bank controls Bitcoin. It runs on math and computer code that can't be changed or manipulated. This means your Bitcoin can't be printed away like regular money, making it a good store of value over time.

Bitcoin works like the internet - it's everywhere and nowhere at the same time. You don't need permission from anyone to use it, and it works the same way whether you're in New York or Tokyo. It's the first truly global money that belongs to everyone and no one at the same time.`;

    const keyTakeaways = [
      "Bitcoin is digital money you can't touch but can use everywhere",
      "It's like digital gold you can email instantly worldwide",
      "A global notebook tracks every Bitcoin transaction safely",
      "No government or bank controls Bitcoin - only math and code"
    ];
    
    const whyItMatters = "Bitcoin matters because it gives you complete control over your money for the first time in history. Unlike bank accounts that can be frozen or cash that loses value when governments print more, Bitcoin puts you in charge. It's like having a Swiss bank account in your pocket that works anywhere in the world, 24 hours a day. As more people lose trust in traditional money systems, Bitcoin offers an alternative that can't be manipulated by politics or poor economic decisions.";
    
    await db.insert(contentLessons).values({
      dayId: contentDay.id,
      title: "Understanding Bitcoin: Your First Step Into Digital Money",
      content: lessonContent,
      keyTakeaways: keyTakeaways,
      whyItMatters: whyItMatters,
      estimatedReadTime: 3,
      createdAt: new Date()
    });
    console.log('✓ Saved comprehensive lesson');
    
    // 4. Insert quiz questions
    const quizQuestions = [
      {
        question: "What makes Bitcoin different from the cash in your wallet?",
        options: ["Bitcoin exists only on computers and can't be touched", "Bitcoin is printed by the government", "Bitcoin can only be used in one country", "Bitcoin expires after one year"],
        correctAnswer: 0,
        explanation: "Bitcoin is digital money that exists only as computer data, unlike physical cash you can hold."
      },
      {
        question: "How many Bitcoin will ever exist?",
        options: ["Unlimited - more can always be created", "21 million maximum forever", "100 million", "It depends on government decisions"],
        correctAnswer: 1,
        explanation: "Bitcoin has a hard cap of 21 million coins built into its code that can never be changed."
      },
      {
        question: "What is Bitcoin compared to in the lesson?",
        options: ["A bank account", "A credit card", "Digital gold you can email", "A government bond"],
        correctAnswer: 2,
        explanation: "Bitcoin is described as digital gold because it's valuable and scarce, but you can send it instantly like email."
      },
      {
        question: "Who controls Bitcoin?",
        options: ["The US government", "Banks and financial institutions", "Math and computer code", "The Bitcoin company"],
        correctAnswer: 2,
        explanation: "Bitcoin is controlled by mathematical rules and computer code, not by any person, company, or government."
      },
      {
        question: "How does Bitcoin keep track of transactions?",
        options: ["Banks record everything in private databases", "A global notebook that everyone can see but no one can change", "The government maintains all records", "Only Bitcoin owners can see their transactions"],
        correctAnswer: 1,
        explanation: "Bitcoin uses a public ledger (like a global notebook) that everyone can verify but no one can alter."
      }
    ];
    
    const quizInserts = quizQuestions.map((q, index) => ({
      dayId: contentDay.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      orderIndex: index,
      createdAt: new Date()
    }));

    await db.insert(contentQuizzes).values(quizInserts);
    console.log(`✓ Saved ${quizQuestions.length} quiz questions`);
    
    console.log('🎉 Successfully inserted Claude-quality Day 1 content!');
    console.log('📊 Content summary: 3 facts with dive deeper, 1 comprehensive lesson, 5 quiz questions');
    
    return { success: true, message: "Claude Day 1 content inserted successfully" };
  } catch (error) {
    console.error('❌ Failed to insert Day 1 content:', error);
    throw error;
  }
}