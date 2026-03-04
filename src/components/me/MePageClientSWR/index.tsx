"use client";

import { useEffect, useState } from "react";
import MePageClient from "@/components/me/MePageClient";
import styles from "./index.module.scss";
import { getMyProfile } from "@/app/actions/me";

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
  name: string;
  email: string;
  iconUrl?: string;
  activeTitle: { id: string; name: string } | null;
  followingList: Array<{ name: string; iconUrl: string | null; id: string }>;
  followerList: Array<{ name: string; iconUrl: string | null; id: string }>;
}

interface MePageData {
  user: UserData;
  posts: Post[];
  likedPosts: Post[];
}

export default function MePageClientSWR() {
  const [data, setData] = useState<MePageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyProfile();
        if (result.error) {
          setError(result.error);
        } else {
          setData(result as MePageData);
        }
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
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

  if (!data) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataText}>データが見つかりません。</div>
      </div>
    );
  }

  return (
    <MePageClient
      posts={data.posts}
      likedPosts={data.likedPosts}
      userName={data.user.name}
      userEmail={data.user.email}
      userIconUrl={data.user.iconUrl}
      activeTitle={data.user.activeTitle}
      followingList={data.user.followingList}
      followerList={data.user.followerList}
    />
  );
}
