"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

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
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 24 }}>
        {post.title}
      </h2>
      <div style={{ marginBottom: 8, color: "#666" }}>
        {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
      </div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {post.images.length > 0 ? (
          post.images.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              alt="thumb"
              width={120}
              height={120}
              style={{ objectFit: "cover", borderRadius: 12 }}
            />
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
    </div>
  );
}
