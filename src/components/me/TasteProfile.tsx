import React from "react";
import styles from "./TasteProfile.module.scss";

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

type Props = {
  posts: Post[];
};

export default function TasteProfile({ posts }: Props) {
  // 味覚統計情報を取得する関数
  function getTasteStats(posts: Post[]) {
    if (posts.length === 0) return null;

    const totalBitterness = posts.reduce(
      (sum, post) => sum + post.bitterness,
      0
    );
    const totalRichness = posts.reduce((sum, post) => sum + post.richness, 0);
    const totalSweetness = posts.reduce((sum, post) => sum + post.sweetness, 0);

    return {
      avgBitterness: (totalBitterness / posts.length).toFixed(1),
      avgRichness: (totalRichness / posts.length).toFixed(1),
      avgSweetness: (totalSweetness / posts.length).toFixed(1),
    };
  }

  if (posts.length === 0) return null;

  const tasteStats = getTasteStats(posts);
  if (!tasteStats) return null;

  const tasteData = [
    {
      label: "苦味",
      value: tasteStats.avgBitterness,
      color: "bitter",
    },
    {
      label: "濃厚",
      value: tasteStats.avgRichness,
      color: "rich",
    },
    {
      label: "甘味",
      value: tasteStats.avgSweetness,
      color: "sweet",
    },
  ];

  return (
    <div className={styles.tasteProfile}>
      <div className={styles.statsGrid}>
        {tasteData.map((taste) => (
          <div
            key={taste.label}
            className={`${styles.tasteStat} ${styles[taste.color]}`}
          >
            <div className={styles.content}>
              <span className={styles.label}>{taste.label}</span>
              <div className={styles.valueContainer}>
                <span className={styles.value}>{taste.value}</span>
                <span className={styles.scale}>/10</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${(parseFloat(taste.value) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
