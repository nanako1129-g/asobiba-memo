"use server";

import { revalidatePath } from "next/cache";
import { AGE_GROUPS, WARDS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "post-images";
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export type CreatePostResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createPost(formData: FormData): Promise<CreatePostResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "デモ表示モードです。`.env.local` に NEXT_PUBLIC_SUPABASE_URL と、NEXT_PUBLIC_SUPABASE_ANON_KEY（または NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY）を設定すると投稿を保存できます。",
    };
  }

  const supabase = await createSupabaseServerClient();

  const placeName = String(formData.get("placeName") ?? "").trim();
  const ward = String(formData.get("ward") ?? "").trim();
  const ageGroup = String(formData.get("ageGroup") ?? "").trim();
  const playTip = String(formData.get("playTip") ?? "");
  const comment = String(formData.get("comment") ?? "");
  const address = String(formData.get("address") ?? "").trim();

  const nursingRoom = formData.get("nursingRoom") === "on";
  const diaperChange = formData.get("diaperChange") === "on";
  const strollerOk = formData.get("strollerOk") === "on";

  if (!placeName) {
    return { ok: false, error: "施設名を入力してください。" };
  }
  if (!address) {
    return { ok: false, error: "住所を入力してください。" };
  }
  if (!WARDS.includes(ward as (typeof WARDS)[number])) {
    return { ok: false, error: "区の値が不正です。" };
  }
  if (!AGE_GROUPS.includes(ageGroup as (typeof AGE_GROUPS)[number])) {
    return { ok: false, error: "年齢帯の値が不正です。" };
  }

  const file = formData.get("photo");
  let imageUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) {
      return { ok: false, error: "画像は5MB以下にしてください。" };
    }
    const mime = file.type || "application/octet-stream";
    if (!ALLOWED_MIME.has(mime)) {
      return { ok: false, error: "画像は JPEG / PNG / WebP / GIF のみにしてください。" };
    }

    const ext = extFromMime(mime);
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: mime, upsert: false });

    if (uploadError) {
      return { ok: false, error: `画像のアップロードに失敗しました: ${uploadError.message}` };
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    imageUrl = pub.publicUrl;
  }

  const { error: insertError } = await supabase.from("posts").insert({
    place_id: null,
    place_name: placeName,
    ward,
    age_group: ageGroup,
    play_tip: playTip,
    comment,
    address,
    image_url: imageUrl,
    nursing_room: nursingRoom,
    diaper_change: diaperChange,
    stroller_ok: strollerOk,
  });

  if (insertError) {
    return { ok: false, error: `投稿の保存に失敗しました: ${insertError.message}` };
  }

  revalidatePath("/");
  revalidatePath("/posts");

  return { ok: true };
}
