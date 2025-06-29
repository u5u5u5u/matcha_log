import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const schema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "無効なデータです" }, { status: 400 });
    }

    const { token, password } = result.data;

    // トークンでユーザーを検索
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "無効または期限切れのリセットトークンです" },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // パスワードを更新し、リセットトークンをクリア
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "パスワードが正常に更新されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset confirm error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
