"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/types/post";

type Props = {
  posts: Post[];
  /** Supabase 未設定のとき true（サンプルデータのみ） */
  demoMode?: boolean;
  /** デモ時の案内文: Vercel では環境変数はダッシュボードで設定 */
  deploymentHint?: "vercel" | "local";
};

export function HomeClient({ posts, demoMode = false, deploymentHint = "local" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ward, setWard] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [nursingOnly, setNursingOnly] = useState(false);
  const [diaperOnly, setDiaperOnly] = useState(false);
  const [strollerOnly, setStrollerOnly] = useState(false);

  const showPostedToast = searchParams.get("posted") === "1";

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (ward && p.ward !== ward) return false;
      if (ageGroup && p.age_group !== ageGroup) return false;
      if (nursingOnly && !p.nursing_room) return false;
      if (diaperOnly && !p.diaper_change) return false;
      if (strollerOnly && !p.stroller_ok) return false;
      return true;
    });
  }, [posts, ward, ageGroup, nursingOnly, diaperOnly, strollerOnly]);

  const dismissToast = () => {
    router.replace("/", { scroll: false });
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-8 pb-12">
      {demoMode && (
        <div
          className="rounded-[1.25rem] border border-amber-200/90 bg-amber-50/95 px-4 py-3.5 text-sm leading-relaxed text-amber-950 shadow-sm"
          role="status"
        >
          <p className="font-semibold">デモ表示中</p>
          <p className="mt-1 text-[0.8125rem] text-amber-900/90">
            サーバーが Supabase の環境変数を読めていないときに出ます。
            {deploymentHint === "vercel" ? (
              <>
                <span className="mt-2 block">
                  いまは <strong className="font-semibold">Vercel 上</strong>のため、
                  <code className="rounded bg-amber-100/80 px-1">.env.local</code> は使われません。ダッシュボードの{" "}
                  <strong className="font-semibold">Settings → Environment Variables</strong> に URL
                  と API キーを追加し、<strong className="font-semibold">Redeploy</strong> してください。
                </span>
              </>
            ) : (
              <>
                プロジェクト直下の{" "}
                <code className="rounded bg-amber-100/80 px-1">.env.local</code> に URL とキーを保存し、
                <code className="rounded bg-amber-100/80 px-1">npm run dev</code> をそのフォルダで再起動してください。
                <span className="mt-2 block">
                  開発中は{" "}
                  <strong className="font-semibold">localhost:3000</strong> を開いていますか？（Vercel
                  の URL では .env.local は効きません）
                </span>
              </>
            )}
            {deploymentHint === "local" ? (
              <span className="mt-2 block text-[0.75rem] text-amber-900/80">
                切り分け:{" "}
                <a href="/api/dev/supabase-check" className="font-semibold underline underline-offset-2">
                  /api/dev/supabase-check
                </a>{" "}
                を開き、<code className="rounded bg-amber-100/80 px-0.5">configured</code> が true
                になるか確認してください。
              </span>
            ) : null}
          </p>
        </div>
      )}

      {showPostedToast && (
        <div
          className="flex items-start justify-between gap-3 rounded-[1.25rem] border border-app-primary/15 bg-app-bg-sub px-4 py-3.5 text-sm text-app-text shadow-sm"
          role="status"
        >
          <p className="leading-relaxed">
            <span className="font-semibold text-app-primary">保存しました</span>
            <br />
            <span className="text-app-muted">一覧に反映されています。</span>
          </p>
          <button
            type="button"
            onClick={dismissToast}
            className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold text-app-muted transition hover:bg-white/80 hover:text-app-text"
          >
            閉じる
          </button>
        </div>
      )}

      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-app-primary">
          東京の室内あそび場
        </p>
        <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-app-text">
          室内あそび場メモ
        </h1>
        <p className="max-w-[22rem] text-[0.9375rem] leading-relaxed text-app-muted">
          室内で遊べる場所を見つけたら、投稿してみんなでシェアしよう🎵
        </p>
      </header>

      <Link
        href="/posts/new"
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[1.25rem] bg-app-primary px-4 py-3.5 text-base font-bold text-white shadow-[0_6px_20px_-4px_rgba(244,124,108,0.45)] transition hover:brightness-[1.03]"
      >
        <span className="text-xl leading-none" aria-hidden>
          ＋
        </span>
        体験を投稿する
      </Link>

      <FilterBar
        ward={ward}
        ageGroup={ageGroup}
        onWardChange={setWard}
        onAgeGroupChange={setAgeGroup}
        nursingOnly={nursingOnly}
        diaperOnly={diaperOnly}
        strollerOnly={strollerOnly}
        onNursingOnlyChange={setNursingOnly}
        onDiaperOnlyChange={setDiaperOnly}
        onStrollerOnlyChange={setStrollerOnly}
      />

      <div className="flex items-baseline justify-between gap-2 border-b border-app-text/[0.06] pb-2">
        <h2 className="text-sm font-bold text-app-text">みんなの投稿</h2>
        <p className="text-xs text-app-muted">{filtered.length} 件</p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[1.25rem] bg-white px-5 py-10 text-center text-sm leading-relaxed text-app-muted shadow-sm ring-1 ring-app-text/[0.05]">
          条件に合う投稿がありません。
          <br />
          絞り込みを変えてみてください。
        </p>
      ) : (
        <ul className="flex flex-col gap-7">
          {filtered.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
