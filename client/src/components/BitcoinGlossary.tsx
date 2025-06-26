import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

// Comprehensive Bitcoin glossary with beginner-friendly definitions
const bitcoinTerms = {
  "Bitcoin": "A digital currency (cryptocurrency) that operates without banks or governments, using cryptography and a distributed network.",
  "blockchain": "A digital ledger that records all Bitcoin transactions in chronological order, secured by cryptography and maintained by thousands of computers worldwide.",
  "mining": "The process of using computer power to secure the Bitcoin network and validate transactions. Miners are rewarded with new bitcoins.",
  "wallet": "Software or hardware that stores your Bitcoin private keys and allows you to send and receive Bitcoin.",
  "private key": "A secret number that proves you own specific bitcoins. Like a password, it must be kept secure and never shared.",
  "public key": "A cryptographic address derived from your private key that others can use to send you Bitcoin. Safe to share publicly.",
  "address": "A string of letters and numbers (like 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa) where Bitcoin can be sent. Generated from your public key.",
  "satoshi": "The smallest unit of Bitcoin. Named after Bitcoin's creator, 1 Bitcoin = 100,000,000 satoshis (like cents to dollars).",
  "hash": "A unique digital fingerprint created by mathematical algorithms. Used to verify data integrity in Bitcoin.",
  "node": "A computer that maintains a copy of the Bitcoin blockchain and helps validate transactions across the network.",
  "consensus": "Agreement among Bitcoin network participants about which transactions are valid and the current state of the blockchain.",
  "proof of work": "Bitcoin's security mechanism where miners compete to solve mathematical puzzles, proving they've invested computational energy.",
  "halving": "An event every ~4 years where the reward for mining new blocks is cut in half, reducing new Bitcoin supply creation.",
  "transaction": "A transfer of Bitcoin from one address to another, recorded permanently on the blockchain.",
  "block": "A collection of Bitcoin transactions bundled together and added to the blockchain approximately every 10 minutes.",
  "peer-to-peer": "Direct transactions between users without intermediaries like banks or payment processors.",
  "decentralized": "No single point of control. Bitcoin operates across thousands of computers worldwide with no central authority.",
  "cryptography": "Mathematical techniques used to secure information. Bitcoin uses cryptography to protect transactions and control creation of new units.",
  "digital signature": "Cryptographic proof that a transaction was created by the owner of a private key, without revealing the private key.",
  "HODL": "A misspelling of 'hold' that became popular in Bitcoin culture, meaning to keep Bitcoin long-term rather than selling.",
  "Lightning Network": "A second layer built on Bitcoin that enables faster, cheaper transactions by creating payment channels between users.",
  "multisig": "Multi-signature. Requires multiple private keys to authorize a Bitcoin transaction, adding extra security.",
  "cold storage": "Keeping Bitcoin private keys completely offline (like on a hardware wallet) to protect from online threats.",
  "hot wallet": "A Bitcoin wallet connected to the internet, convenient for frequent transactions but less secure than cold storage.",
  "fork": "A change to Bitcoin's protocol rules. Can be 'soft' (backwards compatible) or 'hard' (creates new blockchain).",
  "mempool": "The waiting area for unconfirmed Bitcoin transactions before they're included in a block.",
  "confirmation": "When a transaction is included in a block and added to the blockchain. More confirmations = more security.",
  "double spending": "Attempting to spend the same Bitcoin twice. The blockchain prevents this through consensus mechanisms.",
  "51% attack": "Theoretical attack where someone controls majority of mining power and could potentially reverse transactions.",
  "whitepaper": "The original 9-page document by Satoshi Nakamoto explaining Bitcoin's design and purpose.",
  "Satoshi Nakamoto": "The pseudonymous creator(s) of Bitcoin. Real identity remains unknown.",
  "genesis block": "The first block in the Bitcoin blockchain, created by Satoshi Nakamoto on January 3, 2009.",
  "difficulty adjustment": "Bitcoin automatically adjusts mining difficulty every 2,016 blocks to maintain ~10 minute block times.",
  "fee": "A small amount paid to miners to prioritize including your transaction in the next block.",
  "UTXO": "Unspent Transaction Output. How Bitcoin tracks ownership - like digital coins that can be spent.",
  "seed phrase": "12-24 words that can restore your entire Bitcoin wallet. Must be kept secret and backed up safely.",
  "exchange": "A platform where you can buy, sell, or trade Bitcoin for other currencies or cryptocurrencies.",
  "DCA": "Dollar-Cost Averaging. Investment strategy of buying fixed dollar amounts regularly regardless of price.",
  "market cap": "Total value of all existing Bitcoin (price × total supply). Measures Bitcoin's overall worth.",
  "volatility": "How much Bitcoin's price fluctuates. High volatility means large price swings up and down.",
  "inflation": "General increase in prices over time. Bitcoin's fixed supply makes it potentially inflation-resistant.",
  "fiat": "Government-issued currencies like dollars, euros, or yen. Not backed by physical commodities.",
  "central bank": "Government institution that controls a country's money supply and monetary policy.",
  "store of value": "An asset that maintains its worth over time. Bitcoin is often called 'digital gold' for this property.",
  "medium of exchange": "Something widely accepted as payment for goods and services.",
  "unit of account": "A standard way to measure and compare the value of goods and services.",
  "censorship resistance": "Bitcoin transactions cannot be blocked or reversed by governments or institutions.",
  "immutable": "Cannot be changed or altered. Bitcoin transaction history is immutable once confirmed.",
  "trustless": "System that works without requiring trust in any central authority or counterparty.",
  "permissionless": "Anyone can use Bitcoin without asking permission from any authority.",
  "open source": "Bitcoin's code is publicly available and can be reviewed, modified, and verified by anyone.",
  "energy": "Bitcoin mining consumes electricity to secure the network, often compared to country-level usage.",
  "renewable": "Energy sources like solar, wind, and hydro. Many Bitcoin miners use renewable energy.",
  "hash rate": "Total computational power securing the Bitcoin network. Higher hash rate = more security.",
  "difficulty": "How hard it is to mine a Bitcoin block. Adjusts to maintain consistent block times.",
  "nonce": "A number miners change to try different hash outputs when mining blocks.",
  "Merkle tree": "Data structure that efficiently summarizes all transactions in a block using cryptographic hashes.",
  "Byzantine Generals Problem": "Classic computer science problem that Bitcoin solves - achieving consensus in a distributed system.",
  "game theory": "Study of strategic decision-making. Bitcoin uses economic incentives to encourage honest behavior.",
  "network effect": "Bitcoin becomes more valuable as more people use it, creating positive feedback loops."
};

interface BitcoinTermProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function BitcoinTerm({ term, children, className = "" }: BitcoinTermProps) {
  const definition = bitcoinTerms[term.toLowerCase() as keyof typeof bitcoinTerms];
  
  if (!definition) {
    return <span className={className}>{children}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${className} border-b border-dotted border-orange-400 cursor-help text-orange-400 hover:text-orange-300 transition-colors`}>
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm bg-zinc-800 border-zinc-700 text-zinc-100 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-orange-400">{term}</span>
            </div>
            <p className="text-sm leading-relaxed">{definition}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper component for wrapping text content with automatic term detection
interface AutoGlossaryProps {
  children: string;
  className?: string;
}

export function AutoGlossary({ children, className = "" }: AutoGlossaryProps) {
  const terms = Object.keys(bitcoinTerms);
  let processedText = children;
  
  // Sort terms by length (descending) to match longer terms first
  const sortedTerms = terms.sort((a, b) => b.length - a.length);
  
  // Create a regex pattern that matches any of the terms (case insensitive)
  const pattern = new RegExp(`\\b(${sortedTerms.join('|')})\\b`, 'gi');
  
  const parts = processedText.split(pattern);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        const isGlossaryTerm = terms.includes(lowerPart);
        
        if (isGlossaryTerm) {
          return (
            <BitcoinTerm key={index} term={lowerPart}>
              {part}
            </BitcoinTerm>
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export default BitcoinTerm;