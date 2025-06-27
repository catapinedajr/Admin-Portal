import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface DayContent {
  dayIndex: number;
  topic: string;
  dailyFact: {
    title: string;
    content: string;
    category: string;
    icon: string;
  };
  lesson: {
    title: string;
    content: string;
    summary: string;
    estimatedReadTime: number;
  };
  quiz: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: string;
  };
  diveDeeper: {
    explanation: string;
    examples: string[];
    visualDescription: string;
    keyTakeaways: string[];
  };
}

const month1Topics = [
  { day: 1, topic: "Bitcoin's big win (Control your money)" },
  { day: 2, topic: "No banks needed (Bitcoin's freedom)" },
  { day: 3, topic: "Only 21 million (Scarcity beats inflation)" },
  { day: 4, topic: "Satoshi's vision (Who started Bitcoin?)" },
  { day: 5, topic: "2008 crash (Why Bitcoin was born)" },
  { day: 6, topic: "Your money, your rules (Bitcoin's power)" },
  { day: 7, topic: "Try it: Set up a wallet (First step)" },
  { day: 8, topic: "Send $1 Bitcoin (Easy challenge)" },
  { day: 9, topic: "Wallets explained (Your crypto bank)" },
  { day: 10, topic: "Bitcoin address (Like an email)" },
  { day: 11, topic: "Why money exists (Simplifies trade)" },
  { day: 12, topic: "Barter's problem (Matching wants)" },
  { day: 13, topic: "Gold's rise (Trusted value)" },
  { day: 14, topic: "Paper money (Convenient, risky)" },
  { day: 15, topic: "Digital dollars (Bank-controlled)" },
  { day: 16, topic: "Trust in cash (Why it fails)" },
  { day: 17, topic: "Inflation hurts (Savings shrink)" },
  { day: 18, topic: "Bitcoin vs inflation (Fixed supply)" },
  { day: 19, topic: "Banks freeze funds (Real risks)" },
  { day: 20, topic: "Bitcoin's global reach (No borders)" },
  { day: 21, topic: "Slow bank fees (Costly transfers)" },
  { day: 22, topic: "Bitcoin's speed (Fast payments)" },
  { day: 23, topic: "Unbanked billions (No bank access)" },
  { day: 24, topic: "Bitcoin for all (Just internet)" },
  { day: 25, topic: "Venezuela's story (Bitcoin saves)" },
  { day: 26, topic: "Bitcoin as digital gold (Store value)" },
  { day: 27, topic: "Cash tracks you (Privacy risks)" },
  { day: 28, topic: "HODL mindset (Think long-term)" },
  { day: 29, topic: "Why care? (Your Bitcoin goal)" },
  { day: 30, topic: "Milestone: You're a Bitcoin explorer!" }
];

async function generateDayContent(dayIndex: number, topic: string): Promise<DayContent> {
  if (!openai) {
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
  }

  // Determine difficulty based on day
  const difficulty = dayIndex <= 10 ? 'beginner' : dayIndex <= 20 ? 'intermediate' : 'advanced';
  
  const prompt = `
Create comprehensive Bitcoin educational content for Day ${dayIndex}: "${topic}"

CONTENT REQUIREMENTS:
- Target Audience: Complete Bitcoin beginners
- Style: Narrative storytelling, conversational, engaging
- Technical Level: ${difficulty}
- Tone: Educational but friendly and approachable

Generate the following components:

1. DAILY FACT:
   - Title: 5-8 words, compelling headline
   - Content: 2-3 sentences introducing the concept
   - Category: Choose from "Core Concepts", "Technology", "Economics", "History", "Network"
   - Icon: Appropriate Lucide React icon name (e.g., "Bitcoin", "Shield", "Coins", "Globe", "Lightbulb")

2. LESSON (300-500 words):
   - Title: Clear, engaging lesson title
   - Content: Narrative storytelling format (NO bullet points, NO headers, flowing paragraphs)
   - Summary: 1-2 sentences capturing main point
   - Estimated Read Time: 2-4 minutes based on content length

3. QUIZ QUESTION:
   - Question: Tests conceptual understanding
   - 4 multiple choice options (A, B, C, D)
   - Correct Answer: Letter of correct option
   - Explanation: Why the answer is correct (educational)
   - Category: Same as daily fact category
   - Difficulty: ${difficulty}

4. DIVE DEEPER:
   - Explanation: 3-4 sentences expanding the daily fact
   - Examples: 4 concrete, real-world examples
   - Visual Description: Creative analogy/metaphor for understanding
   - Key Takeaways: 4 main learning points

ACCURACY REQUIREMENTS:
- All Bitcoin technical information must be factually correct
- No speculation or opinion, only established facts
- Real-world examples should be authentic and verifiable

Return the content as a JSON object with this exact structure:
{
  "dailyFact": {
    "title": "string",
    "content": "string", 
    "category": "string",
    "icon": "string"
  },
  "lesson": {
    "title": "string",
    "content": "string",
    "summary": "string", 
    "estimatedReadTime": number
  },
  "quiz": {
    "question": "string",
    "optionA": "string",
    "optionB": "string", 
    "optionC": "string",
    "optionD": "string",
    "correctAnswer": "string",
    "explanation": "string",
    "category": "string",
    "difficulty": "string"
  },
  "diveDeeper": {
    "explanation": "string",
    "examples": ["string", "string", "string", "string"],
    "visualDescription": "string", 
    "keyTakeaways": ["string", "string", "string", "string"]
  }
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert Bitcoin educator creating accurate, engaging content for beginners. Always respond with valid JSON only."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const contentData = JSON.parse(response.choices[0].message.content!);
    
    return {
      dayIndex,
      topic,
      dailyFact: contentData.dailyFact,
      lesson: contentData.lesson,
      quiz: contentData.quiz,
      diveDeeper: contentData.diveDeeper
    };
  } catch (error) {
    console.error(`Error generating content for day ${dayIndex}:`, error);
    throw error;
  }
}

export async function generateMonth1Content(): Promise<void> {
  console.log("🚀 Starting Month 1 content generation...");
  
  for (const { day, topic } of month1Topics) {
    try {
      console.log(`📝 Generating Day ${day}: ${topic}`);
      
      const content = await generateDayContent(day - 1, topic); // dayIndex is 0-based
      
      // Create daily fact
      await storage.createDailyFact({
        title: content.dailyFact.title,
        content: content.dailyFact.content,
        category: content.dailyFact.category,
        icon: content.dailyFact.icon,
        dayIndex: content.dayIndex
      });
      
      // Create lesson
      await storage.createLesson({
        title: content.lesson.title,
        content: content.lesson.content,
        summary: content.lesson.summary,
        estimatedReadTime: content.lesson.estimatedReadTime,
        dayIndex: content.dayIndex,
        imageUrl: null
      });
      
      // Create quiz question
      await storage.createQuizQuestion({
        dayIndex: content.dayIndex,
        question: content.quiz.question,
        optionA: content.quiz.optionA,
        optionB: content.quiz.optionB,
        optionC: content.quiz.optionC,
        optionD: content.quiz.optionD,
        correctAnswer: content.quiz.correctAnswer,
        explanation: content.quiz.explanation,
        category: content.quiz.category,
        difficulty: content.quiz.difficulty
      });
      
      console.log(`✅ Day ${day} content created successfully`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to generate Day ${day}:`, error);
      throw error;
    }
  }
  
  console.log("🎉 Month 1 content generation complete!");
}

// Also need to update the frontend getFactDeepDive function
export function generateDeepDiveCode(contents: DayContent[]): string {
  const deepDiveEntries = contents.map(content => {
    return `"${content.dailyFact.title}": {
  explanation: "${content.diveDeeper.explanation}",
  examples: ${JSON.stringify(content.diveDeeper.examples)},
  visualDescription: "${content.diveDeeper.visualDescription}",
  keyTakeaways: ${JSON.stringify(content.diveDeeper.keyTakeaways)}
}`;
  }).join(',\n      ');

  return `const getFactDeepDive = (factTitle: string) => {
    const deepDives: Record<string, {
      explanation: string;
      examples: string[];
      visualDescription: string;
      keyTakeaways: string[];
    }> = {
      ${deepDiveEntries}
    };
    return deepDives[factTitle];
  };`;
}