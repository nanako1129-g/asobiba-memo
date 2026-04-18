"use client";

import { useCallback, useState } from "react";
import type { VisitSuggestions, VisitSuggestionsRequest } from "@/lib/ai/types";

const AI_GENERATION_ERROR = "提案の生成に失敗しました。もう一度お試しください。";

type Props = {
  request: VisitSuggestionsRequest;
};

export function AiVisitSuggestions({ request }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisitSuggestions | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const onGenerate = useCallback(async () => {
    setError(null);
    setIsDemo(false);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/play-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        setError(AI_GENERATION_ERROR);
        return;
      }
      const data = (await res.json()) as VisitSuggestions & { demo?: boolean };
      const { demo, ...suggestions } = data;
      setResult(suggestions);
      setIsDemo(Boolean(demo));
    } catch {
      setError(AI_GENERATION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [request]);

  return (
    <section
      className="rounded-3xl bg-white p-5 shadow-[0_2px_16px_-4px_rgba(47,47,47,0.08)] ring-1 ring-app-text/[0.04] sm:p-6"
      aria-labelledby="ai-suggestions-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="ai-suggestions-heading" className="text-base font-bold text-app-text">
            AIあそび方提案
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-app-muted">
            投稿内容をもとに、当日の過ごし方のイメージを短くまとめます（参考用です）。
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 self-start rounded-2xl border border-app-primary/25 bg-app-primary/[0.08] px-4 py-2.5 text-sm font-bold text-app-primary shadow-sm transition hover:bg-app-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span
                className="size-4 animate-spin rounded-full border-2 border-app-primary/30 border-t-app-primary"
                aria-hidden
              />
              生成中…
            </>
          ) : (
            <>✨ AIで遊び方を提案</>
          )}
        </button>
      </div>

      {error ? (
        <p
          className="rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm leading-relaxed text-red-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {isDemo && result ? (
        <p className="rounded-2xl border border-amber-100 bg-amber-50/90 px-4 py-2.5 text-xs leading-relaxed text-amber-950">
          <strong className="font-semibold">デモ表示</strong>
          です（OpenAI API 未設定のときのサンプル文面。キーを設定すると AI が生成します）。
        </p>
      ) : null}

      {result ? (
        <div className="mt-4 space-y-4 border-t border-app-text/[0.06] pt-4">
          <SuggestionBlock title="この場所の過ごし方" body={result.summary} />
          <SuggestionBlock title="年齢に合う遊び方の流れ" body={result.playFlow} />
          <SuggestionBlock title="滞在時間の目安" body={result.stayDuration} />
          <SuggestionBlock title="水分・休憩のヒント" body={result.hydrationNote} />
          <SuggestionBlock title="注意点" body={result.precautions} accent />
        </div>
      ) : null}
    </section>
  );
}

function SuggestionBlock({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3.5 ${
        accent
          ? "bg-app-bg-sub ring-1 ring-app-accent/25"
          : "bg-app-bg-sub/80 ring-1 ring-app-text/[0.05]"
      }`}
    >
      <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-app-muted">{title}</h3>
      <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-app-text">{body}</p>
    </div>
  );
}
