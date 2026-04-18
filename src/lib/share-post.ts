import type { Post } from "@/types/post";

/** LINE 等に貼りやすい、一文での共有用テキスト */
export function buildPostShareText(
  post: Pick<Post, "place_name" | "ward" | "age_group" | "comment">
): string {
  const snippet = post.comment.replace(/\s+/g, " ").trim();
  const base = `${post.place_name}、${post.ward}で${post.age_group}と行きやすい室内あそび場メモ。`;
  if (!snippet) return base;
  const short = snippet.length > 200 ? `${snippet.slice(0, 200)}…` : snippet;
  return `${base}${short}`;
}
