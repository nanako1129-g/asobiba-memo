"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AGE_GROUPS, WARDS } from "@/lib/constants";
import { verifyAdminSession } from "@/lib/admin-session";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
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
  | { ok: true; postId: string; editToken: string }
  | { ok: false; error: string };

export type UpdatePostResult = { ok: true } | { ok: false; error: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  const { data: inserted, error: insertError } = await supabase
    .from("posts")
    .insert({
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
    })
    .select("id, edit_token")
    .single();

  if (insertError) {
    return { ok: false, error: `投稿の保存に失敗しました: ${insertError.message}` };
  }

  if (!inserted?.id || !inserted.edit_token) {
    return {
      ok: false,
      error:
        "投稿は保存されましたが、編集用トークンを取得できませんでした。Supabase の posts に edit_token 列があるか（マイグレーション済みか）確認してください。",
    };
  }

  revalidatePath("/");
  revalidatePath("/posts");

  return { ok: true, postId: inserted.id, editToken: String(inserted.edit_token) };
}

type UpdateAuth = { kind: "token"; editToken: string } | { kind: "admin" };

async function performPostUpdate(formData: FormData, auth: UpdateAuth): Promise<UpdatePostResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "デモ表示モードでは編集できません。" };
  }

  let admin;
  try {
    admin = createSupabaseServiceClient();
  } catch {
    return {
      ok: false,
      error:
        "編集機能のためのサーバー設定が完了していません。`.env.local` に SUPABASE_SERVICE_ROLE_KEY（Supabase の service_role キー）を設定してください。",
    };
  }

  const postId = String(formData.get("postId") ?? "").trim();
  if (!UUID_RE.test(postId)) {
    return {
      ok: false,
      error: auth.kind === "admin" ? "投稿の指定が不正です。" : "編集用のリンクが無効です。",
    };
  }

  if (auth.kind === "token") {
    const { editToken } = auth;
    if (!UUID_RE.test(editToken)) {
      return { ok: false, error: "編集用のリンクが無効です。" };
    }

    const { data: row, error: selErr } = await admin
      .from("posts")
      .select("id, edit_token")
      .eq("id", postId)
      .maybeSingle();

    if (selErr || !row || String(row.edit_token) !== editToken) {
      return { ok: false, error: "編集用のリンクが無効か、期限切れの可能性があります。" };
    }
  }

  const placeName = String(formData.get("placeName") ?? "").trim();
  const ward = String(formData.get("ward") ?? "").trim();
  const ageGroup = String(formData.get("ageGroup") ?? "").trim();
  const playTip = String(formData.get("playTip") ?? "");
  const comment = String(formData.get("comment") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const existingImageUrl = String(formData.get("existingImageUrl") ?? "").trim();

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
  let imageUrl: string | null = existingImageUrl || null;

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

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, file, { contentType: mime, upsert: false });

    if (uploadError) {
      return { ok: false, error: `画像のアップロードに失敗しました: ${uploadError.message}` };
    }

    const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
    imageUrl = pub.publicUrl;
  }

  let updateBuilder = admin
    .from("posts")
    .update({
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
    })
    .eq("id", postId);

  if (auth.kind === "token") {
    updateBuilder = updateBuilder.eq("edit_token", auth.editToken);
  }

  const { error: updateError } = await updateBuilder;

  if (updateError) {
    return { ok: false, error: `更新に失敗しました: ${updateError.message}` };
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/admin");

  return { ok: true };
}

export async function updatePost(formData: FormData): Promise<UpdatePostResult> {
  const editToken = String(formData.get("editToken") ?? "").trim();
  if (!UUID_RE.test(editToken)) {
    return { ok: false, error: "編集用のリンクが無効です。" };
  }
  return performPostUpdate(formData, { kind: "token", editToken });
}

export async function updatePostAsAdmin(formData: FormData): Promise<UpdatePostResult> {
  if (!(await verifyAdminSession())) {
    return { ok: false, error: "管理者としてログインしてください。" };
  }
  return performPostUpdate(formData, { kind: "admin" });
}

export async function deletePostAsAdmin(formData: FormData): Promise<void> {
  if (!(await verifyAdminSession())) {
    redirect("/admin");
  }
  if (!isSupabaseConfigured()) {
    redirect("/admin?del=demo");
  }

  let admin;
  try {
    admin = createSupabaseServiceClient();
  } catch {
    redirect("/admin?del=key");
  }

  const postId = String(formData.get("postId") ?? "").trim();
  if (!UUID_RE.test(postId)) {
    redirect("/admin?del=bad");
  }

  const { error } = await admin.from("posts").delete().eq("id", postId);

  if (error) {
    redirect("/admin?del=fail");
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin");
  revalidatePath(`/posts/${postId}`);

  redirect("/admin?del=ok");
}
