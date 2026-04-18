import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostShareButton } from "@/components/post-share-button";
import type { Post } from "@/types/post";

type Props = {
  post: Post;
  mapsUrl: string;
  shareUrl: string;
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_2px_16px_-4px_rgba(47,47,47,0.08)] ring-1 ring-app-text/[0.04] sm:p-6">
      <h2 className="mb-3 text-base font-bold text-app-text">{title}</h2>
      {children}
    </section>
  );
}

export function PostDetail({ post, mapsUrl, shareUrl }: Props) {
  const tags: { on: boolean; label: string }[] = [
    { on: post.nursing_room, label: "授乳室あり" },
    { on: post.diaper_change, label: "おむつ替えあり" },
    { on: post.stroller_ok, label: "ベビーカーOK" },
  ];

  return (
    <div className="min-h-full bg-app-bg pb-16">
      <div className="relative bg-app-primary px-4 pb-32 pt-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <span aria-hidden>←</span>
            戻る
          </Link>
          <PostShareButton
            shareUrl={shareUrl}
            post={{
              place_name: post.place_name,
              ward: post.ward,
              age_group: post.age_group,
              comment: post.comment,
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 text-app-bg" aria-hidden>
          <svg
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            className="block h-14 w-full sm:h-16"
          >
            <path
              fill="currentColor"
              d="M0,32 C320,4 640,56 960,28 C1120,12 1280,40 1440,24 L1440,64 L0,64 Z"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-[1] -mt-28 px-4">
        <div className="relative aspect-[16/10] min-h-[200px] overflow-hidden rounded-3xl bg-app-bg-sub shadow-[0_16px_48px_-12px_rgba(47,47,47,0.18)] ring-[6px] ring-white">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={`${post.place_name}の写真`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-app-muted">
              <span className="text-5xl opacity-70" aria-hidden>
                🧸
              </span>
              <span className="text-sm font-medium">写真なし</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-5 px-4 pt-8">
        <header className="space-y-3 text-center">
          <h1 className="text-xl font-bold leading-snug text-app-text sm:text-[1.35rem]">
            {post.place_name}
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-app-bg-sub px-4 py-2 text-sm font-semibold text-app-text shadow-sm ring-1 ring-app-text/[0.06]">
              {post.ward}
            </span>
            <span className="rounded-full bg-app-bg-sub px-4 py-2 text-sm font-semibold text-app-text shadow-sm ring-1 ring-app-text/[0.06]">
              {post.age_group}
              と行った
            </span>
          </div>
        </header>

        <SectionCard title="おすすめの遊び方">
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-app-muted">
            {post.play_tip || "（まだ入力がありません）"}
          </p>
        </SectionCard>

        <SectionCard title="行ってみた感想">
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-app-muted">
            {post.comment || "（まだ入力がありません）"}
          </p>
        </SectionCard>

        <SectionCard title="設備">
          {tags.some((t) => t.on) ? (
            <ul className="flex flex-wrap gap-2">
              {tags
                .filter((t) => t.on)
                .map(({ label }) => (
                  <li
                    key={label}
                    className="rounded-full bg-app-primary/10 px-3.5 py-1.5 text-sm font-semibold text-app-primary ring-1 ring-app-primary/15"
                  >
                    {label}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-app-muted">記載された設備はありません</p>
          )}
        </SectionCard>

        <SectionCard title="場所">
          <p className="mb-5 text-sm leading-relaxed text-app-muted">{post.address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl bg-app-bg-sub py-6 text-center ring-1 ring-app-text/[0.06] transition hover:bg-app-primary/[0.06]"
          >
            <span className="text-2xl" aria-hidden>
              🗺️
            </span>
            <span className="text-xs font-semibold text-app-muted">地図で場所を確認</span>
            <span className="mt-1 flex min-h-[48px] min-w-[200px] items-center justify-center rounded-full bg-app-primary px-8 py-3 text-sm font-bold text-white shadow-[0_6px_18px_-4px_rgba(244,124,108,0.45)]">
              Google マップで見る
            </span>
          </a>
        </SectionCard>

        <Link
          href="/posts/new"
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-app-primary/30 bg-white py-3 text-sm font-bold text-app-primary transition hover:border-app-primary/45 hover:bg-app-bg-sub/50"
        >
          ほかの体験も投稿する
        </Link>
      </div>
    </div>
  );
}
