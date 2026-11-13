/**
 * Gramavance — Google Gemini Generative AI Service
 *
 * Provides live, multilingual Generative AI reasoning for:
 * 1. Community Assistant (Patient rural assistant in Tamil, Hindi, and English)
 * 2. Document Intelligence (Assisting rural users with document category & details)
 * 3. Scheme Matching & Compatibility Explanations
 *
 * Secure Configuration:
 * - Reads VITE_GEMINI_API_KEY from environment, or from secure browser storage.
 * - Graceful fallback to verified rule-based knowledge when offline or unconfigured.
 */

import type { LanguageCode } from '../types';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiResponse {
  text: string;
  isLiveAI: boolean;
  error?: string;
}

const SYSTEM_INSTRUCTION = `You are "Gramavance Community Assistant", a patient, friendly, human-centered Generative AI assistant for Gramavance — an Intelligent Community Development Platform for rural India.

Your primary audience: Elderly rural farmers, rural women, Self-Help Groups (SHGs), village artisans, and first-time internet users in India.

Tone and Communication Rules:
1. Speak with deep warmth, patience, and humility. Begin greetings with "Vanakkam!" for Tamil/English or "Namaste!" for Hindi when appropriate.
2. Use simple, everyday words. Avoid technical bureaucratic jargon.
3. If you use a necessary government term, explain it immediately:
   - Subsidy: Free government financial assistance that does not have to be repaid.
   - Collateral: Property or land deed that traditional banks ask as security; explain that many schemes like MUDRA or PMEGP are collateral-free.
   - Interest Subvention: A discount paid by the government on your bank loan interest rate.
4. Keep answers short, clear, and focused. Ask only ONE question at a time so users never feel overwhelmed.
5. NEVER guarantee eligibility, loan sanction, or subsidy approval. Always remind users that final sanction is decided by the district committee and bank.
6. Language: Match the user's selected language (Tamil, Hindi, or English). Write natural, readable Tamil or Hindi script, or clean plain English.

Verified Scheme Facts:
- PMEGP: Up to 35% non-repayable capital subsidy for rural women/SC/ST/OBC; 5-10% promoter contribution; max project cost ₹50 Lakh (manufacturing) or ₹20 Lakh (services).
- PMFME: 35% capital subsidy up to ₹10 Lakh for micro food processing; ₹40,000 seed capital per SHG member.
- MUDRA Yojana: Collateral-free credit up to ₹20 Lakh (Shishu ≤ ₹50k, Kishore ₹50k-₹5L, Tarun ₹5L-₹20L).
- DAY-NRLM: Subsidized 7% bank loans, reduced to 4% for prompt repayment by women SHGs.
- Essential Documents: Aadhaar Card, Bank Passbook, Machinery/Shop Quotation, Land Patta or Rent Agreement.`;

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
];

export const getGeminiApiKey = (): string => {
  const localKey = localStorage.getItem('gramavance_gemini_api_key');
  if (localKey && localKey.trim().length > 10) {
    return localKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }
  return '';
};

export const getGeminiApiKeySource = (): 'localStorage' | 'env' | 'none' => {
  const localKey = localStorage.getItem('gramavance_gemini_api_key');
  if (localKey && localKey.trim().length > 10) return 'localStorage';
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) return 'env';
  return 'none';
};

export const setGeminiApiKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem('gramavance_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gramavance_gemini_api_key');
  }
};

export const isGeminiConfigured = (): boolean => {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 20);
};

/**
 * Test a Gemini API key connection directly
 */
export async function testGeminiConnection(
  customKey?: string
): Promise<{ success: boolean; message: string }> {
  const key = (customKey && customKey.trim()) || getGeminiApiKey();
  if (!key) {
    return {
      success: false,
      message: 'No API key provided. Please enter a valid Gemini API key.',
    };
  }

  let lastError = '';

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Respond with the exact word: "READY"' }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 20,
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        lastError =
          errorData?.error?.message || `HTTP ${response.status} from Google Gemini (${model})`;
        // If 404 or 503, try next candidate model
        if (response.status === 404 || response.status === 503) {
          continue;
        }
        return {
          success: false,
          message: `Connection failed: ${lastError}`,
        };
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'READY';
      return {
        success: true,
        message: `Connected to Google ${model} successfully! Response: "${reply}"`,
      };
    } catch (err: any) {
      lastError = err?.message || 'Could not reach Google Gemini endpoint.';
    }
  }

  return {
    success: false,
    message: `Network error: ${lastError}`,
  };
}

/**
 * Send a conversation history to Google Gemini API
 */
export async function sendGeminiChat(
  history: GeminiMessage[],
  language: LanguageCode = 'en'
): Promise<GeminiResponse> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {
      text: '',
      isLiveAI: false,
      error: 'NO_KEY',
    };
  }

  // Format contents for Gemini v1beta API
  const languageInstruction =
    language === 'ta'
      ? '\n[Respond clearly in Tamil (தமிழ்)]'
      : language === 'hi'
      ? '\n[Respond clearly in Hindi (हिन्दी)]'
      : '\n[Respond in simple, friendly English]';

  const contents = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const requestBody = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION + languageInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 800,
    },
  };

  let lastErrorMessage = '';

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message || `Gemini API returned HTTP status ${response.status} (${model})`;
        lastErrorMessage = errorMessage;

        // If model not found or unavailable, try next candidate model
        if (response.status === 404 || response.status === 503) {
          continue;
        }

        if (response.status === 400 || response.status === 403) {
          return {
            text: '',
            isLiveAI: false,
            error: 'INVALID_KEY: ' + errorMessage,
          };
        } else if (response.status === 429) {
          return {
            text: '',
            isLiveAI: false,
            error: 'RATE_LIMIT: Gemini API quota exceeded. Please wait a moment.',
          };
        }

        return {
          text: '',
          isLiveAI: false,
          error: errorMessage,
        };
      }

      const data = await response.json();
      const candidateText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!candidateText) {
        continue;
      }

      return {
        text: candidateText.trim(),
        isLiveAI: true,
      };
    } catch (err: any) {
      lastErrorMessage = err?.message || 'Network error while contacting Gemini API';
    }
  }

  return {
    text: '',
    isLiveAI: false,
    error: lastErrorMessage,
  };
}

/**
 * Call the secure Supabase Edge Function to generate an AI response
 */
export async function sendSupabaseEdgeChat(
  message: string,
  history: GeminiMessage[] = [],
  language: LanguageCode = 'en',
  signal?: AbortSignal
): Promise<{ text: string; model?: string }> {
  const endpoint = `${supabaseUrl}/functions/v1/gemini-chat`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      message,
      history,
      language,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error || `Supabase Edge Function returned HTTP ${response.status}`
    );
  }

  const data = await response.json();
  if (!data?.text) {
    throw new Error('Empty response received from Supabase Edge Function');
  }

  return {
    text: data.text,
    model: data.model,
  };
}

/**
 * Health check to verify whether Supabase Edge Function / Copilot service is genuinely online
 */
export async function checkCopilotOnlineStatus(): Promise<boolean> {
  try {
    const endpoint = `${supabaseUrl}/functions/v1/gemini-chat`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });
    return res.ok;
  } catch {
    // If Supabase edge function cannot be reached, test /api/chat
    try {
      const vercelRes = await fetch('/api/chat', { method: 'GET' });
      return vercelRes.ok;
    } catch {
      return false;
    }
  }
}
