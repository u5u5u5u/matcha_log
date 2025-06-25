import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userTitles: {
          include: {
            title: true,
          },
        },
        activeTitle: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // すべての称号を取得
    const allTitles = await prisma.title.findMany({
      orderBy: [{ rarity: "asc" }, { createdAt: "asc" }],
    });

    // ユーザーが獲得した称号のIDセット
    const unlockedTitleIds = new Set(user.userTitles.map((ut) => ut.titleId));

    // 称号をカテゴリ別に整理
    const titlesByCategory = allTitles.reduce((acc, title) => {
      const category = title.type;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        ...title,
        isUnlocked: unlockedTitleIds.has(title.id),
        isActive: user.activeTitleId === title.id,
      });
      return acc;
    }, {} as Record<string, { id: string; name: string; description: string | null; type: string; rarity: string; isUnlocked: boolean; isActive: boolean }[]>);

    return NextResponse.json({
      titlesByCategory,
      activeTitle: user.activeTitle,
      totalUnlocked: user.userTitles.length,
      totalTitles: allTitles.length,
    });
  } catch (error) {
    console.error("Error fetching titles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
