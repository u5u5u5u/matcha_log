"use client";

import React, { useState } from "react";
import { Input } from "../../util/input";
import { Button } from "../../util/button";
import Link from "next/link";
import styles from "./index.module.scss";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "6文字以上で入力してください" }),
  name: z.string().min(1, { message: "お名前を入力してください" }),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
      } else {
        window.location.href = "/login";
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>新規登録</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">お名前</label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>
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
        <div className={styles.field}>
          <label htmlFor="password">パスワード</label>
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
        {error && <div className={styles.error}>{error}</div>}
        <Button className={styles.button} type="submit" disabled={loading}>
          {loading ? "登録中..." : "新規登録"}
        </Button>
      </form>
      <div className={styles.links}>
        <Link href="/login" className={styles.link}>
          ログインはこちら
        </Link>
      </div>
    </div>
  );
}
