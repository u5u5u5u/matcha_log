"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/util/button";
import {
  TitleField,
  CategoryField,
  ShopField,
  RatingSliders,
  CommentField,
  ImageUploadField,
} from "./fields";
import styles from "./PostForm.module.scss";

const schema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.enum(["SWEET", "DRINK"]),
  bitterness: z.coerce.number().min(1).max(10),
  richness: z.coerce.number().min(1).max(10),
  sweetness: z.coerce.number().min(1).max(10),
  comment: z.string().optional(),
  shop: z.string().optional(),
  images: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  initialForm?: Partial<FormData>;
};

export default function PostForm({ initialForm }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: initialForm?.title || "",
    category: initialForm?.category || "SWEET",
    bitterness: initialForm?.bitterness || 5,
    richness: initialForm?.richness || 5,
    sweetness: initialForm?.sweetness || 5,
    comment: initialForm?.comment || "",
    shop: initialForm?.shop || "",
    images: undefined,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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

  const handleImageUpload = (files: File[], urls: string[]) => {
    setImageFiles(files);
    setForm({ ...form, images: urls });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      schema.parse(form);

      // 画像ファイルがある場合は先にアップロード
      let uploadedImageUrls: string[] = [];
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

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // APIにPOSTリクエスト
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("bitterness", String(form.bitterness));
      fd.append("richness", String(form.richness));
      fd.append("sweetness", String(form.sweetness));
      fd.append("comment", form.comment || "");
      fd.append("shop", form.shop || "");

      // アップロードされた画像URLを使用
      uploadedImageUrls.forEach((url) => {
        if (url) fd.append("images[]", url);
      });

      const res = await fetch("/api/post/new", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
      } else {
        router.push("/posts");
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
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("入力内容に誤りがあります");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <TitleField value={form.title} onChange={handleChange} />

      <CategoryField
        value={form.category}
        onChange={(category) => setForm({ ...form, category })}
      />

      <ShopField value={form.shop || ""} onChange={handleChange} />

      <ImageUploadField
        onUpload={handleImageUpload}
        initialUrls={form.images || []}
        maxCount={3}
      />

      <RatingSliders
        bitterness={form.bitterness}
        richness={form.richness}
        sweetness={form.sweetness}
        onChange={handleChange}
      />

      <CommentField value={form.comment || ""} onChange={handleChange} />

      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "送信中..." : "投稿する"}
      </Button>
    </form>
  );
}
