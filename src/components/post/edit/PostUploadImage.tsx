"use client";
import React, { useRef } from "react";
import Image from "next/image";

export default function PostUploadImage({
  onUpload,
  maxCount = 3,
  initialUrls = [],
}: {
  onUpload: (urls: string[]) => void;
  maxCount?: number;
  initialUrls?: string[];
}) {
  const [urls, setUrls] = React.useState<string[]>(initialUrls);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploadPromises = [];
    for (let i = 0; i < files.length && urls.length + i < maxCount; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      uploadPromises.push(
        fetch("/api/blob/post-upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => data.url)
      );
    }
    try {
      const newUrls = await Promise.all(uploadPromises);
      const allUrls = [...urls, ...newUrls].slice(0, maxCount);
      setUrls(allUrls);
      onUpload(allUrls);
    } catch {
      alert("アップロード失敗");
    }
  };

  const handleRemove = (idx: number) => {
    const newUrls = urls.filter((_, i) => i !== idx);
    setUrls(newUrls);
    onUpload(newUrls);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
        multiple
        disabled={urls.length >= maxCount}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {urls.map((url, idx) => (
          <div key={url} style={{ position: "relative" }}>
            <Image
              src={url}
              alt="preview"
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#ff4757",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
                color: "#fff",
                fontWeight: "bold",
                lineHeight: 1,
                padding: 0,
                fontSize: 12,
              }}
              aria-label="画像を削除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {urls.length >= maxCount && (
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
          最大{maxCount}枚までアップロードできます
        </div>
      )}
      {urls.length === 0 && (
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
          画像をアップロードしてください（最大{maxCount}枚）
        </div>
      )}
    </div>
  );
}
