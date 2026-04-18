-- 既存の posts に編集用トークン列を追加（Supabase SQL Editor で 1 回実行）
-- アプリの「投稿後の修正」機能用。公開 API では edit_token は返しません。

alter table public.posts
  add column if not exists edit_token uuid not null default gen_random_uuid();

create unique index if not exists posts_edit_token_uidx on public.posts (edit_token);
