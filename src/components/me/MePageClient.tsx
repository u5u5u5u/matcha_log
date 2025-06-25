"use client";
import React from "react";
import Image from "next/image";
import styles from "./MePage.module.scss";
import Modal from "../util/Modal";
import UserList from "./UserList";

type Post = {
  id: string;
  title: string;
  category: string;
  bitterness: number; // 苦さ 1-10
  richness: number; // 濃さ 1-10
  sweetness: number; // 甘さ 1-10
  images: { url: string }[];
  shop?: { name?: string | null };
};

type UserSimple = { id: string; name: string | null; iconUrl: string | null };

type Props = {
  posts: Post[];
  likedPosts: Post[];
  userName: string;
  userEmail: string;
  userIconUrl?: string;
  followingList: UserSimple[];
  followerList: UserSimple[];
};

export default function PageClient({
  posts,
  likedPosts,
  userName,
  userIconUrl,
  followingList,
  followerList,
}: Props) {
  const [followingModalOpen, setFollowingModalOpen] = React.useState(false);
  const [followersModalOpen, setFollowersModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"posts" | "liked">("posts");
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

  // 投稿数に応じた称号を取得する関数
  function getUserTitle(postCount: number): string {
    if (postCount >= 100) return "抹茶マスター";
    if (postCount >= 50) return "抹茶エキスパート";
    if (postCount >= 20) return "抹茶愛好家";
    if (postCount >= 10) return "抹茶ファン";
    if (postCount >= 5) return "抹茶初心者";
    return "抹茶新人";
  }

  // 次の称号までの投稿数を取得する関数
  function getNextTitleInfo(
    postCount: number
  ): { nextTitle: string; postsNeeded: number } | null {
    if (postCount < 5)
      return { nextTitle: "抹茶初心者", postsNeeded: 5 - postCount };
    if (postCount < 10)
      return { nextTitle: "抹茶ファン", postsNeeded: 10 - postCount };
    if (postCount < 20)
      return { nextTitle: "抹茶愛好家", postsNeeded: 20 - postCount };
    if (postCount < 50)
      return { nextTitle: "抹茶エキスパート", postsNeeded: 50 - postCount };
    if (postCount < 100)
      return { nextTitle: "抹茶マスター", postsNeeded: 100 - postCount };
    return null; // 最高称号に到達
  }

  // 称号に応じたスタイルクラスを取得する関数
  function getTitleClass(postCount: number): string {
    if (postCount >= 100) return styles.titleMaster;
    if (postCount >= 50) return styles.titleExpert;
    if (postCount >= 20) return styles.titleLover;
    if (postCount >= 10) return styles.titleFan;
    if (postCount >= 5) return styles.titleBeginner;
    return styles.titleNewbie;
  }

  // 味覚パラメータの平均値から称号を取得する関数
  function getTasteTitle(posts: Post[]): string {
    if (posts.length === 0) return "";

    const totalBitterness = posts.reduce(
      (sum, post) => sum + post.bitterness,
      0
    );
    const totalRichness = posts.reduce((sum, post) => sum + post.richness, 0);
    const totalSweetness = posts.reduce((sum, post) => sum + post.sweetness, 0);

    const avgBitterness = totalBitterness / posts.length;
    const avgRichness = totalRichness / posts.length;
    const avgSweetness = totalSweetness / posts.length;

    // 味覚のバランスをチェック（3つの値が近い場合）
    const maxDiff =
      Math.max(avgBitterness, avgRichness, avgSweetness) -
      Math.min(avgBitterness, avgRichness, avgSweetness);

    if (maxDiff <= 1.5) {
      // バランス型称号
      const totalAvg = (avgBitterness + avgRichness + avgSweetness) / 3;
      if (totalAvg >= 8) return "完璧なバランサー";
      if (totalAvg >= 6) return "バランスマスター";
      if (totalAvg >= 4) return "バランス探求者";
      return "味覚の調和者";
    }

    // 最も高い平均値に基づいて称号を決定
    if (avgBitterness >= avgRichness && avgBitterness >= avgSweetness) {
      if (avgBitterness >= 8) return "苦味の求道者";
      if (avgBitterness >= 7) return "苦味マスター";
      if (avgBitterness >= 5) return "苦味愛好家";
      return "苦味探求者";
    } else if (avgRichness >= avgSweetness) {
      if (avgRichness >= 8) return "濃厚の極み";
      if (avgRichness >= 7) return "濃厚マスター";
      if (avgRichness >= 5) return "濃厚愛好家";
      return "濃厚探求者";
    } else {
      if (avgSweetness >= 8) return "甘味の天使";
      if (avgSweetness >= 7) return "甘味マスター";
      if (avgSweetness >= 5) return "甘味愛好家";
      return "甘味探求者";
    }
  }

  // 味覚称号のスタイルクラスを取得する関数
  function getTasteTitleClass(posts: Post[]): string {
    if (posts.length === 0) return "";

    const totalBitterness = posts.reduce(
      (sum, post) => sum + post.bitterness,
      0
    );
    const totalRichness = posts.reduce((sum, post) => sum + post.richness, 0);
    const totalSweetness = posts.reduce((sum, post) => sum + post.sweetness, 0);

    const avgBitterness = totalBitterness / posts.length;
    const avgRichness = totalRichness / posts.length;
    const avgSweetness = totalSweetness / posts.length;

    // バランス型の判定
    const maxDiff =
      Math.max(avgBitterness, avgRichness, avgSweetness) -
      Math.min(avgBitterness, avgRichness, avgSweetness);

    if (maxDiff <= 1.5) {
      return styles.tasteTitleBalance;
    }

    if (avgBitterness >= avgRichness && avgBitterness >= avgSweetness) {
      return styles.tasteTitleBitter;
    } else if (avgRichness >= avgSweetness) {
      return styles.tasteTitleRich;
    } else {
      return styles.tasteTitleSweet;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/post/${id}/delete`, { method: "POST" });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("削除に失敗しました");
    }
    setActionModalOpen(false);
    setSelectedPost(null);
  }

  function handlePostClick(post: Post) {
    if (activeTab === "posts") {
      setSelectedPost(post);
      setActionModalOpen(true);
    } else {
      // いいねした投稿の場合は詳細ページに遷移
      window.location.href = `/post/${post.id}`;
    }
  }

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

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <Image
            src={userIconUrl || "/file.svg"}
            alt="icon"
            width={60}
            height={60}
            className={styles.iconPreview}
          />
          <div className={styles.userNameContainer}>
            <p className={styles.userName}>{userName}</p>
            <div className={styles.titleContainer}>
              <p
                className={`${styles.userTitle} ${getTitleClass(posts.length)}`}
              >
                {getUserTitle(posts.length)}
              </p>
              {posts.length > 0 && getTasteTitle(posts) && (
                <p
                  className={`${styles.tasteTitle} ${getTasteTitleClass(
                    posts
                  )}`}
                >
                  {getTasteTitle(posts)}
                </p>
              )}
            </div>
            {getNextTitleInfo(posts.length) ? (
              <p className={styles.nextTitleInfo}>
                次の称号「{getNextTitleInfo(posts.length)!.nextTitle}」まであと
                {getNextTitleInfo(posts.length)!.postsNeeded}投稿
              </p>
            ) : (
              <p className={styles.masterTitleInfo}>
                🎉 最高称号に到達しました！
              </p>
            )}
          </div>
        </div>
        <div className={styles.userStats}>
          <div className={styles.countButton}>
            <p>投稿</p>
            <p>{posts.length}</p>
          </div>
          <button
            className={styles.countButton}
            onClick={() => setFollowingModalOpen(true)}
          >
            <p>フォロー</p>
            <p>{followingList.length}</p>
          </button>
          <button
            className={styles.countButton}
            onClick={() => setFollowersModalOpen(true)}
          >
            <p>フォロワー</p>
            <p>{followerList.length}</p>
          </button>
        </div>

        {/* 味覚統計情報 */}
        {posts.length > 0 &&
          (() => {
            const tasteStats = getTasteStats(posts);
            if (!tasteStats) return null;

            return (
              <div className={styles.tasteStats}>
                <h3 className={styles.tasteStatsTitle}>味覚プロフィール</h3>
                <div className={styles.tasteStatsGrid}>
                  <div
                    className={`${styles.tasteStat} ${
                      parseFloat(tasteStats.avgBitterness) >= 7
                        ? styles.highValue
                        : ""
                    }`}
                  >
                    <span className={styles.tasteStatLabel}>苦味</span>
                    <span className={styles.tasteStatValue}>
                      {tasteStats.avgBitterness}
                    </span>
                  </div>
                  <div
                    className={`${styles.tasteStat} ${
                      parseFloat(tasteStats.avgRichness) >= 7
                        ? styles.highValue
                        : ""
                    }`}
                  >
                    <span className={styles.tasteStatLabel}>濃厚</span>
                    <span className={styles.tasteStatValue}>
                      {tasteStats.avgRichness}
                    </span>
                  </div>
                  <div
                    className={`${styles.tasteStat} ${
                      parseFloat(tasteStats.avgSweetness) >= 7
                        ? styles.highValue
                        : ""
                    }`}
                  >
                    <span className={styles.tasteStatLabel}>甘味</span>
                    <span className={styles.tasteStatValue}>
                      {tasteStats.avgSweetness}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "posts" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          投稿 ({posts.length})
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "liked" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("liked")}
        >
          いいね ({likedPosts.length})
        </button>
      </div>

      {/* フォロー中のユーザーモーダル */}
      <Modal
        isOpen={followingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
        title={`フォロー中 (${followingList.length})`}
      >
        <UserList
          users={followingList}
          emptyMessage="フォローしているユーザーはいません"
        />
      </Modal>

      {/* フォロワーモーダル */}
      <Modal
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        title={`フォロワー (${followerList.length})`}
      >
        <UserList users={followerList} emptyMessage="フォロワーはいません" />
      </Modal>

      {/* 投稿アクションモーダル */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedPost(null);
        }}
        title={selectedPost?.title || ""}
      >
        {selectedPost && (
          <div className={styles.actionModal}>
            <div className={styles.postPreview}>
              {selectedPost.images.length > 0 && (
                <Image
                  src={`/api/image-proxy?url=${encodeURIComponent(
                    selectedPost.images[0].url
                  )}`}
                  alt={selectedPost.title}
                  width={200}
                  height={200}
                  className={styles.previewImage}
                  onError={(e) => {
                    console.error(
                      "Modal image failed to load:",
                      selectedPost.images[0].url
                    );
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className={styles.postInfo}>
                <p>
                  <strong>タイトル:</strong> {selectedPost.title}
                </p>
                <p>
                  <strong>カテゴリ:</strong>{" "}
                  {selectedPost.category === "SWEET" ? "スイーツ" : "ドリンク"}
                </p>
                <p>
                  <strong>店舗:</strong> {selectedPost.shop?.name || "未登録"}
                </p>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                className={styles.editButton}
                onClick={() => {
                  window.location.href = `/post/${selectedPost.id}/edit`;
                }}
              >
                編集
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(selectedPost.id)}
              >
                削除
              </button>
            </div>
          </div>
        )}
      </Modal>
      <div>
        {activeTab === "posts" ? (
          posts.length === 0 ? (
            <div>まだ投稿がありません。</div>
          ) : (
            <div className={styles.gridContainer}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={styles.gridItem}
                  onClick={() => handlePostClick(post)}
                >
                  {post.images.length > 0 ? (
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(
                        post.images[0].url
                      )}`}
                      alt={post.title}
                      width={200}
                      height={200}
                      className={styles.gridImage}
                      onError={(e) => {
                        console.error(
                          "Image failed to load:",
                          post.images[0].url
                        );
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : (
                    <div className={styles.noImagePlaceholder}>画像なし</div>
                  )}
                  <div className={`${styles.noImagePlaceholder} hidden`}>
                    画像読み込みエラー
                  </div>
                </div>
              ))}
            </div>
          )
        ) : likedPosts.length === 0 ? (
          <div>まだいいねした投稿がありません。</div>
        ) : (
          <div className={styles.gridContainer}>
            {likedPosts.map((post) => (
              <div
                key={post.id}
                className={styles.gridItem}
                onClick={() => handlePostClick(post)}
              >
                {post.images.length > 0 ? (
                  <Image
                    src={`/api/image-proxy?url=${encodeURIComponent(
                      post.images[0].url
                    )}`}
                    alt={post.title}
                    width={200}
                    height={200}
                    className={styles.gridImage}
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        post.images[0].url
                      );
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                ) : (
                  <div className={styles.noImagePlaceholder}>画像なし</div>
                )}
                <div className={`${styles.noImagePlaceholder} hidden`}>
                  画像読み込みエラー
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
