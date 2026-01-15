"use client";

import PostCard from "@/components/posts/PostCard";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { getPosts } from "@/app/actions/posts";

interface PostsResponse {
  posts: Post[];
  myId: string | null;
}

export default function PostListClient() {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await getPosts();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result as PostsResponse);
      }
    } catch (err) {
      setError("投稿の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className={styles.errorText}>エラーが発生しました: {error}</div>
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
          onUpdate={() => fetchData()}
        />
      ))}
    </div>
  );
}
