"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/util/button";

import ProfileEditForm from "@/components/me/ProfileEditForm";
import styles from "./MePage.module.scss";

type Post = {
  id: string;
  title: string;
  category: string;
  images: { url: string }[];
  shop?: { name?: string | null };
};

type Props = {
  posts: Post[];
  userName: string;
  userEmail?: string;
  userIconUrl?: string;
};

export default function MePageClient({
  posts,
  userName: initialUserName,
  userEmail: initialUserEmail,
  userIconUrl: initialUserIconUrl,
}: Props) {
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userName, setUserName] = React.useState(initialUserName);
  const [userEmail, setUserEmail] = React.useState(initialUserEmail || "");
  const [userIconUrl, setUserIconUrl] = React.useState(initialUserIconUrl);

  async function handleProfileSave(data: {
    name: string;
    email: string;
    iconUrl?: string;
  }) {
    setLoading(true);
    try {
      const res = await fetch("/api/me/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setUserName(data.name);
      setUserEmail(data.email);
      setUserIconUrl(data.iconUrl);
      setEditing(false);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setLoading(false);
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
        <Button
          type="button"
          onClick={() => setEditing(true)}
          style={{ marginLeft: 8 }}
        >
          プロフィール編集
        </Button>
      </div>
      {editing && (
        <ProfileEditForm
          initialName={userName}
          initialEmail={userEmail}
          initialIconUrl={userIconUrl || ""}
          onSave={handleProfileSave}
          loading={loading}
        />
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
