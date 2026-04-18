import type { NextConfig } from "next";

/**
 * Supabase Storage の公開 URL は通常 `https://<ref>.supabase.co/storage/v1/object/public/...`
 * hostname は picomatch（Next の remotePatterns）で `*.supabase.co` が使える。
 * Vercel のビルド時に NEXT_PUBLIC_SUPABASE_URL が未設定でも、標準ホストの画像が最適化される。
 *
 * カスタムドメインの Supabase を使う場合は、環境変数からホストを足す（下の optionalHost）。
 */
const optionalSupabaseHost = (() => {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return null;
  try {
    return new URL(u).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  /** 開発時: LAN や別ホスト名から開くときの警告・Server Actions 周りを安定させる（必要なら IP を足す） */
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.11.11"],
  experimental: {
    serverActions: {
      // 写真1枚アップロード用（Server Action の FormData 上限）
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      ...(optionalSupabaseHost &&
      !optionalSupabaseHost.endsWith(".supabase.co") &&
      optionalSupabaseHost !== "localhost"
        ? [
            {
              protocol: "https" as const,
              hostname: optionalSupabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
