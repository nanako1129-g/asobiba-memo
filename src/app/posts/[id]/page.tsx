import { notFound } from "next/navigation";
import { PostDetail } from "@/components/post-detail";
import { PostsLoadError } from "@/components/posts-load-error";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";
import { getPostDetailAbsoluteUrl } from "@/lib/post-share-url";
import { getPostById } from "@/lib/posts/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  let post;
  try {
    post = await getPostById(id);
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラーが発生しました。";
    return <PostsLoadError message={message} />;
  }

  if (!post) notFound();

  const mapsUrl = buildGoogleMapsSearchUrl(post.address);
  const shareUrl = await getPostDetailAbsoluteUrl(id);

  return <PostDetail post={post} mapsUrl={mapsUrl} shareUrl={shareUrl} />;
}
