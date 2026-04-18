import type { PlayTipDraftRequest, VisitSuggestions, VisitSuggestionsRequest } from "@/lib/ai/types";

/** OPENAI_API_KEY 未設定時のサンプル（ハッカソン・デモ用） */
export function buildDemoVisitSuggestions(req: VisitSuggestionsRequest): VisitSuggestions {
  const place = req.placeName.trim() || "この施設";
  const ward = req.ward;
  const age = req.ageGroup;

  return {
    summary: `${place}（${ward}）での過ごし方のサンプルです。${age}の子どもと一緒なら、まず落ち着ける席や広さを確認してから遊びに入るとスムーズです。`,
    playFlow: `1. 受付・手洗い・靴の置き場所を確認\n2. 年齢に合いそうなエリアから少しずつ体を慣らす\n3. 水分補給と休憩を挟みつつ、混雑が落ち着いたタイミングで帰る準備`,
    stayDuration: `${age}の場合、体力的には1〜2時間程度を目安にすると満足しやすいことが多いです（混雑や体調で前後してください）。`,
    hydrationNote: `室内は空調で乾きやすいです。水筒や飲み物を持参し、こまめに一口ずつ飲む習慣があると安心です。`,
    precautions: `この文面は API 未接続時のデモ表示です。床の滑りやすさ・小さなパーツ・他の子どもとの距離などは、現地で必ず確認してください。`,
  };
}

export function buildDemoPlayTipDraft(req: PlayTipDraftRequest): string {
  const place = req.placeName.trim() || "この施設";
  const hints: string[] = [];
  if (req.nursingRoom) hints.push("授乳やミルクのタイミングが合えば、授乳室の場所を先に把握しておくと楽です");
  if (req.diaperChange) hints.push("おむつ替えの可否・場所は入口付近の案内をチェック");
  if (req.strollerOk) hints.push("ベビーカー置き場のルール（室内持ち込み可否など）を確認");
  const extra = hints.length ? `\n\n${hints.join("。")}。` : "";

  return `【デモ下書き】${place}では、まず広さと人の流れに慣れてから遊ぶと安心です。${req.ageGroup}なら、段差の少ない遊びから始めると集中しやすいです。${extra}\n\n※本番では OpenAI 接続時に、入力内容に沿った文がここに入ります。`;
}
