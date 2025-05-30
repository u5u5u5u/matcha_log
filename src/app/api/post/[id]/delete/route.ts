import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }
  const post = await prisma.post.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!post) return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 });
  if (post.user.email !== session.user.email) return NextResponse.json({ error: '削除権限がありません' }, { status: 403 });
  await prisma.image.deleteMany({ where: { postId: params.id } });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
