-- ============================================================
-- 室内あそび場メモ MVP — スキーマ & RLS（Supabase SQL Editor で実行）
-- ============================================================
-- 【RLS についての注意】
-- この MVP では posts の INSERT / SELECT を匿名（anon）に開放しています。
-- 認証なしのため、誰でも投稿・閲覧でき、スパムや不適切投稿を防げません。
-- 本番では Supabase Auth + 投稿者のみ更新可、などに切り替えてください。
-- Storage も匿名アップロード可能にしているため、悪用や容量攻撃のリスクがあります。
-- 運用前にレート制限・ファイルサイズ制限・ウイルススキャン等の検討を推奨します。
-- ============================================================

-- ------------------------------------------------------------
-- places（将来の正規化用。MVP では投稿から直接参照しなくてもよい）
-- ------------------------------------------------------------
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ward text not null,
  address text not null,
  google_maps_url text,
  created_at timestamptz not null default now()
);

alter table public.places enable row level security;

drop policy if exists "places_select_public" on public.places;
create policy "places_select_public"
  on public.places
  for select
  to anon, authenticated
  using (true);

-- MVP ではアプリから places へは書き込まない想定（seed は SQL で投入）

-- ------------------------------------------------------------
-- posts
-- ------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references public.places (id) on delete set null,
  place_name text not null,
  ward text not null,
  age_group text not null,
  play_tip text not null default '',
  comment text not null default '',
  address text not null,
  image_url text,
  nursing_room boolean not null default false,
  diaper_change boolean not null default false,
  stroller_ok boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_ward_idx on public.posts (ward);
create index if not exists posts_age_group_idx on public.posts (age_group);

alter table public.posts enable row level security;

drop policy if exists "posts_select_public" on public.posts;
create policy "posts_select_public"
  on public.posts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "posts_insert_public" on public.posts;
create policy "posts_insert_public"
  on public.posts
  for insert
  to anon, authenticated
  with check (true);

-- ------------------------------------------------------------
-- Storage: バケット post-images（公開読み取り）
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "post_images_select" on storage.objects;
create policy "post_images_select"
  on storage.objects
  for select
  to public
  using (bucket_id = 'post-images');

drop policy if exists "post_images_insert" on storage.objects;
create policy "post_images_insert"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'post-images');

-- 注意: UPDATE/DELETE を開放しない（上書き・削除の悪用防止のため）
-- 必要になったら認証済みユーザーのみ等のポリシーを追加してください。
