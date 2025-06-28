import OpenAI from "openai";
import { db } from "./db";
import { contentDays, contentFacts, contentLessons, contentQuizzes } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GeneratedContent {
  dailyFact: {
    title: string;
    content: string;
    category: string;
  };
  lesson: {
    title: string;
    content: string;
    keyTakeaways: string[];
    whyItMatters: string;
  };
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export async function generateDayContent(dayIndex: number): Promise<GeneratedContent> {
  const prompt = `
You are an expert Bitcoin educator creating content for HODLearn, a beginner-friendly Bitcoin education app.

TARGET AUDIENCE:
- Complete beginners with zero Bitcoin knowledge
- 9th grade reading level (age 14-15)
- "Normie" cultural stage - everyday language only
- Maximum 15 words per sentence

WRITING STYLE:
- Patient, encouraging, non-intimidating tone
- Use familiar analogies: email, banking, phones, cars, notebooks
- Avoid technical jargon completely
- Replace "blockchain" with "shared notebook"
- Replace "cryptocurrency" with "digital money"
- Use active voice and present tense
- No scary statistics or complex numbers

DAY ${dayIndex} THEME: "What is Bitcoin?"
LEARNING OBJECTIVE: Introduce Bitcoin as digital money concept
KEY ANALOGY: Bitcoin as digital gold you can email

Generate content for Day ${dayIndex} with this exact JSON structure:

{
  "dailyFact": {
    "title": "Simple 4-6 word title",
    "content": "2-3 sentences max explaining one key concept simply",
    "category": "basic"
  },
  "lesson": {
    "title": "Clear lesson title (max 8 words)",
    "content": "150-200 word narrative story format explaining Bitcoin basics using simple analogies. Write like you're explaining to a curious teenager. Use familiar comparisons they understand.",
    "keyTakeaways": [
      "First key point (max 12 words)",
      "Second key point (max 12 words)", 
      "Third key point (max 12 words)"
    ],
    "whyItMatters": "2-3 sentences explaining real-world relevance in simple terms"
  },
  "quizQuestions": [
    {
      "question": "Question testing the daily fact understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Simple explanation of why this answer is correct"
    },
    {
      "question": "Question testing lesson comprehension",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Simple explanation"
    },
    {
      "question": "Practical application question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Simple explanation"
    },
    {
      "question": "Comparison question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Simple explanation"
    },
    {
      "question": "Broader implications question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 3,
      "explanation": "Simple explanation"
    }
  ]
}

Remember: Keep everything at 9th grade level using everyday language and familiar analogies.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert Bitcoin educator specializing in beginner-friendly content creation. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = JSON.parse(response.choices[0].message.content!);
    return content as GeneratedContent;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error('Failed to generate content');
  }
}

export async function saveDayContentToDatabase(dayIndex: number, content: GeneratedContent): Promise<void> {
  try {
    console.log(`💾 Saving content for Day ${dayIndex} to database...`);
    
    // 1. Delete existing Day 1 content to overwrite test data
    if (dayIndex === 1) {
      console.log(`🗑️ Removing existing Day ${dayIndex} test data...`);
      
      // Get the existing day
      const [existingDay] = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex));
      
      if (existingDay) {
        // Delete in correct order due to foreign key constraints
        await db.delete(contentQuizzes).where(eq(contentQuizzes.dayId, existingDay.id));
        await db.delete(contentLessons).where(eq(contentLessons.dayId, existingDay.id));
        await db.delete(contentFacts).where(eq(contentFacts.dayId, existingDay.id));
        await db.delete(contentDays).where(eq(contentDays.id, existingDay.id));
        console.log(`✓ Removed existing Day ${dayIndex} data`);
      }
    }

    // 2. Create new content day
    const [contentDay] = await db.insert(contentDays).values({
      dayIndex,
      title: `Day ${dayIndex}: ${content.lesson.title}`,
      readingLevel: "9th_grade",
      culturalStage: "normie",
      theme: "Bitcoin Basics",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    console.log(`✓ Created content day with ID: ${contentDay.id}`);

    // 3. Save the daily fact
    await db.insert(contentFacts).values({
      dayId: contentDay.id,
      title: content.dailyFact.title,
      content: content.dailyFact.content,
      category: content.dailyFact.category,
      icon: "💡",
      orderIndex: 0,
      createdAt: new Date()
    });
    console.log(`✓ Saved daily fact: "${content.dailyFact.title}"`);

    // 4. Save the lesson
    await db.insert(contentLessons).values({
      dayId: contentDay.id,
      title: content.lesson.title,
      content: content.lesson.content,
      keyTakeaways: content.lesson.keyTakeaways,
      whyItMatters: content.lesson.whyItMatters,
      estimatedReadTime: 3,
      createdAt: new Date()
    });
    console.log(`✓ Saved lesson: "${content.lesson.title}"`);

    // 5. Save the quiz questions
    const quizInserts = content.quizQuestions.map((q, index) => ({
      dayId: contentDay.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      orderIndex: index,
      createdAt: new Date()
    }));

    await db.insert(contentQuizzes).values(quizInserts);
    console.log(`✓ Saved ${content.quizQuestions.length} quiz questions`);
    
    console.log(`🎉 Successfully generated and saved content for Day ${dayIndex}!`);
  } catch (error) {
    console.error(`❌ Failed to save Day ${dayIndex} content:`, error);
    throw error;
  }
}