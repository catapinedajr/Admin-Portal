import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSampleTopics() {
  const prompt = `Generate a sample 180-day Bitcoin education curriculum showing the progression from normie to maxi.

SHOW SAMPLE DAYS FROM EACH MONTH:
- Days 1-5 (9th grade, Normie basics)  
- Days 31-35 (10th grade, Bitcoin mechanics)
- Days 61-65 (11th grade, Austrian economics)
- Days 91-95 (12th grade, Advanced concepts)
- Days 121-125 (12th+ grade, Philosophy) 
- Days 151-155 (Advanced, Maximalism)
- Days 176-180 (Final maximalist conviction)

FORMAT: Day X: Topic Title (2-8 words)

Requirements:
- Show clear progression from simple to advanced
- Build logically (each day builds on previous knowledge)
- End with strong Bitcoin maximalist worldview
- Include variety: technical, economic, cultural, philosophical

Generate exactly these sample days to demonstrate the full curriculum progression.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.3
    });

    console.log("180-Day Bitcoin Curriculum Sample (showing progression):\n");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

generateSampleTopics();