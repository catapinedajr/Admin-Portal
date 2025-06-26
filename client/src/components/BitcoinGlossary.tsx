import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

// Comprehensive Bitcoin glossary with beginner-friendly definitions
const bitcoinTerms = {
  // Core Bitcoin Concepts
  "Bitcoin": "A decentralized digital currency that operates on a peer-to-peer network without banks or governments, using cryptography for security.",
  "BTC": "The ticker symbol for Bitcoin, like how USD represents US dollars.",
  "blockchain": "A distributed ledger that records all Bitcoin transactions in chronological order, secured by cryptography and maintained by thousands of computers worldwide.",
  "cryptocurrency": "Digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit or double-spend.",
  
  // Network and Mining
  "mining": "The process of using computer power to secure the Bitcoin network, validate transactions, and solve computational puzzles for rewards.",
  "miners": "People or organizations that use specialized computers to secure the Bitcoin network and earn rewards.",
  "node": "A computer that maintains a copy of the Bitcoin blockchain and helps validate transactions across the network.",
  "hash": "A unique digital fingerprint created by mathematical algorithms. Used to verify data integrity in Bitcoin.",
  "hash rate": "Total computational power securing the Bitcoin network. Higher hash rate means more security.",
  "difficulty": "How hard it is to mine a Bitcoin block. Automatically adjusts to maintain consistent ~10 minute block times.",
  "difficulty adjustment": "Bitcoin automatically adjusts mining difficulty every 2,016 blocks to maintain ~10 minute block times.",
  "nonce": "A number miners change to try different hash outputs when mining blocks.",
  "proof of work": "Bitcoin's security mechanism where miners compete to solve mathematical puzzles, proving they've invested computational energy.",
  
  // Transactions and Blocks
  "transaction": "A transfer of Bitcoin from one address to another, recorded permanently on the blockchain.",
  "block": "A group of transactions bundled together and added to the blockchain approximately every 10 minutes.",
  "confirmation": "When a transaction is included in a block and added to the blockchain. More confirmations mean more security.",
  "mempool": "The waiting area for unconfirmed Bitcoin transactions before they're included in a block.",
  "fee": "A small amount paid to miners to prioritize including your transaction in the next block.",
  "gas fees": "Transaction fees paid to process operations on the Bitcoin network.",
  "UTXO": "Unspent Transaction Output. How Bitcoin tracks ownership - like digital coins that can be spent.",
  
  // Wallets and Security
  "wallet": "Software or hardware that stores your Bitcoin private keys and allows you to send and receive Bitcoin.",
  "private key": "A secret code that grants access to Bitcoin in a wallet. Like a password, it must be kept secure and never shared.",
  "public key": "A cryptographic address derived from your private key that others can use to send you Bitcoin. Safe to share publicly.",
  "address": "A shortened public key (like 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa) where Bitcoin can be sent.",
  "seed phrase": "12-24 words that can restore your entire Bitcoin wallet. Must be kept secret and backed up safely.",
  "cold storage": "Keeping Bitcoin private keys completely offline (like on a hardware wallet) to protect from online threats.",
  "hot wallet": "A Bitcoin wallet connected to the internet, convenient for frequent transactions but less secure than cold storage.",
  "multisig": "Multi-signature. Requires multiple private keys to authorize a Bitcoin transaction, adding extra security.",
  "digital signature": "Cryptographic proof that a transaction was created by the owner of a private key, without revealing the private key.",
  
  // Network Properties
  "decentralized": "No single point of control. Bitcoin operates across thousands of computers worldwide with no central authority.",
  "peer-to-peer": "Direct transactions between users without intermediaries like banks or payment processors.",
  "consensus": "Agreement among Bitcoin network participants about which transactions are valid and the current state of the blockchain.",
  "trustless": "System that works without requiring trust in any central authority or counterparty.",
  "permissionless": "Anyone can use Bitcoin without asking permission from any authority.",
  "censorship resistance": "Bitcoin transactions cannot be blocked or reversed by governments or institutions.",
  "immutable": "Cannot be changed or altered. Bitcoin transaction history is immutable once confirmed.",
  "open source": "Bitcoin's code is publicly available and can be reviewed, modified, and verified by anyone.",
  
  // Supply and Economics
  "satoshi": "The smallest unit of Bitcoin (0.00000001 BTC). Named after Bitcoin's creator, like cents to dollars.",
  "halving": "An event reducing mining reward by half, occurs approximately every 4 years to control Bitcoin supply.",
  "21 million": "The maximum number of bitcoins that will ever exist, creating built-in scarcity.",
  "deflation": "Decrease in general price levels. Bitcoin's fixed supply makes it potentially deflationary.",
  "inflation": "General increase in prices over time. Bitcoin's fixed supply makes it potentially inflation-resistant.",
  "store of value": "An asset that maintains its worth over time. Bitcoin is often called 'digital gold' for this property.",
  "medium of exchange": "Something widely accepted as payment for goods and services.",
  "unit of account": "A standard way to measure and compare the value of goods and services.",
  
  // Trading and Investment
  "HODL": "A misspelling of 'hold' that became popular Bitcoin slang, meaning to keep Bitcoin long-term rather than selling.",
  "exchange": "A platform for trading Bitcoin with other currencies or cryptocurrencies (e.g., Coinbase, Binance).",
  "DCA": "Dollar-Cost Averaging. Investment strategy of buying fixed dollar amounts regularly regardless of price.",
  "market cap": "Total value of all existing Bitcoin (price × total supply). Measures Bitcoin's overall worth.",
  "volatility": "How much Bitcoin's price fluctuates. High volatility means large price swings up and down.",
  "fiat": "Government-issued currency not backed by physical commodities (e.g., USD, EUR).",
  "KYC": "Know Your Customer - regulatory ID verification required by most exchanges.",
  
  // Technical Concepts
  "cryptography": "Mathematical techniques used to secure information. Bitcoin uses cryptography to protect transactions and control creation of new units.",
  "fork": "A change in blockchain protocol, creating new chain. Can be 'hard' (incompatible) or 'soft' (backwards compatible).",
  "double spending": "Attempting to spend the same Bitcoin twice. The blockchain prevents this through consensus mechanisms.",
  "51% attack": "Theoretical attack where someone controls majority of mining power and could potentially reverse transactions.",
  "Merkle tree": "Data structure that efficiently summarizes all transactions in a block using cryptographic hashes.",
  "Byzantine Generals Problem": "Classic computer science problem that Bitcoin solves - achieving consensus in a distributed system.",
  "game theory": "Study of strategic decision-making. Bitcoin uses economic incentives to encourage honest behavior.",
  "network effect": "Bitcoin becomes more valuable as more people use it, creating positive feedback loops.",
  
  // Historical and Cultural
  "whitepaper": "Bitcoin's foundational document by Satoshi Nakamoto (2008) explaining the system design.",
  "Satoshi Nakamoto": "The pseudonymous creator(s) of Bitcoin. Real identity remains unknown.",
  "genesis block": "The first block in the Bitcoin blockchain, created by Satoshi Nakamoto on January 3, 2009.",
  "Lightning Network": "A second layer built on Bitcoin that enables faster, cheaper transactions by creating payment channels between users.",
  
  // Environmental and Energy
  "energy": "Bitcoin mining consumes electricity to secure the network, often compared to country-level usage.",
  "renewable": "Energy sources like solar, wind, and hydro. Many Bitcoin miners use renewable energy.",
  
  // Traditional Finance Context
  "central bank": "Government institution that controls a country's money supply and monetary policy.",
  "fractional reserve": "Banking system where banks hold only a fraction of deposits as reserves, lending out the rest.",
  "quantitative easing": "Central bank policy of creating new money to purchase government securities or bonds.",
  "debasement": "Reduction in the value of currency, often through increasing the money supply."
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