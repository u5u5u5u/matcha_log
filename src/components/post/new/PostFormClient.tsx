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
  onSubmit?: (form: FormData) => Promise<void>;
};

export default function PostFormClient({ initialForm, onSubmit }: Props) {
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

  // ...（残りのUI・イベント処理はPostFormから移植）

  return (
    <form>
      {/* フォームUIをここに記述 */}
      {/* ... */}
    </form>
  );
}
