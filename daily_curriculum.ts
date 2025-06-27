// Comprehensive 52-week daily curriculum for money education
// Each week has 7 days of content with facts, lessons, and quizzes

export const dailyCurriculum = {
  // Week 1: What Is Money Really? (Days 1-7)
  week1: {
    title: "What Is Money Really?",
    description: "Explore the fundamental nature of money, from ancient barter systems to modern digital currencies",
    days: {
      day1: {
        dayIndex: 1,
        weekNumber: 1,
        title: "The Story of Barter and Trade",
        facts: [
          {
            category: "History",
            text: "Before money existed, people traded goods directly through barter systems",
            icon: "🔄",
            expandedContent: {
              explanation: "Imagine trying to trade your cow for shoes, but the shoemaker doesn't need a cow - they need grain. You'd have to find someone who wants your cow and has grain, then trade the grain for shoes. This 'coincidence of wants' problem made trade incredibly difficult.",
              examples: [
                "A farmer with wheat needing tools had to find a toolmaker who wanted wheat",
                "Ancient Mesopotamians traded barley for pottery around 3000 BCE",
                "Native American tribes used complex barter networks across vast distances"
              ],
              visualDescription: "Picture a web of people trying to match what they have with what others want - it's like a giant puzzle where every piece must fit perfectly.",
              keyTakeaways: [
                "Barter required perfect timing and matching needs",
                "Trade was limited by the 'double coincidence of wants'",
                "Complex trades required multiple steps and intermediaries"
              ]
            }
          },
          {
            category: "Economics",
            text: "The 'double coincidence of wants' problem made barter systems inefficient for complex societies",
            icon: "⚖️",
            expandedContent: {
              explanation: "For barter to work, both parties must want exactly what the other has at exactly the same time. As societies grew more complex with specialized jobs, this became nearly impossible to achieve.",
              examples: [
                "A blacksmith making horseshoes couldn't easily trade with a baker who didn't own horses",
                "Seasonal workers couldn't save their labor for future use",
                "Artists and craftspeople struggled to find direct trades for their specialized work"
              ],
              visualDescription: "Think of it like trying to organize a massive potluck dinner where everyone must bring exactly what someone else wants, and everyone must want exactly what someone else brings - chaos!",
              keyTakeaways: [
                "Specialization made direct barter increasingly difficult",
                "Timing mismatches prevented many beneficial trades",
                "Complex societies needed better trade solutions"
              ]
            }
          },
          {
            category: "Innovation",
            text: "Early humans solved trade problems by finding commonly desired goods as intermediate exchange",
            icon: "🧠",
            expandedContent: {
              explanation: "Smart traders realized they could use goods that almost everyone wanted as stepping stones for trade. Instead of direct barter, they'd trade for something universally desired, then trade that for what they actually needed.",
              examples: [
                "Cattle became common trade intermediaries because everyone needed food or labor",
                "Salt was used for trade because it preserved food and was essential for life",
                "Shells were valued for decoration and rarity in inland communities"
              ],
              visualDescription: "Imagine having a universal gift card that everyone accepts - that's what these early trade goods became for ancient communities.",
              keyTakeaways: [
                "Commonly desired goods became natural trade intermediaries",
                "This was the first step toward true money",
                "Innovation arose from practical trading problems"
              ]
            }
          }
        ],
        lesson: {
          title: "The Story of Barter and Trade",
          content: "Long before coins jingled in pockets or bills exchanged hands, humans faced a fundamental challenge: how do you get what you need when you have something completely different to offer? This is the story of how our ancestors solved one of humanity's oldest economic puzzles.\n\nImagine Sarah, a skilled potter in an ancient village, who has just finished crafting beautiful clay vessels. Her family needs grain for the winter, but when she approaches Marcus the farmer, he shakes his head. 'I already have plenty of pots,' he says. 'What I really need is a new ax for cutting wood.' Sarah's heart sinks. She could make the most beautiful pottery in the village, but without an ax to trade, Marcus won't give her the grain her family desperately needs.\n\nThis scenario played out countless times across ancient civilizations. The barter system seemed logical in theory - trade what you have for what you need - but in practice, it created an enormous problem economists call the 'double coincidence of wants.' Both people had to want exactly what the other offered, at exactly the same time.\n\nAs communities grew larger and people became more specialized in their crafts, this problem became even worse. A musician couldn't eat their songs, a toolmaker couldn't wear their hammers, and a healer couldn't build shelter with their knowledge. Everyone produced something valuable, but connecting producers with the right consumers became like solving an incredibly complex puzzle every single day.\n\nThe breakthrough came when clever traders realized they didn't need to find perfect matches. Instead, they could use goods that almost everyone wanted as stepping stones. If Sarah the potter could trade her vessels for cattle - which everyone valued for food, labor, and materials - she could then trade the cattle for grain. The cattle became what we now call a 'medium of exchange.'\n\nDifferent communities discovered different solutions. Coastal peoples used shells that were beautiful and rare inland. Mountain communities traded precious stones and metals. Agricultural societies used grain or livestock. Each community found something that most people desired, creating the world's first informal currencies.\n\nThese early trade goods had to meet certain criteria to work effectively. They needed to be durable enough to last during storage, portable enough to carry to markets, and valuable enough that small amounts could purchase necessary goods. Most importantly, they had to be widely accepted and trusted by the community.\n\nThis innovation transformed human civilization. Suddenly, a skilled craftsperson could focus entirely on perfecting their craft, knowing they could always trade their products for whatever they needed. Farmers could specialize in growing the crops best suited to their land. Artists could create beauty without worrying about finding someone who wanted art in exchange for food.\n\nThe story of barter and its evolution into early money systems reveals something profound about human nature: when faced with practical problems, people innovate. The inconvenience of barter wasn't just accepted as 'the way things are' - our ancestors recognized the inefficiency and created solutions that would eventually lead to the sophisticated monetary systems we use today.\n\nThis ancient innovation laid the foundation for everything from gold coins to paper currency to digital payments. Every time you use money today, you're benefiting from the creative problem-solving of countless generations who refused to accept that trade had to be difficult and inefficient.",
          summary: "Before money, people used barter systems where goods were traded directly. This created the 'double coincidence of wants' problem - both traders needed to want exactly what the other offered. Early humans solved this by using commonly desired goods like cattle, shells, or grain as trade intermediaries, creating the first primitive money systems.",
          estimatedReadTime: 4
        },
        quiz: [
          {
            question: "What was the main problem with barter systems that led to the invention of money?",
            options: [
              "People didn't know how to count",
              "The double coincidence of wants was hard to achieve",
              "Goods were too heavy to carry",
              "There weren't enough goods to trade"
            ],
            correctAnswer: 1,
            explanation: "The 'double coincidence of wants' meant both parties had to want exactly what the other offered at the same time, making direct barter very difficult as societies became more complex."
          },
          {
            question: "How did early humans begin to solve the barter problem?",
            options: [
              "They invented paper money",
              "They created banks",
              "They used commonly desired goods as trade intermediaries",
              "They stopped trading altogether"
            ],
            correctAnswer: 2,
            explanation: "Early humans identified goods that almost everyone wanted (like cattle, shells, or grain) and used these as stepping stones for trade, creating the first primitive money systems."
          },
          {
            question: "What made certain goods effective as early money?",
            options: [
              "They were colorful and pretty",
              "They were durable, portable, and widely accepted",
              "They were made by the government",
              "They had numbers written on them"
            ],
            correctAnswer: 1,
            explanation: "Effective early money needed to be durable enough to store, portable enough to carry, and most importantly, widely accepted and trusted by the community."
          }
        ]
      },
      day2: {
        dayIndex: 2,
        weekNumber: 1,
        title: "Why Shells and Stones Became Money",
        facts: [
          {
            category: "History",
            text: "Cowrie shells were used as money for over 4,000 years across Africa, Asia, and the Pacific",
            icon: "🐚",
            expandedContent: {
              explanation: "Cowrie shells became one of history's most successful currencies because they were naturally scarce, difficult to counterfeit, durable, and beautiful. They were small enough to carry but valuable enough for meaningful transactions.",
              examples: [
                "Chinese emperors used cowrie shells as official currency around 1200 BCE",
                "West African kingdoms built vast trading empires using cowrie shell money",
                "Pacific Island cultures used shells for dowries and important ceremonies"
              ],
              visualDescription: "Imagine smooth, glossy white shells with natural patterns - each one was like a perfectly designed coin created by nature, impossible to fake and universally beautiful.",
              keyTakeaways: [
                "Natural scarcity made shells valuable and trusted",
                "Durability allowed shells to function as stores of value",
                "Beauty and uniqueness prevented counterfeiting"
              ]
            }
          },
          {
            category: "Economics",
            text: "Yap Island's giant stone money proved that value comes from social agreement, not physical properties",
            icon: "🗿",
            expandedContent: {
              explanation: "The people of Yap Island used massive limestone discs as money - some weighing several tons. The stones rarely moved; instead, ownership was tracked through oral tradition. This showed that money's value comes from collective belief, not the physical object itself.",
              examples: [
                "A 12-foot stone disc could buy a house, but it stayed in the village center",
                "When a stone sank during transport, it was still considered valuable money",
                "Ownership changes were announced publicly and remembered by the community"
              ],
              visualDescription: "Picture enormous stone wheels, taller than a person, sitting permanently in village squares while their ownership changed hands through spoken agreements - like invisible bank transfers.",
              keyTakeaways: [
                "Money's value exists in the mind, not the object",
                "Social consensus can make anything into money",
                "Physical possession isn't required for ownership"
              ]
            }
          },
          {
            category: "Innovation",
            text: "Natural objects became money because they solved key problems: scarcity, durability, and trust",
            icon: "💎",
            expandedContent: {
              explanation: "Shells, stones, and other natural objects succeeded as money because nature provided built-in features that made them perfect currency: they were hard to find (scarcity), lasted a long time (durability), and difficult to fake (authenticity).",
              examples: [
                "Obsidian blades were valued because the volcanic glass was rare and useful",
                "Amber was prized for its beauty and the fact that it preserved ancient life",
                "Jade was treasured because it was extremely hard to carve and naturally beautiful"
              ],
              visualDescription: "Think of nature as the first central bank, creating limited supplies of beautiful, durable objects that humans instinctively valued and trusted.",
              keyTakeaways: [
                "Nature provided scarcity without human intervention",
                "Natural beauty created universal appeal",
                "Difficulty of creation prevented inflation"
              ]
            }
          }
        ],
        lesson: {
          title: "Why Shells and Stones Became Money",
          content: "On a remote Pacific island called Yap, something extraordinary happened that would challenge everything we think we know about money. The islanders created a currency system using massive stone discs - some as tall as a person and weighing several tons. But here's the remarkable part: these 'coins' rarely moved. Instead, ownership was tracked through oral tradition, with the entire community remembering who owned which stone.\n\nThis wasn't just an isolated curiosity. Around the same time, halfway across the world, cowrie shells were circulating as currency from China to West Africa. These small, glossy shells became one of history's most successful and long-lasting money systems, used for over 4,000 years across multiple continents.\n\nWhat made these natural objects so effective as money reveals fundamental truths about what money really is and why it works.\n\nCowrie shells succeeded because nature had engineered them perfectly for use as currency. They were naturally scarce - you couldn't just go to any beach and collect them. The specific shells used for money came from particular regions in the Indian Ocean, making them rare and valuable. They were incredibly durable, lasting for decades without deteriorating. Their smooth, glossy surface and natural patterns made them beautiful and nearly impossible to counterfeit.\n\nMost importantly, cowrie shells were the perfect size and weight for transactions. A handful could buy a meal, a bag could purchase livestock, and larger quantities could fund major trade expeditions. They were portable enough for merchants to carry long distances, yet valuable enough to make transportation worthwhile.\n\nThe stone money of Yap Island taught an even more profound lesson. When a massive stone disc sank to the bottom of the ocean during transport, the community decided it was still valuable money. The physical stone was unreachable, but everyone agreed it still existed and still had an owner. This revealed something crucial: money's value doesn't come from the physical object itself, but from the collective agreement of the community.\n\nAcross different cultures, natural objects became money when they solved three critical problems. First, scarcity - they had to be rare enough that not everyone could easily obtain them, creating genuine value. Second, durability - they needed to last long enough to function as a store of value, allowing people to save for the future. Third, trust - the community had to believe in their authenticity and value.\n\nNature provided these features automatically. Shells were limited by geography and biology. Precious stones were rare and difficult to find. Metals like gold and silver were scarce in the earth and required skill to extract and shape. None of these could be easily created or faked, giving them inherent trustworthiness.\n\nDifferent environments produced different solutions. Island cultures used shells because they understood their scarcity and beauty. Mountain peoples used stones and metals because they understood their rarity and permanence. Each community chose objects that made sense in their specific context, but all successful money shared those same fundamental characteristics.\n\nThe transition from barter to natural money represented a crucial leap in human economic development. Suddenly, value could be stored over time. A farmer could sell grain at harvest and save cowrie shells to buy tools in the spring. A craftsperson could accumulate stones over months to make a major purchase. Money became humanity's first technology for moving value through time.\n\nThese early money systems also enabled long-distance trade on an unprecedented scale. Merchants could carry concentrated value across vast distances, opening up trade routes that connected distant civilizations. The famous Silk Road was possible partly because traders could carry valuable, widely-accepted money across thousands of miles.\n\nWhat's fascinating is how similar solutions emerged independently across the globe. From the Americas to Africa to Asia, human communities discovered that certain natural objects could serve as money. This suggests that the need for money - and the criteria for what makes good money - are fundamental aspects of human nature and economic organization.\n\nThe story of shells and stones as money teaches us that successful currency isn't imposed from above - it emerges from practical needs and collective agreement. The most enduring money systems have been those that people freely chose to adopt because they solved real problems and provided genuine value.\n\nToday, as we navigate digital currencies and new forms of money, we can learn from these ancient innovations. The same principles that made cowrie shells successful for millennia - scarcity, durability, and trust - remain essential for any money system, whether it's made of shells, stones, metal, paper, or computer code.",
          summary: "Natural objects like cowrie shells and stone discs became successful money because they possessed key qualities: scarcity, durability, and community trust. These currencies lasted thousands of years and enabled long-distance trade, proving that money's value comes from collective agreement rather than government decree.",
          estimatedReadTime: 5
        },
        quiz: [
          {
            question: "What made cowrie shells effective as money for over 4,000 years?",
            options: [
              "They were created by governments",
              "They were naturally scarce, durable, and beautiful",
              "They could be easily reproduced",
              "They were the largest objects available"
            ],
            correctAnswer: 1,
            explanation: "Cowrie shells succeeded as money because nature provided them with ideal monetary properties: natural scarcity from specific regions, durability that lasted decades, and beauty that made them universally desired and hard to counterfeit."
          },
          {
            question: "What did Yap Island's stone money teach us about the nature of money?",
            options: [
              "Money must be small and portable",
              "Value comes from social agreement, not physical properties",
              "Only governments can create valid money",
              "Money must be made of precious metals"
            ],
            correctAnswer: 1,
            explanation: "Yap's massive stone discs that rarely moved - and retained value even when lost at sea - demonstrated that money's value exists in the collective agreement of the community, not in the physical object itself."
          },
          {
            question: "Why did different cultures independently develop similar money systems using natural objects?",
            options: [
              "They copied each other's ideas",
              "They all used the same materials",
              "Natural objects solved universal problems of scarcity, durability, and trust",
              "They were forced to by ancient governments"
            ],
            correctAnswer: 2,
            explanation: "Different cultures worldwide independently chose natural objects as money because these objects naturally provided the essential qualities needed for effective currency: scarcity, durability, and trustworthiness."
          }
        ]
      }
      // Additional days 3-7 will be implemented following the same pattern
    }
  }
  // Additional weeks will be implemented following the same pattern
};