import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicApiKey } from "@/lib/supabase/is-configured";

/** クライアントコンポーネント用（将来の認証やクライアント直叩き用に用意） */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = getSupabasePublicApiKey();
  if (!url || !anonKey) {
    throw new Error("Supabase の環境変数が設定されていません。");
  }
  return createBrowserClient(url, anonKey);
}
