import { PrismaClient, TitleType } from "@/generated/prisma";

const prisma = new PrismaClient();

/**
 * ユーザーの称号獲得状況を更新する
 */
export async function updateUserTitles(userId: string) {
  try {
    // ユーザーの投稿データを取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        userTitles: {
          include: { title: true },
        },
      },
    });

    if (!user) {
      console.error("User not found:", userId);
      return;
    }

    const posts = user.posts;
    const postCount = posts.length;

    // 味覚の合計値を計算
    const tasteStats = {
      totalBitterness: posts.reduce((sum, post) => sum + post.bitterness, 0),
      totalRichness: posts.reduce((sum, post) => sum + post.richness, 0),
      totalSweetness: posts.reduce((sum, post) => sum + post.sweetness, 0),
    };

    // 全ての称号を取得
    const allTitles = await prisma.title.findMany();

    // 既に獲得している称号のIDリスト
    const existingTitleIds = user.userTitles.map((ut) => ut.titleId);

    // 新たに獲得する称号を判定
    const newTitles = [];

    for (const title of allTitles) {
      // 既に獲得済みの場合はスキップ
      if (existingTitleIds.includes(title.id)) {
        continue;
      }

      const condition = title.condition as {
        minPosts?: number;
        minTotal?: number;
      };
      let shouldUnlock = false;

      switch (title.type) {
        case TitleType.POST_COUNT:
          if (
            condition.minPosts !== undefined &&
            postCount >= condition.minPosts
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_BITTER:
          if (
            condition.minTotal !== undefined &&
            tasteStats.totalBitterness >= condition.minTotal
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_RICH:
          if (
            condition.minTotal !== undefined &&
            tasteStats.totalRichness >= condition.minTotal
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_SWEET:
          if (
            condition.minTotal !== undefined &&
            tasteStats.totalSweetness >= condition.minTotal
          ) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        newTitles.push(title);
      }
    }

    // 新しい称号を登録
    for (const title of newTitles) {
      await prisma.userTitle.create({
        data: {
          userId,
          titleId: title.id,
          unlockedAt: new Date(),
        },
      });
    }

    return newTitles;
  } catch (error) {
    console.error("Error updating user titles:", error);
    return [];
  }
}
