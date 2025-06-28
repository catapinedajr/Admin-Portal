import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateTopicBatch(startDay, endDay, gradeLevel, culturalStage, themes) {
  const prompt = `Generate Bitcoin education topics for Days ${startDay}-${endDay}.

REQUIREMENTS:
- Reading Level: ${gradeLevel}
- Cultural Progression: ${culturalStage}
- Themes: ${themes}
- Format: Day X: Topic Title (exactly 2-8 words)
- Build logically from previous concepts
- Each day = one focused topic

PROGRESSION CONTEXT:
Days 1-30: Basic Bitcoin concepts, money problems, simple explanations
Days 31-60: How Bitcoin works, economic comparisons, use cases
Days 61-90: Austrian economics, sound money theory, conviction building
Days 91-120: Advanced economics, network effects, institutional adoption
Days 121-150: Philosophy, maximalism, societal change
Days 151-180: Future vision, advanced theory, complete Bitcoin worldview

Generate exactly ${endDay - startDay + 1} topics numbered Day ${startDay} through Day ${endDay}.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.3
  });

  return response.choices[0].message.content;
}

async function generateAllTopics() {
  console.log("Generating 180-Day Bitcoin Education Curriculum...\n");
  
  const batches = [
    { start: 1, end: 30, grade: "9th grade", stage: "Normie → Pre-coiner", themes: "Bitcoin basics, money problems" },
    { start: 31, end: 60, grade: "10th grade", stage: "Pre-coiner → New coiner", themes: "How Bitcoin works, economics" },
    { start: 61, end: 90, grade: "11th grade", stage: "New coiner → HODLer", themes: "Austrian economics, sound money" },
    { start: 91, end: 120, grade: "12th grade", stage: "HODLer → Early Maxi", themes: "Advanced economics, institutions" },
    { start: 121, end: 150, grade: "12th+ grade", stage: "Early Maxi → Confident Maxi", themes: "Philosophy, societal change" },
    { start: 151, end: 180, grade: "Advanced", stage: "Confident Maxi → Bitcoin Maximalist", themes: "Future vision, maximalism" }
  ];

  for (const batch of batches) {
    try {
      console.log(`Generating Days ${batch.start}-${batch.end} (${batch.grade})...`);
      const topics = await generateTopicBatch(batch.start, batch.end, batch.grade, batch.stage, batch.themes);
      console.log(topics);
      console.log("\n" + "=".repeat(80) + "\n");
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generating batch ${batch.start}-${batch.end}:`, error.message);
    }
  }
}

generateAllTopics();