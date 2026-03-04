"use client";

import React, { useState } from "react";
import { Input } from "../../util/input";
import { Button } from "../../util/button";
import Link from "next/link";
import styles from "./index.module.scss";
import { z } from "zod";
import { requestPasswordReset } from "@/app/actions/auth";

const schema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [form, setForm] = useState<FormData>({
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setResetUrl(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const data = await requestPasswordReset(form.email);

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(
          "resetUrl" in data && data.resetUrl
            ? "開発環境のため、下記のリンクからパスワードをリセットしてください。"
            : "パスワードリセットのメールを送信しました。メールをご確認ください。"
        );
        if ("resetUrl" in data && data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>パスワードリセット</div>
      <div className={styles.description}>
        登録したメールアドレスを入力してください。
        <br />
        パスワードリセット用のリンクをお送りします。
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">メールアドレス</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        {resetUrl && (
          <div className={styles.resetLink}>
            <a href={resetUrl} className={styles.resetButton}>
              パスワードをリセットする
            </a>
          </div>
        )}
        <Button className={styles.button} type="submit" disabled={loading}>
          {loading ? "送信中..." : "リセットメールを送信"}
        </Button>
      </form>
      <div className={styles.links}>
        <Link href="/login" className={styles.link}>
          ログインページに戻る
        </Link>
        <Link href="/signup" className={styles.link}>
          新規登録はこちら
        </Link>
      </div>
    </div>
  );
}
