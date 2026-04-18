import type { Post } from "@/types/post";

/** Supabase 未設定時のサンプル（seed.sql と同じ内容） */
export const DEMO_POSTS: Post[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    place_id: null,
    place_name: "にじいろキッズパーク 世田谷",
    ward: "世田谷区",
    age_group: "0〜2歳",
    play_tip: "ボールプールは浅め。ソフトブロックでつかまり立ちの練習にちょうどよかったです。",
    comment: "平日午前は空いていて快適でした。",
    address: "東京都世田谷区太子堂1-1-1",
    image_url: "https://images.unsplash.com/photo-1545558014-8692077e9d5c?w=800&q=80",
    nursing_room: true,
    diaper_change: true,
    stroller_ok: true,
    created_at: "2026-04-10T10:00:00+09:00",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    place_id: null,
    place_name: "あそびのひろば 渋谷",
    ward: "渋谷区",
    age_group: "3〜4歳",
    play_tip: "クライミング壁と迷路が人気。一緒に登ると盛り上がります。",
    comment: "スタッフさんが優しく声をかけてくれました。",
    address: "東京都渋谷区神南1-2-3",
    image_url: "https://images.unsplash.com/photo-1596908905631-3a2bd1fcdcf1?w=800&q=80",
    nursing_room: false,
    diaper_change: true,
    stroller_ok: true,
    created_at: "2026-04-12T14:30:00+09:00",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    place_id: null,
    place_name: "室内あそび場 杉並わくわく",
    ward: "杉並区",
    age_group: "5〜6歳",
    play_tip: "滑り台が大きめ。鬼ごっこスペースも広くて満足でした。",
    comment: "夏休みでも比較的ゆとりがありました。",
    address: "東京都杉並区高円寺南4-5-6",
    image_url: null,
    nursing_room: true,
    diaper_change: false,
    stroller_ok: false,
    created_at: "2026-04-14T09:15:00+09:00",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    place_id: null,
    place_name: "キッズスペース 目黒",
    ward: "目黒区",
    age_group: "0〜2歳",
    play_tip: "授乳室がきれいで落ち着ける。絵本コーナーも小さな子向き。",
    comment: "写真は撮り忘れ…また行きたいです。",
    address: "東京都目黒区中目黒2-3-4",
    image_url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    nursing_room: true,
    diaper_change: true,
    stroller_ok: true,
    created_at: "2026-04-15T11:00:00+09:00",
  },
];

export function listDemoPostsSorted(): Post[] {
  return [...DEMO_POSTS].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function getDemoPostById(id: string): Post | null {
  return DEMO_POSTS.find((p) => p.id === id) ?? null;
}
