import Link from "next/link";
import { adminLoginAction, adminLogoutAction } from "@/app/actions/admin";
import { AdminDeletePostForm } from "@/components/admin-delete-post-form";
import { isAdminPasswordConfigured, verifyAdminSession } from "@/lib/admin-session";
import { listPosts } from "@/lib/posts/queries";
import { PostsLoadError } from "@/components/posts-load-error";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ login?: string; del?: string }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const isAdmin = await verifyAdminSession();
  const passwordOk = isAdminPasswordConfigured();

  let posts;
  try {
    posts = await listPosts();
  } catch (err) {
    const message = err instanceof Error ? err.message : "不明なエラーが発生しました。";
    return <PostsLoadError message={message} />;
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-2xl flex-1 bg-app-bg px-4 py-8 pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-app-text">投稿の管理</h1>
        <Link
          href="/"
          className="inline-flex min-h-[40px] items-center rounded-full border border-app-text/[0.08] bg-white/90 px-4 py-2 text-sm font-semibold text-app-text shadow-sm transition hover:bg-white"
        >
          ← トップへ
        </Link>
      </div>

      {!passwordOk ? (
        <p className="rounded-2xl border border-amber-100 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          環境変数 <code className="rounded bg-white/80 px-1">ADMIN_PASSWORD</code>{" "}
          を設定すると、ここから一覧・編集・削除ができます。
        </p>
      ) : null}

      {passwordOk && !isAdmin ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-app-text/[0.08] bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-app-muted">自分用のパスワードを入力してログインしてください。</p>
          {q.login === "fail" ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              パスワードが違います。
            </p>
          ) : null}
          <form action={adminLoginAction} className="space-y-3">
            <label className="block text-sm font-bold text-app-text" htmlFor="admin-password">
              パスワード
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border-0 bg-app-bg-sub px-4 py-3 text-app-text shadow-inner ring-1 ring-app-text/[0.06] focus:outline-none focus:ring-2 focus:ring-app-primary/25"
            />
            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-app-primary py-3 text-base font-bold text-white shadow-[0_6px_20px_-4px_rgba(244,124,108,0.45)] transition hover:brightness-[1.03]"
            >
              ログイン
            </button>
          </form>
        </div>
      ) : null}

      {passwordOk && isAdmin ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="rounded-full border border-app-text/15 bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:bg-app-bg-sub"
              >
                ログアウト
              </button>
            </form>
            {q.del === "ok" ? (
              <span className="text-sm font-medium text-emerald-700">削除しました。</span>
            ) : null}
            {q.del === "fail" ? (
              <span className="text-sm font-medium text-red-700">削除に失敗しました。</span>
            ) : null}
            {q.del === "demo" || q.del === "key" || q.del === "bad" ? (
              <span className="text-sm font-medium text-red-700">削除できませんでした（設定または ID を確認）。</span>
            ) : null}
          </div>

          <ul className="mt-6 divide-y divide-app-text/[0.06] rounded-2xl border border-app-text/[0.08] bg-white/90 shadow-sm">
            {posts.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-app-muted">投稿はまだありません。</li>
            ) : (
              posts.map((p) => (
                <li key={p.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-app-text">{p.place_name}</p>
                    <p className="mt-0.5 text-xs text-app-muted">{p.ward}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-app-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-[1.03]"
                    >
                      編集
                    </Link>
                    <AdminDeletePostForm postId={p.id} />
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      ) : null}
    </div>
  );
}
