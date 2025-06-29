"use client";

import PostCard from "@/components/posts/PostCard";
import type { Post } from "@/types/post";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import styles from "./index.module.scss";

interface PostsResponse {
  posts: Post[];
  myId: string | null;
}

export default function PostListClient() {
  const { data, error, isLoading, mutate } = useSWR<PostsResponse>(
    "/api/posts",
    fetcher
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>
          エラーが発生しました: {error.message}
        </div>
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataText}>投稿がありません。</div>
      </div>
    );
  }

  return (
    <div>
      {data.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          myId={data.myId || undefined}
          onUpdate={() => mutate()}
        />
      ))}
    </div>
  );
}
