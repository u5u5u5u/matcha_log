"use client";
import PostEditForm from "@/components/post/edit/PostEditForm";
import type { Post } from "@/types/post";
import { use, useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setPost(data.post);
      })
      .catch(() => setError("投稿が見つかりません"));
  }, [id]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PostEditForm postId={id} initialPost={post} />
    </div>
  );
}
