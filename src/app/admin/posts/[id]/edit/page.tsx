import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PostEditForm } from "@/components/post-edit-form";
import { PostsLoadError } from "@/components/posts-load-error";
import { verifyAdminSession } from "@/lib/admin-session";
import { getPostByIdForAdmin } from "@/lib/posts/admin-queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPostEditPage({ params }: PageProps) {
  if (!(await verifyAdminSession())) {
    redirect("/admin");
  }

  const { id } = await params;

  let post;
  try {
    post = await getPostByIdForAdmin(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラーが発生しました。";
    return <PostsLoadError message={message} />;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col bg-app-bg px-4 py-6 pb-16">
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className="inline-flex min-h-[40px] w-fit items-center rounded-full border border-app-text/[0.08] bg-white/90 px-4 py-2 text-sm font-semibold text-app-text shadow-sm transition hover:bg-white"
        >
          ← 管理一覧
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-[40px] w-fit items-center rounded-full border border-app-text/[0.08] bg-white/90 px-4 py-2 text-sm font-semibold text-app-text shadow-sm transition hover:bg-white"
        >
          トップへ
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-app-primary/15 bg-app-bg-sub/90 px-4 py-3 text-sm leading-relaxed text-app-muted ring-1 ring-app-text/[0.04]">
        <p className="font-semibold text-app-text">管理者として編集</p>
        <p className="mt-1 text-[0.8125rem]">
          この画面は <code className="rounded bg-white/70 px-1">ADMIN_PASSWORD</code>{" "}
          でログインしたときだけ開けます。
        </p>
      </div>

      <header className="mb-8 space-y-2 text-center">
        <h1 className="text-[1.375rem] font-bold leading-tight text-app-text">投稿を修正する</h1>
        <p className="text-sm font-medium text-app-muted">{post.place_name}</p>
      </header>

      <PostEditForm mode="admin" post={post} />
    </div>
  );
}
