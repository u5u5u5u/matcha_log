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

export default function MePageClient({
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

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/post/${id}/delete`, { method: "POST" });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>マイページ</h2>
      <div className={styles.welcome}>
        <Image
          src={userIconUrl || "/file.svg"}
          alt="icon"
          width={40}
          height={40}
          className={styles.iconPreview}
        />
        ようこそ、{userName} さん
        <span style={{ flex: 1 }} />
      </div>
      <div style={{ display: "flex", gap: 24, margin: "12px 0" }}>
        <button
          className={styles.countButton}
          onClick={() => setFollowingModalOpen(true)}
        >
          フォロー <b>{followingList.length}</b>
        </button>
        <button
          className={styles.countButton}
          onClick={() => setFollowersModalOpen(true)}
        >
          フォロワー <b>{followerList.length}</b>
        </button>
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
      <div>
        {activeTab === "posts" ? (
          posts.length === 0 ? (
            <div>まだ投稿がありません。</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.card}>
                <div className={styles.cardTitle}>{post.title}</div>
                <div className={styles.cardCategory}>
                  {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
                </div>
                <div className={styles.cardImage}>
                  {post.images.length > 0 && (
                    <Image
                      src={post.images[0].url}
                      alt="thumb"
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  )}
                </div>
                <div className={styles.cardShop}>
                  店舗: {post.shop?.name || "未登録"}
                </div>
                <div className={styles.cardActions}>
                  <a href={`/post/${post.id}/edit`} className={styles.editLink}>
                    編集
                  </a>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(post.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )
        ) : likedPosts.length === 0 ? (
          <div>まだいいねした投稿がありません。</div>
        ) : (
          likedPosts.map((post) => (
            <div key={post.id} className={styles.card}>
              <div className={styles.cardTitle}>{post.title}</div>
              <div className={styles.cardCategory}>
                {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
              </div>
              <div className={styles.cardImage}>
                {post.images.length > 0 && (
                  <Image
                    src={post.images[0].url}
                    alt="thumb"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                )}
              </div>
              <div className={styles.cardShop}>
                店舗: {post.shop?.name || "未登録"}
              </div>
              <div className={styles.cardActions}>
                <a href={`/post/${post.id}`} className={styles.viewLink}>
                  詳細
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
