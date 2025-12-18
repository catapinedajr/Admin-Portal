-- Clear existing content for Days 1-7
DELETE FROM content_quizzes WHERE day_id IN (1, 2, 4, 5, 6, 7, 8);
DELETE FROM content_lessons WHERE day_id IN (1, 2, 4, 5, 6, 7, 8);
DELETE FROM content_set_up_questions WHERE day_id IN (1, 2, 4, 5, 6, 7, 8);

-- Insert setup questions for Day 1
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(1, 'Why does your grocery bill keep getting bigger?', 'Understanding the hidden force that makes everything more expensive', 'Problem Recognition', 'shopping-cart', 1),
(1, 'What happens when governments create new money?', 'Exploring the effects of money printing on your purchasing power', 'Problem Recognition', 'printer', 2),
(1, 'How can you protect your purchasing power?', 'Discovering Bitcoin as a solution to money debasement', 'Problem Recognition', 'shield', 3);

-- Insert lesson for Day 1
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(1, 'Your Money is Being Stolen (And You Don''t Even Know It)', 
'You work hard for your paycheck. But something steals from you daily. This thief makes your money worth less. This thief is inflation. Governments need money for wars and bailouts. They don''t raise taxes. They create new money from nothing. In 2020, the U.S. created massive amounts of new money. What happens when you add more money? More dollars chasing goods means higher prices. Your grocery bill doubles. Your rent triples. Your salary grows 3% yearly. You get poorer with raises. A $50,000 salary today buys what $30,000 bought in 2000. Bitcoin solves this problem. Unlike dollars, only 21 million Bitcoin will exist. No government can print more Bitcoin. No bank can create Bitcoin from nothing. Bitcoin is digital money for people who want control.',
'["Inflation steals purchasing power silently", "Bitcoin has fixed supply preventing devaluation", "Working professionals need inflation protection"]',
'This matters because inflation silently reduces your purchasing power every year, and understanding Bitcoin''s fixed supply helps you evaluate whether it deserves a place in your financial planning.');

-- Insert quiz questions for Day 1
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(1, 'What is the main cause of inflation?', '["Higher wages for workers", "Governments creating new money", "Increased business profits", "Supply chain problems"]', 2, 'Inflation happens when governments create new money from nothing. Bitcoin''s fixed supply prevents this problem.', 1),
(1, 'What makes Bitcoin different from dollars?', '["Bitcoin supply increases every year", "Bitcoin has a fixed supply of 21 million coins", "Bitcoin supply is controlled by banks", "Bitcoin supply depends on government policy"]', 2, 'Unlike dollars that can be printed endlessly, Bitcoin has a fixed limit of 21 million coins making it scarce.', 2),
(1, 'What happens when you get a 3% raise but inflation is higher?', '["Your purchasing power increases", "Your purchasing power stays the same", "Your purchasing power decreases", "It depends on spending habits"]', 3, 'When inflation exceeds your raise, you can buy less despite earning more dollars. Bitcoin protects purchasing power.', 3),
(1, 'How much new money did the U.S. create in 2020?', '["The same as every year", "Double the previous year", "More than existed twenty years ago", "Less than in 2008"]', 3, 'In 2020, the U.S. created more dollars than existed twenty years earlier. Bitcoin prevents this with fixed supply.', 4);

-- Insert setup questions for Day 2
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(2, 'Why do prices keep going up?', 'Understanding the connection between money supply and rising prices', 'Problem Recognition', 'trending-up', 1),
(2, 'What happens to your savings over time?', 'Exploring how inflation erodes the value of cash savings', 'Problem Recognition', 'piggy-bank', 2),
(2, 'How does Bitcoin protect against rising prices?', 'Learning about Bitcoin''s scarcity as protection against inflation', 'Problem Recognition', 'shield-check', 3);

-- Insert lesson for Day 2
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(2, 'Why Your Coffee Costs $5 (When It Used to Cost $3)', 
'Everything costs more than it used to. Coffee was $3 five years ago. Now it''s $5. Gas doubled. Rent doubled. Food doubled. Your money buys less stuff. This happens because governments print money. They create new dollars constantly. More dollars means higher prices. It''s supply and demand. When there''s more money, prices go up. Your paycheck might grow 3% yearly. But prices grow 6% yearly. You fall behind every year. Your savings lose value sitting in the bank. Banks pay 0.5% interest. Inflation runs 6%. You lose 5.5% yearly. Bitcoin works differently. No one can print more Bitcoin. Only 21 million will exist. Ever. When demand grows, price goes up. When supply is fixed, scarcity creates value. Bitcoin protects against money printing. It can''t be inflated away. It''s digital gold for the internet age.',
'["Money printing causes prices to rise", "Your savings lose value over time", "Bitcoin''s fixed supply creates scarcity value"]',
'This matters because your money quietly loses value every year while sitting in banks, and understanding Bitcoin''s scarcity helps you evaluate whether it could preserve your wealth better than traditional savings.');

-- Insert quiz questions for Day 2
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(2, 'What causes prices to rise over time?', '["Businesses becoming greedy", "Governments printing more money", "Workers demanding higher wages", "Global supply shortages"]', 2, 'When governments print more money, more dollars chase the same goods, causing prices to rise. Bitcoin''s fixed supply prevents this.', 1),
(2, 'If your salary grows 3% but prices grow 6%, what happens?', '["You can buy more things", "You can buy the same amount", "You can buy less things", "It depends on what you buy"]', 3, 'When prices rise faster than wages, your purchasing power decreases. Bitcoin''s scarcity helps protect against this erosion.', 2),
(2, 'How many Bitcoin will exist?', '["21 million maximum", "100 million maximum", "Unlimited supply", "Supply increases with demand"]', 1, 'Bitcoin has a fixed supply of 21 million coins maximum. This scarcity makes it valuable as money printing increases.', 3),
(2, 'What happens to savings in a bank account?', '["They grow with inflation", "They stay the same value", "They lose value to inflation", "They''re protected from inflation"]', 3, 'Bank savings earn less interest than inflation rates, so they lose purchasing power over time. Bitcoin offers scarcity protection.', 4);

-- Insert setup questions for Day 3
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(4, 'How do banks make money from your deposits?', 'Understanding fractional reserve banking and interest rate spreads', 'Problem Recognition', 'building-2', 1),
(4, 'Why do you pay fees to access your own money?', 'Exploring the various fees banks charge for basic services', 'Problem Recognition', 'credit-card', 2),
(4, 'How does Bitcoin eliminate banking middlemen?', 'Learning about peer-to-peer transactions without banks', 'Problem Recognition', 'arrow-right-left', 3);

-- Insert lesson for Day 3
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(4, 'Banks Are Getting Rich Off Your Money', 
'Banks don''t work for you. They work for themselves. You deposit your money. They pay you 0.5% interest. Then they lend your money to others. They charge 6% interest on loans. They keep the 5.5% difference. This is called fractional reserve banking. Banks also charge you fees. Monthly maintenance fees. ATM fees. Overdraft fees. Wire transfer fees. They make money from your money. Then they charge you to use it. Bitcoin works differently. No bank controls your Bitcoin. You control your own money. No monthly fees. No overdraft fees. No wire transfer fees. Bitcoin transactions cost pennies. Not dollars. You can send Bitcoin anywhere instantly. No bank approval needed. No business hours. No holidays. Bitcoin is peer-to-peer money. You send directly to anyone. Banks can''t stop you. They can''t freeze your account. They can''t charge you fees. Bitcoin gives you financial freedom.',
'["Banks profit from your deposits and charge fees", "Bitcoin eliminates banking middlemen completely", "You control your money with Bitcoin"]',
'This matters because traditional banks extract wealth from your deposits while charging you fees, and understanding Bitcoin''s peer-to-peer system helps you evaluate whether you need banks at all.');

-- Insert quiz questions for Day 3
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(4, 'How do banks make money from your deposits?', '["They invest in stocks", "They lend your money at higher interest rates", "They charge government fees", "They print more money"]', 2, 'Banks pay you low interest then lend your money at higher rates, keeping the difference. Bitcoin eliminates this middleman extraction.', 1),
(4, 'What makes Bitcoin different from banking?', '["Bitcoin has higher fees", "Bitcoin requires bank approval", "Bitcoin is peer-to-peer with no middlemen", "Bitcoin has business hours"]', 3, 'Bitcoin allows direct peer-to-peer transactions without banks as middlemen. No fees, no approval needed, available 24/7.', 2),
(4, 'How much do Bitcoin transactions typically cost?', '["Same as wire transfers", "Pennies, not dollars", "Monthly maintenance fees", "Percentage of transaction amount"]', 2, 'Bitcoin transactions cost pennies compared to expensive bank wire transfers and fees. Much more affordable for users.', 3),
(4, 'What is fractional reserve banking?', '["Banks keep all deposits in vaults", "Banks lend out most of your deposits", "Banks only lend to businesses", "Banks don''t charge interest"]', 2, 'Banks keep only a fraction of deposits and lend the rest, profiting from the interest difference. Bitcoin eliminates this system.', 4);

-- Insert setup questions for Day 4
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(5, 'What happens when inflation beats your savings rate?', 'Understanding the math behind purchasing power erosion', 'Problem Recognition', 'calculator', 1),
(5, 'Why do rich people buy assets instead of saving cash?', 'Exploring the wealth-building strategies of the wealthy', 'Problem Recognition', 'trending-up', 2),
(5, 'How does Bitcoin protect against currency devaluation?', 'Learning about Bitcoin as digital property with fixed supply', 'Problem Recognition', 'coins', 3);

-- Insert lesson for Day 4
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(5, 'Your Savings Are Shrinking Every Day', 
'Your savings account is losing money. Banks pay 0.5% interest yearly. Inflation runs 6% yearly. You lose 5.5% purchasing power annually. A $10,000 savings account loses $550 yearly. In ten years, it buys $4,500 worth of stuff. Your money shrinks while sitting there. Rich people don''t save cash. They buy assets. Stocks, real estate, gold. Assets go up with inflation. Cash goes down with inflation. Poor people save cash. Rich people buy assets. This creates wealth inequality. Bitcoin is a new asset class. It''s digital property. Limited to 21 million coins. No government can print more. No bank can create more. Bitcoin price rises with demand. Limited supply meets growing demand. This creates scarcity value. Bitcoin protects against currency devaluation. It''s property, not currency. You own digital real estate. Not depreciating dollars.',
'["Savings accounts lose purchasing power to inflation", "Rich people buy assets, poor people save cash", "Bitcoin is digital property with limited supply"]',
'This matters because traditional savings lose value to inflation while assets protect wealth, and understanding Bitcoin as digital property helps you evaluate whether it could preserve your purchasing power better than cash.');

-- Insert quiz questions for Day 4
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(5, 'What happens when inflation is 6% but savings earn 0.5%?', '["You gain 5.5% purchasing power", "You lose 5.5% purchasing power", "Your money stays the same", "You gain 6.5% purchasing power"]', 2, 'When inflation exceeds savings rates, you lose purchasing power. Bitcoin''s scarcity can protect against this erosion.', 1),
(5, 'What do rich people buy instead of saving cash?', '["More cash in different banks", "Government bonds only", "Assets like stocks and real estate", "Gold and silver coins"]', 3, 'Rich people buy assets that appreciate with inflation. Bitcoin represents a new digital asset class with scarcity properties.', 2),
(5, 'How many Bitcoin will ever exist?', '["21 million maximum", "100 million maximum", "Unlimited supply", "Supply increases with demand"]', 1, 'Bitcoin has a fixed supply of 21 million coins, making it scarce digital property that can''t be inflated away.', 3),
(5, 'What is Bitcoin best described as?', '["Digital currency for spending", "Digital property with limited supply", "Government-backed money", "Bank-issued digital cash"]', 2, 'Bitcoin is digital property with a fixed supply of 21 million coins, making it scarce like real estate or gold.', 4);

-- Insert setup questions for Day 5
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(6, 'Why do asset prices rise faster than wages?', 'Understanding how money printing affects different asset classes', 'Problem Recognition', 'bar-chart-3', 1),
(6, 'How does money printing benefit asset owners?', 'Exploring the connection between monetary policy and wealth inequality', 'Problem Recognition', 'printer', 2),
(6, 'Why is Bitcoin access important for working professionals?', 'Learning how Bitcoin democratizes access to digital property', 'Problem Recognition', 'users', 3);

-- Insert lesson for Day 5
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(6, 'Why the Rich Keep Getting Richer', 
'The rich get richer. The poor get poorer. This isn''t accident. It''s system design. When governments print money, asset prices rise. Stocks go up. Real estate goes up. Gold goes up. But wages stay flat. Rich people own assets. Poor people own wages. Money printing makes assets more expensive. But wages don''t keep up. This creates wealth inequality. A house cost $100,000 in 2000. Now it costs $500,000. Did houses get better? No. Money got worse. Rich people owned the house. They got richer. Working people earned wages. They got poorer. Bitcoin changes this game. Bitcoin is digital property. Anyone can buy it. Not just rich people. You can buy $10 of Bitcoin. You can buy $10,000 of Bitcoin. No minimum. No restrictions. No bank approval. Bitcoin gives working professionals asset access. You can own digital property. Not just earn wages.',
'["Money printing inflates asset prices faster than wages", "Rich people own assets, poor people earn wages", "Bitcoin gives everyone access to digital property"]',
'This matters because money printing systematically benefits asset owners over wage earners, and understanding Bitcoin as accessible digital property helps you evaluate whether it could level the playing field for working professionals.');

-- Insert quiz questions for Day 5
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(6, 'What happens to asset prices when money is printed?', '["They stay the same", "They go down", "They go up", "They become worthless"]', 3, 'Money printing inflates asset prices because more money chases the same assets. Bitcoin benefits from this as digital property.', 1),
(6, 'Why did house prices rise from $100,000 to $500,000?', '["Houses got much better", "Money got worse through printing", "Population doubled", "Construction costs increased"]', 2, 'Money printing devalued dollars, making assets like houses more expensive in dollar terms. Bitcoin offers similar scarcity protection.', 2),
(6, 'What''s the minimum amount of Bitcoin you can buy?', '["One full Bitcoin only", "$1,000 minimum", "Any amount, even $10", "Depends on your bank"]', 3, 'Bitcoin is divisible, so anyone can buy any amount. This gives working professionals access to digital property.', 3),
(6, 'What advantage does Bitcoin give working professionals?', '["Higher wages", "Better jobs", "Access to digital property", "Government benefits"]', 3, 'Bitcoin gives working professionals access to digital property ownership, not just wage earning. This helps close the wealth gap.', 4);

-- Insert setup questions for Day 6
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(7, 'Who benefits most from money printing?', 'Understanding the Cantillon Effect and monetary privilege', 'Problem Recognition', 'users-2', 1),
(7, 'Why do you pay taxes but billionaires don''t?', 'Exploring the unfair advantages of being closest to money creation', 'Problem Recognition', 'receipt', 2),
(7, 'How does Bitcoin create a fairer system?', 'Learning about Bitcoin''s equal rules for all participants', 'Problem Recognition', 'scale', 3);

-- Insert lesson for Day 6
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(7, 'The Money System is Rigged Against You', 
'The money system is rigged. Billionaires get loans at 0% interest. You pay 6% interest. Banks get bailouts. You pay taxes. Government prints money. Assets go up. Your wages stay flat. This isn''t fair. It''s designed this way. Rich people get new money first. They buy assets cheaply. Then prices rise. Working people get new money last. They buy assets expensively. This is called the Cantillon Effect. People closest to money printing benefit most. People furthest from money printing suffer most. You work for money. Rich people create money. Different rules for different people. Bitcoin fixes this. Bitcoin has same rules for everyone. No special treatment. No bailouts. No money printing. Everyone plays by same rules. Rich or poor. Bitcoin transactions work the same. Bitcoin supply stays the same. Bitcoin access stays the same. Fair money for fair people.',
'["Traditional money system favors those closest to printing", "Working people get new money last, pay highest prices", "Bitcoin has same rules for everyone"]',
'This matters because the current monetary system systematically disadvantages working people through the Cantillon Effect, and understanding Bitcoin''s fair rules helps you evaluate whether it could provide more equitable financial access.');

-- Insert quiz questions for Day 6
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(7, 'What is the Cantillon Effect?', '["Everyone gets new money equally", "People closest to money printing benefit most", "Money printing helps poor people", "Inflation affects everyone the same"]', 2, 'The Cantillon Effect means people closest to money creation benefit most, while distant people suffer. Bitcoin eliminates this unfairness.', 1),
(7, 'Who gets new money first in the current system?', '["Working people", "Students", "Banks and wealthy people", "Small businesses"]', 3, 'Banks and wealthy people get new money first through loans and bailouts. Bitcoin gives equal access to everyone.', 2),
(7, 'What interest rate do billionaires get on loans?', '["Same as everyone else", "Higher than working people", "Close to 0%", "They don''t get loans"]', 3, 'Wealthy people get ultra-low interest rates while working people pay high rates. Bitcoin eliminates this unfair advantage.', 3),
(7, 'How does Bitcoin treat different people?', '["Rich people get special privileges", "Same rules for everyone", "Poor people get advantages", "Depends on your bank"]', 2, 'Bitcoin has identical rules for everyone regardless of wealth. No special treatment, no bailouts, no money printing.', 4);

-- Insert setup questions for Day 7
INSERT INTO content_set_up_questions (day_id, title, content, category, icon, order_index) VALUES
(8, 'What if money couldn''t be printed?', 'Imagining a world with mathematically fixed money supply', 'Problem Recognition', 'calculator', 1),
(8, 'How would fixed supply money change everything?', 'Exploring the benefits of predictable, unchangeable money', 'Problem Recognition', 'lock', 2),
(8, 'Why do millions of professionals choose Bitcoin?', 'Understanding the growing adoption among educated professionals', 'Problem Recognition', 'graduation-cap', 3);

-- Insert lesson for Day 7
INSERT INTO content_lessons (day_id, title, content, key_takeaways, why_it_matters) VALUES
(8, 'There''s a Better Way to Store Your Wealth', 
'There''s a better way. Imagine money that can''t be printed. Money that can''t be inflated. Money that can''t be manipulated. Money that works for you. This money exists. It''s called Bitcoin. Bitcoin solves every problem we''ve discussed. No inflation. No bank fees. No money printing. No rigged system. Bitcoin is fixed supply money. Only 21 million coins. Forever. No government can change this. No bank can change this. No billionaire can change this. Math controls Bitcoin. Not politics. Code controls Bitcoin. Not corruption. You control your Bitcoin. Not banks. Bitcoin is money designed for the people. By the people. Millions of professionals already use Bitcoin. Doctors, lawyers, engineers, teachers. They''re protecting their wealth. They''re taking control. They''re opting out of the rigged system. Bitcoin gives you financial freedom. Real freedom. Not fake freedom. You can join them. Or stay in the rigged system. Your choice.',
'["Bitcoin is fixed supply money that can''t be manipulated", "Math and code control Bitcoin, not politics", "Millions of professionals already use Bitcoin"]',
'This matters because Bitcoin offers a mathematically sound alternative to the manipulated traditional money system, and understanding why millions of professionals choose Bitcoin helps you evaluate whether it could provide the financial freedom you deserve.');

-- Insert quiz questions for Day 7
INSERT INTO content_quizzes (day_id, question, options, correct_answer, explanation, order_index) VALUES
(8, 'What controls Bitcoin''s supply?', '["Government policies", "Bank decisions", "Math and code", "Billionaire preferences"]', 3, 'Bitcoin''s supply is controlled by mathematical code, not human manipulation. This makes it predictable and fair.', 1),
(8, 'How many Bitcoin will exist?', '["21 million forever", "Increases with demand", "Decreases over time", "Depends on government"]', 1, 'Bitcoin has a fixed supply of 21 million coins forever. No one can change this mathematical limit.', 2),
(8, 'Who uses Bitcoin?', '["Only criminals", "Only tech people", "Millions of professionals", "Only billionaires"]', 3, 'Millions of professionals including doctors, lawyers, and engineers use Bitcoin to protect their wealth from inflation.', 3),
(8, 'What does Bitcoin give you?', '["Higher wages", "Financial freedom", "Government benefits", "Bank partnerships"]', 2, 'Bitcoin gives you financial freedom by letting you control your own money without banks or government interference.', 4);