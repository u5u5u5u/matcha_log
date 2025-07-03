"use client";

import React, { useState } from "react";
import { Input } from "@/components/util/input";
import { Button } from "@/components/util/button";
import styles from "./index.module.scss";
import IconUploadImage from "@/components/me/IconUploadImage";

export default function ProfileEditForm({
  initialName,
  initialEmail,
  initialIconUrl,
  onSave,
  loading,
}: {
  initialName: string;
  initialEmail: string;
  initialIconUrl: string;
  onSave?: (data: {
    name: string;
    email: string;
    iconUrl?: string;
  }) => Promise<void>;
  loading?: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [iconUrl, setIconUrl] = useState(initialIconUrl);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }
    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (loading) return;

    try {
      let finalIconUrl = iconUrl;

      // Blob URLの場合は実際のファイルをアップロード
      if (uploadedFiles.length > 0 && iconUrl.startsWith("blob:")) {
        const formData = new FormData();
        formData.append("file", uploadedFiles[0]);

        const uploadResponse = await fetch("/api/blob/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          const errorMessage =
            errorData.error || "画像のアップロードに失敗しました";
          throw new Error(errorMessage);
        }

        const uploadResult = await uploadResponse.json();
        finalIconUrl = uploadResult.url;
      }

      if (onSave) {
        await onSave({ name, email, iconUrl: finalIconUrl });
        setSuccess(true);
      } else {
        const res = await fetch("/api/me/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, iconUrl: finalIconUrl }),
        });
        if (!res.ok) throw new Error();
        setSuccess(true);
      }
    } catch (error) {
      console.error("保存エラー:", error);
      setError(error instanceof Error ? error.message : "保存に失敗しました");
    }
  };

  const handleImageUpload = (files: File[], urls: string[]) => {
    setUploadedFiles(files);
    if (urls.length > 0) {
      setIconUrl(urls[0]);
    } else {
      setIconUrl("");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.iconUploadField}>
        <label>プロフィール画像</label>
        <div className={styles.iconUploadContainer}>
          <IconUploadImage
            onUpload={handleImageUpload}
            maxCount={1}
            initialUrls={iconUrl && iconUrl.trim() !== "" ? [iconUrl] : []}
            isProfileMode={true}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="name">名前</label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力してください"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">メールアドレス</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力してください"
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>保存しました</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
