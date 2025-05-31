import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!me) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (me.id === id)
    return NextResponse.json(
      { error: "cannot follow yourself" },
      { status: 400 }
    );
  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId: me.id, followingId: id },
    },
    update: {},
    create: { followerId: me.id, followingId: id },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!me) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.follow.deleteMany({
    where: { followerId: me.id, followingId: id },
  });
  return NextResponse.json({ ok: true });
}
