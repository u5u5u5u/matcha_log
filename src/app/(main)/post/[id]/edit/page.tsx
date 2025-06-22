"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/types/post";
import dynamic from "next/dynamic";

const UploadImage = dynamic(
  () => import("@/components/post/edit/PostUploadImage"),
  { ssr: false }
);

export default function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setPost(data.post);
        setImageUrls(
          data.post.images?.map((img: { url: string }) => img.url) || []
        );
      })
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
      // 新しい画像ファイルがある場合は先にアップロード
      let finalImageUrls: string[] = [];

      // 既存の画像URLs（blob:で始まらないもの）
      const existingImageUrls = imageUrls.filter(
        (url) => !url.startsWith("blob:")
      );

      // 新しい画像ファイルをアップロード
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/blob/post-upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("画像のアップロードに失敗しました");
          }

          const data = await response.json();
          return data.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...existingImageUrls, ...uploadedUrls];
      } else {
        finalImageUrls = existingImageUrls;
      }

      // 最終的な画像URLを追加
      finalImageUrls.forEach((url) => {
        if (url) {
          fd.append("images[]", url);
        }
      });

      const res = await fetch(`/api/post/${id}/edit`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "保存に失敗しました");
      } else {
        router.push("/posts");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = (files: File[], urls: string[]) => {
    setImageFiles(files);
    setImageUrls(urls);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 24 }}>
        投稿編集
      </h2>
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
          >
            タイトル
          </label>
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
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
          >
            カテゴリ
          </label>
          <select
            name="category"
            defaultValue={post.category}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: 8,
            }}
          >
            <option value="SWEET">スイーツ</option>
            <option value="DRINK">ドリンク</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              濃さ
            </label>
            <input
              name="richness"
              type="number"
              min={1}
              max={10}
              defaultValue={post.richness}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: 8,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              苦さ
            </label>
            <input
              name="bitterness"
              type="number"
              min={1}
              max={10}
              defaultValue={post.bitterness}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: 8,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              甘さ
            </label>
            <input
              name="sweetness"
              type="number"
              min={1}
              max={10}
              defaultValue={post.sweetness}
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: 8,
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
          >
            コメント
          </label>
          <textarea
            name="comment"
            defaultValue={post.comment || ""}
            rows={3}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: 8,
              resize: "vertical",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
          >
            店舗名
          </label>
          <input
            name="shop"
            defaultValue={post.shop?.name || ""}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: 8,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              店舗緯度
            </label>
            <input
              name="shopLat"
              type="text"
              defaultValue={post.shop?.lat ?? ""}
              placeholder="例: 35.6895"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: 8,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              店舗経度
            </label>
            <input
              name="shopLng"
              type="text"
              defaultValue={post.shop?.lng ?? ""}
              placeholder="例: 139.6917"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                padding: 8,
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
          >
            写真
          </label>
          <UploadImage
            onUpload={handleImageUpload}
            maxCount={3}
            initialUrls={imageUrls}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            background: loading ? "#9ca3af" : "#1e8e3e",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: 12,
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
          disabled={loading}
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
