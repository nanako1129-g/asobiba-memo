-- seed.sql（schema.sql 実行後に SQL Editor または psql で実行）

-- サンプル施設（任意）
insert into public.places (id, name, ward, address, google_maps_url)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'サンプル室内遊び場 A',
    '世田谷区',
    '東京都世田谷区太子堂1-1-1',
    null
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'サンプル室内遊び場 B',
    '渋谷区',
    '東京都渋谷区神南1-2-3',
    null
  )
on conflict (id) do nothing;

-- サンプル投稿（画像は外部URLまたは null。Storage 不要で一覧確認しやすい）
insert into public.posts (
  id, place_id, place_name, ward, age_group, play_tip, comment, address,
  image_url, nursing_room, diaper_change, stroller_ok, created_at
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    null,
    'にじいろキッズパーク 世田谷',
    '世田谷区',
    '0〜2歳',
    'ボールプールは浅め。ソフトブロックでつかまり立ちの練習にちょうどよかったです。',
    '平日午前は空いていて快適でした。',
    '東京都世田谷区太子堂1-1-1',
    'https://images.unsplash.com/photo-1545558014-8692077e9d5c?w=800&q=80',
    true, true, true,
    '2026-04-10T10:00:00+09'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    null,
    'あそびのひろば 渋谷',
    '渋谷区',
    '3〜4歳',
    'クライミング壁と迷路が人気。一緒に登ると盛り上がります。',
    'スタッフさんが優しく声をかけてくれました。',
    '東京都渋谷区神南1-2-3',
    'https://images.unsplash.com/photo-1596908905631-3a2bd1fcdcf1?w=800&q=80',
    false, true, true,
    '2026-04-12T14:30:00+09'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    null,
    '室内あそび場 杉並わくわく',
    '杉並区',
    '5〜6歳',
    '滑り台が大きめ。鬼ごっこスペースも広くて満足でした。',
    '夏休みでも比較的ゆとりがありました。',
    '東京都杉並区高円寺南4-5-6',
    null,
    true, false, false,
    '2026-04-14T09:15:00+09'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    null,
    'キッズスペース 目黒',
    '目黒区',
    '0〜2歳',
    '授乳室がきれいで落ち着ける。絵本コーナーも小さな子向き。',
    '写真は撮り忘れ…また行きたいです。',
    '東京都目黒区中目黒2-3-4',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
    true, true, true,
    '2026-04-15T11:00:00+09'
  )
on conflict (id) do nothing;
