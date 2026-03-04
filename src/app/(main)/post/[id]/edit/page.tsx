"use client";
import PostEditForm from "@/components/post/edit/PostEditForm";
import type { Post } from "@/types/post";
import { use, useEffect, useState } from "react";
import styles from "./page.module.scss";
import { getPostById } from "@/app/actions/posts";

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  interface PostResponse {
    post: Post;
  }

  const [data, setData] = useState<PostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPostById(id);
        if (result.error) {
          setError(result.error);
        } else {
          setData(result as PostResponse);
        }
      } catch {
        setError("投稿の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
          {error || "投稿が見つかりません"}
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
