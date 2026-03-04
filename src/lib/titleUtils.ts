import { supabase } from "@/lib/supabase";
import type { TitleTypeEnum } from "@/types/database";

/**
 * ユーザーの称号獲得状況を更新する
 */
export async function updateUserTitles(userId: string) {
  try {
    // ユーザーの存在確認
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!user) {
      console.error("User not found:", userId);
      return;
    }

    // ユーザーの投稿を取得
    const { data: posts } = await supabase
      .from("posts")
      .select("bitterness, richness, sweetness")
      .eq("user_id", userId);

    // 既に獲得している称号を取得
    const { data: userTitles } = await supabase
      .from("user_titles")
      .select("title_id")
      .eq("user_id", userId);

    const postCount = posts?.length ?? 0;
    const tasteStats = {
      totalBitterness: posts?.reduce((s, p) => s + p.bitterness, 0) ?? 0,
      totalRichness: posts?.reduce((s, p) => s + p.richness, 0) ?? 0,
      totalSweetness: posts?.reduce((s, p) => s + p.sweetness, 0) ?? 0,
    };

    // 全称号を取得
    const { data: allTitles } = await supabase.from("titles").select("*");

    if (!allTitles) return;

    const existingTitleIds = new Set(userTitles?.map((ut) => ut.title_id) ?? []);

    const newTitles = [];

    for (const title of allTitles) {
      if (existingTitleIds.has(title.id)) continue;

      const condition = title.condition as {
        minPosts?: number;
        minTotal?: number;
      };
      let shouldUnlock = false;

      switch (title.type as TitleTypeEnum) {
        case "POST_COUNT":
          if (
            condition.minPosts !== undefined &&
            postCount >= condition.minPosts
          ) {
            shouldUnlock = true;
          }
          break;

        case "TASTE_BITTER":
          if (
            condition.minTotal !== undefined &&
            tasteStats.totalBitterness >= condition.minTotal
          ) {
            shouldUnlock = true;
          }
          break;

        case "TASTE_RICH":
          if (
            condition.minTotal !== undefined &&
            tasteStats.totalRichness >= condition.minTotal
          ) {
            shouldUnlock = true;
          }
          break;

        case "TASTE_SWEET":
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
      await supabase.from("user_titles").insert({
        user_id: userId,
        title_id: title.id,
        unlocked_at: new Date().toISOString(),
      });
    }

    return newTitles;
  } catch (error) {
    console.error("Error updating user titles:", error);
    return [];
  }
}
