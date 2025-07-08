// Audit script to check content-quiz alignment across all 30 days
const { db } = require('./server/db');
const { contentDays, contentLessons, contentQuizzes } = require('./shared/schema');
const { eq } = require('drizzle-orm');

async function auditContentQuizAlignment() {
  console.log('🔍 Auditing content-quiz alignment for Days 1-30...\n');
  
  const mismatches = [];
  
  for (let dayIndex = 1; dayIndex <= 30; dayIndex++) {
    try {
      // Get lesson content for this day
      const dayRecord = await db.select().from(contentDays).where(eq(contentDays.dayIndex, dayIndex)).limit(1);
      if (!dayRecord.length) continue;
      
      const lesson = await db.select().from(contentLessons).where(eq(contentLessons.dayId, dayRecord[0].id)).limit(1);
      if (!lesson.length) continue;
      
      const quizzes = await db.select().from(contentQuizzes).where(eq(contentQuizzes.dayId, dayRecord[0].id));
      
      const lessonContent = lesson[0].content.toLowerCase();
      const dayTitle = dayRecord[0].title;
      
      console.log(`Day ${dayIndex}: ${dayTitle}`);
      
      // Check each quiz question against lesson content
      for (const quiz of quizzes) {
        const question = quiz.question.toLowerCase();
        const explanation = quiz.explanation.toLowerCase();
        
        // Look for potential mismatches
        let issues = [];
        
        // Check for specific examples mentioned in questions that might not be in lesson
        if (question.includes('baseball') && !lessonContent.includes('baseball')) {
          issues.push('Baseball card example mentioned but not in lesson');
        }
        
        if (question.includes('example') && question.includes('used to explain') && !lessonContent.includes('example')) {
          issues.push('Question refers to specific example not found in lesson');
        }
        
        if (question.includes('according to') && question.includes('lesson')) {
          // Check if the specific fact mentioned in the question exists in lesson
          const questionWords = question.split(' ');
          let foundMatch = false;
          
          // Look for key terms from the question in the lesson
          for (let i = 0; i < questionWords.length - 2; i++) {
            const phrase = questionWords.slice(i, i + 3).join(' ');
            if (lessonContent.includes(phrase)) {
              foundMatch = true;
              break;
            }
          }
          
          if (!foundMatch) {
            issues.push('Question claims lesson content that may not exist');
          }
        }
        
        // Check if explanation references content not in lesson
        if (explanation.includes('lesson') && explanation.includes('mentioned') && !lessonContent.includes(explanation.split('lesson')[1].split('.')[0].trim())) {
          issues.push('Explanation references lesson content that may not exist');
        }
        
        if (issues.length > 0) {
          mismatches.push({
            day: dayIndex,
            title: dayTitle,
            question: quiz.question,
            issues: issues,
            quizId: quiz.id
          });
        }
      }
      
      console.log(`  ✅ ${quizzes.length} questions checked`);
      
    } catch (error) {
      console.error(`❌ Error checking Day ${dayIndex}:`, error.message);
    }
  }
  
  console.log('\n📋 AUDIT RESULTS:\n');
  
  if (mismatches.length === 0) {
    console.log('✅ All content-quiz alignments are correct!');
  } else {
    console.log(`❌ Found ${mismatches.length} potential mismatches:\n`);
    
    mismatches.forEach((mismatch, index) => {
      console.log(`${index + 1}. Day ${mismatch.day}: ${mismatch.title}`);
      console.log(`   Question: ${mismatch.question}`);
      console.log(`   Issues: ${mismatch.issues.join(', ')}`);
      console.log(`   Quiz ID: ${mismatch.quizId}\n`);
    });
    
    console.log('🔧 These require manual review and correction.');
  }
}

// Run the audit
auditContentQuizAlignment().catch(console.error);