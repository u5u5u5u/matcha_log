"use client";
import { SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeicImage from "../../util/HeicImage";
import CategoryTag from "../../posts/CategoryTag";
import ImageGallery from "../../posts/ImageGallery";
import CircularProgress from "../../util/CircularProgress";
import Modal from "../../util/Modal";
import styles from "./index.module.scss";
import TasteProfile from "../TasteProfile";
import TitleCollectionButton from "../TitleCollectionButton";
import TitleDisplay from "../TitleDisplay";
import UserList from "../UserList";

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
  activeTitle: { id: string; name: string } | null;
  followingList: UserSimple[];
  followerList: UserSimple[];
};

export default function PageClient({
  posts,
  likedPosts,
  userName,
  userIconUrl,
  activeTitle,
  followingList,
  followerList,
}: Props) {
  const [followingModalOpen, setFollowingModalOpen] = React.useState(false);
  const [followersModalOpen, setFollowersModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"posts" | "liked">("posts");
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [likedPostModalOpen, setLikedPostModalOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] =
    React.useState(false);

  function showDeleteConfirm() {
    setDeleteConfirmModalOpen(true);
  }

  async function handleDelete() {
    if (!selectedPost) return;

    const res = await fetch(`/api/post/${selectedPost.id}/delete`, {
      method: "POST",
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("削除に失敗しました");
    }
    setDeleteConfirmModalOpen(false);
    setActionModalOpen(false);
    setSelectedPost(null);
  }

  function handlePostClick(post: Post) {
    setSelectedPost(post);
    if (activeTab === "posts") {
      setActionModalOpen(true);
    } else {
      // いいねした投稿の場合は詳細モーダルを表示
      setLikedPostModalOpen(true);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <HeicImage
            src={userIconUrl || "/file.svg"}
            alt="icon"
            width={60}
            height={60}
            className={styles.iconPreview}
          />
          <div className={styles.userNameContainer}>
            <div className={styles.userTitle}>
              <TitleDisplay activeTitle={activeTitle} />
              <TitleCollectionButton activeTitle={activeTitle} />
            </div>
            <div className={styles.userName}>
              <p>{userName}</p>
              <div>
                <Link href="/me/edit">
                  <SquarePen />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.userStats}>
          <button
            className={styles.countButton}
            onClick={() => setFollowingModalOpen(true)}
          >
            <p className={styles.statsText}>フォロー</p>
            <p>{followingList.length}</p>
          </button>
          <button
            className={styles.countButton}
            onClick={() => setFollowersModalOpen(true)}
          >
            <p className={styles.statsText}>フォロワー</p>
            <p>{followerList.length}</p>
          </button>
        </div>

        {/* 味覚プロフィール */}
        <TasteProfile posts={posts} />
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
              {selectedPost.images.length > 0 ? (
                <ImageGallery
                  images={selectedPost.images}
                  alt={selectedPost.title}
                  width={200}
                  height={200}
                  className={styles.previewImage}
                />
              ) : (
                <Image
                  src="/no-image.svg"
                  alt="image load failed"
                  width={200}
                  height={200}
                  className={styles.noImage}
                />
              )}
              <div className={styles.postInfo}>
                <div className={styles.postCardName}>{selectedPost.title}</div>
                <CategoryTag category={selectedPost.category} />
                <div className={styles.postCardShop}>
                  店舗：{selectedPost.shop?.name || "未登録"}
                </div>
                <div className={styles.tasteMetrics}>
                  <CircularProgress
                    value={selectedPost.bitterness}
                    label="苦さ"
                    size={70}
                  />
                  <CircularProgress
                    value={selectedPost.richness}
                    label="濃さ"
                    size={70}
                  />
                  <CircularProgress
                    value={selectedPost.sweetness}
                    label="甘さ"
                    size={70}
                  />
                </div>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                className={styles.editButton}
                onClick={() => {
                  window.location.href = `/post/${selectedPost.id}/edit`;
                }}
              >
                <SquarePen />
                編集
              </button>
              <button
                className={styles.deleteButton}
                onClick={showDeleteConfirm}
              >
                <Trash2 />
                削除
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* いいねした投稿詳細モーダル */}
      <Modal
        isOpen={likedPostModalOpen}
        onClose={() => {
          setLikedPostModalOpen(false);
          setSelectedPost(null);
        }}
        title={selectedPost?.title || ""}
      >
        {selectedPost && (
          <div className={styles.actionModal}>
            <div className={styles.postPreview}>
              {selectedPost.images.length > 0 ? (
                <ImageGallery
                  images={selectedPost.images}
                  alt={selectedPost.title}
                  width={200}
                  height={200}
                  className={styles.previewImage}
                />
              ) : (
                <Image
                  src="/no-image.svg"
                  alt="image load failed"
                  width={200}
                  height={200}
                  className={styles.noImage}
                />
              )}
              <div className={styles.postInfo}>
                <div className={styles.postCardName}>{selectedPost.title}</div>
                <CategoryTag category={selectedPost.category} />
                <div className={styles.postCardShop}>
                  店舗：{selectedPost.shop?.name || "未登録"}
                </div>
                <div className={styles.tasteMetrics}>
                  <CircularProgress
                    value={selectedPost.bitterness}
                    label="苦さ"
                    size={70}
                  />
                  <CircularProgress
                    value={selectedPost.richness}
                    label="濃さ"
                    size={70}
                  />
                  <CircularProgress
                    value={selectedPost.sweetness}
                    label="甘さ"
                    size={70}
                  />
                </div>
              </div>
            </div>
            {/* 編集・削除ボタンは表示しない */}
          </div>
        )}
      </Modal>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        title="投稿の削除"
      >
        <div className={styles.confirmModal}>
          <p>本当に削除しますか？</p>
          <div className={styles.confirmButtons}>
            <button
              className={styles.confirmDeleteButton}
              onClick={handleDelete}
            >
              削除
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setDeleteConfirmModalOpen(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
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
