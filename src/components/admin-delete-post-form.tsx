"use client";

import { deletePostAsAdmin } from "@/app/actions/posts";

export function AdminDeletePostForm({ postId }: { postId: string }) {
  return (
    <form
      action={deletePostAsAdmin}
      onSubmit={(e) => {
        if (!window.confirm("この投稿を削除しますか？")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 transition hover:bg-red-100"
      >
        削除
      </button>
    </form>
  );
}
