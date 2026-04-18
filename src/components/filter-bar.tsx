"use client";

import { AGE_GROUPS, WARDS } from "@/lib/constants";

type Props = {
  ward: string;
  ageGroup: string;
  onWardChange: (ward: string) => void;
  onAgeGroupChange: (age: string) => void;
  nursingOnly: boolean;
  diaperOnly: boolean;
  strollerOnly: boolean;
  onNursingOnlyChange: (v: boolean) => void;
  onDiaperOnlyChange: (v: boolean) => void;
  onStrollerOnlyChange: (v: boolean) => void;
};

const ALL = "";

const selectClass =
  "w-full min-h-[48px] appearance-none rounded-2xl border border-app-text/[0.08] bg-white px-4 py-3 text-[0.9375rem] font-medium text-app-text shadow-[0_1px_2px_rgba(47,47,47,0.04)] focus:border-app-primary/40 focus:outline-none focus:ring-2 focus:ring-app-primary/20";

const facilityToggleClass =
  "flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl border border-app-text/[0.08] bg-white/90 px-4 py-3 text-sm font-semibold text-app-text shadow-[0_1px_2px_rgba(47,47,47,0.04)] transition hover:border-app-primary/25 hover:bg-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-app-primary/25";

export function FilterBar({
  ward,
  ageGroup,
  onWardChange,
  onAgeGroupChange,
  nursingOnly,
  diaperOnly,
  strollerOnly,
  onNursingOnlyChange,
  onDiaperOnlyChange,
  onStrollerOnlyChange,
}: Props) {
  return (
    <section
      className="rounded-[1.35rem] bg-app-bg-sub/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-app-text/[0.05]"
      aria-labelledby="filter-heading"
    >
      <div className="mb-4 flex items-end justify-between gap-2">
        <div>
          <h2 id="filter-heading" className="text-base font-bold text-app-text">
            条件で絞り込み
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-app-muted">
            区・年齢帯・設備から、合いそうな投稿を探せます
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-app-muted"
            htmlFor="ward-filter"
          >
            区
          </label>
          <div className="relative">
            <select
              id="ward-filter"
              value={ward}
              onChange={(e) => onWardChange(e.target.value)}
              className={selectClass}
            >
              <option value={ALL}>すべての区</option>
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label
            className="block text-xs font-bold uppercase tracking-wide text-app-muted"
            htmlFor="age-filter"
          >
            年齢帯
          </label>
          <select
            id="age-filter"
            value={ageGroup}
            onChange={(e) => onAgeGroupChange(e.target.value)}
            className={selectClass}
          >
            <option value={ALL}>すべての年齢</option>
            {AGE_GROUPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5 space-y-3 border-t border-app-text/[0.06] pt-5">
        <legend className="text-xs font-bold uppercase tracking-wide text-app-muted">
          設備（複数可・すべて満たす投稿だけ表示）
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <label className={facilityToggleClass}>
            <input
              type="checkbox"
              checked={nursingOnly}
              onChange={(e) => onNursingOnlyChange(e.target.checked)}
              className="size-4 shrink-0 rounded border-app-text/25 text-app-primary focus:ring-app-primary/30"
            />
            <span className="leading-snug">授乳室あり</span>
          </label>
          <label className={facilityToggleClass}>
            <input
              type="checkbox"
              checked={diaperOnly}
              onChange={(e) => onDiaperOnlyChange(e.target.checked)}
              className="size-4 shrink-0 rounded border-app-text/25 text-app-primary focus:ring-app-primary/30"
            />
            <span className="leading-snug">おむつ替えあり</span>
          </label>
          <label className={facilityToggleClass}>
            <input
              type="checkbox"
              checked={strollerOnly}
              onChange={(e) => onStrollerOnlyChange(e.target.checked)}
              className="size-4 shrink-0 rounded border-app-text/25 text-app-primary focus:ring-app-primary/30"
            />
            <span className="leading-snug">ベビーカーOK</span>
          </label>
        </div>
      </fieldset>
    </section>
  );
}
