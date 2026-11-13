import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_INSTRUCTION = `You are "Gramavance Copilot", an expert, empathetic community development and government schemes assistant for rural entrepreneurs, Self-Help Groups (SHGs), small farmers, and artisans in India.

Tone & Instructions:
1. Speak with deep warmth, patience, and humility. Begin greetings with "Vanakkam!" for Tamil/English or "Namaste!" for Hindi when appropriate.
2. Provide clear, step-by-step guidance on government grants, capital subsidies, and loan schemes (such as PMEGP, PMFME, MUDRA, DAY-NRLM, TAHDCO, NEEDs).
3. Explain terms simply:
   - Subsidy: Free government financial assistance that does not have to be repaid.
   - Collateral: Property or asset requested as loan security; many MSME/rural schemes are collateral-free.
   - Margin Money / Own Contribution: The 5% to 10% amount invested by the entrepreneur.
4. Language Rules:
   - If the user writes or requests Tamil, respond in fluent, grammatically clean Tamil (தமிழ்).
   - If the user writes or requests Hindi, respond in fluent, respectful Hindi (हिन्दी).
   - If the user writes in English, respond in clear, accessible plain English.
5. Use clean Markdown formatting with bullet points, **bold** key terms, and concise paragraphs.
6. Never guarantee loan approval or subsidy sanction; final decision is made by the district task force committee and bank branch.`;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Health check endpoint
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "online",
        service: "Gramavance Copilot",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST or GET allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not configured in Supabase secrets.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = body.message || body.prompt;
    const history = Array.isArray(body.history) ? body.history : [];
    const language = body.language || "en";

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required 'message' field in body." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build contents array
    const contents = [];

    // Add previous history if provided
    for (const msg of history) {
      if (msg && msg.text) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    const langInstruction =
      language === "ta"
        ? "\n[Please respond in Tamil (தமிழ்)]"
        : language === "hi"
        ? "\n[Please respond in Hindi (हिन्दी)]"
        : "";

    const requestPayload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION + langInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
    };

    let lastError = "";
    let lastStatusCode = 500;

    for (const model of CANDIDATE_MODELS) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastStatusCode = response.status;
          lastError =
            errData?.error?.message ||
            `Google Gemini returned status ${response.status} for model ${model}`;

          // Try next model if 404, 503, or 429
          if (
            response.status === 404 ||
            response.status === 503 ||
            response.status === 429
          ) {
            console.warn(`[gemini-chat] Model ${model} returned ${response.status}, trying fallback.`);
            continue;
          }

          break;
        }

        const data = await response.json();
        const responseText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!responseText) {
          lastError = "Empty candidate response from Gemini model";
          continue;
        }

        return new Response(
          JSON.stringify({
            text: responseText,
            model,
            status: "success",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (fetchErr: any) {
        lastError = fetchErr?.message || "Network exception reaching Gemini";
      }
    }

    return new Response(
      JSON.stringify({
        error: lastError || "All candidate Gemini models failed.",
        status: "error",
      }),
      {
        status: lastStatusCode >= 400 && lastStatusCode < 600 ? lastStatusCode : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err?.message || "Internal server error in edge function.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
