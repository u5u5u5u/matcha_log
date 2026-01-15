"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getMyProfile() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: "認証が必要です" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        iconUrl: true,
        activeTitle: {
          select: {
            id: true,
            name: true,
          },
        },
        following: {
          select: {
            followingId: true,
            following: { select: { name: true, iconUrl: true, id: true } },
          },
        },
        followers: {
          select: {
            followerId: true,
            follower: { select: { name: true, iconUrl: true, id: true } },
          },
        },
      },
    });

    const posts = await prisma.post.findMany({
      where: { user: { email: session.user.email } },
      include: {
        images: { select: { url: true } },
        shop: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: { user: { email: session.user.email } },
        },
      },
      include: {
        images: { select: { url: true } },
        shop: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      user: {
        name: user?.name || "",
        email: user?.email || "",
        iconUrl: user?.iconUrl || undefined,
        activeTitle: user?.activeTitle || null,
        followingList: user?.following?.map((f) => f.following) || [],
        followerList: user?.followers?.map((f) => f.follower) || [],
      },
      posts,
      likedPosts,
    };
  } catch (error) {
    console.error("マイページデータの取得に失敗しました:", error);
    return {
      error: "データの取得に失敗しました",
    };
  }
}

export async function updateProfile(
  name: string,
  email: string,
  iconUrl?: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "認証が必要です" };
    }

    if (!name || !email) {
      return {
        error: "名前とメールアドレスは必須です",
      };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { name, email, iconUrl },
    });

    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return { error: "プロフィール更新に失敗しました" };
  }
}
