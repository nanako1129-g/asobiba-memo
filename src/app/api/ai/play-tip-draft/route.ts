import { openaiChatJson } from "@/lib/ai/openai-json";
import { buildPlayTipDraftUserMessage, PLAY_TIP_DRAFT_SYSTEM } from "@/lib/ai/prompts";
import type { PlayTipDraftRequest, PlayTipDraftResponse } from "@/lib/ai/types";

function isDraftRequest(x: unknown): x is PlayTipDraftRequest {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.placeName === "string" &&
    typeof o.ward === "string" &&
    typeof o.ageGroup === "string" &&
    typeof o.comment === "string" &&
    typeof o.nursingRoom === "boolean" &&
    typeof o.diaperChange === "boolean" &&
    typeof o.strollerOk === "boolean"
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    if (!isDraftRequest(body)) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const raw = await openaiChatJson<{ playTipDraft?: string }>(
      [
        { role: "system", content: PLAY_TIP_DRAFT_SYSTEM },
        { role: "user", content: buildPlayTipDraftUserMessage(body) },
      ],
      "gpt-4o-mini",
    );

    const draft = typeof raw.playTipDraft === "string" ? raw.playTipDraft.trim() : "";
    const out: PlayTipDraftResponse = {
      playTipDraft: draft || "（下書きを生成できませんでした）",
    };
    return Response.json(out);
  } catch (e) {
    console.error("[ai/play-tip-draft]", e);
    return Response.json({ error: "generation_failed" }, { status: 502 });
  }
}
