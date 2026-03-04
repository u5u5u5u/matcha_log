"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function login(formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      return {
        error: "全ての項目を入力してください",
      };
    }

    const { email, password } = result.data;

    // Supabase Auth でパスワード検証
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (authError || !authData.user) {
      return { error: "メールアドレスまたはパスワードが違います" };
    }

    // プロフィール情報を public.users から取得
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", authData.user.id)
      .single();

    return {
      ok: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile?.name ?? null,
      },
    };
  } catch {
    return { error: "サーバーエラー" };
  }
}

export async function signup(formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    };

    const result = signupSchema.safeParse(data);
    if (!result.success) {
      return {
        error: "全ての項目を入力してください",
      };
    }

    const { email, password, name } = result.data;

    // Supabase Auth にユーザー作成
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { error: "このメールアドレスは既に登録されています" };
      }
      return { error: "ユーザー作成に失敗しました" };
    }

    // プロフィールを public.users に登録（パスワード不要）
    const { data: user, error: profileError } = await supabase
      .from("users")
      .insert({ id: authData.user.id, email, name })
      .select("id, email, name")
      .single();

    if (profileError || !user) {
      // ロールバック: auth ユーザーを削除
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: "ユーザー作成に失敗しました" };
    }

    return {
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    };
  } catch {
    return { error: "サーバーエラー" };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const result = resetPasswordSchema.safeParse({ email });
    if (!result.success) {
      return { error: "有効なメールアドレスを入力してください" };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const { error } = await supabase.auth.resetPasswordForEmail(
      result.data.email,
      { redirectTo: `${siteUrl}/reset-password/confirm` },
    );

    if (error) {
      console.error("Password reset error:", error.message);
    }

    // セキュリティ上、メールが存在しなくても成功レスポンスを返す
    return {
      message:
        "パスワードリセットのメールを送信しました。メールをご確認ください",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "サーバーエラーが発生しました" };
  }
}
