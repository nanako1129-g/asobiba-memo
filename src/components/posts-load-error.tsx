type Props = {
  message: string;
};

/** Supabase 未設定や通信エラー時の案内 */
export function PostsLoadError({ message }: Props) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col justify-center gap-4 px-4 py-10">
      <div className="rounded-[1.25rem] border border-app-primary/15 bg-app-bg-sub px-5 py-5 text-sm text-app-text shadow-sm">
        <p className="font-bold text-app-primary">データを読み込めませんでした</p>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed text-app-muted">{message}</p>
        <ul className="mt-4 list-inside list-disc space-y-1.5 text-app-muted">
          <li>
            プロジェクト直下に <code className="rounded-md bg-white/90 px-1.5 py-0.5 text-app-text">.env.local</code>{" "}
            を置き、Supabase の URL / anon key を設定してください。
          </li>
          <li>
            Supabase で <code className="rounded-md bg-white/90 px-1.5 py-0.5 text-app-text">schema.sql</code>{" "}
            を実行済みか確認してください。
          </li>
        </ul>
      </div>
    </div>
  );
}
