import { generateDayContent, saveDayContentToDatabase } from './server/content-generator.js';

async function testGeneration() {
  try {
    console.log('🤖 Testing OpenAI content generation for Day 1...');
    
    // Generate content for Day 1
    const content = await generateDayContent(1);
    
    console.log('✅ Content generated successfully!');
    console.log('📊 Generated content preview:');
    console.log('  Daily Fact:', content.dailyFact.title);
    console.log('  Lesson:', content.lesson.title);
    console.log('  Quiz Questions:', content.quizQuestions.length);
    
    // Save to database (this will overwrite Day 1 test data)
    await saveDayContentToDatabase(1, content);
    
    console.log('💾 Content saved to database, overwriting Day 1 test data');
    console.log('\n📝 Full content structure:');
    console.log(JSON.stringify(content, null, 2));
    
  } catch (error) {
    console.error('❌ Generation failed:', error);
  }
}

testGeneration();