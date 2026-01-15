"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { Category } from "@/generated/prisma";
import { updateUserTitles } from "@/lib/titleUtils";
import { revalidatePath } from "next/cache";

export async function getPosts(take: number = 10, skip: number = 0) {
  try {
    const session = await getServerSession(authOptions);

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

    return {
      posts,
      myId: session?.user?.id || null,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      error: "投稿の取得に失敗しました",
    };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { images: true, shop: true },
    });

    if (!post) {
      return {
        error: "投稿が見つかりません",
      };
    }

    return { post };
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return { error: "投稿の取得に失敗しました" };
  }
}

export async function createPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "認証が必要です" };
    }

    const title = formData.get("title") as string;
    const category = formData.get("category") as Category;
    const bitterness = Number(formData.get("bitterness"));
    const richness = Number(formData.get("richness"));
    const sweetness = Number(formData.get("sweetness"));
    const comment = formData.get("comment") as string;
    const shopName = formData.get("shop") as string;
    const images = formData.getAll("images[]") as string[];

    if (!title || !category) {
      return {
        error: "必須項目が不足しています",
      };
    }

    if (!images || images.length === 0) {
      return {
        error: "画像は最低1枚必要です",
      };
    }

    // 店舗情報の登録・取得
    let shop = null;
    if (shopName) {
      shop = await prisma.shop.findFirst({ where: { name: shopName } });
      if (!shop) {
        shop = await prisma.shop.create({
          data: {
            name: shopName,
          },
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return {
        error: "ユーザーが見つかりません",
      };
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

    // 称号獲得状況を更新
    await updateUserTitles(user.id);

    revalidatePath("/posts");
    revalidatePath("/me");
    return { ok: true, post };
  } catch (error) {
    console.error("投稿作成エラー:", error);
    return { error: "投稿の作成に失敗しました" };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "認証が必要です" };
    }

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
      return {
        error: "必須項目が不足しています",
      };
    }

    if (!imageUrls || imageUrls.length === 0) {
      return {
        error: "画像は最低1枚必要です",
      };
    }

    // 投稿取得＆認可
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { user: true },
    });
    if (!post) {
      return {
        error: "投稿が見つかりません",
      };
    }
    if (post.user.email !== session.user.email) {
      return {
        error: "編集権限がありません",
      };
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

    revalidatePath("/posts");
    revalidatePath(`/post/${id}`);
    revalidatePath("/me");
    return { ok: true, post: updated };
  } catch (error) {
    console.error("投稿更新エラー:", error);
    return { error: "投稿の更新に失敗しました" };
  }
}

export async function deletePost(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "認証が必要です" };
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { user: true },
    });

    if (!post) {
      return {
        error: "投稿が見つかりません",
      };
    }

    if (post.user.email !== session.user.email) {
      return {
        error: "削除権限がありません",
      };
    }

    await prisma.image.deleteMany({ where: { postId: id } });
    await prisma.like.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id: id } });

    revalidatePath("/posts");
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("投稿削除エラー:", error);
    return { error: "投稿の削除に失敗しました" };
  }
}

export async function likePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;
    await prisma.like.create({
      data: { postId, userId },
    });

    revalidatePath("/posts");
    revalidatePath(`/post/${postId}`);
    return { ok: true };
  } catch (error) {
    console.error("いいねエラー:", error);
    return { error: "いいねに失敗しました" };
  }
}

export async function unlikePost(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;
    await prisma.like.deleteMany({
      where: { postId, userId },
    });

    revalidatePath("/posts");
    revalidatePath(`/post/${postId}`);
    return { ok: true };
  } catch (error) {
    console.error("いいね解除エラー:", error);
    return { error: "いいね解除に失敗しました" };
  }
}
