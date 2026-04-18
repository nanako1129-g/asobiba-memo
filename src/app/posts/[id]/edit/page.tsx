import Link from "next/link";
import { notFound } from "next/navigation";
import { PostEditForm } from "@/components/post-edit-form";
import { PostsLoadError } from "@/components/posts-load-error";
import { getPostForEditing } from "@/lib/posts/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ e?: string }>;
};

export default async function PostEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { e: editTokenRaw } = await searchParams;
  const editToken = editTokenRaw?.trim() ?? "";

  if (!editToken) {
    notFound();
  }

  let post;
  try {
    post = await getPostForEditing(id, editToken);
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラーが発生しました。";
    return <PostsLoadError message={message} />;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col bg-app-bg px-4 py-6 pb-16">
      <Link
        href="/"
        className="mb-4 inline-flex min-h-[40px] w-fit items-center rounded-full border border-app-text/[0.08] bg-white/90 px-4 py-2 text-sm font-semibold text-app-text shadow-sm transition hover:bg-white"
      >
        ← 一覧へ
      </Link>

      <div className="mb-6 rounded-2xl border border-app-primary/15 bg-app-bg-sub/90 px-4 py-3 text-sm leading-relaxed text-app-muted ring-1 ring-app-text/[0.04]">
        <p className="font-semibold text-app-text">編集用ページ</p>
        <p className="mt-1 text-[0.8125rem]">
          このページの URL（アドレス欄）をブックマークしておくと、あとから同じ内容を修正できます。
        </p>
      </div>

      <header className="mb-8 space-y-2 text-center">
        <h1 className="text-[1.375rem] font-bold leading-tight text-app-text">投稿を修正する</h1>
        <p className="text-sm font-medium text-app-muted">{post.place_name}</p>
      </header>

      <PostEditForm mode="token" post={post} editToken={editToken} />
    </div>
  );
}
