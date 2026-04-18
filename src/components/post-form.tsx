"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createPost } from "@/app/actions/posts";
import { AGE_GROUPS, WARDS } from "@/lib/constants";

const fieldBase =
  "w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-[0.9375rem] text-app-text shadow-[0_2px_12px_-2px_rgba(47,47,47,0.08)] placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/25";

const AI_GENERATION_ERROR = "提案の生成に失敗しました。もう一度お試しください。";

type ChipProps = {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  icon: ReactNode;
};

function FacilityChip({ name, checked, onChange, children, icon }: ChipProps) {
  return (
    <label
      className={`flex min-h-[52px] cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-center text-xs font-bold leading-tight transition sm:gap-2 sm:px-3 sm:text-sm ${
        checked
          ? "bg-app-primary text-white shadow-[0_4px_14px_-2px_rgba(244,124,108,0.45)]"
          : "bg-app-primary/[0.12] text-app-primary ring-1 ring-app-primary/20"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-base leading-none sm:text-lg" aria-hidden>
        {icon}
      </span>
      {checked ? <span aria-hidden>✓</span> : null}
      <span>{children}</span>
    </label>
  );
}

export function PostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [ward, setWard] = useState<string>(WARDS[0]);
  const [ageGroup, setAgeGroup] = useState<string>(AGE_GROUPS[0]);
  const [playTip, setPlayTip] = useState("");
  const [comment, setComment] = useState("");
  const [address, setAddress] = useState("");
  const [nursingRoom, setNursingRoom] = useState(false);
  const [diaperChange, setDiaperChange] = useState(false);
  const [strollerOk, setStrollerOk] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiDraftError, setAiDraftError] = useState<string | null>(null);
  const [aiDraftDemo, setAiDraftDemo] = useState(false);

  const onAiPlayTipDraft = useCallback(async () => {
    setAiDraftError(null);
    setAiDraftDemo(false);
    setAiDraftLoading(true);
    try {
      const res = await fetch("/api/ai/play-tip-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName,
          ward,
          ageGroup,
          comment,
          nursingRoom,
          diaperChange,
          strollerOk,
        }),
      });
      if (!res.ok) {
        setAiDraftError(AI_GENERATION_ERROR);
        return;
      }
      const data = (await res.json()) as { playTipDraft?: string; demo?: boolean };
      const draft = typeof data.playTipDraft === "string" ? data.playTipDraft.trim() : "";
      if (!draft) {
        setAiDraftError(AI_GENERATION_ERROR);
        return;
      }
      setAiDraftDemo(Boolean(data.demo));
      setPlayTip((prev) => {
        const t = prev.trim();
        return t ? `${t}\n\n${draft}` : draft;
      });
    } catch {
      setAiDraftError(AI_GENERATION_ERROR);
    } finally {
      setAiDraftLoading(false);
    }
  }, [placeName, ward, ageGroup, comment, nursingRoom, diaperChange, strollerOk]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    setIsSubmitting(true);
    try {
      const result = await createPost(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/posts/${result.postId}/edit?e=${encodeURIComponent(result.editToken)}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "送信に失敗しました。もう一度お試しください。";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <p
          className="rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3.5 text-sm leading-relaxed text-red-900"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="space-y-2">
        <label
          htmlFor="photo"
          className="relative block aspect-[5/4] w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-neutral-200 bg-app-bg-sub shadow-inner"
        >
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            className="sr-only"
          />
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="選択した写真のプレビュー"
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-app-text/50 py-2.5 text-center text-xs font-semibold text-white">
                タップして写真を差し替え
              </span>
            </>
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 py-10">
              <span className="text-4xl opacity-90" aria-hidden>
                📷
              </span>
              <span className="text-base font-bold text-app-text">写真を追加する</span>
              <span className="text-sm text-app-muted">1枚だけでOK</span>
            </span>
          )}
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="placeName">
          施設名
        </label>
        <input
          id="placeName"
          name="placeName"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className={fieldBase}
          placeholder="施設名を入力してください"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-app-text" htmlFor="ward">
            区
          </label>
          <select
            id="ward"
            name="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className={fieldBase}
          >
            {WARDS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-app-text" htmlFor="ageGroup">
            何歳と行った？
          </label>
          <select
            id="ageGroup"
            name="ageGroup"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className={fieldBase}
          >
            {AGE_GROUPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="playTip">
          おすすめの遊び方
        </label>
        <textarea
          id="playTip"
          name="playTip"
          value={playTip}
          onChange={(e) => setPlayTip(e.target.value)}
          rows={3}
          className={`${fieldBase} min-h-[100px] resize-y`}
          placeholder="遊び方のヒント（空欄でもOK）"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="comment">
          ひとこと感想
        </label>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className={`${fieldBase} min-h-[88px] resize-y`}
          placeholder="雰囲気や混雑など（空欄でもOK）"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="address">
          住所
        </label>
        <input
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={fieldBase}
          placeholder="住所を入力してください"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-app-text">設備</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <FacilityChip
            name="nursingRoom"
            checked={nursingRoom}
            onChange={setNursingRoom}
            icon="🤱"
          >
            授乳室あり
          </FacilityChip>
          <FacilityChip
            name="diaperChange"
            checked={diaperChange}
            onChange={setDiaperChange}
            icon="👶"
          >
            おむつ替えあり
          </FacilityChip>
          <FacilityChip
            name="strollerOk"
            checked={strollerOk}
            onChange={setStrollerOk}
            icon="🛒"
          >
            ベビーカーOK
          </FacilityChip>
        </div>
      </fieldset>

      <div className="rounded-2xl border border-app-primary/15 bg-app-bg-sub/80 px-4 py-4 ring-1 ring-app-text/[0.04]">
        <p className="mb-3 text-sm font-bold text-app-text">おすすめの遊び方（AI下書き）</p>
        <button
          type="button"
          onClick={onAiPlayTipDraft}
          disabled={aiDraftLoading || isSubmitting}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-app-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-app-primary shadow-sm transition hover:bg-app-bg-sub disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {aiDraftLoading ? (
            <>
              <span
                className="size-4 animate-spin rounded-full border-2 border-app-primary/30 border-t-app-primary"
                aria-hidden
              />
              生成中…
            </>
          ) : (
            <>✨ AIでおすすめの遊び方を作る</>
          )}
        </button>
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-app-muted">
          年齢帯・設備・感想などをもとに、「おすすめの遊び方」欄へ下書きを入れます。すでに文字がある場合は末尾に追加されます。
        </p>
        {aiDraftDemo ? (
          <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50/90 px-3 py-2 text-[0.6875rem] leading-relaxed text-amber-950">
            <strong className="font-semibold">デモ表示</strong>
            （API 未設定時のサンプル。OpenAI のキーを入れると AI が文を生成します）。
          </p>
        ) : null}
        {aiDraftError ? (
          <p className="mt-2 text-sm leading-relaxed text-red-800" role="alert">
            {aiDraftError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full bg-app-primary py-4 text-lg font-bold text-white shadow-[0_6px_20px_-4px_rgba(244,124,108,0.5)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isSubmitting ? "送信中…" : "投稿する"}
      </button>
    </form>
  );
}
