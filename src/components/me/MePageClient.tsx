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
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);

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
