"use client";
import React from "react";
import Image from "next/image";
import styles from "./MePage.module.scss";
import LogoutButton from "@/components/ui/LogoutButton";
import Link from "next/link";

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
  userName: string;
  userIconUrl?: string;
  followingList: UserSimple[];
  followerList: UserSimple[];
};

export default function MePageClient({
  posts,
  userName,
  userIconUrl,
  followingList,
  followerList,
}: Props) {
  const [showFollowing, setShowFollowing] = React.useState(false);
  const [showFollowers, setShowFollowers] = React.useState(false);

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
        <LogoutButton />
      </div>
      <div style={{ display: "flex", gap: 24, margin: "12px 0" }}>
        <button
          className={styles.countButton}
          onClick={() => setShowFollowing((v) => !v)}
        >
          フォロー <b>{followingList.length}</b>
        </button>
        <button
          className={styles.countButton}
          onClick={() => setShowFollowers((v) => !v)}
        >
          フォロワー <b>{followerList.length}</b>
        </button>
      </div>
      {showFollowing && (
        <div className={styles.userListModal}>
          <h4>フォロー中ユーザー</h4>
          <ul>
            {followingList.length === 0 ? (
              <li>なし</li>
            ) : (
              followingList.map((u) => (
                <li key={u.id} className={styles.userListItem}>
                  <Link href={`/user/${u.id}`} className={styles.userLink}>
                    <Image
                      src={u.iconUrl || "/file.svg"}
                      alt="icon"
                      width={28}
                      height={28}
                      style={{ borderRadius: 14, marginRight: 8 }}
                    />
                    {u.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      {showFollowers && (
        <div className={styles.userListModal}>
          <h4>フォロワー</h4>
          <ul>
            {followerList.length === 0 ? (
              <li>なし</li>
            ) : (
              followerList.map((u) => (
                <li key={u.id} className={styles.userListItem}>
                  <Link href={`/user/${u.id}`} className={styles.userLink}>
                    <Image
                      src={u.iconUrl || "/file.svg"}
                      alt="icon"
                      width={28}
                      height={28}
                      style={{ borderRadius: 14, marginRight: 8 }}
                    />
                    {u.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <div>
        {posts.length === 0 ? (
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
        )}
      </div>
    </div>
  );
}
