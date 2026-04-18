import { getSupabasePublicApiKey, isSupabaseConfigured } from "@/lib/supabase/is-configured";

/** 開発専用: サーバーが .env.local を読めているか（秘密は返さない） */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = getSupabasePublicApiKey();
  let urlHost: string | null = null;
  if (url) {
    try {
      urlHost = new URL(url).hostname;
    } catch {
      urlHost = "invalid-url";
    }
  }

  return Response.json({
    configured: isSupabaseConfigured(),
    hasUrl: Boolean(url),
    hasKey: Boolean(key),
    urlHost,
  });
}
