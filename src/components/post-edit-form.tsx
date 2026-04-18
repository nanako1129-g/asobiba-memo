"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { updatePost } from "@/app/actions/posts";
import { AGE_GROUPS, WARDS } from "@/lib/constants";
import type { Post } from "@/types/post";

const fieldBase =
  "w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-[0.9375rem] text-app-text shadow-[0_2px_12px_-2px_rgba(47,47,47,0.08)] placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/25";

type ChipProps = {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  icon: ReactNode;
};

function FacilityChip({ name, checked, onChange, children, icon }: ChipProps) {
  return (
    <label
      className={`flex min-h-[52px] cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-center text-xs font-bold leading-tight transition sm:gap-2 sm:px-3 sm:text-sm ${
        checked
          ? "bg-app-primary text-white shadow-[0_4px_14px_-2px_rgba(244,124,108,0.45)]"
          : "bg-app-primary/[0.12] text-app-primary ring-1 ring-app-primary/20"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value="on"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-base leading-none sm:text-lg" aria-hidden>
        {icon}
      </span>
      {checked ? <span aria-hidden>✓</span> : null}
      <span>{children}</span>
    </label>
  );
}

type Props = {
  post: Post;
  editToken: string;
};

export function PostEditForm({ post, editToken }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState(post.place_name);
  const [ward, setWard] = useState(post.ward);
  const [ageGroup, setAgeGroup] = useState(post.age_group);
  const [playTip, setPlayTip] = useState(post.play_tip);
  const [comment, setComment] = useState(post.comment);
  const [address, setAddress] = useState(post.address);
  const [nursingRoom, setNursingRoom] = useState(post.nursing_room);
  const [diaperChange, setDiaperChange] = useState(post.diaper_change);
  const [strollerOk, setStrollerOk] = useState(post.stroller_ok);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    setIsSubmitting(true);
    try {
      const result = await updatePost(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/posts/${post.id}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "送信に失敗しました。もう一度お試しください。";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <input type="hidden" name="postId" value={post.id} />
      <input type="hidden" name="editToken" value={editToken} />
      <input type="hidden" name="existingImageUrl" value={post.image_url ?? ""} />

      {error && (
        <p
          className="rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3.5 text-sm leading-relaxed text-red-900"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="space-y-2">
        <label
          htmlFor="edit-photo"
          className="relative block aspect-[5/4] w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-neutral-200 bg-app-bg-sub shadow-inner"
        >
          <input
            id="edit-photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFileChange}
            className="sr-only"
          />
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="差し替え予定の写真"
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-app-text/50 py-2.5 text-center text-xs font-semibold text-white">
                タップして別の写真に変更
              </span>
            </>
          ) : post.image_url ? (
            <>
              <Image
                src={post.image_url}
                alt="現在の写真"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-app-text/50 py-2.5 text-center text-xs font-semibold text-white">
                タップして写真を差し替え
              </span>
            </>
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-2 py-10">
              <span className="text-4xl opacity-90" aria-hidden>
                📷
              </span>
              <span className="text-base font-bold text-app-text">写真を追加する</span>
              <span className="text-sm text-app-muted">任意（そのままでもOK）</span>
            </span>
          )}
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="edit-placeName">
          施設名
        </label>
        <input
          id="edit-placeName"
          name="placeName"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className={fieldBase}
          placeholder="施設名を入力してください"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-app-text" htmlFor="edit-ward">
            区
          </label>
          <select
            id="edit-ward"
            name="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className={fieldBase}
          >
            {WARDS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-app-text" htmlFor="edit-ageGroup">
            何歳と行った？
          </label>
          <select
            id="edit-ageGroup"
            name="ageGroup"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className={fieldBase}
          >
            {AGE_GROUPS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="edit-playTip">
          おすすめの遊び方
        </label>
        <textarea
          id="edit-playTip"
          name="playTip"
          value={playTip}
          onChange={(e) => setPlayTip(e.target.value)}
          rows={3}
          className={`${fieldBase} min-h-[100px] resize-y`}
          placeholder="遊び方のヒント（空欄でもOK）"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="edit-comment">
          ひとこと感想
        </label>
        <textarea
          id="edit-comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className={`${fieldBase} min-h-[88px] resize-y`}
          placeholder="雰囲気や混雑など（空欄でもOK）"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-app-text" htmlFor="edit-address">
          住所
        </label>
        <input
          id="edit-address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={fieldBase}
          placeholder="住所を入力してください"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-app-text">設備</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <FacilityChip
            name="nursingRoom"
            checked={nursingRoom}
            onChange={setNursingRoom}
            icon="🤱"
          >
            授乳室あり
          </FacilityChip>
          <FacilityChip
            name="diaperChange"
            checked={diaperChange}
            onChange={setDiaperChange}
            icon="👶"
          >
            おむつ替えあり
          </FacilityChip>
          <FacilityChip
            name="strollerOk"
            checked={strollerOk}
            onChange={setStrollerOk}
            icon="🛒"
          >
            ベビーカーOK
          </FacilityChip>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full bg-app-primary py-4 text-lg font-bold text-white shadow-[0_6px_20px_-4px_rgba(244,124,108,0.5)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isSubmitting ? "保存中…" : "変更を保存"}
      </button>
    </form>
  );
}
