"use client";

import PostCard from "@/components/posts/PostCard";
import type { Post } from "@/types/post";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

interface PostsResponse {
  posts: Post[];
  myId: string | null;
}

export default function PostListClient() {
  const { data, error, isLoading } = useSWR<PostsResponse>(
    "/api/posts",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div>読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">
          エラーが発生しました: {error.message}
        </div>
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div>投稿がありません。</div>
      </div>
    );
  }

  return (
    <div>
      {data.posts.map((post) => (
        <PostCard key={post.id} post={post} myId={data.myId || undefined} />
      ))}
    </div>
  );
}
