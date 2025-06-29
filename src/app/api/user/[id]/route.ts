import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const meId = session?.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: id },
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
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("ユーザープロフィールデータの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
