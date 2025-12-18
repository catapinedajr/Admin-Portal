# Claude Bulk Content Generation Format

## JSON Structure for Bulk Day Import

Use this exact JSON format when generating content with Claude. I can import multiple days at once from this structure.

```json
{
  "content_batch": [
    {
      "day_index": 2,
      "title": "Your Day Title Here",
      "theme": "Problem Recognition",
      "setup_questions": [
        {
          "title": "Question 1 text?",
          "content": "Brief description of what this explores",
          "category": "Financial Awareness",
          "icon": "DollarSign"
        },
        {
          "title": "Question 2 text?",
          "content": "Brief description of what this explores", 
          "category": "System Understanding",
          "icon": "TrendingDown"
        },
        {
          "title": "Question 3 text?",
          "content": "Brief description of what this explores",
          "category": "Bitcoin Solution", 
          "icon": "Shield"
        }
      ],
      "lesson": {
        "title": "Same as day title",
        "content": "Full lesson content here (300-500 words, 8th grade level, end with 'And this is HODLearn.' exactly once per day)",
        "estimated_read_time": 4
      },
      "quiz_questions": [
        {
          "question": "Quiz question 1?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": 2,
          "explanation": "Explanation of why this answer is correct"
        },
        {
          "question": "Quiz question 2?", 
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": 1,
          "explanation": "Explanation of why this answer is correct"
        },
        {
          "question": "Quiz question 3?",
          "options": ["Option A", "Option B", "Option C", "Option D"], 
          "correct_answer": 0,
          "explanation": "Explanation of why this answer is correct"
        },
        {
          "question": "Quiz question 4?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": 3,
          "explanation": "Explanation of why this answer is correct"
        }
      ],
      "key_takeaways": [
        "Takeaway 1 (under 12 words)",
        "Takeaway 2 (under 12 words)", 
        "Takeaway 3 (under 12 words)"
      ],
      "why_it_matters": "Explanation of why this matters for financial self-defense, connecting to real-world goals and Bitcoin's relevance to the lesson content."
    }
  ]
}
```

## Content Framework Requirements

### Day Themes by Week:
- **Week 1**: Problem Recognition  
- **Week 2**: Discovery
- **Week 3**: Network Understanding
- **Week 4**: Investment Education

### Setup Question Categories:
- **Financial Awareness**: DollarSign, Wallet, CreditCard
- **System Understanding**: TrendingDown, AlertTriangle, Eye
- **Bitcoin Solution**: Shield, Lock, Zap

### Common Icons:
- DollarSign, Wallet, CreditCard, TrendingDown, AlertTriangle, Eye, Shield, Lock, Zap, Bitcoin, Coins, TrendingUp

### Content Guidelines:
- **Titles**: Urgent, curiosity-driven (under 60 chars)
- **Setup Questions**: Build financial urgency, lead to Bitcoin curiosity  
- **Lesson Content**: "Conviction Through Curiosity" approach, concrete examples
- **Quiz Questions**: Test actual lesson comprehension
- **Key Takeaways**: Everyday language, under 12 words each
- **Why It Matters**: Financial self-defense focus

## Example Batch for Days 2-4:

```json
{
  "content_batch": [
    {
      "day_index": 2,
      "title": "Why Your Coffee Costs $5",
      "theme": "Problem Recognition",
      "setup_questions": [
        {
          "title": "Why do the same things cost more every year?",
          "content": "Understanding how inflation quietly steals purchasing power",
          "category": "Financial Awareness", 
          "icon": "DollarSign"
        },
        {
          "title": "Who decides how much money exists?",
          "content": "Exploring the power to create money from nothing",
          "category": "System Understanding",
          "icon": "AlertTriangle" 
        },
        {
          "title": "What if money couldn't be inflated away?",
          "content": "Discovering how fixed supply protects value",
          "category": "Bitcoin Solution",
          "icon": "Shield"
        }
      ],
      "lesson": {
        "title": "Why Your Coffee Costs $5",
        "content": "Remember when coffee was $2? When a movie ticket was $8?\n\nYour memory isn't wrong. Those prices were real.\n\n**The Hidden Tax**\n\nWhat changed wasn't the coffee or the movie. What changed was the money.\n\nEvery time more money gets created, your existing dollars become worth less. It's like owning 10% of a pizza, then watching someone add 50% more pizza slices to everyone else. Your slice just got smaller.\n\n**The Coffee Test**\n\nThat $5 coffee isn't actually more expensive. Your dollars are just weaker.\n\nIn 2000, you needed 1 hour of minimum wage work to buy 3 cups of coffee. Today, you need that same hour to buy 1 cup. The coffee stayed the same. Your money's buying power got cut by two-thirds.\n\n**Bitcoin's Different Math**\n\nBitcoin works backwards. Instead of losing value over time, it tends to gain value.\n\nWhy? Because there will only ever be 21 million Bitcoin. While dollar supply increases every year, Bitcoin supply decreases (lost coins) or stays flat.\n\nAnd this is HODLearn.",
        "estimated_read_time": 3
      },
      "quiz_questions": [
        {
          "question": "Why does coffee cost more today than 20 years ago?",
          "options": ["Coffee beans are harder to grow", "The money supply has increased", "Coffee shops are greedier", "People drink more coffee"],
          "correct_answer": 1,
          "explanation": "As money supply increases, the value of each dollar decreases, making everything appear more expensive."
        },
        {
          "question": "How many cups of coffee could minimum wage buy in 2000 vs today?",
          "options": ["Same amount both times", "More today than 2000", "3 cups in 2000, 1 cup today", "1 cup in 2000, 3 cups today"],
          "correct_answer": 2,
          "explanation": "Minimum wage purchasing power has declined significantly due to currency debasement."
        },
        {
          "question": "What happens to Bitcoin's supply over time?",
          "options": ["It increases every year", "It stays fixed or decreases", "It doubles every decade", "It depends on demand"],
          "correct_answer": 1,
          "explanation": "Bitcoin has a fixed maximum supply of 21 million, and some coins are lost forever, effectively decreasing supply."
        },
        {
          "question": "The pizza analogy in the lesson illustrates what concept?",
          "options": ["Inflation makes food more expensive", "Adding money supply dilutes existing money value", "Pizza sizes are getting smaller", "Restaurants are raising prices"],
          "correct_answer": 1,
          "explanation": "When money supply increases, each existing dollar represents a smaller percentage of total money, reducing its value."
        }
      ],
      "key_takeaways": [
        "Money creation makes everything appear more expensive",
        "Your buying power decreases even with same income",
        "Bitcoin's fixed supply works in reverse direction"
      ],
      "why_it_matters": "Understanding this hidden tax on your purchasing power helps you recognize why traditional savings accounts lose value over time. Bitcoin's fixed supply offers protection against this systematic wealth erosion, making it worth considering as part of your financial defense strategy."
    }
  ]
}
```

## Import Process:
1. Generate JSON with Claude using this format
2. Save as `.json` file 
3. I'll create import script to process the entire batch at once
4. Verify all content loaded correctly

This allows you to generate 5-10 days at once with Claude, then bulk import them all in one operation.