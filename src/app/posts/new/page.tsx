import Link from "next/link";
import { headers } from "next/headers";
import { PostForm } from "@/components/post-form";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

function hostWithoutPort(raw: string) {
  return raw.split(":")[0] ?? raw;
}

export default async function NewPostPage() {
  const h = await headers();
  const host = hostWithoutPort(h.get("x-forwarded-host") ?? h.get("host") ?? "");
  const isLikelyLan =
    host.length > 0 &&
    host !== "localhost" &&
    host !== "127.0.0.1" &&
    /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(host);
  const supabaseOk = isSupabaseConfigured();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col bg-app-bg px-4 py-6 pb-16">
      <Link
        href="/"
        className="mb-6 inline-flex min-h-[40px] w-fit items-center rounded-full border border-app-text/[0.08] bg-white/90 px-4 py-2 text-sm font-semibold text-app-text shadow-sm transition hover:bg-white"
      >
        ← 一覧へ
      </Link>

      {!supabaseOk ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
        >
          <p className="font-semibold">Supabase 未設定（サーバーから環境変数が見えていません）</p>
          <p className="mt-1 text-[0.8125rem] text-amber-900/90">
            プロジェクト直下の <code className="rounded bg-amber-100/90 px-1">.env.local</code> に URL
            と API キーを保存し、このフォルダで{" "}
            <code className="rounded bg-amber-100/90 px-1">npm run dev</code> を再起動してください。
          </p>
        </div>
      ) : null}

      {supabaseOk && isLikelyLan ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950"
        >
          <p className="font-semibold">LAN（{host}）から開いています</p>
          <p className="mt-1 text-[0.8125rem] text-sky-900/90">
            投稿でエラーになるときは、開発中の Mac 上のブラウザで{" "}
            <a href="http://localhost:3000/posts/new" className="font-semibold underline underline-offset-2">
              localhost:3000
            </a>
            から開いて試してください。
          </p>
        </div>
      ) : null}

      <header className="mb-8 space-y-2 text-center">
        <h1 className="text-[1.375rem] font-bold leading-tight text-app-text">
          あそび場メモを投稿する
        </h1>
        <p className="text-sm font-medium text-app-muted">写真とひとことだけでもOK</p>
      </header>

      <PostForm />
    </div>
  );
}
