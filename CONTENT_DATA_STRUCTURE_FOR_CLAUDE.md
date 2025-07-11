# HODLearn Content Data Structure for External Claude Development

## CONTENT FRAMEWORK SUMMARY
Use the complete CONTENT_CREATION_FRAMEWORK.md for detailed guidelines. Key points:

**Philosophy**: "Conviction Through Curiosity" - Build Bitcoin conviction through immediate financial relevance
**Target**: Working professionals 25-35, $40K-$80K salary, seeking financial protection
**Approach**: 8th grade reading level, urgent financial hooks, sequential building, 300-1200 words per lesson

## DATABASE STRUCTURE REQUIREMENTS

When you return with content, format it as JSON objects that match our database schema:

### 1. CONTENT_DAYS Table Structure
```json
{
  "dayIndex": 1,
  "title": "Your Money is Being Stolen (And You Don't Even Know It)",
  "theme": "Problem Recognition",
  "isApproved": true
}
```

### 2. CONTENT_SET_UP_QUESTIONS Table Structure
```json
[
  {
    "dayId": 1,
    "questionOrder": 1,
    "question": "Why does your grocery bill keep getting bigger even though you buy the same things?"
  },
  {
    "dayId": 1,
    "questionOrder": 2,
    "question": "What happens to your savings when the government prints trillions of dollars?"
  },
  {
    "dayId": 1,
    "questionOrder": 3,
    "question": "What if money existed that no government could print more of?"
  }
]
```

### 3. CONTENT_LESSONS Table Structure
```json
{
  "dayId": 1,
  "title": "Your Money is Being Silently Stolen",
  "content": "Every morning, you wake up to work for money that's worth less than yesterday...\n\n**The Hidden Tax**\nWhen governments print money, they don't announce it...\n\n**Your Real Loss**\nThis isn't theoretical. Your salary today buys 20% less...\n\n**Bitcoin: The Solution**\nBitcoin has a fixed supply of 21 million coins...",
  "keyTakeaways": [
    "Your money loses value when governments print more dollars",
    "Bitcoin has a fixed supply that can't be increased", 
    "This makes Bitcoin potential protection against inflation"
  ],
  "whyItMatters": "This matters because inflation silently reduces your purchasing power every year, and understanding Bitcoin's fixed supply helps you evaluate whether it deserves a place in your financial planning."
}
```

### 4. CONTENT_QUIZZES Table Structure
```json
[
  {
    "dayIndex": 1,
    "question": "What is the main cause of your money losing purchasing power over time?",
    "optionA": "People spending too much",
    "optionB": "Government printing more money", 
    "optionC": "Bitcoin competition",
    "optionD": "Bank interest rates",
    "correctAnswer": "B",
    "explanation": "When governments print more money, it increases the money supply, making each dollar worth less. This is the primary driver of inflation and loss of purchasing power."
  }
]
```

## CONTENT CONTAINER FORMAT

When returning with completed content, use this container structure:

```json
{
  "contentBatch": {
    "description": "Week X: [Theme Name] - Days [X-Y]",
    "totalDays": 7,
    "weekTheme": "Problem Recognition",
    "contentDays": [
      {
        "dayIndex": 1,
        "title": "Title Here",
        "theme": "Week theme",
        "isApproved": true
      }
    ],
    "setupQuestions": [
      {
        "dayId": 1,
        "questionOrder": 1,
        "question": "Question text here"
      }
    ],
    "lessons": [
      {
        "dayId": 1,
        "title": "Lesson title",
        "content": "Full lesson content with **bold headers** and proper formatting...",
        "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
        "whyItMatters": "Why it matters explanation mentioning Bitcoin specifically..."
      }
    ],
    "quizzes": [
      {
        "dayIndex": 1,
        "question": "Quiz question text",
        "optionA": "Option A text",
        "optionB": "Option B text", 
        "optionC": "Option C text",
        "optionD": "Option D text",
        "correctAnswer": "B",
        "explanation": "Explanation reinforcing lesson content"
      }
    ]
  }
}
```

## CRITICAL CONTENT REQUIREMENTS

### Title Requirements:
- Under 60 characters
- Emotional hook + professional impact + urgency
- Power words: Stolen, Hidden, Secret, Crisis, Destroy, Protect

### Setup Questions Requirements:
- Exactly 3 questions per day
- Under 100 characters each
- Escalate: Personal → Systemic → Solution
- Build irresistible curiosity gaps

### Lesson Content Requirements:
- 300-1200 words
- 8th grade reading level
- Proper formatting with **bold headers**
- Clear paragraph breaks every 2-3 sentences
- Concrete examples with real numbers
- Sequential building (reference previous concepts naturally)
- Bitcoin conviction focus (not general finance education)

### Quiz Requirements:
- Exactly 4 questions per day
- Test actual lesson content (not external knowledge)
- optionA/B/C/D format with one clearly correct answer
- Professional scenarios in examples
- Explanations reinforce key lesson points

### Key Takeaways Requirements:
- Exactly 3 points
- Maximum 12 words each
- No technical jargon
- Everyday language
- Reinforce lesson core message

### Why It Matters Requirements:
- Must explicitly mention Bitcoin and its relevance
- Connect to personal financial protection
- Professional financial concerns focus
- Not generic financial advice

## RECOGNITION MARKERS

When you return with content, use these markers so I can easily identify and process it:

**Start Marker**: `=== HODLEARN CONTENT BATCH START ===`
**End Marker**: `=== HODLEARN CONTENT BATCH END ===`

Example:
```
=== HODLEARN CONTENT BATCH START ===
{
  "contentBatch": {
    // Your content JSON here
  }
}
=== HODLEARN CONTENT BATCH END ===
```

## CURRENT CURRICULUM STATUS

**Completed**: Days 1-30 (Month 1 complete)
**Next Priority**: Days 31-60 (Month 2: Bitcoin Basics & Properties)
**Available for Development**: Any day range you want to focus on

**Monthly Themes**:
- Month 1 (Days 1-30): Problem Recognition & Motivation ✅ COMPLETE
- Month 2 (Days 31-60): Bitcoin Basics & Properties
- Month 3 (Days 61-90): Implementation & Security
- Month 4+ (Days 91+): Advanced cycles

This structure ensures I can immediately recognize your content when you return and seamlessly import it into the HODLearn database with proper relationships and formatting.