// Create Day 0 quiz questions in new database format
import { pool } from './server/db.js';

const day0Quizzes = [
  {
    day_id: 1, // Day 0 uses dayId 1 in content_days table
    question: "According to today's lesson, what problem does Bitcoin solve with digital money?",
    options: ["Making payments faster", "Stopping people from copying digital money", "Making payments cheaper", "Creating more money"],
    correct_answer_index: 1,
    explanation: "Bitcoin solves the copying problem - stopping someone from copying digital money and spending it twice, which was the main challenge before Bitcoin.",
    category: "Fundamentals",
    difficulty: "beginner",
    order_index: 0
  },
  {
    day_id: 1,
    question: "Based on today's content, what makes Bitcoin's scarcity special?",
    options: ["Banks control the supply", "Government decides how much to print", "Maximum of 21 million coins will ever exist", "Supply changes based on demand"],
    correct_answer_index: 2,
    explanation: "Today's lesson explains that Bitcoin has a maximum supply of 21 million coins that will ever exist, creating digital scarcity like digital gold.",
    category: "Fundamentals", 
    difficulty: "beginner",
    order_index: 1
  },
  {
    day_id: 1,
    question: "According to today's lesson, how does Bitcoin give you control over your money?",
    options: ["Banks manage your account better", "Government protects your money", "No one can freeze your account or stop your payments", "Credit cards become unnecessary"],
    correct_answer_index: 2,
    explanation: "Today's content explains that Bitcoin gives complete control over your money - no one can freeze your account, reverse payments, or stop you from sending money anywhere.",
    category: "Purpose",
    difficulty: "beginner", 
    order_index: 2
  },
  {
    day_id: 1,
    question: "Based on today's lesson, what makes Bitcoin different from regular digital payments?",
    options: ["It uses the internet", "It doesn't need banks or middlemen", "It's faster than cash", "It's accepted everywhere"],
    correct_answer_index: 1,
    explanation: "Today's lesson explains that Bitcoin is special because it allows direct person-to-person payments without needing banks or other middlemen.",
    category: "Technology",
    difficulty: "beginner",
    order_index: 3
  },
  {
    day_id: 1,
    question: "According to today's content, what inspired Bitcoin's creation?",
    options: ["Making payments faster", "The 2008 financial crisis and need for money you don't have to trust", "Competing with credit cards", "Creating a new investment asset"],
    correct_answer_index: 1,
    explanation: "Today's lesson explains that Bitcoin was created in response to the 2008 financial crisis, designed as digital money that doesn't rely on failing banks.",
    category: "History",
    difficulty: "intermediate",
    order_index: 4
  },
  {
    day_id: 1,
    question: "Based on today's lesson, what does 'digital scarcity' mean for Bitcoin?",
    options: ["Bitcoin is hard to find online", "Only tech experts can use it", "Each Bitcoin is unique and cannot be copied or counterfeited", "Bitcoin websites are rare"],
    correct_answer_index: 2,
    explanation: "Today's content explains that digital scarcity means each Bitcoin is mathematically unique and cannot be copied, counterfeited, or double-spent, solving a major problem with digital money.",
    category: "Technology",
    difficulty: "intermediate",
    order_index: 5
  }
];

async function createQuizzes() {
  try {
    const client = await pool.connect();
    
    for (const quiz of day0Quizzes) {
      await client.query(`
        INSERT INTO content_quizzes (day_id, question, options, correct_answer_index, explanation, category, difficulty, order_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        quiz.day_id,
        quiz.question, 
        JSON.stringify(quiz.options),
        quiz.correct_answer_index,
        quiz.explanation,
        quiz.category,
        quiz.difficulty,
        quiz.order_index
      ]);
    }
    
    client.release();
    console.log('✅ Created 6 quiz questions for Day 0');
    
  } catch (error) {
    console.error('❌ Error creating quizzes:', error);
  }
}

createQuizzes();