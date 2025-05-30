import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ isFollowing: false });
  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!me) return NextResponse.json({ isFollowing: false });
  if (me.id === params.id) return NextResponse.json({ isFollowing: false });
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: me.id, followingId: params.id },
    },
  });
  return NextResponse.json({ isFollowing: !!follow });
}
