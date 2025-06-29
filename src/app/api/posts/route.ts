import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams;
    const take = Number(searchParams.get("take")) || 10;
    const skip = Number(searchParams.get("skip")) || 0;

    const posts = await prisma.post.findMany({
      include: {
        images: true,
        shop: true,
        user: true,
        likes: true,
      },
      orderBy: { createdAt: "desc" },
      take: take,
      skip: skip,
    });

    return NextResponse.json({
      posts,
      myId: session?.user?.id || null,
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
