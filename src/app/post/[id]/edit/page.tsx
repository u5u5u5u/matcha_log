"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Post } from "@/types/post";

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPost(data.post))
      .catch(() => setError("投稿が見つかりません"));
  }, [id]);

  if (!post)
    return (
      <div style={{ textAlign: "center", margin: 40 }}>
        {error || "読み込み中..."}
      </div>
    );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch(`/api/post/${id}/edit`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "保存に失敗しました");
      } else {
        router.push(`/post/${id}`);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 24 }}>
        投稿編集
      </h2>
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>タイトル</label>
          <input
            name="title"
            defaultValue={post.title}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: 8,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>カテゴリ</label>
          <select name="category" defaultValue={post.category}>
            <option value="SWEET">スイーツ</option>
            <option value="DRINK">ドリンク</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>濃さ</label>
          <input
            name="richness"
            type="number"
            min={1}
            max={10}
            defaultValue={post.richness}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>苦さ</label>
          <input
            name="bitterness"
            type="number"
            min={1}
            max={10}
            defaultValue={post.bitterness}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>甘さ</label>
          <input
            name="sweetness"
            type="number"
            min={1}
            max={10}
            defaultValue={post.sweetness}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>コメント</label>
          <textarea
            name="comment"
            defaultValue={post.comment || ""}
            rows={3}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: 8,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>店舗名</label>
          <input name="shop" defaultValue={post.shop?.name || ""} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>店舗緯度</label>
          <input
            name="shopLat"
            type="text"
            defaultValue={post.shop?.lat ?? ""}
            placeholder="例: 35.6895"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>店舗経度</label>
          <input
            name="shopLng"
            type="text"
            defaultValue={post.shop?.lng ?? ""}
            placeholder="例: 139.6917"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>写真（編集未対応）</label>
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
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#1e8e3e",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: 12,
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          disabled={loading}
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
