"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "../../util/input";
import { Button } from "../../util/button";
import Link from "next/link";
import styles from "./index.module.scss";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(6, { message: "6文字以上で入力してください" }),
    confirmPassword: z
      .string()
      .min(6, { message: "6文字以上で入力してください" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordConfirmPage() {
  const [form, setForm] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("無効なリセットリンクです");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("無効なリセットリンクです");
      return;
    }

    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "パスワードの更新に失敗しました");
      } else {
        setSuccess(
          "パスワードが正常に更新されました。ログインページに移動します。"
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>新しいパスワードを設定</div>
      <div className={styles.description}>
        新しいパスワードを入力してください。
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="password">新しいパスワード</label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmPassword">パスワード確認</label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <Button
          className={styles.button}
          type="submit"
          disabled={loading || !token}
        >
          {loading ? "更新中..." : "パスワードを更新"}
        </Button>
      </form>
      <div className={styles.links}>
        <Link href="/login" className={styles.link}>
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}
