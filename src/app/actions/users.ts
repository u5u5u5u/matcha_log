"use server";

import { supabase, mapToCamel } from "@/lib/supabase";
import { getServerUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  try {
    const currentUser = await getServerUser();
    const meId = currentUser?.id;

    const { data: rawUser } = await supabase
      .from("users")
      .select(
        `id, name, email, icon_url, active_title_id,
         active_title:titles!active_title_id(id, name),
         following:follows!follower_id(following_id, following_user:users!following_id(name, icon_url, id)),
         followers:follows!following_id(follower_id, follower_user:users!follower_id(name, icon_url, id))`,
      )
      .eq("id", userId)
      .single();

    if (!rawUser) {
      return {
        error: "ユーザーが見つかりません",
      };
    }

    const { data: rawPosts } = await supabase
      .from("posts")
      .select("*, images(url), shop:shops(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const posts = mapToCamel(rawPosts ?? []);

    let initialIsFollowing = false;
    if (meId && meId !== userId) {
      const { data: follow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", meId)
        .eq("following_id", userId)
        .maybeSingle();
      initialIsFollowing = !!follow;
    }

    type RawFollow = {
      following_id: string;
      following_user:
        | { name: string | null; icon_url: string | null; id: string }
        | { name: string | null; icon_url: string | null; id: string }[]
        | null;
    };
    type RawFollower = {
      follower_id: string;
      follower_user:
        | { name: string | null; icon_url: string | null; id: string }
        | { name: string | null; icon_url: string | null; id: string }[]
        | null;
    };
    type RawUserProfile = typeof rawUser & {
      following: RawFollow[];
      followers: RawFollower[];
      active_title: { id: string; name: string } | null;
    };
    const user = rawUser as RawUserProfile;

    const getFollowingUser = (f: RawFollow) => {
      const fu = f.following_user;
      return Array.isArray(fu) ? fu[0] : fu;
    };
    const getFollowerUser = (f: RawFollower) => {
      const fu = f.follower_user;
      return Array.isArray(fu) ? fu[0] : fu;
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        iconUrl: user.icon_url,
        activeTitle: user.active_title,
      },
      posts,
      followingList:
        user.following?.map((f) => {
          const fu = getFollowingUser(f);
          return {
            id: fu?.id ?? "",
            name: fu?.name ?? null,
            iconUrl: fu?.icon_url ?? null,
          };
        }) || [],
      followerList:
        user.followers?.map((f) => {
          const fu = getFollowerUser(f);
          return {
            id: fu?.id ?? "",
            name: fu?.name ?? null,
            iconUrl: fu?.icon_url ?? null,
          };
        }) || [],
      initialIsFollowing,
      showFollowButton: meId !== undefined && meId !== userId,
    };
  } catch (error) {
    console.error("ユーザープロフィールデータの取得に失敗しました:", error);
    return {
      error: "データの取得に失敗しました",
    };
  }
}

export async function followUser(userId: string) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "unauthorized" };
    }

    if (currentUser.id === userId) {
      return { error: "cannot follow yourself" };
    }

    await supabase
      .from("follows")
      .upsert(
        { follower_id: currentUser.id, following_id: userId },
        { onConflict: "follower_id,following_id" },
      );

    revalidatePath(`/user/${userId}`);
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("フォローエラー:", error);
    return { error: "フォローに失敗しました" };
  }
}

export async function unfollowUser(userId: string) {
  try {
    const currentUser2 = await getServerUser();
    if (!currentUser2) {
      return { error: "unauthorized" };
    }

    await supabase
      .from("follows")
      .delete()
      .eq("follower_id", currentUser2.id)
      .eq("following_id", userId);

    revalidatePath(`/user/${userId}`);
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    console.error("フォロー解除エラー:", error);
    return { error: "フォロー解除に失敗しました" };
  }
}

export async function checkIsFollowing(userId: string) {
  try {
    const currentUser3 = await getServerUser();
    if (!currentUser3) {
      return { isFollowing: false };
    }

    if (currentUser3.id === userId) {
      return { isFollowing: false };
    }

    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser3.id)
      .eq("following_id", userId)
      .maybeSingle();

    return { isFollowing: !!follow };
  } catch (error) {
    console.error("フォロー状態確認エラー:", error);
    return { isFollowing: false };
  }
}
