"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./PostForm.module.scss";
import dynamic from "next/dynamic";
import { z } from "zod";

const UploadImage = dynamic(() => import("./UploadImage"), { ssr: false });

const schema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.enum(["SWEET", "DRINK"]),
  bitterness: z.coerce.number().min(1).max(10),
  richness: z.coerce.number().min(1).max(10),
  sweetness: z.coerce.number().min(1).max(10),
  comment: z.string().optional(),
  shop: z.string().optional(),
  images: z.any().optional(),
  shopLat: z.string().optional(),
  shopLng: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  initialForm?: Partial<FormData>;
};

export default function PostFormClient({ initialForm }: Props) {
  const [form, setForm] = useState<FormData>({
    title: initialForm?.title || "",
    category: initialForm?.category || "SWEET",
    bitterness: initialForm?.bitterness || 5,
    richness: initialForm?.richness || 5,
    sweetness: initialForm?.sweetness || 5,
    comment: initialForm?.comment || "",
    shop: initialForm?.shop || "",
    images: undefined,
    shopLat: initialForm?.shopLat || "",
    shopLng: initialForm?.shopLng || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const handleImageUpload = (urls: string[]) => {
    setForm({ ...form, images: urls });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      schema.parse(form);
      // APIにPOSTリクエスト
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("bitterness", String(form.bitterness));
      fd.append("richness", String(form.richness));
      fd.append("sweetness", String(form.sweetness));
      fd.append("comment", form.comment || "");
      fd.append("shop", form.shop || "");
      fd.append("shopLat", form.shopLat || "");
      fd.append("shopLng", form.shopLng || "");
      if (Array.isArray(form.images)) {
        form.images.forEach((url) => {
          if (url) fd.append("images[]", url);
        });
      }
      const res = await fetch("/api/post/new", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "errors" in err &&
        Array.isArray((err as { errors?: { message?: string }[] }).errors)
      ) {
        setError(
          (err as { errors?: { message?: string }[] }).errors?.[0]?.message ||
            "入力内容に誤りがあります"
        );
      } else {
        setError("入力内容に誤りがあります");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title">タイトル</label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="category">カテゴリ</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="SWEET">スイーツ</option>
          <option value="DRINK">ドリンク</option>
        </select>
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="bitterness">苦さ</label>
          <Input
            id="bitterness"
            name="bitterness"
            type="number"
            min={1}
            max={10}
            value={form.bitterness}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="richness">濃さ</label>
          <Input
            id="richness"
            name="richness"
            type="number"
            min={1}
            max={10}
            value={form.richness}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="sweetness">甘さ</label>
          <Input
            id="sweetness"
            name="sweetness"
            type="number"
            min={1}
            max={10}
            value={form.sweetness}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="shop">店舗名</label>
        <Input
          id="shop"
          name="shop"
          value={form.shop}
          onChange={handleChange}
        />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="shopLat">店舗緯度</label>
          <Input
            id="shopLat"
            name="shopLat"
            type="number"
            step="any"
            value={form.shopLat}
            onChange={handleChange}
            placeholder="例: 35.6895"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="shopLng">店舗経度</label>
          <Input
            id="shopLng"
            name="shopLng"
            type="number"
            step="any"
            value={form.shopLng}
            onChange={handleChange}
            placeholder="例: 139.6917"
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="comment">コメント</label>
        <textarea
          id="comment"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className={styles.field}>
        <label>画像アップロード</label>
        <UploadImage onUpload={handleImageUpload} />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "送信中..." : "投稿する"}
      </Button>
    </form>
  );
}
