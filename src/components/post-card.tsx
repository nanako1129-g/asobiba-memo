import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";

type Props = {
  post: Post;
};

function FacilityChips({ post }: { post: Post }) {
  const items: { on: boolean; label: string }[] = [
    { on: post.nursing_room, label: "授乳室" },
    { on: post.diaper_change, label: "おむつ替え" },
    { on: post.stroller_ok, label: "ベビーカーOK" },
  ];
  const active = items.filter((i) => i.on);
  if (active.length === 0) {
    return <p className="text-xs text-app-muted/80">設備の記載なし</p>;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {active.map(({ label }) => (
        <li
          key={label}
          className="rounded-full border border-app-primary/15 bg-app-bg-sub px-2.5 py-1 text-xs font-medium text-app-text"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export function PostCard({ post }: Props) {
  const mapsUrl = buildGoogleMapsSearchUrl(post.address);

  return (
    <article className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_4px_24px_-4px_rgba(47,47,47,0.08),0_2px_8px_-2px_rgba(47,47,47,0.04)] ring-1 ring-app-text/5">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative aspect-[5/4] w-full bg-app-bg-sub">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={`${post.place_name}の写真`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-app-bg-sub text-app-muted">
              <span className="text-4xl opacity-70" aria-hidden>
                🧸
              </span>
              <span className="text-sm font-medium">写真なし</span>
            </div>
          )}
        </div>

        <div className="space-y-4 p-5 pt-4">
          <div className="space-y-2">
            <h2 className="text-[1.125rem] font-bold leading-snug tracking-tight text-app-text">
              {post.place_name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-app-bg-sub px-3 py-1 text-xs font-semibold text-app-text ring-1 ring-app-text/[0.06]">
                {post.ward}
              </span>
              <span className="inline-flex items-center rounded-full bg-app-accent/25 px-3 py-1 text-xs font-semibold text-app-text ring-1 ring-app-accent/30">
                {post.age_group}
              </span>
            </div>
          </div>

          {post.comment ? (
            <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-app-muted">
              {post.comment}
            </p>
          ) : (
            <p className="text-sm italic text-app-muted/70">ひとこと感想はまだありません</p>
          )}

          <div className="space-y-1.5">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-app-muted">
              設備
            </p>
            <FacilityChips post={post} />
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold text-app-primary">
            <span>詳しく見る</span>
            <span aria-hidden>→</span>
          </div>
        </div>
      </Link>

      <div className="border-t border-app-text/[0.06] px-5 pb-5 pt-1">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-app-primary/25 bg-white py-3 text-sm font-semibold text-app-primary shadow-sm transition hover:border-app-primary/40 hover:bg-app-bg-sub"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-base" aria-hidden>
            📍
          </span>
          地図で見る
        </a>
      </div>
    </article>
  );
}
