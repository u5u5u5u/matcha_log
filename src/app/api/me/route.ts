import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("マイページデータの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
