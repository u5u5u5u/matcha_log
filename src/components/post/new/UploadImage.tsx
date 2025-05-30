"use client";
import React, { useRef } from "react";

export default function UploadImage({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/blob/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      alert("アップロード失敗");
      return;
    }
    const data = await res.json();
    if (data.url) onUpload([data.url]);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
}
