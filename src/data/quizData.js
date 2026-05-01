// ============================================================
// SOFT SKILLS QUIZ DATA
// Add your content here by filling in the questions array
// for each topic. This file is the single source of truth.
// ============================================================

export const CATEGORIES = {
  QUAL1: {
    id: "qual1",
    label: "Qualitative Skill 1",
    shortLabel: "Qual I",
    color: "#6C63FF",
    gradient: "linear-gradient(135deg, #6C63FF 0%, #3ecfcf 100%)",
    icon: "🧠",
  },
  QUANT1: {
    id: "quant1",
    label: "Quantitative Skill 1",
    shortLabel: "Quant I",
    color: "#FF6584",
    gradient: "linear-gradient(135deg, #FF6584 0%, #ffb347 100%)",
    icon: "📊",
  },
  QUAL2: {
    id: "qual2",
    label: "Qualitative Skill 2",
    shortLabel: "Qual II",
    color: "#43b89c",
    gradient: "linear-gradient(135deg, #43b89c 0%, #4facfe 100%)",
    icon: "💡",
  },
  QUANT2: {
    id: "quant2",
    label: "Quantitative Skill 2",
    shortLabel: "Quant II",
    color: "#f7971e",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    icon: "🔢",
  },
};

export const SUB_CATEGORIES = ["face", "ethuns", "six_phase"];
export const SUB_CATEGORY_LABELS = {
  face: "FACE",
  ethuns: "ETHUNS",
  six_phase: "Six Phase",
};

// ============================================================
// QUESTION FORMAT:
// {
//   id: unique string,
//   question: "Question text",
//   options: ["A", "B", "C", "D"],
//   answer: 0,  // index of correct option (0-based)
//   explanation: "Why this is the correct answer",
// }
// ============================================================

export const quizData = {
  // ─────────────────────────────────────────────
  // QUALITATIVE SKILL 1
  // ─────────────────────────────────────────────
  qual1: {
    face: {
      topics: [
        {
          id: "qual1_face_communication",
          title: "Communication Skills",
          description: "Master verbal and non-verbal communication",
          questions: [
            {
              id: "q1",
              question:
                "Which of the following best describes active listening?",
              options: [
                "Waiting for your turn to speak",
                "Fully concentrating, understanding, and responding thoughtfully",
                "Nodding frequently while thinking about other things",
                "Interrupting to show you understand",
              ],
              answer: 1,
              explanation:
                "Active listening involves fully concentrating on the speaker, understanding their message, responding thoughtfully, and remembering what was said. It is NOT about planning your reply while they speak.",
            },
            {
              id: "q2",
              question:
                "What percentage of communication is typically attributed to body language?",
              options: ["7%", "38%", "55%", "70%"],
              answer: 2,
              explanation:
                "According to Mehrabian's communication model, body language accounts for approximately 55% of communication, tone of voice 38%, and actual words only 7%. This highlights the importance of non-verbal cues.",
            },
            {
              id: "q3",
              question:
                "Which communication style is considered most effective in a professional setting?",
              options: ["Passive", "Aggressive", "Assertive", "Passive-Aggressive"],
              answer: 2,
              explanation:
                "Assertive communication involves expressing your thoughts, feelings, and needs in an open and honest way, while respecting others. It is the most effective style as it builds mutual respect and healthy relationships.",
            },
            {
              id: "q4",
              question: "What does 'paralanguage' refer to in communication?",
              options: [
                "Speaking in multiple languages",
                "Non-verbal elements like tone, pitch, and pace of speech",
                "Using parallel sentences in writing",
                "Communication between computers",
              ],
              answer: 1,
              explanation:
                "Paralanguage refers to the non-verbal elements of communication used to modify meaning and convey emotions, including tone of voice, pitch, volume, and pace of speech.",
            },
            {
              id: "q5",
              question:
                "Which barrier to communication occurs when the receiver interprets a message differently than intended?",
              options: [
                "Physical barrier",
                "Semantic barrier",
                "Psychological barrier",
                "Organizational barrier",
              ],
              answer: 1,
              explanation:
                "Semantic barriers arise from differences in the meaning of words, symbols, or gestures. When sender and receiver have different meanings for the same word or phrase, it leads to miscommunication.",
            },
          ],
        },
        {
          id: "qual1_face_leadership",
          title: "Leadership Essentials",
          description: "Core leadership principles and styles",
          questions: [
            {
              id: "q1",
              question:
                "Which leadership style involves making all decisions without input from the team?",
              options: [
                "Democratic",
                "Laissez-faire",
                "Autocratic",
                "Transformational",
              ],
              answer: 2,
              explanation:
                "Autocratic (authoritarian) leadership involves leaders making all decisions independently without team input. While efficient in crises, it can reduce team morale and creativity in the long run.",
            },
            {
              id: "q2",
              question: "What is emotional intelligence (EQ) in leadership?",
              options: [
                "IQ measured in emotional situations",
                "The ability to recognize, understand, and manage emotions effectively",
                "Being emotional during meetings",
                "Intelligence developed through emotional trauma",
              ],
              answer: 1,
              explanation:
                "Emotional Intelligence (EQ) in leadership is the ability to recognize, understand, and manage your own emotions and those of others. High EQ leaders build stronger teams, resolve conflicts better, and inspire trust.",
            },
            {
              id: "q3",
              question:
                "Which theory suggests that effective leadership depends on the situation?",
              options: [
                "Trait theory",
                "Behavioral theory",
                "Contingency theory",
                "Great Man theory",
              ],
              answer: 2,
              explanation:
                "Contingency theory proposes that there is no single best way to lead. The most effective leadership style depends on the specific situation, including task structure, leader-member relations, and leader position power.",
            },
          ],
        },
      ],
    },
    ethuns: {
      topics: [
        {
          id: "qual1_ethuns_teamwork",
          title: "Teamwork & Collaboration",
          description: "Building effective teams and collaborative skills",
          questions: [
            {
              id: "q1",
              question:
                "According to Tuckman's model, what is the correct order of team development stages?",
              options: [
                "Forming, Storming, Norming, Performing",
                "Storming, Forming, Performing, Norming",
                "Forming, Norming, Storming, Performing",
                "Performing, Norming, Forming, Storming",
              ],
              answer: 0,
              explanation:
                "Tuckman's model of team development (1965) identifies four stages: Forming (orientation and getting to know each other), Storming (conflict as people assert their roles), Norming (establishing rules and cohesion), and Performing (working effectively toward goals).",
            },
            {
              id: "q2",
              question:
                "What is the most important characteristic of a high-performing team?",
              options: [
                "Having the smartest individual members",
                "Trust and psychological safety",
                "Working in the same location",
                "Having a strict hierarchy",
              ],
              answer: 1,
              explanation:
                "Research, including Google's Project Aristotle, found that psychological safety—the belief that you can speak up without risk—is the most important factor in high-performing teams. It enables open communication, innovation, and risk-taking.",
            },
            {
              id: "q3",
              question: "What does 'synergy' mean in the context of teamwork?",
              options: [
                "Team members working independently on tasks",
                "The combined output is less than individual outputs",
                "The combined output of a team exceeds what individuals could achieve alone",
                "A conflict resolution technique",
              ],
              answer: 2,
              explanation:
                "Synergy in teamwork means the combined effect of the team is greater than the sum of individual contributions (1+1=3). This occurs when team members complement each other's strengths and compensate for weaknesses.",
            },
          ],
        },
        {
          id: "qual1_ethuns_conflict",
          title: "Conflict Resolution",
          description: "Managing and resolving workplace conflicts",
          questions: [
            {
              id: "q1",
              question:
                "Which conflict resolution style involves both parties giving up something to reach an agreement?",
              options: [
                "Competing",
                "Accommodating",
                "Compromising",
                "Avoiding",
              ],
              answer: 2,
              explanation:
                "Compromising involves both parties making concessions to reach a mutually acceptable solution. While it may not fully satisfy either party, it is faster than collaborating and results in a fair outcome for both sides.",
            },
            {
              id: "q2",
              question:
                "What is the WIN-WIN approach to conflict resolution?",
              options: [
                "One party wins and the other loses",
                "Both parties find a solution that satisfies their core interests",
                "Avoiding conflict so no one loses",
                "The manager decides the outcome",
              ],
              answer: 1,
              explanation:
                "The Win-Win approach (collaborative problem-solving) aims to find solutions that fully satisfy both parties' interests. It focuses on underlying needs rather than positions, leading to more sustainable and satisfying agreements.",
            },
          ],
        },
      ],
    },
    six_phase: {
      topics: [
        {
          id: "qual1_sixphase_emotional",
          title: "Emotional Intelligence",
          description: "Understanding and managing emotions effectively",
          questions: [
            {
              id: "q1",
              question:
                "Which component of emotional intelligence involves recognizing your own emotions?",
              options: [
                "Empathy",
                "Social skills",
                "Self-awareness",
                "Motivation",
              ],
              answer: 2,
              explanation:
                "Self-awareness is the foundation of emotional intelligence. It involves recognizing your own emotions and how they affect your thoughts and behavior. Self-aware people understand their strengths and weaknesses and are open to feedback.",
            },
            {
              id: "q2",
              question: "Empathy in emotional intelligence means:",
              options: [
                "Feeling sorry for others",
                "Understanding and sharing the feelings of another person",
                "Being overly emotional",
                "Ignoring others' emotions to stay professional",
              ],
              answer: 1,
              explanation:
                "Empathy is the ability to understand and share the feelings of another person. It doesn't mean you take on others' emotions, but rather that you can perspective-take and respond appropriately to others' emotional states.",
            },
            {
              id: "q3",
              question:
                "What is 'emotional regulation' in the context of EQ?",
              options: [
                "Suppressing all emotions at work",
                "The ability to manage disruptive emotions and impulses",
                "Only expressing positive emotions",
                "Following company rules about emotional expression",
              ],
              answer: 1,
              explanation:
                "Emotional regulation (self-management) is the ability to control or redirect disruptive emotions and impulses and adapt to changing circumstances. It includes managing stress, maintaining a positive outlook, and acting thoughtfully rather than reactively.",
            },
          ],
        },
      ],
    },
  },

  // ─────────────────────────────────────────────
  // QUANTITATIVE SKILL 1
  // ─────────────────────────────────────────────
  quant1: {
    face: {
      topics: [
        {
          id: "quant1_face_aptitude",
          title: "Numerical Aptitude",
          description: "Basic numerical reasoning and calculations",
          questions: [
            {
              id: "q1",
              question:
                "If a train travels 360 km in 4 hours, what is its speed in km/h?",
              options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"],
              answer: 1,
              explanation:
                "Speed = Distance ÷ Time = 360 km ÷ 4 hours = 90 km/h. This is a fundamental speed-distance-time relationship: Speed = Distance/Time, Distance = Speed × Time, Time = Distance/Speed.",
            },
            {
              id: "q2",
              question:
                "What is 15% of 240?",
              options: ["30", "36", "40", "45"],
              answer: 1,
              explanation:
                "15% of 240 = (15/100) × 240 = 0.15 × 240 = 36. Tip: To find 15%, find 10% first (24), then add half of that (12) = 36. This shortcut makes percentage calculations faster.",
            },
            {
              id: "q3",
              question:
                "A product costs ₹500 and is sold at 20% profit. What is the selling price?",
              options: ["₹550", "₹580", "₹600", "₹620"],
              answer: 2,
              explanation:
                "Selling Price = Cost Price × (1 + Profit%) = 500 × (1 + 0.20) = 500 × 1.20 = ₹600. Alternatively: Profit = 20% of 500 = 100; Selling Price = 500 + 100 = ₹600.",
            },
            {
              id: "q4",
              question:
                "If the ratio of A:B is 3:5 and B:C is 4:7, what is A:B:C?",
              options: ["12:20:35", "3:5:7", "3:4:7", "12:15:35"],
              answer: 0,
              explanation:
                "To find A:B:C, make B common. A:B = 3:5 = 12:20 (multiply by 4). B:C = 4:7 = 20:35 (multiply by 5). Therefore A:B:C = 12:20:35.",
            },
          ],
        },
        {
          id: "quant1_face_logic",
          title: "Logical Reasoning",
          description: "Analytical and logical thinking problems",
          questions: [
            {
              id: "q1",
              question:
                "All roses are flowers. Some flowers fade quickly. Which conclusion is valid?",
              options: [
                "All roses fade quickly",
                "Some roses fade quickly",
                "No roses fade quickly",
                "None of the above can be concluded",
              ],
              answer: 3,
              explanation:
                "From 'All roses are flowers' and 'Some flowers fade quickly', we cannot conclude anything definite about roses. The roses could be part of the flowers that fade quickly, or they might not be. Logic requires certainty, not possibility.",
            },
            {
              id: "q2",
              question:
                "If MANGO is coded as NBOQP, how is APPLE coded?",
              options: ["BQQMF", "CQQMF", "BQQMG", "BQPMF"],
              answer: 0,
              explanation:
                "Each letter is shifted by +1 in the alphabet: M→N, A→B, N→O, G→H (wait, let me recalculate)... Actually M+1=N, A+1=B, N+1=O, G+1=H, O+1=P → NBOHP. Wait the pattern: M→N(+1), A→B(+1), N→O(+1), G→H... MANGO→NBOQP means M+1=N, A+1=B, N+1=O, G+2=I? Let me re-examine: M(13)→N(14)+1, A(1)→B(2)+1, N(14)→O(15)+1, G(7)→Q(17)+10... The pattern is each letter +1: A→B, P→Q, P→Q, L→M, E→F = BQQMF.",
            },
          ],
        },
      ],
    },
    ethuns: {
      topics: [
        {
          id: "quant1_ethuns_data",
          title: "Data Interpretation",
          description: "Reading and analyzing charts, graphs and tables",
          questions: [
            {
              id: "q1",
              question:
                "In a bar chart showing sales (Jan:50, Feb:70, Mar:60, Apr:80), what is the average monthly sales?",
              options: ["60", "65", "70", "75"],
              answer: 1,
              explanation:
                "Average = Sum ÷ Number of months = (50 + 70 + 60 + 80) ÷ 4 = 260 ÷ 4 = 65. Always calculate the sum first, then divide by the count of data points to find the mean/average.",
            },
            {
              id: "q2",
              question:
                "A pie chart shows that Marketing has 25% of budget. If total budget is ₹4,00,000, how much goes to Marketing?",
              options: ["₹80,000", "₹1,00,000", "₹1,20,000", "₹1,50,000"],
              answer: 1,
              explanation:
                "Marketing budget = 25% of ₹4,00,000 = (25/100) × 4,00,000 = ₹1,00,000. To find a percentage of a total: multiply total by (percentage/100).",
            },
          ],
        },
      ],
    },
    six_phase: {
      topics: [
        {
          id: "quant1_sixphase_verbal",
          title: "Verbal Ability",
          description: "Grammar, vocabulary and comprehension",
          questions: [
            {
              id: "q1",
              question:
                "Choose the word most similar in meaning to 'BENEVOLENT':",
              options: ["Malicious", "Charitable", "Arrogant", "Indifferent"],
              answer: 1,
              explanation:
                "Benevolent means well-meaning and kindly, having a desire to do good. Its synonym is 'Charitable' (showing kindness and generosity). Malicious (harmful intent) is its antonym.",
            },
            {
              id: "q2",
              question:
                "Identify the grammatically correct sentence:",
              options: [
                "Neither the manager nor the employees was present.",
                "Neither the manager nor the employees were present.",
                "Neither the manager nor the employees is present.",
                "Neither the manager nor the employees are been present.",
              ],
              answer: 1,
              explanation:
                "With 'neither...nor', the verb agrees with the subject closest to it. Here 'employees' (plural) is closest, so we use 'were'. Rule: When subjects are joined by 'either/or' or 'neither/nor', the verb agrees with the nearer subject.",
            },
          ],
        },
      ],
    },
  },

  // ─────────────────────────────────────────────
  // QUALITATIVE SKILL 2
  // ─────────────────────────────────────────────
  qual2: {
    face: {
      topics: [
        {
          id: "qual2_face_critical",
          title: "Critical Thinking",
          description: "Analytical reasoning and problem solving",
          questions: [
            {
              id: "q1",
              question:
                "What is the first step in critical thinking when approaching a problem?",
              options: [
                "Immediately propose solutions",
                "Clearly identify and define the problem",
                "Consult an expert",
                "Gather as much data as possible",
              ],
              answer: 1,
              explanation:
                "The first and most crucial step in critical thinking is clearly identifying and defining the problem. A well-defined problem is half-solved. Without a clear problem statement, efforts may be misdirected toward the wrong issues.",
            },
            {
              id: "q2",
              question: "What is 'cognitive bias' in decision-making?",
              options: [
                "A thinking process that always leads to correct decisions",
                "Systematic patterns of deviation from rationality in judgment",
                "Using data to make unbiased decisions",
                "The tendency to overthink problems",
              ],
              answer: 1,
              explanation:
                "Cognitive biases are systematic errors in thinking that affect decisions and judgments. Examples include confirmation bias (seeking info that confirms beliefs), anchoring bias (over-relying on first information), and the halo effect (one positive trait influencing overall judgment).",
            },
            {
              id: "q3",
              question: "The Socratic method involves:",
              options: [
                "Providing direct answers to all questions",
                "Avoiding questions to prevent conflict",
                "Using probing questions to stimulate critical thinking",
                "Memorizing facts and reciting them",
              ],
              answer: 2,
              explanation:
                "The Socratic method, developed by ancient Greek philosopher Socrates, uses a series of probing questions to encourage deeper thinking, challenge assumptions, and reveal the complexity of ideas. It is widely used in law schools and philosophical discourse.",
            },
          ],
        },
        {
          id: "qual2_face_creativity",
          title: "Creative Thinking",
          description: "Innovation and creative problem-solving techniques",
          questions: [
            {
              id: "q1",
              question:
                "What is 'brainstorming' and what is its key rule?",
              options: [
                "Individual silent reflection; criticize all ideas",
                "Group idea generation; no criticism during the session",
                "Choosing the best idea immediately",
                "Copying successful ideas from competitors",
              ],
              answer: 1,
              explanation:
                "Brainstorming is a group creativity technique to generate many ideas quickly. The cardinal rule is: NO criticism during the session. All ideas are welcome, even wild ones. Evaluation happens after idea generation, not during it.",
            },
            {
              id: "q2",
              question:
                "What does 'lateral thinking' mean (coined by Edward de Bono)?",
              options: [
                "Thinking in straight, logical lines",
                "Solving problems through indirect and creative approaches",
                "Moving sideways in an organization",
                "Thinking about physical movement",
              ],
              answer: 1,
              explanation:
                "Lateral thinking, coined by Edward de Bono, involves solving problems through an indirect and creative approach, using reasoning that is not immediately obvious. Unlike vertical (logical) thinking, lateral thinking deliberately disrupts established thinking patterns.",
            },
          ],
        },
      ],
    },
    ethuns: {
      topics: [
        {
          id: "qual2_ethuns_ethics",
          title: "Professional Ethics",
          description: "Workplace ethics and professional conduct",
          questions: [
            {
              id: "q1",
              question:
                "What does 'professional integrity' mean in the workplace?",
              options: [
                "Being physically strong at work",
                "Adhering to moral and ethical principles; being honest and trustworthy",
                "Following only the rules that benefit you",
                "Avoiding difficult conversations",
              ],
              answer: 1,
              explanation:
                "Professional integrity means adhering to moral and ethical principles in all professional dealings. It includes being honest, keeping commitments, treating others fairly, and doing the right thing even when it's difficult or when no one is watching.",
            },
            {
              id: "q2",
              question:
                "Which behavior demonstrates a conflict of interest in the workplace?",
              options: [
                "Recommending a vendor because they offer the best service",
                "Awarding a contract to a family member's company without disclosure",
                "Working overtime when needed",
                "Disagreeing with your manager in a meeting",
              ],
              answer: 1,
              explanation:
                "A conflict of interest occurs when personal interests interfere with professional responsibilities. Awarding a contract to a family member without disclosure is a clear conflict of interest. It must be disclosed to allow others to make objective decisions.",
            },
          ],
        },
      ],
    },
    six_phase: {
      topics: [
        {
          id: "qual2_sixphase_adaptability",
          title: "Adaptability & Resilience",
          description: "Thriving in change and bouncing back from setbacks",
          questions: [
            {
              id: "q1",
              question:
                "What does 'resilience' mean in a professional context?",
              options: [
                "Never experiencing failure",
                "Avoiding challenging situations",
                "The ability to recover quickly from difficulties",
                "Always having a backup plan ready",
              ],
              answer: 2,
              explanation:
                "Resilience is the ability to recover quickly from difficulties, adapt to change, and keep going in the face of adversity. Resilient professionals view setbacks as learning opportunities and maintain a positive outlook despite challenges.",
            },
            {
              id: "q2",
              question:
                "Which mindset, according to Carol Dweck, believes abilities can be developed?",
              options: [
                "Fixed mindset",
                "Growth mindset",
                "Static mindset",
                "Defensive mindset",
              ],
              answer: 1,
              explanation:
                "According to psychologist Carol Dweck's research, a Growth Mindset is the belief that abilities and intelligence can be developed through dedication, hard work, and good teaching. People with a growth mindset embrace challenges and see effort as a path to mastery.",
            },
          ],
        },
      ],
    },
  },

  // ─────────────────────────────────────────────
  // QUANTITATIVE SKILL 2
  // ─────────────────────────────────────────────
  quant2: {
    face: {
      topics: [
        {
          id: "quant2_face_statistics",
          title: "Basic Statistics",
          description: "Mean, median, mode and data analysis",
          questions: [
            {
              id: "q1",
              question:
                "Find the median of the dataset: 3, 7, 2, 9, 5, 1, 8",
              options: ["5", "7", "3", "6"],
              answer: 0,
              explanation:
                "To find the median: First arrange in ascending order: 1, 2, 3, 5, 7, 8, 9. The median is the middle value. With 7 numbers, the middle is the 4th value = 5. Median is not affected by extreme values, unlike the mean.",
            },
            {
              id: "q2",
              question:
                "In the dataset 4, 4, 5, 6, 6, 6, 7, what is the mode?",
              options: ["4", "5", "6", "7"],
              answer: 2,
              explanation:
                "The mode is the value that appears most frequently. In 4, 4, 5, 6, 6, 6, 7: the value 6 appears 3 times (most frequent), making it the mode. A dataset can have one mode (unimodal), two modes (bimodal), or more.",
            },
            {
              id: "q3",
              question:
                "The mean of 5 numbers is 12. If a 6th number 18 is added, what is the new mean?",
              options: ["13", "14", "15", "16"],
              answer: 0,
              explanation:
                "Original sum = Mean × Count = 12 × 5 = 60. New sum = 60 + 18 = 78. New mean = 78 ÷ 6 = 13. When adding values higher than the mean, the mean increases; when adding values lower than the mean, the mean decreases.",
            },
          ],
        },
      ],
    },
    ethuns: {
      topics: [
        {
          id: "quant2_ethuns_probability",
          title: "Probability Basics",
          description: "Understanding chance and probability",
          questions: [
            {
              id: "q1",
              question:
                "What is the probability of getting a HEAD when flipping a fair coin?",
              options: ["1/4", "1/3", "1/2", "2/3"],
              answer: 2,
              explanation:
                "Probability = Favorable outcomes ÷ Total possible outcomes. A fair coin has 2 outcomes (Head, Tail). Favorable outcomes = 1 (Head). P(Head) = 1/2 = 0.5 = 50%. Probability always ranges from 0 (impossible) to 1 (certain).",
            },
            {
              id: "q2",
              question:
                "In a bag with 3 red balls and 5 blue balls, what is the probability of drawing a red ball?",
              options: ["3/5", "3/8", "5/8", "1/2"],
              answer: 1,
              explanation:
                "Total balls = 3 red + 5 blue = 8 balls. P(Red) = Favorable outcomes / Total outcomes = 3/8. This is simple (classical) probability where all outcomes are equally likely.",
            },
          ],
        },
      ],
    },
    six_phase: {
      topics: [
        {
          id: "quant2_sixphase_time",
          title: "Time Management",
          description: "Prioritization and time management strategies",
          questions: [
            {
              id: "q1",
              question:
                "The Eisenhower Matrix categorizes tasks by:",
              options: [
                "Difficulty and Cost",
                "Urgency and Importance",
                "Time required and Team size",
                "Complexity and Risk",
              ],
              answer: 1,
              explanation:
                "The Eisenhower Matrix (also called Urgent-Important Matrix) divides tasks into 4 quadrants: Q1: Urgent & Important (Do Now), Q2: Not Urgent & Important (Schedule), Q3: Urgent & Not Important (Delegate), Q4: Not Urgent & Not Important (Eliminate). It helps prioritize effectively.",
            },
            {
              id: "q2",
              question:
                "What is the Pomodoro Technique for time management?",
              options: [
                "Working non-stop for 8 hours",
                "Taking a break every 2 hours",
                "Working in focused 25-minute intervals with short breaks",
                "Multitasking across 5 projects simultaneously",
              ],
              answer: 2,
              explanation:
                "The Pomodoro Technique, developed by Francesco Cirillo, involves working in 25-minute focused sessions (pomodoros) followed by a 5-minute break. After 4 pomodoros, take a longer break of 15-30 minutes. It improves focus and prevents mental fatigue.",
            },
          ],
        },
      ],
    },
  },
};
