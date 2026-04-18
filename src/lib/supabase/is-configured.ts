/**
 * 公開用 API キー（ダッシュボードの「Publishable」または従来の anon JWT のどちらでも可）
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function getSupabasePublicApiKey(): string | undefined {
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return publishable || anon;
}

/** URL と公開キーが揃っているか（空文字は未設定扱い） */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabasePublicApiKey();
  return Boolean(url && key);
}
