// ============================================================
// AI Service - Powered by Google Gemini API
// Set your API key in the .env file: VITE_GEMINI_API_KEY=...
// ============================================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, maxTokens = 512) {
  if (!GEMINI_API_KEY) {
    return "⚠️ Please set your Gemini API key in the .env file (VITE_GEMINI_API_KEY) to enable AI explanations.";
  }
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Gemini API error: ${err}`); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
}

export async function explainAnswer({ question, options, correctIndex, selectedIndex }) {
  const prompt = `You are a soft skills tutor. A student answered a quiz question incorrectly.
Question: "${question}"
Options: ${options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join(", ")}
Student selected: "${options[selectedIndex]}"
Correct answer: "${options[correctIndex]}"
Provide a clear, concise explanation (3-5 sentences) of why the correct answer is right and why the student's choice is incorrect. Use encouraging language.`;
  return callGemini(prompt);
}

export async function generateLearningExplanation({ question, options, correctIndex }) {
  const prompt = `You are a soft skills tutor creating educational content.
Question: "${question}"
Correct Answer: "${options[correctIndex]}"
All options: ${options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("; ")}
Write a comprehensive educational explanation (5-8 sentences) that explains the concept, why the correct answer is right, briefly why others are wrong, and gives a real-world example.`;
  return callGemini(prompt, 600);
}

export async function generateQuizAnalysis({ totalQuestions, wrongAnswers, topicTitle }) {
  const score = totalQuestions - wrongAnswers.length;
  const pct = Math.round((score / totalQuestions) * 100);
  const wrongDetails = wrongAnswers.map(q =>
    `Q: "${q.question}" | Student: "${q.options[q.selectedIndex]}" | Correct: "${q.options[q.answer]}"`
  ).join("\n");
  const prompt = `You are a soft skills coach providing post-quiz feedback.
Topic: "${topicTitle}", Score: ${score}/${totalQuestions} (${pct}%)
${wrongDetails ? `Wrong answers:\n${wrongDetails}` : "All answers correct!"}
Provide a brief, motivating analysis (4-6 sentences): acknowledge the score, identify 1-2 areas to improve, give a specific study tip. Keep it positive.`;
  return callGemini(prompt);
}

export async function askSoftSkillsQuestion(userQuestion) {
  const prompt = `You are an expert soft skills coach. A student asks: "${userQuestion}"
Provide a helpful, practical answer (4-6 sentences): address the question directly, use simple language, include a practical tip or real-world example, be encouraging and actionable.
Focus only on soft skills, communication, leadership, teamwork, or professional development. If unrelated, gently redirect.`;
  return callGemini(prompt);
}

// ── Analyse PDF content → structured quiz + learning data ──
export async function analyzePDFContent({ pdfText, filename, parsedMeta }) {
  if (!GEMINI_API_KEY) {
    throw new Error("⚠️ Gemini API key not set. Add VITE_GEMINI_API_KEY to your .env file.");
  }

  const safeText = pdfText.substring(0, 12000);

  const prompt = `You are an AI that processes educational PDF content for a Soft Skills quiz platform.

FILENAME: ${filename}
SEMESTER: ${parsedMeta.semester}
YEAR: ${parsedMeta.year}
COURSE CODE: ${parsedMeta.courseCode}
TOPIC (from filename): ${parsedMeta.topicName}

PDF CONTENT:
${safeText}

Return ONLY a raw JSON object (no markdown, no code fences) with this exact structure:
{
  "topicName": "Clean readable topic name",
  "description": "1-2 sentence description",
  "mainCategory": "qual1 or quant1 or qual2 or quant2",
  "subCategory": "face or ethuns or six_phase",
  "categoryReason": "Brief reason for categorization",
  "questions": [
    {"id":"q1","question":"...?","options":["A","B","C","D"],"answer":0,"explanation":"..."}
  ],
  "learningContent": [
    {"id":"lc1","heading":"...","content":"3-5 sentence explanation","keyPoints":["...","...","..."]}
  ]
}

RULES:
- Generate 5-10 MCQ questions with exactly 4 options each. answer is 0-based index.
- Extract 3-6 learning content items as key concepts.
- mainCategory: qual1=communication/leadership, quant1=numerical/math/verbal, qual2=critical thinking/ethics, quant2=data/stats/time mgmt
- subCategory: face=basic professional skills, ethuns=ethics/team/human skills, six_phase=advanced frameworks
- Return ONLY raw JSON, absolutely nothing else.`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
    }),
  });

  if (!res.ok) { const err = await res.text(); throw new Error(`Gemini API error: ${err}`); }
  const data = await res.json();
  let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Strip accidental markdown fences
  raw = raw.replace(/^```json\s*/im, "").replace(/^```\s*/im, "").replace(/```\s*$/im, "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`AI returned invalid JSON. Preview: ${raw.substring(0, 400)}`);
  }
}
