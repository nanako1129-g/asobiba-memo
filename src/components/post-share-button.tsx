"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildPostShareText } from "@/lib/share-post";
import type { Post } from "@/types/post";

type SharePostFields = Pick<Post, "place_name" | "ward" | "age_group" | "comment">;

type Props = {
  post: SharePostFields;
  shareUrl: string;
};

type Feedback = "idle" | "shared" | "copied" | "error";

const feedbackMessage: Record<Exclude<Feedback, "idle">, string> = {
  shared: "共有しました",
  copied: "URLをコピーしました",
  error: "コピーできませんでした。URLを手で選んでコピーしてください。",
};

export function PostShareButton({ post, shareUrl }: Props) {
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showThenHide = useCallback((next: Exclude<Feedback, "idle">) => {
    setFeedback(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFeedback("idle"), 2800);
  }, []);

  const handleClick = useCallback(async () => {
    const text = buildPostShareText(post);
    const title = post.place_name;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, text, url: shareUrl });
        showThenHide("shared");
        return;
      }
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name === "AbortError") {
        return;
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showThenHide("copied");
        return;
      }
    } catch {
      /* fallthrough */
    }

    showThenHide("error");
  }, [post, shareUrl, showThenHide]);

  return (
    <div className="relative flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
        aria-label="この投稿を共有"
      >
        <span className="text-base leading-none" aria-hidden>
          ↗
        </span>
        共有
      </button>
      {feedback !== "idle" ? (
        <p
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 max-w-[min(100vw-2rem,280px)] rounded-xl border border-white/30 bg-app-text/90 px-3 py-2 text-center text-xs font-medium text-white shadow-lg"
          role="status"
        >
          {feedbackMessage[feedback]}
        </p>
      ) : null}
    </div>
  );
}
