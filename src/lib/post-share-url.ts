import { headers } from "next/headers";

/** 詳細ページの絶対URL（共有・OG 等で利用） */
export async function getPostDetailAbsoluteUrl(postId: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) {
    return `http://localhost:3000/posts/${postId}`;
  }
  const forwardedProto = h.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}/posts/${postId}`;
}
