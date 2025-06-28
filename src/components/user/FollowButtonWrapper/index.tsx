"use client";
import FollowButton from "../FollowButton";

type Props = {
  userId: string;
  initialIsFollowing: boolean;
};

export default function FollowButtonWrapper({
  userId,
  initialIsFollowing,
}: Props) {
  return (
    <FollowButton userId={userId} initialIsFollowing={initialIsFollowing} />
  );
}
