import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicApiKey } from "@/lib/supabase/is-configured";

/** Server Components / Server Actions 用（Cookie 経由でセッションを扱える。認証なしでも推奨パターン） */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = getSupabasePublicApiKey();
  if (!url || !anonKey) {
    throw new Error(
      "`.env.local` に NEXT_PUBLIC_SUPABASE_URL と、NEXT_PUBLIC_SUPABASE_ANON_KEY または NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY を設定してください。",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component からのみ呼ばれた場合など、set が使えないことがある
        }
      },
    },
  });
}
