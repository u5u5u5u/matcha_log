"use client";
import {
  CategoryField,
  CommentField,
  CoordinatesField,
  ImageUploadField,
  RatingSliders,
  ShopField,
  TitleField,
} from "@/components/post/new/fields";
import { Button } from "@/components/util/button";
import type { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import styles from "./PostEditForm.module.scss";

const schema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.enum(["SWEET", "DRINK"]),
  bitterness: z.coerce.number().min(1).max(10),
  richness: z.coerce.number().min(1).max(10),
  sweetness: z.coerce.number().min(1).max(10),
  comment: z.string().optional(),
  shop: z.string().optional(),
  shopLat: z.string().optional(),
  shopLng: z.string().optional(),
  images: z.array(z.string()).min(1, "画像は最低1枚必要です"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  postId: string;
  initialPost: Post;
}

export default function PostEditForm({ postId, initialPost }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: initialPost.title || "",
    category: initialPost.category || "SWEET",
    bitterness: initialPost.bitterness || 5,
    richness: initialPost.richness || 5,
    sweetness: initialPost.sweetness || 5,
    comment: initialPost.comment || "",
    shop: initialPost.shop?.name || "",
    shopLat: initialPost.shop?.lat?.toString() || "",
    shopLng: initialPost.shop?.lng?.toString() || "",
    images: initialPost.images?.map((img: { url: string }) => img.url) || [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialPost.images?.map((img: { url: string }) => img.url) || []
  );
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
    setImageUrls(urls);
    setForm({ ...form, images: urls });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      schema.parse(form);

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
            const errorData = await response.json().catch(() => ({}));
            const errorMessage =
              errorData.error || "画像のアップロードに失敗しました";
            throw new Error(errorMessage);
          }

          const data = await response.json();
          return data.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...existingImageUrls, ...uploadedUrls];
      } else {
        finalImageUrls = existingImageUrls;
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
      fd.append("shopLat", form.shopLat || "");
      fd.append("shopLng", form.shopLng || "");

      // 最終的な画像URLを追加
      finalImageUrls.forEach((url) => {
        if (url) {
          fd.append("images[]", url);
        }
      });

      const res = await fetch(`/api/post/${postId}/edit`, {
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

      <CoordinatesField
        latValue={form.shopLat || ""}
        lngValue={form.shopLng || ""}
        onChange={handleChange}
      />

      <ImageUploadField
        onUpload={handleImageUpload}
        initialUrls={imageUrls}
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
        {loading ? "保存中..." : "保存"}
      </Button>
    </form>
  );
}
