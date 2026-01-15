"use client";
import { useState } from "react";
import { likePost, unlikePost } from "@/app/actions/posts";

export default function LikeButton({
  postId,
  likeCount: initialLikeCount,
}: {
  postId: string;
  likeCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;
    setLoading(true);
    const result = liked ? await unlikePost(postId) : await likePost(postId);
    if (result.ok) {
      setLiked(!liked);
      setLikeCount((c) => c + (liked ? -1 : 1));
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        color: liked ? "#e53935" : "#888",
        fontWeight: "bold",
        fontSize: "1.1rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span style={{ fontSize: "1.3em" }}>{liked ? "♥" : "♡"}</span> {likeCount}
    </button>
  );
}
