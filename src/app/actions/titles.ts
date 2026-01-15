"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getTitles() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
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
      return { error: "User not found" };
    }

    // すべての称号を取得
    const allTitles = await prisma.title.findMany({
      orderBy: [{ createdAt: "asc" }],
    });

    // ユーザーが獲得した称号のIDセット
    const unlockedTitleIds = new Set(user.userTitles.map((ut) => ut.titleId));

    // 称号をカテゴリ別に整理
    const titlesByCategory = allTitles.reduce(
      (acc, title) => {
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
      },
      {} as Record<
        string,
        {
          id: string;
          name: string;
          description: string | null;
          type: string;
          isUnlocked: boolean;
          isActive: boolean;
        }[]
      >
    );

    return {
      titlesByCategory,
      activeTitle: user.activeTitle,
      totalUnlocked: user.userTitles.length,
      totalTitles: allTitles.length,
    };
  } catch (error) {
    console.error("Error fetching titles:", error);
    return {
      error: "Internal server error",
    };
  }
}

export async function setActiveTitle(titleId: string | null) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // titleIdがnullの場合は称号を無効化
    if (titleId === null) {
      await prisma.user.update({
        where: { id: user.id },
        data: { activeTitleId: null },
      });
      revalidatePath("/me");
      revalidatePath("/titles");
      return { success: true, message: "Title deactivated" };
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
      return {
        error: "Title not unlocked",
      };
    }

    // アクティブな称号を更新
    await prisma.user.update({
      where: { id: user.id },
      data: { activeTitleId: titleId },
    });

    revalidatePath("/me");
    revalidatePath("/titles");
    return { success: true, message: "Title activated" };
  } catch (error) {
    console.error("Error setting active title:", error);
    return {
      error: "Internal server error",
    };
  }
}
