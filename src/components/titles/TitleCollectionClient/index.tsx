"use client";
import { useEffect, useState } from "react";
import Modal from "../../util/Modal";
import TitleCard from "../TitleCard";
import styles from "./index.module.scss";

type Title = {
  id: string;
  name: string;
  description: string | null;
  type: string;
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
  TASTE_BITTER: "苦さ",
  TASTE_RICH: "濃さ",
  TASTE_SWEET: "甘さ",
};

export default function TitleCollectionClient() {
  const [titleData, setTitleData] = useState<TitleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleTitleClick = (title: Title) => {
    if (!title.isUnlocked) return;
    setSelectedTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTitle(null);
  };

  // 全ての称号を1つの配列にまとめる
  const allTitles = titleData
    ? Object.values(titleData.titlesByCategory).flat()
    : [];

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

      <div className={styles.allTitlesGrid}>
        {allTitles.map((title) => (
          <TitleCard
            key={title.id}
            title={title}
            categoryNames={categoryNames}
            onClick={handleTitleClick}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="">
        {selectedTitle && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedTitle.name}</h2>
              <span className={styles.modalCategory}>
                {
                  categoryNames[
                    selectedTitle.type as keyof typeof categoryNames
                  ]
                }
              </span>
            </div>
            <p className={styles.modalDescription}>
              {selectedTitle.description}
            </p>
            <div className={styles.modalActions}>
              {selectedTitle.isActive ? (
                <button
                  className={styles.deactivateButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTitle(null);
                    closeModal();
                  }}
                >
                  非表示にする
                </button>
              ) : (
                <button
                  className={styles.activateButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTitle(selectedTitle.id);
                    closeModal();
                  }}
                >
                  表示する
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
