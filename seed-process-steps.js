// Quick script to populate content_generation_steps table
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
const { contentGenerationSteps } = schema;

const steps = [
  {
    stepNumber: 1,
    stepName: "Extract Day Metadata from Database",
    description: "Query the content_days table to extract all day parameters including title, reading level, theme, and cultural stage.",
    requirements: [
      "Query content_days table for target day",
      "Validate all required fields are populated",
      "Ensure reading_level and cultural_stage are valid enum values"
    ],
    qualityGates: [
      "Day metadata successfully retrieved",
      "All required fields validated",
      "Error handling for missing data implemented"
    ],
    outputs: [
      "Day title, reading level, theme, cultural stage",
      "Valid day_id for foreign key relationships"
    ],
    dependencies: [],
    estimatedTimeMinutes: 5
  },
  {
    stepNumber: 2,
    stepName: "Contextual Learning Continuity Analysis",
    description: "For days 2+, review previous 3 days' content to ensure smooth knowledge progression and vocabulary consistency.",
    requirements: [
      "Review previous 3 days' lesson titles and key takeaways",
      "Identify core concepts already introduced",
      "Plan conceptual bridges from known to unknown",
      "Ensure terminology consistency"
    ],
    qualityGates: [
      "Previous content thoroughly reviewed",
      "Knowledge gaps identified",
      "Vocabulary progression mapped",
      "Smooth transitions planned"
    ],
    outputs: [
      "Contextual awareness summary",
      "Vocabulary consistency checklist",
      "Knowledge bridge plan"
    ],
    dependencies: [1],
    estimatedTimeMinutes: 15
  },
  {
    stepNumber: 3,
    stepName: "Generate Complete Lesson - Captivating Storytelling",
    description: "Create 5-paragraph narrative lesson using storytelling structure with hook, bridge, problems, benefits, and vision.",
    requirements: [
      "5-paragraph storytelling format (~400 words)",
      "Apply specific reading level from database",
      "Use varied opening approaches (mystery, curiosity, scenarios)",
      "Include familiar analogies and real problems",
      "End with empowerment and forward momentum"
    ],
    qualityGates: [
      "Compelling hook that creates curiosity",
      "Familiar analogies that clarify abstract concepts",
      "Real problems clearly identified",
      "Bitcoin solutions elegantly revealed",
      "Empowering conclusion with forward momentum"
    ],
    outputs: [
      "Complete lesson content (~400 words)",
      "4 key takeaways (JSON array)",
      "Why it matters explanation",
      "3-minute estimated read time"
    ],
    dependencies: [1, 2],
    estimatedTimeMinutes: 25
  },
  {
    stepNumber: 4,
    stepName: "Generate 3 Supporting Facts",
    description: "Extract 3 key concepts from lesson that serve as building blocks for lesson understanding.",
    requirements: [
      "Extract 3 key concepts from lesson",
      "Create facts as preview/building blocks",
      "Use vocabulary established in prior days",
      "Vary categories (Technology, Economics, Security)",
      "Order from fundamental to broader implications"
    ],
    qualityGates: [
      "Facts preview lesson concepts effectively",
      "No repetition of previous days' concepts",
      "Vocabulary consistent with established terms",
      "Clear progression from basic to advanced"
    ],
    outputs: [
      "3 fact titles using everyday language",
      "Fact content at target reading level",
      "Appropriate icons and categories",
      "Logical ordering sequence"
    ],
    dependencies: [3],
    estimatedTimeMinutes: 20
  },
  {
    stepNumber: 5,
    stepName: "Generate 3 Dive Deeper Sections",
    description: "Create focused 60-80 word explanations for each fact with examples, visual descriptions, and key takeaways.",
    requirements: [
      "Maximum 60-80 words per explanation",
      "Single clear insight per section",
      "Use only established vocabulary plus everyday language",
      "One powerful analogy using familiar concepts",
      "4 real-world examples and 4 key takeaways each"
    ],
    qualityGates: [
      "Each explanation delivers genuine 'aha moment'",
      "No unexplained jargon or technical terms",
      "Memorable analogies using familiar concepts",
      "Examples clarify rather than complicate",
      "Key takeaways reinforce understanding"
    ],
    outputs: [
      "3 focused explanations (60-80 words each)",
      "12 real-world examples (4 per fact)",
      "Visual descriptions using established mental models",
      "12 key takeaways (4 per fact)"
    ],
    dependencies: [4],
    estimatedTimeMinutes: 30
  },
  {
    stepNumber: 6,
    stepName: "Generate 6 Quiz Questions",
    description: "Create 6 questions testing fact understanding, lesson synthesis, and practical application with cross-day connections.",
    requirements: [
      "Questions 1-3: Test daily fact understanding",
      "Question 4: Test lesson synthesis",
      "Question 5: Test practical application",
      "Question 6: Test deeper comprehension",
      "Include 1-2 questions connecting to previous days",
      "All options plausible with clear explanations"
    ],
    qualityGates: [
      "Questions test comprehension not memorization",
      "Cross-day connections included",
      "All answer options plausible",
      "Explanations reinforce learning",
      "Vocabulary consistent with curriculum"
    ],
    outputs: [
      "6 quiz questions with 4 options each",
      "Correct answers clearly identified",
      "Educational explanations for each question",
      "Cross-day knowledge connections"
    ],
    dependencies: [3, 4, 5],
    estimatedTimeMinutes: 20
  },
  {
    stepNumber: 7,
    stepName: "Final Holistic Review and Optimization",
    description: "Comprehensive review ensuring learning continuity, database accuracy, content quality, and user experience.",
    requirements: [
      "Review learning continuity across all content",
      "Verify database accuracy and relationships",
      "Assess educational value and flow",
      "Check user experience and readability",
      "Validate vocabulary consistency",
      "Ensure unique lesson openings"
    ],
    qualityGates: [
      "Smooth knowledge progression confirmed",
      "Database relationships validated",
      "Content accuracy verified",
      "Optimal user experience achieved",
      "All vocabulary consistent",
      "Engaging lesson openings without repetitive patterns"
    ],
    outputs: [
      "Quality-assured complete day content",
      "Database-ready formatted content",
      "Educational flow validation",
      "Final content optimizations"
    ],
    dependencies: [6],
    estimatedTimeMinutes: 10
  }
];

async function seedProcessSteps() {
  try {
    console.log('Seeding content generation process steps...');
    
    // Clear existing steps
    await db.delete(contentGenerationSteps);
    
    // Insert new steps
    for (const step of steps) {
      await db.insert(contentGenerationSteps).values(step);
    }
    
    console.log(`Successfully seeded ${steps.length} process steps.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding process steps:', error);
    process.exit(1);
  }
}

seedProcessSteps();