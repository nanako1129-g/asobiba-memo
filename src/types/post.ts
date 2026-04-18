/** 投稿1件（Supabase の posts に対応する想定） */
export type Post = {
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
