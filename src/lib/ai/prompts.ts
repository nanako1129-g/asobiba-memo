import type { VisitSuggestionsRequest } from "@/lib/ai/types";

export function buildVisitSuggestionsUserMessage(input: VisitSuggestionsRequest): string {
  const facilities: string[] = [];
  if (input.nursingRoom) facilities.push("授乳室あり");
  if (input.diaperChange) facilities.push("おむつ替えあり");
  if (input.strollerOk) facilities.push("ベビーカーOK");
  const facilityLine = facilities.length > 0 ? facilities.join("、") : "（設備の記載なし）";

  return `以下は室内あそび場の投稿です。親が「当日どう過ごせばよいか」を短時間でイメージできるよう、次のJSONキーだけで返してください。値はすべて日本語。長文禁止。全体でおおよそ450字以内。

キーと意味:
- summary: この場所での過ごし方の要約（2〜4文、やわらかい口調）
- playFlow: 示された年齢帯に合う遊び方の流れ（箇条書き風の短文2〜4行）
- stayDuration: 滞在時間の目安（一文）
- hydrationNote: 水分補給や休憩の一言（一文、安心感を添える）
- precautions: 注意点（最大2点、短文。脅しではなく現実的な注意）

施設名: ${input.placeName}
区: ${input.ward}
年齢帯: ${input.ageGroup}
住所: ${input.address}
設備: ${facilityLine}
おすすめの遊び方（投稿）: ${input.playTip || "（なし）"}
ひとこと感想: ${input.comment || "（なし）"}`;
}

export const VISIT_SUGGESTIONS_SYSTEM = `あなたは子育て中の親向けの室内遊び場アドバイザーです。不安を煽らず、現実的で短い文章だけを返します。必ず有効なJSONオブジェクト1つだけを返してください。`;

export const PLAY_TIP_DRAFT_SYSTEM = `あなたは子育て中の親向けの室内遊び場アドバイザーです。親が投稿フォームに書く「おすすめの遊び方」の下書きを、やさしい口調の日本語で短く提案します。必ず {"playTipDraft":"..."} 形式のJSONだけを返してください。`;

export function buildPlayTipDraftUserMessage(input: {
  placeName: string;
  ward: string;
  ageGroup: string;
  comment: string;
  nursingRoom: boolean;
  diaperChange: boolean;
  strollerOk: boolean;
}): string {
  const facilities: string[] = [];
  if (input.nursingRoom) facilities.push("授乳室あり");
  if (input.diaperChange) facilities.push("おむつ替えあり");
  if (input.strollerOk) facilities.push("ベビーカーOK");
  const facilityLine = facilities.length > 0 ? facilities.join("、") : "（設備の記載なし）";

  return `施設名: ${input.placeName || "（未入力）"}
区: ${input.ward}
年齢帯: ${input.ageGroup}
設備: ${facilityLine}
ひとこと感想: ${input.comment || "（なし）"}

上記を踏まえ、「おすすめの遊び方」欄にそのまま貼れる下書きを1つ。100〜220字程度。箇条書きではなく短い段落で。`;
}
