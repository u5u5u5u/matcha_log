"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import styles from "./SignupPage.module.scss";
import { z } from "zod";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "6文字以上で入力してください" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
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
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (res?.error) {
        setError(res.error || "ログインに失敗しました");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>ログイン</div>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="メールアドレス"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Input
          name="password"
          type="password"
          placeholder="パスワード"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
      <div className={styles.link}>
        <a href="/reset-password">パスワードをお忘れですか？</a>
      </div>
      <div className={styles.link}>
        <a href="/signup">新規登録はこちら</a>
      </div>
    </div>
  );
}
