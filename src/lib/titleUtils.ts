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

    // 味覚の平均値を計算
    const tasteStats =
      posts.length > 0
        ? {
            avgBitterness:
              posts.reduce((sum, post) => sum + post.bitterness, 0) /
              posts.length,
            avgRichness:
              posts.reduce((sum, post) => sum + post.richness, 0) /
              posts.length,
            avgSweetness:
              posts.reduce((sum, post) => sum + post.sweetness, 0) /
              posts.length,
          }
        : {
            avgBitterness: 0,
            avgRichness: 0,
            avgSweetness: 0,
          };

    // バランススコアを計算（3つの味覚パラメータの標準偏差の逆数）
    const balanceScore =
      posts.length > 0
        ? calculateBalanceScore(
            tasteStats.avgBitterness,
            tasteStats.avgRichness,
            tasteStats.avgSweetness
          )
        : 0;

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
        minAvg?: number;
        maxAvg?: number;
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
            posts.length >= 3 && // 最低3投稿は必要
            condition.minAvg !== undefined &&
            condition.maxAvg !== undefined &&
            tasteStats.avgBitterness >= condition.minAvg &&
            tasteStats.avgBitterness <= condition.maxAvg
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_RICH:
          if (
            posts.length >= 3 && // 最低3投稿は必要
            condition.minAvg !== undefined &&
            condition.maxAvg !== undefined &&
            tasteStats.avgRichness >= condition.minAvg &&
            tasteStats.avgRichness <= condition.maxAvg
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_SWEET:
          if (
            posts.length >= 3 && // 最低3投稿は必要
            condition.minAvg !== undefined &&
            condition.maxAvg !== undefined &&
            tasteStats.avgSweetness >= condition.minAvg &&
            tasteStats.avgSweetness <= condition.maxAvg
          ) {
            shouldUnlock = true;
          }
          break;

        case TitleType.TASTE_BALANCE:
          if (
            posts.length >= 5 && // バランス系は最低5投稿必要
            condition.minAvg !== undefined &&
            condition.maxAvg !== undefined &&
            balanceScore >= condition.minAvg &&
            balanceScore <= condition.maxAvg
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
      console.log(`New title unlocked for user ${userId}: ${title.name}`);
    }

    return newTitles;
  } catch (error) {
    console.error("Error updating user titles:", error);
    return [];
  }
}

/**
 * バランススコアを計算する（3つの味覚パラメータがどれくらい均等に分散しているかを計算）
 * 値が大きいほどバランスが取れている
 */
function calculateBalanceScore(
  bitterness: number,
  richness: number,
  sweetness: number
): number {
  const values = [bitterness, richness, sweetness];
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const standardDeviation = Math.sqrt(variance);

  // 標準偏差が小さいほど（バラつきが少ないほど）バランスが取れている
  // 10 - 標準偏差で、0-10の範囲にスケール
  return Math.max(0, Math.min(10, 10 - standardDeviation));
}
