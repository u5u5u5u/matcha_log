import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: '全ての項目を入力してください' }, { status: 400 });
    }
    // 既存ユーザー確認
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 409 });
    }
    // パスワードハッシュ化
    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
