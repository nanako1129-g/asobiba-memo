import { connection } from "next/server";
import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";
import { HomeFallback } from "@/components/home-fallback";
import { PostsLoadError } from "@/components/posts-load-error";
import { listPosts } from "@/lib/posts/queries";
import { isSupabaseConfigured, isVercelDeployment } from "@/lib/supabase/is-configured";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connection();
  const demoMode = !isSupabaseConfigured();
  const deploymentHint = isVercelDeployment() ? "vercel" : "local";
  let posts;
  try {
    posts = await listPosts();
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラーが発生しました。";
    return <PostsLoadError message={message} />;
  }

  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient posts={posts} demoMode={demoMode} deploymentHint={deploymentHint} />
    </Suspense>
  );
}
