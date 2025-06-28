import React from "react";
import styles from "./index.module.scss";
import CircularProgress from "../../util/CircularProgress";

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
      label: "苦さ",
      value: tasteStats.avgBitterness,
      color: "bitter",
    },
    {
      label: "濃さ",
      value: tasteStats.avgRichness,
      color: "rich",
    },
    {
      label: "甘さ",
      value: tasteStats.avgSweetness,
      color: "sweet",
    },
  ];

  return (
    <div className={styles.tasteProfile}>
      <div className={styles.statsRow}>
        {tasteData.map((taste) => (
          <React.Fragment key={taste.label}>
            <CircularProgress
              value={parseFloat(taste.value)}
              max={10}
              size={80}
              strokeWidth={8}
              label={taste.label}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
