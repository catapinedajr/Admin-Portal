import fs from 'fs';

// Read the file
const content = fs.readFileSync('client/src/pages/WalletPage.tsx', 'utf8');

// Remove premium indicators and unused imports
let cleaned = content;

// Remove Gem and Crown from imports
cleaned = cleaned.replace(/,\s*Crown\s*,\s*Gem\s*,/g, ',');
cleaned = cleaned.replace(/,\s*Gem\s*,\s*Crown\s*,/g, ',');
cleaned = cleaned.replace(/\s*Crown\s*,\s*Gem\s*,/g, '');
cleaned = cleaned.replace(/\s*Gem\s*,\s*Crown\s*,/g, '');
cleaned = cleaned.replace(/\s*Crown\s*,/g, '');
cleaned = cleaned.replace(/\s*Gem\s*,/g, '');
cleaned = cleaned.replace(/,\s*Crown\s*$/g, '');
cleaned = cleaned.replace(/,\s*Gem\s*$/g, '');

// Remove premium status indicator blocks
const premiumBlockRegex = /\s*{\/\* Premium Status Indicator \*\/}[\s\S]*?{isPremiumTier \? \([\s\S]*?\) : \([\s\S]*?\)}/g;
cleaned = cleaned.replace(premiumBlockRegex, '');

// Clean up any remaining references to premium variables
cleaned = cleaned.replace(/const \[isPremiumTier.*?\] = useState\(false\);?\s*/g, '');
cleaned = cleaned.replace(/const \[showEmailModal.*?\] = useState\(false\);?\s*/g, '');

// Write the cleaned content back
fs.writeFileSync('client/src/pages/WalletPage.tsx', cleaned);

console.log('Cleaned WalletPage.tsx');