import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });
const { 
  forumCategories, 
  forumPosts, 
  forumPostStats,
  forumReplies,
  forumReplyStats,
  userKarma,
  adCampaigns,
  adCreatives
} = schema;

const categories = [
  { 
    name: "Bitcoin Basics", 
    slug: "bitcoin-basics",
    description: "Fundamental concepts, terminology, and beginner questions about Bitcoin",
    sortOrder: 1 
  },
  { 
    name: "Why Bitcoin", 
    slug: "why-bitcoin",
    description: "Understanding Bitcoin's value proposition and monetary properties",
    sortOrder: 2 
  },
  { 
    name: "Stacking & Strategy", 
    slug: "stacking-strategy",
    description: "DCA strategies, accumulation methods, and long-term planning",
    sortOrder: 3 
  },
  { 
    name: "Macro & Markets", 
    slug: "macro-markets",
    description: "Economic analysis, market cycles, and global monetary policy",
    sortOrder: 4 
  },
  { 
    name: "Security & Self-Custody", 
    slug: "security-self-custody",
    description: "Hardware wallets, seed phrases, and protecting your Bitcoin",
    sortOrder: 5 
  },
  { 
    name: "Bitcoin Lifestyle", 
    slug: "bitcoin-lifestyle",
    description: "Living on Bitcoin, low time preference, and personal finance",
    sortOrder: 6 
  },
  { 
    name: "Career & Business", 
    slug: "career-business",
    description: "Working in Bitcoin, starting businesses, and professional opportunities",
    sortOrder: 7 
  },
  { 
    name: "Orange Pilling", 
    slug: "orange-pilling",
    description: "Sharing Bitcoin knowledge with friends, family, and skeptics",
    sortOrder: 8 
  },
  { 
    name: "News & Events", 
    slug: "news-events",
    description: "Latest developments, conferences, and important announcements",
    sortOrder: 9 
  },
  { 
    name: "Community", 
    slug: "community",
    description: "General discussion, meetups, and connecting with fellow Bitcoiners",
    sortOrder: 10 
  }
];

const posts = [
  {
    userId: 1,
    categoryId: 1,
    title: "What's the difference between a hot wallet and cold wallet?",
    content: "I keep hearing these terms but I'm confused. Can someone explain in simple terms which one I should use?",
    flair: "question"
  },
  {
    userId: 2,
    categoryId: 1,
    title: "Understanding Bitcoin's 21 million supply cap",
    content: "One of the most important aspects of Bitcoin is its fixed supply of 21 million coins. Unlike fiat currencies that can be printed infinitely, Bitcoin's supply is mathematically limited. This is enforced by the protocol itself and cannot be changed without consensus from the entire network.\n\nHere's why this matters:\n1. Scarcity creates value preservation\n2. Predictable monetary policy\n3. Protection against inflation\n4. No central authority can dilute your holdings",
    flair: "article",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800"
  },
  {
    userId: 1,
    categoryId: 2,
    title: "Bitcoin vs Gold: Which is better for long-term savings?",
    content: "I've been doing research on both and I'm curious what the community thinks. Gold has been around for thousands of years but Bitcoin seems to have some unique properties.",
    flair: "discussion"
  },
  {
    userId: 3,
    categoryId: 2,
    title: "The Cantillon Effect explained",
    content: "Ever wonder why the rich get richer while savers lose purchasing power? It's called the Cantillon Effect. When new money is created, those closest to the money printer benefit first.\n\nBitcoin fixes this by having a transparent, predictable issuance schedule that no one can manipulate.",
    flair: "article",
    linkUrl: "https://nakamotoinstitute.org"
  },
  {
    userId: 2,
    categoryId: 3,
    title: "My 2-year DCA journey: lessons learned",
    content: "Started stacking 2 years ago with $50/week. Here's what I've learned:\n\n1. Consistency beats timing\n2. Don't check the price daily\n3. Have a long-term mindset\n4. Self-custody is essential\n\nAMA about my experience!",
    flair: "discussion"
  },
  {
    userId: 1,
    categoryId: 3,
    title: "Best DCA frequency: daily, weekly, or monthly?",
    content: "I've been doing weekly but wondering if there's an optimal frequency. Does it really make a difference over a 10-year horizon?",
    flair: "question"
  },
  {
    userId: 3,
    categoryId: 4,
    title: "Federal Reserve just announced another rate decision",
    content: "The Fed just made their latest announcement. What does this mean for Bitcoin and the broader economy? Share your thoughts.",
    flair: "discussion"
  },
  {
    userId: 2,
    categoryId: 4,
    title: "Understanding the Bitcoin halving cycle",
    content: "The halving is when Bitcoin's block reward gets cut in half approximately every 4 years. This reduces the new supply entering the market.\n\nHistorically, this has led to significant price appreciation in the following 12-18 months. Here's a breakdown of past cycles and what we might expect.",
    flair: "article",
    imageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800"
  },
  {
    userId: 1,
    categoryId: 5,
    title: "Just set up my first hardware wallet!",
    content: "Finally took the plunge and got a hardware wallet. The setup was easier than I expected. Highly recommend for anyone holding significant amounts.",
    flair: "discussion"
  },
  {
    userId: 3,
    categoryId: 5,
    title: "Seed phrase backup best practices",
    content: "Your seed phrase is the key to your Bitcoin. Here are my recommendations:\n\n- NEVER store digitally (no photos, no cloud)\n- Use metal backup for fire/water resistance\n- Consider geographic distribution\n- Test your recovery process",
    flair: "article"
  },
  {
    userId: 2,
    categoryId: 6,
    title: "How Bitcoin changed my spending habits",
    content: "Since I started stacking, I've become much more intentional about purchases. Instead of impulse buying, I now ask myself: 'Is this worth the future value of that Bitcoin?'\n\nAnyone else experience this shift in mindset?",
    flair: "discussion"
  },
  {
    userId: 1,
    categoryId: 7,
    title: "Bitcoin jobs: where to find opportunities?",
    content: "Looking to transition my career into the Bitcoin industry. Where are the best places to find job listings? Any companies known for being great to work for?",
    flair: "question"
  },
  {
    userId: 3,
    categoryId: 8,
    title: "I orange pilled my wife!!!",
    content: "After 2 years of casually mentioning Bitcoin, she finally asked me to explain it properly. Used the inflation angle and showed her our purchasing power declining. She's now stacking too!\n\nWhat approaches have worked for you?",
    flair: "discussion"
  },
  {
    userId: 2,
    categoryId: 8,
    title: "Best resources for introducing Bitcoin to normies?",
    content: "Looking for beginner-friendly content to share with friends who are curious but skeptical. What books, videos, or articles have worked best for you?",
    flair: "question"
  },
  {
    userId: 1,
    categoryId: 9,
    title: "El Salvador update: 3 years of Bitcoin adoption",
    content: "It's been 3 years since El Salvador made Bitcoin legal tender. What has the impact been? Let's discuss the successes and challenges.",
    flair: "discussion"
  },
  {
    userId: 3,
    categoryId: 10,
    title: "Virtual meetup this Saturday!",
    content: "Organizing a virtual hangout for HODLearn community members. All experience levels welcome. We'll be discussing stacking strategies and answering questions.\n\nDrop a comment if you're interested!",
    flair: "discussion"
  },
  {
    userId: 2,
    categoryId: 1,
    title: "Michael Saylor explains Bitcoin simply",
    content: "One of the best explanations of why Bitcoin matters from Michael Saylor. Worth the watch for anyone still on the fence.\n\nKey timestamps:\n0:00 - Why money matters\n5:30 - Bitcoin's unique properties\n12:00 - The case for adoption",
    flair: "video",
    linkUrl: "https://www.youtube.com/watch?v=j4cGFbioPHg"
  },
  {
    userId: 1,
    categoryId: 2,
    title: "Fiat is a Ponzi scheme - change my mind",
    content: "The current monetary system requires constant growth and new participants to pay off old debts. Sounds familiar?",
    flair: "meme",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800"
  }
];

const replies = [
  { postId: 1, userId: 2, content: "Hot wallet = connected to internet (convenient but less secure)\nCold wallet = offline (more secure but less convenient)\n\nFor small amounts, hot wallet is fine. For savings, definitely use cold storage!", parentReplyId: null },
  { postId: 1, userId: 3, content: "Think of it like your physical wallet vs a bank vault. You keep spending money in your wallet, but store your savings in the vault.", parentReplyId: null },
  { postId: 1, userId: 1, content: "That analogy really helps! Thanks!", parentReplyId: 2 },
  { postId: 2, userId: 1, content: "Great explanation! This is what made me understand Bitcoin's value.", parentReplyId: null },
  { postId: 3, userId: 3, content: "Bitcoin has better portability and divisibility. Gold is tangible but hard to verify and transport.", parentReplyId: null },
  { postId: 3, userId: 2, content: "Why not both? I see them as complementary rather than competing.", parentReplyId: null },
  { postId: 5, userId: 1, content: "How did you handle the volatility mentally? Any tips?", parentReplyId: null },
  { postId: 5, userId: 2, content: "Zoom out! Look at 4-year charts instead of daily. Also, having a strong conviction in the fundamentals helps.", parentReplyId: 7 },
  { postId: 9, userId: 2, content: "Congrats! Which hardware wallet did you choose?", parentReplyId: null },
  { postId: 9, userId: 1, content: "Went with a Trezor. The open-source aspect was important to me.", parentReplyId: 9 },
  { postId: 10, userId: 1, content: "Would you recommend Cryptosteel for the metal backup?", parentReplyId: null },
  { postId: 13, userId: 2, content: "The inflation angle works so well! Everyone can relate to rising prices.", parentReplyId: null },
  { postId: 13, userId: 1, content: "I tried showing the M2 money supply chart. Visual evidence is powerful.", parentReplyId: null },
  { postId: 16, userId: 1, content: "Count me in! What time zone?", parentReplyId: null },
  { postId: 16, userId: 2, content: "Looking forward to it!", parentReplyId: null }
];

const campaigns = [
  {
    name: "Bitcoin Security Launch",
    advertiser: "Trezor",
    status: "active",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    budgetCents: 500000,
    spentCents: 0,
    costPerClickCents: 100,
    costPerImpressionCents: 10
  },
  {
    name: "DCA Education",
    advertiser: "Swan Bitcoin",
    status: "active",
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    budgetCents: 300000,
    spentCents: 0,
    costPerClickCents: 75,
    costPerImpressionCents: 8
  },
  {
    name: "Hardware Wallet Promo",
    advertiser: "Ledger",
    status: "active",
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    budgetCents: 400000,
    spentCents: 0,
    costPerClickCents: 90,
    costPerImpressionCents: 9
  }
];

const creatives = [
  {
    campaignId: 1,
    title: "Secure Your Bitcoin with Trezor",
    description: "Industry-leading hardware wallets for complete control of your private keys.",
    ctaText: "Shop Now",
    ctaUrl: "https://trezor.io",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
    placement: "in_feed",
    isActive: true
  },
  {
    campaignId: 2,
    title: "Stack Sats Automatically",
    description: "Set up recurring Bitcoin purchases with Swan. Dollar-cost averaging made simple.",
    ctaText: "Start Stacking",
    ctaUrl: "https://swanbitcoin.com",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop",
    placement: "in_feed",
    isActive: true
  },
  {
    campaignId: 3,
    title: "Ledger Nano X - Premium Security",
    description: "The most advanced hardware wallet with Bluetooth. Protect your crypto anywhere.",
    ctaText: "Get Yours",
    ctaUrl: "https://ledger.com",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop",
    placement: "in_feed",
    isActive: true
  }
];

async function seedCommunity() {
  try {
    console.log('🌱 Seeding community data...\n');

    console.log('📁 Seeding forum categories...');
    for (const category of categories) {
      await db.insert(forumCategories).values(category).onConflictDoNothing();
    }
    console.log(`   ✅ ${categories.length} categories seeded\n`);

    console.log('📝 Seeding forum posts...');
    for (const post of posts) {
      const [insertedPost] = await db.insert(forumPosts).values(post).returning();
      await db.insert(forumPostStats).values({
        postId: insertedPost.id,
        upvotes: Math.floor(Math.random() * 50),
        downvotes: 0,
        hotScore: String(Math.random() * 100)
      });
    }
    console.log(`   ✅ ${posts.length} posts seeded with stats\n`);

    console.log('💬 Seeding forum replies...');
    for (const reply of replies) {
      const [insertedReply] = await db.insert(forumReplies).values(reply).returning();
      await db.insert(forumReplyStats).values({
        replyId: insertedReply.id,
        parentReplyId: reply.parentReplyId,
        depth: reply.parentReplyId ? 1 : 0,
        upvotes: Math.floor(Math.random() * 20),
        downvotes: 0
      });
    }
    console.log(`   ✅ ${replies.length} replies seeded with stats\n`);

    console.log('⭐ Seeding user karma...');
    const karmaData = [
      { userId: 1, totalKarma: 150, postKarma: 100, commentKarma: 50, awardedKarma: 0 },
      { userId: 2, totalKarma: 280, postKarma: 200, commentKarma: 80, awardedKarma: 0 },
      { userId: 3, totalKarma: 420, postKarma: 300, commentKarma: 120, awardedKarma: 0 }
    ];
    for (const karma of karmaData) {
      await db.insert(userKarma).values(karma).onConflictDoNothing();
    }
    console.log(`   ✅ ${karmaData.length} user karma records seeded\n`);

    console.log('📢 Seeding ad campaigns...');
    for (const campaign of campaigns) {
      await db.insert(adCampaigns).values(campaign).onConflictDoNothing();
    }
    console.log(`   ✅ ${campaigns.length} campaigns seeded\n`);

    console.log('🎨 Seeding ad creatives...');
    for (const creative of creatives) {
      await db.insert(adCreatives).values(creative).onConflictDoNothing();
    }
    console.log(`   ✅ ${creatives.length} creatives seeded\n`);

    console.log('🎉 Community data seeding complete!\n');
    console.log('Summary:');
    console.log(`  - ${categories.length} forum categories`);
    console.log(`  - ${posts.length} forum posts`);
    console.log(`  - ${replies.length} replies`);
    console.log(`  - ${karmaData.length} user karma records`);
    console.log(`  - ${campaigns.length} ad campaigns`);
    console.log(`  - ${creatives.length} ad creatives`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding community data:', error);
    process.exit(1);
  }
}

seedCommunity();
