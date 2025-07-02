import { db } from './server/db.js';
import { quizQuestions, quizOptions } from './shared/schema.js';

async function migrateQuizData() {
  console.log('Starting quiz data migration...');
  
  try {
    // Get all old quiz data
    const oldQuizzes = await db.execute(`
      SELECT day_id, question, options, correct_answer, explanation, order_index
      FROM content_quizzes 
      ORDER BY day_id, order_index
    `);
    
    console.log(`Found ${oldQuizzes.length} quiz questions to migrate`);
    
    for (const oldQuiz of oldQuizzes) {
      const { day_id, question, options, correct_answer, explanation, order_index } = oldQuiz;
      
      // Parse options JSON
      const optionsArray = JSON.parse(options);
      
      // Insert question into new table
      const [newQuestion] = await db.insert(quizQuestions).values({
        dayId: day_id,
        question: question,
        explanation: explanation,
        category: 'Fundamentals',
        difficulty: 'beginner'
      }).returning();
      
      console.log(`Migrated question ${newQuestion.id} for day ${day_id}`);
      
      // Insert all 4 options
      for (let i = 0; i < optionsArray.length; i++) {
        await db.insert(quizOptions).values({
          questionId: newQuestion.id,
          orderIndex: i,
          optionText: optionsArray[i],
          isCorrect: i === correct_answer // Convert numeric to boolean
        });
      }
      
      console.log(`  Added 4 options for question ${newQuestion.id}`);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify migration
    const verification = await db.execute(`
      SELECT q.day_id, COUNT(DISTINCT q.id) as questions, COUNT(o.id) as options
      FROM quiz_questions q
      JOIN quiz_options o ON q.id = o.question_id
      GROUP BY q.day_id
      ORDER BY q.day_id
    `);
    
    console.log('Verification results:', verification);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateQuizData();