import type { Post } from "@/types/post";

/** Supabase の posts 行（DB カラム名と一致） */
export type PostRow = {
  id: string;
  place_id: string | null;
  place_name: string;
  ward: string;
  age_group: string;
  play_tip: string;
  comment: string;
  address: string;
  image_url: string | null;
  nursing_room: boolean;
  diaper_change: boolean;
  stroller_ok: boolean;
  created_at: string;
};

export function mapRowToPost(row: PostRow): Post {
  return {
    id: row.id,
    place_id: row.place_id,
    place_name: row.place_name,
    ward: row.ward,
    age_group: row.age_group,
    play_tip: row.play_tip,
    comment: row.comment,
    address: row.address,
    image_url: row.image_url,
    nursing_room: row.nursing_room,
    diaper_change: row.diaper_change,
    stroller_ok: row.stroller_ok,
    created_at: row.created_at,
  };
}
