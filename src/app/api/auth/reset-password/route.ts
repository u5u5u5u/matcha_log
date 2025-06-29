import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // セキュリティ上、ユーザーが存在しなくても成功レスポンスを返す
      return NextResponse.json(
        { message: "パスワードリセットのメールを送信しました" },
        { status: 200 }
      );
    }

    // パスワードリセットトークンの生成
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1時間後

    // データベースにリセットトークンを保存
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 実際のアプリケーションでは、ここでメール送信を行う
    // 今回はログに出力
    console.log(`Password reset token for ${email}: ${resetToken}`);
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password/confirm?token=${resetToken}`;
    console.log(`Reset URL: ${resetUrl}`);

    // 開発環境では、リセットURLもレスポンスに含める
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        message: "パスワードリセットのメールを送信しました",
        ...(isDev && { resetUrl }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
