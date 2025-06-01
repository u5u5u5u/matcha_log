import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient, Category } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const category = formData.get("category") as Category;
  const bitterness = Number(formData.get("bitterness"));
  const richness = Number(formData.get("richness"));
  const sweetness = Number(formData.get("sweetness"));
  const comment = formData.get("comment") as string;
  const shopName = formData.get("shop") as string;
  const images = formData.getAll("images[]") as string[];
  const shopLat = formData.get("shopLat");
  const shopLng = formData.get("shopLng");

  if (!title || !category) {
    return NextResponse.json(
      { error: "必須項目が不足しています" },
      { status: 400 }
    );
  }

  // 店舗情報の登録・取得
  let shop = null;
  if (shopName) {
    shop = await prisma.shop.findFirst({ where: { name: shopName } });
    if (!shop) {
      shop = await prisma.shop.create({
        data: {
          name: shopName,
          lat: shopLat ? Number(shopLat) : undefined,
          lng: shopLng ? Number(shopLng) : undefined,
        },
      });
    } else {
      shop = await prisma.shop.update({
        where: { id: shop.id },
        data: {
          lat: shopLat ? Number(shopLat) : undefined,
          lng: shopLng ? Number(shopLng) : undefined,
        },
      });
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json(
      { error: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      category,
      bitterness,
      richness,
      sweetness,
      comment,
      userId: user.id,
      shopId: shop?.id,
      images: {
        create: images.filter(Boolean).map((url) => ({ url })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ ok: true, post });
}
