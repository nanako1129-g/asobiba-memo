import { getDemoPostById, listDemoPostsSorted } from "@/lib/posts/demo-posts";
import { mapRowToPost, type PostRow } from "@/lib/posts/map-row";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Post } from "@/types/post";

export async function listPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return listDemoPostsSorted();
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`投稿一覧の取得に失敗しました: ${error.message}`);
  }

  return (data as PostRow[] | null)?.map(mapRowToPost) ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return getDemoPostById(id);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`投稿の取得に失敗しました: ${error.message}`);
  }

  if (!data) return null;
  return mapRowToPost(data as PostRow);
}
