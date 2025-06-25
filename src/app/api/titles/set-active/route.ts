import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { titleId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // titleIdがnullの場合は称号を無効化
    if (titleId === null) {
      await prisma.user.update({
        where: { id: user.id },
        data: { activeTitleId: null },
      });
      return NextResponse.json({ success: true, message: "Title deactivated" });
    }

    // ユーザーがその称号を獲得しているか確認
    const userTitle = await prisma.userTitle.findUnique({
      where: {
        userId_titleId: {
          userId: user.id,
          titleId: titleId,
        },
      },
    });

    if (!userTitle) {
      return NextResponse.json({ error: "Title not unlocked" }, { status: 403 });
    }

    // アクティブな称号を更新
    await prisma.user.update({
      where: { id: user.id },
      data: { activeTitleId: titleId },
    });

    return NextResponse.json({ success: true, message: "Title activated" });
  } catch (error) {
    console.error("Error setting active title:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
