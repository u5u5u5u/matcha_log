import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }
  const { name, email, iconUrl } = await req.json();
  if (!name || !email) {
    return NextResponse.json(
      { error: "名前とメールアドレスは必須です" },
      { status: 400 }
    );
  }
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name, email, iconUrl },
  });
  return NextResponse.json({ ok: true });
}
