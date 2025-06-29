"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import UserProfileClient from "@/components/user/UserProfileClient";
import styles from "./index.module.scss";

type Post = {
  id: string;
  title: string;
  category: string;
  bitterness: number;
  richness: number;
  sweetness: number;
  images: { url: string }[];
  shop?: { name?: string | null };
};

interface UserData {
  id: string;
  name: string;
  email: string;
  iconUrl: string | null;
  activeTitle: { id: string; name: string } | null;
}

interface UserProfileData {
  user: UserData;
  posts: Post[];
  followingList: Array<{ name: string; iconUrl: string | null; id: string }>;
  followerList: Array<{ name: string; iconUrl: string | null; id: string }>;
  initialIsFollowing: boolean;
  showFollowButton: boolean;
}

interface Props {
  userId: string;
}

export default function UserProfileClientSWR({ userId }: Props) {
  const { data, error, isLoading } = useSWR<UserProfileData>(
    `/api/user/${userId}`,
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

  if (!data) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataText}>ユーザーが見つかりません。</div>
      </div>
    );
  }

  return (
    <UserProfileClient
      user={data.user}
      posts={data.posts}
      followingList={data.followingList}
      followerList={data.followerList}
      initialIsFollowing={data.initialIsFollowing}
      showFollowButton={data.showFollowButton}
    />
  );
}
