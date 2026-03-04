"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../util/input";
import { Button } from "../../util/button";
import Link from "next/link";
import styles from "./index.module.scss";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

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
  const [ready, setReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // SupabaseのリカバリーリンクのURLフラグメントを処理
    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // 既にセッションがある場合も有効
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: result.data.password,
      });

      if (updateError) {
        setError(
          "パスワードの更新に失敗しました。リセットリンクの有効期限が切れている可能性があります。",
        );
      } else {
        setSuccess(
          "パスワードが正常に更新されました。ログインページに移動します。",
        );
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>読み込み中...</div>
        <p className={styles.description}>
          リセットリンクを検証しています。しばらお待ちください。
        </p>
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
          disabled={loading || !ready}
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
