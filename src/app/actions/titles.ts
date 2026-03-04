"use server";

import { supabase, mapToCamel } from "@/lib/supabase";
import { getServerUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTitles() {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const { data: user } = await supabase
      .from("users")
      .select(
        "id, active_title_id, user_titles(title_id, title:titles(*)), active_title:titles!active_title_id(*)",
      )
      .eq("id", currentUser.id)
      .single();

    if (!user) {
      return { error: "User not found" };
    }

    // すべての称号を取得
    const { data: rawAllTitles } = await supabase
      .from("titles")
      .select("*")
      .order("created_at", { ascending: true });

    const allTitles = mapToCamel<
      {
        id: string;
        name: string;
        description: string | null;
        type: string;
        rarity: string;
      }[]
    >(rawAllTitles ?? []);

    type RawUserTitleEntry = { title_id: string };
    const userTitleEntries = (user.user_titles ?? []) as RawUserTitleEntry[];
    const unlockedTitleIds = new Set(userTitleEntries.map((ut) => ut.title_id));

    // 称号をカテゴリ別に整理
    const titlesByCategory = allTitles.reduce(
      (acc, title) => {
        const category = title.type;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          ...title,
          isUnlocked: unlockedTitleIds.has(title.id),
          isActive: (user.active_title_id ?? null) === title.id,
        });
        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          name: string;
          description: string | null;
          type: string;
          isUnlocked: boolean;
          isActive: boolean;
        }[]
      >,
    );

    const activeTitle = user.active_title
      ? mapToCamel<{ id: string; name: string }>(user.active_title)
      : null;

    return {
      titlesByCategory,
      activeTitle,
      totalUnlocked: userTitleEntries.length,
      totalTitles: allTitles.length,
    };
  } catch (error) {
    console.error("Error fetching titles:", error);
    return {
      error: "Internal server error",
    };
  }
}

export async function setActiveTitle(titleId: string | null) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    // titleIdがnullの場合は称号を無効化
    if (titleId === null) {
      await supabase
        .from("users")
        .update({ active_title_id: null })
        .eq("id", currentUser.id);
      revalidatePath("/me");
      revalidatePath("/titles");
      return { success: true, message: "Title deactivated" };
    }

    // ユーザーがその称号を獲得しているか確認
    const { data: userTitle } = await supabase
      .from("user_titles")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("title_id", titleId)
      .maybeSingle();

    if (!userTitle) {
      return {
        error: "Title not unlocked",
      };
    }

    // アクティブな称号を更新
    await supabase
      .from("users")
      .update({ active_title_id: titleId })
      .eq("id", currentUser.id);

    revalidatePath("/me");
    revalidatePath("/titles");
    return { success: true, message: "Title activated" };
  } catch (error) {
    console.error("Error setting active title:", error);
    return {
      error: "Internal server error",
    };
  }
}
