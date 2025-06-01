"use client";
import React, { useRef } from "react";
import Image from "next/image";

export default function UploadImage({
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploadPromises = [];
    for (let i = 0; i < files.length && urls.length + i < maxCount; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      uploadPromises.push(
        fetch("/api/blob/upload", {
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
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {urls.map((url, idx) => (
          <div key={url} style={{ position: "relative" }}>
            <Image
              src={url}
              alt="preview"
              width={64}
              height={64}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
                color: "#c00",
                fontWeight: "bold",
                lineHeight: 1,
                padding: 0,
              }}
              aria-label="画像を削除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {urls.length >= maxCount && (
        <div style={{ color: "#888", fontSize: 12 }}>最大{maxCount}枚までアップロードできます</div>
      )}
    </div>
  );
}
