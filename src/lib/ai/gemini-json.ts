import { defaultGeminiModel } from "@/lib/ai/gemini-configured";

function extractJsonObject(text: string): string {
  const t = text.trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("JSON object not found in model output");
  }
  return t.slice(start, end + 1);
}

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message?: string; code?: number };
};

/** system + user を JSON モードで送り、パースしたオブジェクトを返す（Server のみ） */
export async function geminiGenerateJson<T>(systemInstruction: string, userText: string): Promise<T> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const model = defaultGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    }),
  });

  const rawBody = await res.text();
  let data: GeminiGenerateContentResponse;
  try {
    data = JSON.parse(rawBody) as GeminiGenerateContentResponse;
  } catch {
    throw new Error(`Gemini API: invalid JSON body (${res.status})`);
  }

  if (!res.ok) {
    const msg = data.error?.message ?? rawBody.slice(0, 240);
    throw new Error(`Gemini API error: ${res.status} ${msg}`);
  }

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("")?.trim() ?? "";

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return JSON.parse(extractJsonObject(text)) as T;
  }
}
