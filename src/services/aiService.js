// ============================================================
// AI Service - Powered by Google Gemini API
// ============================================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Comprehensive model list for the Free Tier
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro"
];

async function callGemini(prompt, maxTokens = 512, retries = 2, delay = 1500) {
  if (!GEMINI_API_KEY) {
    return "⚠️ Please set your Gemini API key in the .env file.";
  }

  let lastError = "";

  for (const modelName of MODELS) {
    // Try both v1beta and v1 endpoints as some models are only on one
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`
    ];

    for (const url of endpoints) {
      for (let i = 0; i <= retries; i++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
            }),
          });

          if (res.status === 429) {
            console.warn(`[AI] ${modelName} (429) Quota exceeded. Waiting ${delay}ms...`);
            if (i === retries) break; // Try next endpoint/model
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
            continue;
          }

          if (res.status === 404) {
            // Model not found on this endpoint, try next endpoint/model
            break; 
          }

          if (!res.ok) {
            const errBody = await res.text();
            lastError = `[${res.status}] ${errBody}`;
            break; // Try next model
          }

          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
          
          throw new Error("Empty response from AI.");
        } catch (err) {
          lastError = err.message;
          if (i === retries) break;
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
  }
  
  throw new Error(`AI Service Unavailable. Last Error: ${lastError.substring(0, 150)}`);
}

export async function explainAnswer({ question, options, correctIndex, selectedIndex }) {
  const prompt = `Soft skills tutor. Q: "${question}" Correct: "${options[correctIndex]}" Student: "${options[selectedIndex]}". Explain in 3-5 sentences.`;
  return callGemini(prompt);
}

export async function generateLearningExplanation({ question, options, correctIndex }) {
  const prompt = `Soft skills tutor. Q: "${question}" Correct: "${options[correctIndex]}". Write 5-8 sentence educational explanation.`;
  return callGemini(prompt, 600);
}

export async function generateQuizAnalysis({ totalQuestions, wrongAnswers, topicTitle }) {
  const score = totalQuestions - wrongAnswers.length;
  const prompt = `Soft skills coach feedback. Topic: "${topicTitle}", Score: ${score}/${totalQuestions}. Motivating 4-6 sentences.`;
  return callGemini(prompt);
}

export async function askSoftSkillsQuestion(userQuestion) {
  const prompt = `Soft skills coach. User Question: "${userQuestion}". 4-6 sentence practical answer.`;
  return callGemini(prompt);
}

export async function analyzePDFContent({ pdfText, filename, parsedMeta }) {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key missing.");
  
  // Cut down text even more to save bandwidth/tokens
  const safeText = pdfText.substring(0, 6000); 

  const prompt = `Return ONLY JSON for Soft Skills Quiz Platform.
FILENAME: ${filename}
METADATA: ${JSON.stringify(parsedMeta)}
PDF TEXT:
${safeText}

JSON FORMAT:
{
  "topicName": "String",
  "description": "String",
  "mainCategory": "qual1|quant1|qual2|quant2",
  "subCategory": "face|ethuns|six_phase",
  "categoryReason": "String",
  "questions": [{"id":"q1","question":"?","options":["A","B","C","D"],"answer":0,"explanation":"..."}],
  "learningContent": [{"id":"lc1","heading":"...","content":"...","keyPoints":["..."]}]
}
Rules: 5 questions. 3 concepts.`;

  const resText = await callGemini(prompt, 8192);
  let raw = resText.replace(/^```json\s*/im, "").replace(/^```\s*/im, "").replace(/```\s*$/im, "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`AI returned invalid JSON.`);
  }
}
