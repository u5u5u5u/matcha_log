"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    const meId = session?.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
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

    if (!user) {
      return {
        error: "ユーザーが見つかりません",
      };
    }

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        images: { select: { url: true } },
        shop: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    let initialIsFollowing = false;
    if (meId && meId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: meId, followingId: user.id },
        },
      });
      initialIsFollowing = !!follow;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        iconUrl: user.iconUrl,
        activeTitle: user.activeTitle,
      },
      posts,
      followingList: user.following?.map((f) => f.following) || [],
      followerList: user.followers?.map((f) => f.follower) || [],
      initialIsFollowing,
      showFollowButton: meId !== undefined && meId !== user.id,
    };
  } catch (error) {
    console.error("ユーザープロフィールデータの取得に失敗しました:", error);
    return {
      error: "データの取得に失敗しました",
    };
  }
}

export async function followUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "unauthorized" };
    }

    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!me) {
      return { error: "not found" };
    }

    if (me.id === userId) {
      return {
        error: "cannot follow yourself",
      };
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: me.id, followingId: userId },
      },
      update: {},
      create: { followerId: me.id, followingId: userId },
    });

    revalidatePath(`/user/${userId}`);
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("フォローエラー:", error);
    return { error: "フォローに失敗しました" };
  }
}

export async function unfollowUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "unauthorized" };
    }

    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!me) {
      return { error: "not found" };
    }

    await prisma.follow.deleteMany({
      where: { followerId: me.id, followingId: userId },
    });

    revalidatePath(`/user/${userId}`);
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("フォロー解除エラー:", error);
    return { error: "フォロー解除に失敗しました" };
  }
}

export async function checkIsFollowing(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { isFollowing: false };
    }

    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!me) {
      return { isFollowing: false };
    }

    if (me.id === userId) {
      return { isFollowing: false };
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: me.id, followingId: userId },
      },
    });

    return { isFollowing: !!follow };
  } catch (error) {
    console.error("フォロー状態確認エラー:", error);
    return { isFollowing: false };
  }
}
