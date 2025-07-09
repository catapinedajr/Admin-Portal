import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read the backup file to extract the lesson content  
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupPath = path.join(__dirname, 'server/storage-old.ts');
const backupContent = fs.readFileSync(backupPath, 'utf8');

// Extract lesson data from the backup
const lessonsMatch = backupContent.match(/const lessons = \[([\s\S]*?)\];\s*\/\/ Initialize lessons/);
if (!lessonsMatch) {
  console.error('Could not find lessons array in backup file');
  process.exit(1);
}

const lessonsContent = lessonsMatch[1];
console.log('Found lessons content in backup file');

// Create a migration script to restore the content
const migrationScript = `
// Data migration script to restore 30-day content from backup
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');
const { neonConfig } = require('@neondatabase/serverless');

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function restoreContent() {
  const client = await pool.connect();
  
  try {
    // Clear existing content (except Day 1 which is working)
    await client.query('DELETE FROM content_lessons WHERE day_index > 1');
    await client.query('DELETE FROM content_days WHERE day_index > 1');
    await client.query('DELETE FROM content_quizzes WHERE day_index > 1');
    await client.query('DELETE FROM content_set_up_questions WHERE day_index > 1');
    await client.query('DELETE FROM content_dive_deeper WHERE day_index > 1');
    
    console.log('Cleared existing content > Day 1');
    
    // Restore lesson content for Days 2-30
    const lessons = ${lessonsContent};
    
    for (const lesson of lessons) {
      if (lesson.dayIndex > 1) {
        // Insert content_days record
        await client.query(
          'INSERT INTO content_days (day_index, title, theme, reading_level, cultural_stage, is_approved) VALUES ($1, $2, $3, $4, $5, $6)',
          [lesson.dayIndex, lesson.title, 'Bitcoin Education', 'beginner', 'curious', true]
        );
        
        // Insert content_lessons record
        await client.query(
          'INSERT INTO content_lessons (day_index, content, key_takeaways, why_it_matters, estimated_read_time) VALUES ($1, $2, $3, $4, $5)',
          [lesson.dayIndex, lesson.content, JSON.stringify(lesson.keyTakeaways || []), lesson.whyItMatters || '', lesson.estimatedReadTime || 3]
        );
        
        console.log(\`Restored lesson for Day \${lesson.dayIndex}: \${lesson.title}\`);
      }
    }
    
    console.log('Successfully restored all lesson content');
    
  } catch (error) {
    console.error('Error restoring content:', error);
  } finally {
    client.release();
  }
}

restoreContent();
`;

// Write the migration script
fs.writeFileSync('migrate-content.js', migrationScript);
console.log('Created migration script: migrate-content.js');
console.log('Run with: node migrate-content.js');