"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import styles from "./index.module.scss";

export default function LikeButtonInline({
  postId,
  initialLiked,
  initialLikeCount,
  onUpdate,
}: {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  onUpdate?: () => void;
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
      // いいね状態が変更されたらリスト更新
      if (onUpdate) {
        onUpdate();
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={liked ? styles.likeButton : styles.unlikeButton}
    >
      <span>
        <Heart size={20} />
      </span>
      {likeCount}
    </button>
  );
}
