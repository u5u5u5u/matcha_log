"use server";

import { supabase, mapToCamel } from "@/lib/supabase";
import { getServerUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMyProfile() {
  try {
    const currentUser = await getServerUser();

    if (!currentUser) {
      return { error: "認証が必要です" };
    }

    const { data: rawUser } = await supabase
      .from("users")
      .select(
        `name, email, icon_url, active_title_id,
         active_title:titles!active_title_id(id, name),
         following:follows!follower_id(following_id, following_user:users!following_id(name, icon_url, id)),
         followers:follows!following_id(follower_id, follower_user:users!follower_id(name, icon_url, id))`,
      )
      .eq("id", currentUser.id)
      .single();

    type RawFollow = {
      following_id: string;
      following_user: {
        name: string | null;
        icon_url: string | null;
        id: string;
      } | null;
    };
    type RawFollower = {
      follower_id: string;
      follower_user: {
        name: string | null;
        icon_url: string | null;
        id: string;
      } | null;
    };
    type RawUser = {
      name: string | null;
      email: string;
      icon_url: string | null;
      active_title_id: string | null;
      active_title: { id: string; name: string } | null;
      following: RawFollow[];
      followers: RawFollower[];
    };

    const user = rawUser as RawUser | null;

    const { data: rawPosts } = await supabase
      .from("posts")
      .select("*, images(url), shop:shops(name)")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    const { data: rawLikedPosts } = await supabase
      .from("posts")
      .select("*, images(url), shop:shops(name), likes!inner(user_id)")
      .eq("likes.user_id", currentUser.id)
      .order("created_at", { ascending: false });

    const posts = mapToCamel(rawPosts ?? []);
    const likedPosts = mapToCamel(rawLikedPosts ?? []);

    return {
      user: {
        name: user?.name || "",
        email: user?.email || "",
        iconUrl: user?.icon_url || undefined,
        activeTitle: user?.active_title || null,
        followingList:
          user?.following?.map((f) => ({
            id: f.following_user?.id ?? "",
            name: f.following_user?.name ?? null,
            iconUrl: f.following_user?.icon_url ?? null,
          })) || [],
        followerList:
          user?.followers?.map((f) => ({
            id: f.follower_user?.id ?? "",
            name: f.follower_user?.name ?? null,
            iconUrl: f.follower_user?.icon_url ?? null,
          })) || [],
      },
      posts,
      likedPosts,
    };
  } catch (error) {
    console.error("マイページデータの取得に失敗しました:", error);
    return {
      error: "データの取得に失敗しました",
    };
  }
}

export async function updateProfile(
  name: string,
  email: string,
  iconUrl?: string,
) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "認証が必要です" };
    }

    if (!name || !email) {
      return {
        error: "名前とメールアドレスは必須です",
      };
    }

    await supabase
      .from("users")
      .update({ name, email, icon_url: iconUrl ?? null })
      .eq("id", currentUser.id);

    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return { error: "プロフィール更新に失敗しました" };
  }
}
