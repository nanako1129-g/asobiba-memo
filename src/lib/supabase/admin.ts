import { createClient } from "@supabase/supabase-js";

/** Server Actions のみ。RLS をバイパスしてトークン検証後の更新に使う（キーは絶対にクライアントへ出さない） */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY が設定されていません。");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
