/** 区の候補（後から増やしやすいよう配列で管理） */
export const WARDS = [
  "世田谷区",
  "渋谷区",
  "杉並区",
  "目黒区",
  "港区",
  "新宿区",
  "その他",
] as const;

export type Ward = (typeof WARDS)[number];

/** 年齢帯の固定値 */
export const AGE_GROUPS = ["0〜2歳", "3〜4歳", "5〜6歳"] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];
