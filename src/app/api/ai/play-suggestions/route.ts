import { openaiChatJson } from "@/lib/ai/openai-json";
import { buildVisitSuggestionsUserMessage, VISIT_SUGGESTIONS_SYSTEM } from "@/lib/ai/prompts";
import type { VisitSuggestions, VisitSuggestionsRequest } from "@/lib/ai/types";

function isVisitRequest(x: unknown): x is VisitSuggestionsRequest {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.placeName === "string" &&
    typeof o.ward === "string" &&
    typeof o.ageGroup === "string" &&
    typeof o.playTip === "string" &&
    typeof o.comment === "string" &&
    typeof o.address === "string" &&
    typeof o.nursingRoom === "boolean" &&
    typeof o.diaperChange === "boolean" &&
    typeof o.strollerOk === "boolean"
  );
}

function normalizeSuggestions(raw: Record<string, unknown>): VisitSuggestions {
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    summary: s(raw.summary) || "（要約を生成できませんでした）",
    playFlow: s(raw.playFlow) || "（流れを生成できませんでした）",
    stayDuration: s(raw.stayDuration) || "（目安を生成できませんでした）",
    hydrationNote: s(raw.hydrationNote) || "（一言を生成できませんでした）",
    precautions: s(raw.precautions) || "（注意点を生成できませんでした）",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    if (!isVisitRequest(body)) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const raw = await openaiChatJson<Record<string, unknown>>(
      [
        { role: "system", content: VISIT_SUGGESTIONS_SYSTEM },
        { role: "user", content: buildVisitSuggestionsUserMessage(body) },
      ],
      "gpt-4o-mini",
    );

    const suggestions = normalizeSuggestions(raw);
    return Response.json(suggestions);
  } catch (e) {
    console.error("[ai/play-suggestions]", e);
    return Response.json({ error: "generation_failed" }, { status: 502 });
  }
}
