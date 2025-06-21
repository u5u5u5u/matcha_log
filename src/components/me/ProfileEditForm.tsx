"use client";

import React, { useState } from "react";
import { Input } from "@/components/util/input";
import { Button } from "@/components/util/button";
import styles from "./ProfileEditForm.module.scss";
import UploadImage from "@/components/post/new/UploadImage";
import Image from "next/image";

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
      if (onSave) {
        await onSave({ name, email, iconUrl });
        setSuccess(true);
      } else {
        const res = await fetch("/api/me/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, iconUrl }),
        });
        if (!res.ok) throw new Error();
        setSuccess(true);
      }
    } catch {
      setError("保存に失敗しました");
    }
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) setIconUrl(urls[0]);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="icon">アイコン画像</label>
        {iconUrl && (
          <Image
            src={iconUrl}
            alt="icon"
            className={styles.iconPreview}
            width={64}
            height={64}
          />
        )}
        <UploadImage
          onUpload={handleImageUpload}
          maxCount={1}
          initialUrls={iconUrl ? [iconUrl] : []}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="name">名前</label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
