"use client";
import { UploadButton } from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export default function UploadImage({
  onUpload,
}: {
  onUpload: (urls: string[]) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <UploadButton<UploadRouter, "postImage">
        endpoint="postImage"
        onClientUploadComplete={(res) => {
          if (res) onUpload(res.map((f) => f.url));
        }}
        onUploadError={(err) => {
          alert("アップロード失敗: " + err.message);
        }}
      />
    </div>
  );
}
