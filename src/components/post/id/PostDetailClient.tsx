"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import LikeButton from "./LikeButton";

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
  likeCount: number;
};

export default function PostDetailClient({
  post,
  likeCount,
}: PostDetailClientProps) {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 24 }}>
        {post.title}
      </h2>
      <div style={{ marginBottom: 8, color: "#666" }}>
        {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
      </div>
      <div
        style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {post.images.length > 0 ? (
          post.images.map((img) => (
            <div
              key={img.id}
              style={{
                width: "120px",
                height: "120px",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <Image
                src={img.url}
                alt="thumb"
                width={120}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          ))
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              background: "#eee",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        )}
      </div>
      <div>
        濃さ: {post.richness} / 苦さ: {post.bitterness} / 甘さ: {post.sweetness}
      </div>
      <div style={{ margin: "12px 0" }}>
        コメント: {post.comment || "（なし）"}
      </div>
      <div>店舗: {post.shop?.name || "未登録"}</div>
      <div style={{ margin: "12px 0", color: "#888" }}>
        投稿者: {post.user?.name || post.user?.email}
      </div>
      {post.shop?.lat && post.shop?.lng && (
        <MapView
          lat={post.shop.lat}
          lng={post.shop.lng}
          shop={post.shop.name}
        />
      )}
      <div style={{ marginTop: 24 }}>
        <a
          href={`/post/${post.id}/edit`}
          style={{ color: "#1e8e3e", marginRight: 16 }}
        >
          編集
        </a>
      </div>
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <LikeButton postId={post.id} likeCount={likeCount} />
      </div>
    </div>
  );
}
