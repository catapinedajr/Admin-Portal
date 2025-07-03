import { 
  Coins, 
  Box, 
  Shield, 
  KeyRound,
  Gem,
  Zap,
  GraduationCap,
  HelpCircle,
  DollarSign,
  Building2,
  AlertTriangle
} from "lucide-react";

export const iconMap = {
  coins: Coins,
  cube: Box,
  "shield-alt": Shield,
  "user-secret": KeyRound,
  gem: Gem,
  zap: Zap,
  "graduation-cap": GraduationCap,
  "help-circle": HelpCircle,
  "dollar-sign": DollarSign,
  building: Building2,
  "alert-triangle": AlertTriangle,
};

export const bitcoinTerms = [
  {
    term: "Bitcoin",
    definition: "A peer-to-peer electronic cash system that enables direct transactions without intermediaries like banks."
  },
  {
    term: "Blockchain",
    definition: "A distributed ledger technology that records transactions in blocks linked together chronologically."
  },
  {
    term: "Mining",
    definition: "The process of validating transactions and securing the Bitcoin network while earning new bitcoins as rewards."
  },
  {
    term: "Wallet",
    definition: "Software or hardware that stores your private keys and allows you to send and receive Bitcoin."
  },
  {
    term: "Private Key",
    definition: "A secret number that proves ownership of Bitcoin and allows you to spend it. Never share this with anyone."
  },
  {
    term: "Satoshi",
    definition: "The smallest unit of Bitcoin, named after its creator. One Bitcoin equals 100 million satoshis."
  },
  {
    term: "Halving",
    definition: "An event every 4 years where the mining reward is cut in half, reducing new Bitcoin creation."
  },
  {
    term: "HODL",
    definition: "A misspelling of 'hold' that became a strategy of keeping Bitcoin long-term regardless of price swings."
  }
];

// Seed Phrase Recovery Scenarios
export const seedPhraseScenarios = [
  {
    id: 1,
    title: "Phone Replacement Emergency",
    description: "Your phone broke and you need to restore your mobile wallet on a new device.",
    difficulty: "Beginner",
    seedPhrase: Array(12).fill("hodlearn"),
    context: "You had $200 worth of Bitcoin in your mobile wallet for daily spending. Your phone screen cracked completely and won't turn on.",
    timeLimit: 300, // 5 minutes
    correctSteps: [
      "Download the same wallet app on your new phone",
      "Select 'Restore from seed phrase' option",
      "Enter your 12 words in the exact order",
      "Set a new PIN for the restored wallet"
    ],
    incorrectSteps: [
      "Contact your bank to recover the funds",
      "Email the wallet company for help",
      "Try to guess your seed phrase"
    ],
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "This is a 12-word seed phrase",
      "Seed phrases are case-sensitive and order matters"
    ]
  },
  {
    id: 2,
    title: "Hardware Wallet Recovery",
    description: "Your hardware wallet was damaged and you need to recover your long-term Bitcoin savings.",
    difficulty: "Intermediate",
    seedPhrase: Array(16).fill("hodlearn"),
    context: "You stored $5,000 worth of Bitcoin on a hardware wallet for long-term savings. The device fell and the screen is completely broken.",
    timeLimit: 420, // 7 minutes
    correctSteps: [
      "Purchase a new hardware wallet (same or different brand)",
      "Initialize the device and select 'Restore wallet'",
      "Enter your 16-word recovery phrase carefully",
      "Set a new PIN and confirm the wallet address matches"
    ],
    incorrectSteps: [
      "Try to repair the broken hardware wallet",
      "Contact the manufacturer to recover your coins",
      "Attempt to extract data from the broken device"
    ],
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "This is a 16-word seed phrase",
      "Hardware wallets from different manufacturers can restore the same seed"
    ]
  },
  {
    id: 3,
    title: "Critical Backup Recovery",
    description: "You need to recover your Bitcoin from a seed phrase you haven't used in 2 years.",
    difficulty: "Advanced",
    seedPhrase: Array(24).fill("hodlearn"),
    context: "You stored significant Bitcoin using a 24-word seed phrase in 2022. You haven't accessed it since then and need to recover the wallet.",
    timeLimit: 600, // 10 minutes
    correctSteps: [
      "Find your securely stored 24-word seed phrase",
      "Download a compatible wallet software",
      "Use 'Import wallet' with your seed phrase",
      "Check multiple derivation paths if needed"
    ],
    incorrectSteps: [
      "Try to remember the seed phrase from memory",
      "Use incomplete or partial seed phrases",
      "Contact exchanges to recover your Bitcoin"
    ],
    hints: [
      "This is a practice simulation - type 'hodlearn' for each word",
      "This is a 24-word seed phrase",
      "In real wallets, the last word contains a checksum for validation"
    ]
  }
];