"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./PostDetailClient.module.scss";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type PostDetailClientProps = {
  post: {
    id: string;
    title: string;
    category: string;
    richness: number;
    bitterness: number;
    sweetness: number;
    comment: string | null;
    images: { id: string; url: string }[];
    shop?: { name: string; lat: number | null; lng: number | null } | null;
    user?: { name: string | null; email: string | null } | null;
  };
};

export default function PostDetailClient({ post }: PostDetailClientProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post.title}</h2>
      <div className={styles.category}>
        {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
      </div>
      <div className={styles.images}>
        {post.images.length > 0 ? (
          post.images.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              alt="thumb"
              width={120}
              height={120}
              className={styles.image}
            />
          ))
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.score}>
        濃さ: {post.richness} / 苦さ: {post.bitterness} / 甘さ: {post.sweetness}
      </div>
      <div className={styles.comment}>
        コメント: {post.comment || "（なし）"}
      </div>
      <div className={styles.shop}>店舗: {post.shop?.name || "未登録"}</div>
      <div className={styles.user}>
        投稿者: {post.user?.name || post.user?.email}
      </div>
      {post.shop?.lat && post.shop?.lng && (
        <MapView
          lat={post.shop.lat}
          lng={post.shop.lng}
          shop={post.shop.name}
        />
      )}
      <div className={styles.edit}>
        <a href={`/post/${post.id}/edit`} className={styles.editLink}>
          編集
        </a>
      </div>
    </div>
  );
}
