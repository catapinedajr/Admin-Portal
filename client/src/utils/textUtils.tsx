import React from "react";

export function cleanText(text: string | undefined | null): React.ReactNode {
  // Handle undefined/null text gracefully
  if (!text) return null;
  
  // First split by paragraphs (double line breaks), then handle bold formatting within each paragraph
  const paragraphs = text.split(/\n\s*\n/);
  
  return paragraphs.map((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) return null;
    
    // Split by **bold** markers and render appropriately
    const parts = paragraph.split(/\*\*(.*?)\*\*/g);
    const formattedContent = parts.map((part, index) => {
      // Even indices are regular text, odd indices are bold text
      if (index % 2 === 0) {
        return part;
      } else {
        return <strong key={index} className="font-semibold text-white">{part}</strong>;
      }
    });
    
    return (
      <p key={paragraphIndex} className="mb-4 last:mb-0">
        {formattedContent}
      </p>
    );
  });
}

// Helper function for expanded lesson content
export function getExpandedLessonContent(title: string, content: string): Array<{
  title: string;
  paragraphs: string[];
  keyPoints?: string[];
  realWorldExample?: string;
}> {
  switch (title) {
    case "Bitcoin vs Traditional Money: Why It Matters":
      return [
        {
          title: "The Problems with Fiat Currency",
          paragraphs: [
            "Since 1971, when President Nixon ended the gold standard, most world currencies became 'fiat' money - backed only by government promises rather than tangible assets like gold. This fundamental shift has created several critical problems that affect everyone's financial security.",
            "The most obvious problem is inflation by design. Governments can create new money at will, which reduces the purchasing power of existing money. The US dollar has lost over 85% of its value since 1971, meaning what cost $1 then requires about $6.50 today.",
            "Beyond inflation, fiat systems concentrate enormous power in the hands of central authorities. Banks and governments can freeze your accounts without warning, reverse your transactions, control who can send or receive money, and devalue your savings through unlimited money printing. This level of control gives them unprecedented power over your financial life."
          ],
          keyPoints: [
            "No backing by tangible assets since 1971",
            "85% value loss in US dollar since gold standard ended",
            "Unlimited money printing causes guaranteed inflation",
            "Complete control over all financial transactions"
          ]
        },
        {
          title: "Why Bitcoin Solves These Problems",
          paragraphs: [
            "Bitcoin was created specifically to solve the fundamental problems of centralized, government-controlled money. Its fixed supply of 21 million coins makes inflation impossible - no one can create more Bitcoin beyond this limit, no matter how powerful they are.",
            "Rather than relying on banks and governments as intermediaries, Bitcoin operates on a decentralized network where transactions are verified by thousands of computers around the world. This means no single authority can freeze your account, reverse your payments, or prevent you from sending money to anyone, anywhere.",
            "The Bitcoin network operates 24/7/365 without holidays, weekends, or banking hours. International transfers that take days through traditional banking happen in minutes with Bitcoin, often at a fraction of the cost. Most importantly, you maintain complete control over your money - no one else holds the keys to your wealth."
          ],
          keyPoints: [
            "Fixed 21 million supply prevents inflation forever",
            "No central authority can control your money",
            "24/7 global transfers in minutes, not days",
            "You control your wealth directly, not banks"
          ],
          realWorldExample: "During the 2022 Canadian trucker protests, the government froze protesters' bank accounts to stop donations. Bitcoin donations continued flowing because no government can control the Bitcoin network."
        },
        {
          title: "The Network Effect Advantage",
          paragraphs: [
            "As more people adopt Bitcoin, it becomes more valuable and useful for everyone. This creates a positive feedback loop called the network effect - the same principle that made the internet, email, and social media so powerful.",
            "Every new Bitcoin user makes the network more secure, more liquid, and more useful for global commerce. Major corporations like MicroStrategy, Tesla, and Square now hold Bitcoin on their balance sheets. Countries like El Salvador have made it legal tender. This growing adoption increases Bitcoin's stability and utility.",
            "The network effect also applies to Bitcoin's security. With millions of computers worldwide protecting the network, Bitcoin has become the most secure digital asset ever created. The more valuable Bitcoin becomes, the more computing power secures it, making attacks increasingly impossible."
          ],
          keyPoints: [
            "More users = more security and value for everyone",
            "Corporate and government adoption accelerating",
            "Millions of computers protect the network globally",
            "Growing utility makes Bitcoin more practical daily"
          ]
        }
      ];

    default:
      // For any lesson not specifically handled, provide a basic structure
      if (!content) {
        return [{
          title: "Content Loading...",
          paragraphs: ["Content is being loaded. Please try again in a moment."]
        }];
      }
      
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const midpoint = Math.ceil(sentences.length / 2);
      
      return [
        {
          title: "Understanding the Basics",
          paragraphs: [sentences.slice(0, midpoint).join('. ') + '.']
        },
        {
          title: "Why This Matters",
          paragraphs: [sentences.slice(midpoint).join('. ') + '.'],
          keyPoints: [
            "No single control gives people freedom over their money", 
            "Strong security keeps your money safe",
            "Anyone with internet can use it anywhere in the world"
          ]
        }
      ];
  }
}