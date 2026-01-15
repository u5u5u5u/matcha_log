"use server";

import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";

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

const resetPasswordConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        error: "メールアドレスまたはパスワードが違います",
      };
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return {
        error: "メールアドレスまたはパスワードが違います",
      };
    }

    return {
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
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

    // 既存ユーザー確認
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return {
        error: "このメールアドレスは既に登録されています",
      };
    }

    // パスワードハッシュ化
    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

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
      return {
        error: "有効なメールアドレスを入力してください",
      };
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      // セキュリティ上、ユーザーが存在しなくても成功レスポンスを返す
      return {
        message: "パスワードリセットのメールを送信しました",
      };
    }

    // パスワードリセットトークンの生成
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1時間後

    // データベースにリセットトークンを保存
    await prisma.user.update({
      where: { email: result.data.email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 実際のアプリケーションでは、ここでメール送信を行う
    console.log(`Password reset token for ${email}: ${resetToken}`);
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password/confirm?token=${resetToken}`;
    console.log(`Reset URL: ${resetUrl}`);

    // 開発環境では、リセットURLもレスポンスに含める
    const isDev = process.env.NODE_ENV === "development";

    return {
      message: "パスワードリセットのメールを送信しました",
      ...(isDev && { resetUrl }),
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      error: "サーバーエラーが発生しました",
    };
  }
}

export async function confirmPasswordReset(token: string, password: string) {
  try {
    const result = resetPasswordConfirmSchema.safeParse({ token, password });

    if (!result.success) {
      return { error: "無効なデータです" };
    }

    // トークンでユーザーを検索
    const user = await prisma.user.findFirst({
      where: {
        resetToken: result.data.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        error: "無効または期限切れのリセットトークンです",
      };
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(result.data.password, 12);

    // パスワードを更新し、リセットトークンをクリア
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      message: "パスワードが正常に更新されました",
    };
  } catch (error) {
    console.error("Password reset confirm error:", error);
    return {
      error: "サーバーエラーが発生しました",
    };
  }
}
