import { GoogleGenerativeAI } from "@google/generative-ai";

// Working model priority list with multi-tier fallback
const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash"
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Gramavance Copilot', online: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST and GET allowed' });
  }

  const { message, language } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Request body must include a non-empty "message" field.' });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'GEMINI_API_KEY is not configured.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const langHint = language === 'ta' ? ' Respond in Tamil (தமிழ்).' : language === 'hi' ? ' Respond in Hindi (हिन्दी).' : '';
  const systemInstruction = `You are 'Gramavance Copilot', an expert, empathetic development assistant for rural micro-economies and Self-Help Groups (SHGs) in India. Provide clear, step-by-step guidance on government grants (PMEGP, PMFME, MUDRA, DAY-NRLM), subsidy stacking, eligibility criteria, required documents, and financial readiness. Use Markdown formatting with bullet points, **bold** for key terms, and empathetic, simple language suitable for rural users. Keep responses concise and actionable. Never guarantee loan approval or subsidy sanction.${langHint}`;

  let lastError = '';

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      const result = await model.generateContent(message.trim());
      const text = await result.response.text();

      if (!text || !text.trim()) {
        lastError = 'Empty response from AI model';
        continue;
      }

      return res.status(200).json({ text: text.trim() });
    } catch (error) {
      lastError = error?.message || 'Unknown error';
      console.warn(`[Gramavance AI] Candidate model ${modelName} failed, trying next:`, lastError);
      continue;
    }
  }

  console.error('[Gramavance AI] All models failed. Last error:', lastError);
  return res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.', error: lastError });
}
