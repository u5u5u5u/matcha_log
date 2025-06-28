"use client";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

type Title = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  rarity: string;
  isUnlocked: boolean;
  isActive: boolean;
};

type TitleData = {
  titlesByCategory: Record<string, Title[]>;
  activeTitle: { id: string; name: string } | null;
  totalUnlocked: number;
  totalTitles: number;
};

const categoryNames = {
  POST_COUNT: "投稿数",
  TASTE_BITTER: "苦味",
  TASTE_RICH: "濃厚",
  TASTE_SWEET: "甘味",
  TASTE_BALANCE: "バランス",
};

const rarityNames = {
  COMMON: "コモン",
  RARE: "レア",
  EPIC: "エピック",
  LEGENDARY: "レジェンダリー",
};

export default function TitleCollectionClient() {
  const [titleData, setTitleData] = useState<TitleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await fetch("/api/titles");
      if (response.ok) {
        const data = await response.json();
        setTitleData(data);
      }
    } catch (error) {
      console.error("Failed to fetch titles:", error);
    } finally {
      setLoading(false);
    }
  };

  const setActiveTitle = async (titleId: string | null) => {
    try {
      const response = await fetch("/api/titles/set-active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titleId }),
      });

      if (response.ok) {
        await fetchTitles(); // データを再取得
      }
    } catch (error) {
      console.error("Failed to set active title:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (!titleData) {
    return <div className={styles.error}>データの取得に失敗しました</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>称号コレクション</h1>
        <div className={styles.stats}>
          <span className={styles.progress}>
            {titleData.totalUnlocked} / {titleData.totalTitles} 獲得
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${
                  (titleData.totalUnlocked / titleData.totalTitles) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.activeTitle}>
        <h2>現在の称号</h2>
        <div className={styles.activeTitleDisplay}>
          {titleData.activeTitle ? (
            <span className={styles.activeTitleName}>
              {titleData.activeTitle.name}
            </span>
          ) : (
            <span className={styles.noActiveTitle}>
              称号が設定されていません
            </span>
          )}
        </div>
      </div>

      {Object.entries(titleData.titlesByCategory).map(([category, titles]) => (
        <div key={category} className={styles.category}>
          <h2 className={styles.categoryTitle}>
            {categoryNames[category as keyof typeof categoryNames] || category}
          </h2>
          <div className={styles.titleGrid}>
            {titles.map((title) => (
              <div
                key={title.id}
                className={`${styles.titleCard} ${
                  !title.isUnlocked ? styles.locked : ""
                } ${title.isActive ? styles.active : ""} ${
                  styles[`rarity${title.rarity}`]
                }`}
              >
                <div className={styles.titleHeader}>
                  <span className={styles.titleName}>
                    {title.isUnlocked ? title.name : "???"}
                  </span>
                  <span
                    className={`${styles.rarity} ${
                      styles[`rarity${title.rarity}`]
                    }`}
                  >
                    {rarityNames[title.rarity as keyof typeof rarityNames]}
                  </span>
                </div>
                <p className={styles.titleDescription}>
                  {title.isUnlocked
                    ? title.description
                    : "称号を獲得すると詳細が表示されます"}
                </p>
                {title.isUnlocked && (
                  <div className={styles.titleActions}>
                    {title.isActive ? (
                      <button
                        className={styles.deactivateButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTitle(null);
                        }}
                      >
                        非表示にする
                      </button>
                    ) : (
                      <button
                        className={styles.activateButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTitle(title.id);
                        }}
                      >
                        表示する
                      </button>
                    )}
                  </div>
                )}
                {!title.isUnlocked && <div className={styles.lockIcon}>🔒</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
