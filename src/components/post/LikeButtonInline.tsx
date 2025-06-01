"use client";
import { useState } from "react";

export default function LikeButtonInline({
  postId,
  initialLiked,
  initialLikeCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;
    setLoading(true);
    const res = await fetch(`/api/post/${postId}/like`, {
      method: liked ? "DELETE" : "POST",
    });
    if (res.ok) {
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
      <span style={{ fontSize: "1.2em" }}>{liked ? "♥" : "♡"}</span> {likeCount}
    </button>
  );
}
