// Bulk Content Import Script for HODLearn
// Usage: node bulk-import.js <filename.json>

import fs from 'fs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function importContentBatch(filename) {
  if (!filename) {
    console.error('Usage: node bulk-import.js <filename.json>');
    process.exit(1);
  }

  try {
    // Read JSON file
    const jsonData = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(jsonData);
    
    if (!data.content_batch || !Array.isArray(data.content_batch)) {
      throw new Error('JSON must have a "content_batch" array');
    }

    console.log(`📚 Importing ${data.content_batch.length} days from ${filename}`);
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const day of data.content_batch) {
        console.log(`\n📝 Importing Day ${day.day_index}: ${day.title}`);
        
        // Insert day metadata
        const dayResult = await client.query(`
          INSERT INTO content_days (day_index, title, reading_level, cultural_stage, theme, is_active, is_approved) 
          VALUES ($1, $2, 'high_school', 'mainstream', $3, true, true)
          RETURNING id
        `, [day.day_index, day.title, day.theme]);
        
        const dayId = dayResult.rows[0].id;
        console.log(`   ✅ Created day record with ID ${dayId}`);
        
        // Insert setup questions
        for (let i = 0; i < day.setup_questions.length; i++) {
          const q = day.setup_questions[i];
          await client.query(`
            INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [dayId, q.title, q.content, q.category, q.icon, i]);
        }
        console.log(`   ✅ Added ${day.setup_questions.length} setup questions`);
        
        // Insert lesson
        const keyTakeawaysJson = JSON.stringify(day.key_takeaways);
        await client.query(`
          INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters, estimated_read_time)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [dayId, day.lesson.title, day.lesson.content, keyTakeawaysJson, day.why_it_matters, day.lesson.estimated_read_time]);
        console.log(`   ✅ Added lesson content`);
        
        // Insert quiz questions
        for (const q of day.quiz_questions) {
          const optionsJson = JSON.stringify(q.options);
          await client.query(`
            INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation)
            VALUES ($1, $2, $3, $4, $5)
          `, [dayId, q.question, optionsJson, q.correct_answer, q.explanation]);
        }
        console.log(`   ✅ Added ${day.quiz_questions.length} quiz questions`);
      }
      
      await client.query('COMMIT');
      console.log(`\n🎉 Successfully imported all ${data.content_batch.length} days!`);
      
      // Verify import
      const verification = await client.query(`
        SELECT 
          'content_days' as table_name, COUNT(*) as records FROM content_days
        UNION ALL
        SELECT 'content_set_up_questions', COUNT(*) FROM content_set_up_questions
        UNION ALL
        SELECT 'content_lessons', COUNT(*) FROM content_lessons
        UNION ALL
        SELECT 'content_quizzes', COUNT(*) FROM content_quizzes
        ORDER BY table_name
      `);
      
      console.log('\n📊 Database Status:');
      verification.rows.forEach(row => {
        console.log(`   ${row.table_name}: ${row.records} records`);
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run import
const filename = process.argv[2];
importContentBatch(filename);