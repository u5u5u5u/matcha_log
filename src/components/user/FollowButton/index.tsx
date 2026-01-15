"use client";
import { Button } from "@/components/util/button";
import { useState } from "react";
import styles from "./index.module.scss";
import { followUser, unfollowUser } from "@/app/actions/users";

export default function FollowButton({
  userId,
  initialIsFollowing,
}: {
  userId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const result = await followUser(userId);
    if (result.ok) setIsFollowing(true);
    setLoading(false);
  };
  const handleUnfollow = async () => {
    setLoading(true);
    const result = await unfollowUser(userId);
    if (result.ok) setIsFollowing(false);
    setLoading(false);
  };

  if (isFollowing) {
    return (
      <Button
        type="button"
        onClick={handleUnfollow}
        disabled={loading}
        className={styles.followButton}
      >
        フォロー解除
      </Button>
    );
  }
  return (
    <Button
      type="button"
      onClick={handleFollow}
      disabled={loading}
      className={styles.followButton}
    >
      フォロー
    </Button>
  );
}
