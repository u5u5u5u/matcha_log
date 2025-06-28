"use client";
import Image from "next/image";
import React from "react";
import TasteProfile from "../me/TasteProfile";
import TitleDisplay from "../me/TitleDisplay";
import UserList from "../me/UserList";
import CategoryTag from "../posts/CategoryTag";
import ImageGallery from "../posts/ImageGallery";
import Modal from "../util/Modal";
import CircularProgress from "../util/CircularProgress";
import FollowButtonWrapper from "./FollowButtonWrapper";
import styles from "./UserProfile.module.scss";

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

type UserSimple = { id: string; name: string | null; iconUrl: string | null };

type Props = {
  user: {
    id: string;
    name: string | null;
    email: string;
    iconUrl: string | null;
    activeTitle: { id: string; name: string } | null;
  };
  posts: Post[];
  followingList: UserSimple[];
  followerList: UserSimple[];
  initialIsFollowing: boolean;
  showFollowButton: boolean;
};

export default function UserProfileClient({
  user,
  posts,
  followingList,
  followerList,
  initialIsFollowing,
  showFollowButton,
}: Props) {
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [followingModalOpen, setFollowingModalOpen] = React.useState(false);
  const [followersModalOpen, setFollowersModalOpen] = React.useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setActionModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <Image
            src={user.iconUrl || "/file.svg"}
            alt="icon"
            width={60}
            height={60}
            className={styles.iconPreview}
          />
          <div className={styles.userNameContainer}>
            <div className={styles.userTitle}>
              <TitleDisplay activeTitle={user.activeTitle} />
            </div>
            <div className={styles.userName}>
              <p>{user.name}</p>
            </div>
            {showFollowButton && (
              <FollowButtonWrapper
                userId={user.id}
                initialIsFollowing={initialIsFollowing}
              />
            )}
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

      {/* 投稿セクション */}
      <div className={styles.tabNavigation}>
        <div className={`${styles.tabButton} ${styles.activeTab}`}>
          投稿 ({posts.length})
        </div>
      </div>

      {/* 投稿グリッド */}
      {posts.length === 0 ? (
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
                    console.error("Image failed to load:", post.images[0].url);
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

      {/* 投稿詳細モーダル */}
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
          </div>
        )}
      </Modal>
    </div>
  );
}
