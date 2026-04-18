/** useSearchParams 待ちの簡易フォールバック */
export function HomeFallback() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 py-10">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-app-bg-sub" />
      <div className="h-28 animate-pulse rounded-[1.25rem] bg-app-bg-sub" />
      <div className="h-44 animate-pulse rounded-[1.25rem] bg-app-bg-sub" />
    </div>
  );
}
