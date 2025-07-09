import { z } from 'zod';

// Framework validation schemas
const titleSchema = z.string()
  .max(60, "Title must be under 60 characters for mobile optimization")
  .refine(
    (title) => /[!?()]/.test(title),
    "Title must contain urgency indicators (!, ?, or parentheses)"
  )
  .refine(
    (title) => !/^(Understanding|Introduction|Learning|An Overview)/.test(title),
    "Title cannot start with academic phrases like 'Understanding', 'Introduction', 'Learning', or 'An Overview'"
  )
  .refine(
    (title) => /\b(Your|Why|How|What|The Next|Secret|Hidden|Stolen|Crisis|Destroy|Protect)\b/i.test(title),
    "Title must contain power words: Your, Why, How, What, The Next, Secret, Hidden, Stolen, Crisis, Destroy, Protect"
  );

const setupQuestionsSchema = z.array(z.string())
  .length(3, "Must have exactly 3 setup questions")
  .refine(
    (questions) => questions.every(q => q.length <= 100),
    "Each setup question must be under 100 characters"
  )
  .refine(
    (questions) => questions.every(q => /^(Why|What|How|Who)/.test(q)),
    "Setup questions must start with power words: Why, What, How, Who"
  )
  .refine(
    (questions) => questions.every(q => q.endsWith('?')),
    "All setup questions must end with question marks"
  );

const lessonContentSchema = z.string()
  .min(300, "Lesson content must be at least 300 words")
  .max(500, "Lesson content must be under 500 words to maintain 8th grade reading level")
  .refine(
    (content) => content.toLowerCase().includes('bitcoin'),
    "Lesson content must explicitly mention Bitcoin for relevance check"
  )
  .refine(
    (content) => !/(yesterday we learned|building on our previous|as we discovered|continuing from where)/i.test(content),
    "Lesson content cannot use generic linking phrases like 'Yesterday we learned', 'Building on our previous', etc."
  )
  .refine(
    (content) => {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      return sentences.every(sentence => sentence.trim().split(/\s+/).length <= 15);
    },
    "All sentences must be 15 words or fewer for 8th grade reading level"
  )
  .refine(
    (content) => {
      const jargonWords = ['monetary expansion', 'macroeconomic', 'cryptocurrency', 'blockchain technology', 'decentralization', 'cryptographic'];
      return !jargonWords.some(word => content.toLowerCase().includes(word));
    },
    "Lesson content must avoid technical jargon - use simple terms instead"
  );

const quizQuestionsSchema = z.array(z.object({
  question: z.string(),
  optionA: z.string(),
  optionB: z.string(), 
  optionC: z.string(),
  optionD: z.string(),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string()
}))
  .length(4, "Must have exactly 4 quiz questions for daily habit formation")
  .refine(
    (questions) => questions.every(q => q.explanation.toLowerCase().includes('bitcoin')),
    "All quiz explanations must mention Bitcoin for relevance"
  );

const keyTakeawaysSchema = z.array(z.string())
  .length(3, "Must have exactly 3 key takeaways")
  .refine(
    (takeaways) => takeaways.every(t => t.split(/\s+/).length <= 12),
    "Each takeaway must be 12 words or fewer"
  )
  .refine(
    (takeaways) => !takeaways.some(t => /\b(decentralization|cryptocurrency|blockchain|cryptographic|monetary)\b/i.test(t)),
    "Key takeaways must avoid technical jargon"
  );

const whyItMattersSchema = z.string()
  .refine(
    (content) => content.toLowerCase().includes('bitcoin'),
    "Why It Matters section must explicitly mention Bitcoin"
  )
  .refine(
    (content) => content.includes('This matters because'),
    "Why It Matters must follow template: 'This matters because [threat] affects [concern], and understanding [Bitcoin solution] helps you [action]'"
  );

// Main content validation schema
export const contentDaySchema = z.object({
  dayIndex: z.number().int().positive(),
  title: titleSchema,
  setupQuestions: setupQuestionsSchema,
  lessonContent: lessonContentSchema,
  quizQuestions: quizQuestionsSchema,
  keyTakeaways: keyTakeawaysSchema,
  whyItMatters: whyItMattersSchema
});

export type ValidatedContentDay = z.infer<typeof contentDaySchema>;

// Content validation function
export function validateContent(content: any): { isValid: boolean; errors: string[] } {
  try {
    contentDaySchema.parse(content);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return { isValid: false, errors: ['Unknown validation error'] };
  }
}

// Additional framework checks
export function performFrameworkChecks(content: ValidatedContentDay): { passed: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for Bitcoin solution clarity
  if (!content.lessonContent.toLowerCase().includes('bitcoin solves') && 
      !content.lessonContent.toLowerCase().includes('bitcoin addresses') &&
      !content.lessonContent.toLowerCase().includes('bitcoin eliminates')) {
    warnings.push('Lesson should clearly explain HOW Bitcoin solves the problem discussed');
  }
  
  // Check for professional urgency
  if (!content.lessonContent.toLowerCase().includes('working professional') &&
      !content.lessonContent.toLowerCase().includes('your salary') &&
      !content.lessonContent.toLowerCase().includes('your paycheck') &&
      !content.lessonContent.toLowerCase().includes('your money')) {
    warnings.push('Lesson should connect to professional financial concerns');
  }
  
  // Check for concrete examples
  if (!/\$[\d,]+/.test(content.lessonContent)) {
    warnings.push('Lesson should include specific dollar amounts for impact');
  }
  
  // Check title emotional hook
  const emotionalWords = ['stolen', 'crisis', 'destroy', 'hidden', 'secret', 'exposed', 'shocking'];
  if (!emotionalWords.some(word => content.title.toLowerCase().includes(word))) {
    warnings.push('Title should include stronger emotional hooks');
  }
  
  return { passed: warnings.length === 0, warnings };
}

// Export validation middleware
export function validateContentMiddleware(req: any, res: any, next: any) {
  const validation = validateContent(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Content validation failed',
      message: 'Content does not meet framework requirements',
      violations: validation.errors
    });
  }
  
  const frameworkCheck = performFrameworkChecks(req.body);
  if (!frameworkCheck.passed) {
    return res.status(400).json({
      error: 'Framework compliance failed',
      message: 'Content does not meet quality standards',
      warnings: frameworkCheck.warnings
    });
  }
  
  next();
}