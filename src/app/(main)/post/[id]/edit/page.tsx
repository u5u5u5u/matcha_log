"use client";
import PostEditForm from "@/components/post/edit/PostEditForm";
import type { Post } from "@/types/post";
import { fetcher } from "@/lib/fetcher";
import { use } from "react";
import useSWR from "swr";
import styles from "./page.module.scss";

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  interface PostResponse {
    post: Post;
  }

  const { data, error, isLoading } = useSWR<PostResponse>(
    `/api/post/${id}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          {error.message || "投稿が見つかりません"}
        </div>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>投稿が見つかりません</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PostEditForm postId={id} initialPost={data.post} />
    </div>
  );
}
