import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient, Category } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const shopLat = formData.get("shopLat");
  const shopLng = formData.get("shopLng");

  // 画像URLを取得
  const imageUrls = formData.getAll("images[]") as string[];

  if (!title || !category) {
    return NextResponse.json(
      { error: "必須項目が不足しています" },
      { status: 400 }
    );
  }

  if (!imageUrls || imageUrls.length === 0) {
    return NextResponse.json(
      { error: "画像は最低1枚必要です" },
      { status: 400 }
    );
  }

  // 投稿取得＆認可
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { user: true },
  });
  if (!post)
    return NextResponse.json(
      { error: "投稿が見つかりません" },
      { status: 404 }
    );
  if (post.user.email !== session.user.email)
    return NextResponse.json(
      { error: "編集権限がありません" },
      { status: 403 }
    );

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
      // 既存の店舗がある場合、緯度・経度を更新
      shop = await prisma.shop.update({
        where: { id: shop.id },
        data: {
          lat: shopLat ? Number(shopLat) : undefined,
          lng: shopLng ? Number(shopLng) : undefined,
        },
      });
    }
  }

  const updated = await prisma.post.update({
    where: { id: id },
    data: {
      title,
      category,
      bitterness,
      richness,
      sweetness,
      comment,
      shopId: shop?.id,
    },
  });

  // 既存の画像を削除
  await prisma.image.deleteMany({
    where: { postId: id },
  });

  // 新しい画像を追加
  if (imageUrls.length > 0) {
    await prisma.image.createMany({
      data: imageUrls.map((url) => ({
        postId: id,
        url: url,
      })),
    });
  }

  return NextResponse.json({ ok: true, post: updated });
}
