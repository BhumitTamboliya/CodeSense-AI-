const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildReviewPrompt = (code) => `
You are an expert senior software engineer and code reviewer with 20+ years of experience.
Analyze the following code thoroughly and respond with ONLY a valid JSON object — no markdown, no backticks, no extra text.

{
  "qualityScore": <number 0-100>,
  "language": "<detected language>",
  "bugs": [<array of bug strings>],
  "securityIssues": [<array of security strings>],
  "improvements": [<array of improvement strings>],
  "fixedCode": "<complete corrected code>",
  "explainSimple": "<beginner friendly explanation>",
  "summary": "<2-3 sentence summary>"
}

Code to review:
\`\`\`
${code}
\`\`\`
`;

const buildComparePrompt = (
  code1,
  code2,
  name1 = "File 1",
  name2 = "File 2",
) => `
You are an expert code reviewer. Compare these two files and respond with ONLY valid JSON.

{
  "file1": { "name": "${name1}", "language": "<lang>", "qualityScore": <0-100>, "bugs": [], "securityIssues": [], "summary": "<summary>" },
  "file2": { "name": "${name2}", "language": "<lang>", "qualityScore": <0-100>, "bugs": [], "securityIssues": [], "summary": "<summary>" },
  "comparison": { "winner": "<file1|file2|tie>", "differences": [], "recommendation": "<text>" }
}

--- ${name1} ---
${code1}

--- ${name2} ---
${code2}
`;

const reviewCode = async (code) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "Groq API key not configured. Please add GROQ_API_KEY to your .env file.",
    );
  }
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: buildReviewPrompt(code) }],
    temperature: 0.3,
    max_tokens: 8000,
  });
  const text = completion.choices[0].message.content;
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("AI returned invalid format. Please try again.");
  }
  return {
    qualityScore: Math.min(100, Math.max(0, Number(parsed.qualityScore) || 0)),
    language: String(parsed.language || "Unknown"),
    bugs: Array.isArray(parsed.bugs) ? parsed.bugs : [],
    securityIssues: Array.isArray(parsed.securityIssues)
      ? parsed.securityIssues
      : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    fixedCode: String(parsed.fixedCode || code),
    explainSimple: String(parsed.explainSimple || ""),
    summary: String(parsed.summary || ""),
  };
};

const compareCode = async (code1, code2, name1, name2) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "Groq API key not configured. Please add GROQ_API_KEY to your .env file.",
    );
  }
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: buildComparePrompt(code1, code2, name1, name2) },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });
  const text = completion.choices[0].message.content;
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("AI returned invalid comparison format. Please try again.");
  }
  return parsed;
};

module.exports = { reviewCode, compareCode };
