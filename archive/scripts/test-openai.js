import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ 
        role: "user", 
        content: "Generate just the first 10 days of a Bitcoin education curriculum. Format: Day X: Topic Title (Grade Level)" 
      }],
      max_tokens: 500
    });
    
    console.log("✓ OpenAI connection successful");
    console.log("Sample topics:");
    console.log(response.choices[0].message.content);
    
  } catch (error) {
    console.error("✗ OpenAI connection failed:", error.message);
  }
}

testConnection();