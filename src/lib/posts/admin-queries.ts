import { POST_PUBLIC_COLUMNS } from "@/lib/posts/columns";
import { mapRowToPost, type PostRow } from "@/lib/posts/map-row";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import type { Post } from "@/types/post";

/** service_role で id のみ指定して取得（管理者編集ページ用） */
export async function getPostByIdForAdmin(id: string): Promise<Post | null> {
  const admin = createSupabaseServiceClient();
  const { data, error } = await admin
    .from("posts")
    .select(POST_PUBLIC_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`投稿の取得に失敗しました: ${error.message}`);
  }
  if (!data) return null;
  return mapRowToPost(data as PostRow);
}
