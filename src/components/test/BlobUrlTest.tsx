"use client";

import React, { useState } from "react";

export default function BlobUrlTest() {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 既存のBlob URLを解放
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      // 新しいBlob URLを作成
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      setImageLoaded(false);
      setImageError("");

      console.log("Generated Blob URL:", url);
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageLoaded(true);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image load error:", e);
    setImageError("画像の読み込みに失敗しました");
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>Blob URL テスト</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />

      {blobUrl && (
        <div>
          <p>Blob URL: {blobUrl}</p>
          <p>読み込み状態: {imageLoaded ? "成功" : "読み込み中..."}</p>
          {imageError && <p style={{ color: "red" }}>エラー: {imageError}</p>}

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div>
              <h4>標準 img 要素</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blobUrl}
                alt="test"
                width={100}
                height={100}
                style={{ objectFit: "cover", border: "1px solid #ddd" }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
