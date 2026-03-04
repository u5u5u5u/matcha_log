"use server";

import { supabase, mapToCamel } from "@/lib/supabase";
import { getServerUser } from "@/lib/auth";
import type { Category } from "@/types/post";
import { updateUserTitles } from "@/lib/titleUtils";
import { revalidatePath } from "next/cache";

export async function getPosts(take: number = 10, skip: number = 0) {
  try {
    const currentUser = await getServerUser();

    const { data: rawPosts } = await supabase
      .from("posts")
      .select(
        "*, images(*), shop:shops(*), user:users(id,email,name,icon_url,created_at,updated_at), likes(*)",
      )
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    const posts = mapToCamel(rawPosts ?? []);

    return {
      posts,
      myId: currentUser?.id || null,
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
    const { data: rawPost } = await supabase
      .from("posts")
      .select("*, images(*), shop:shops(*)")
      .eq("id", id)
      .single();

    if (!rawPost) {
      return {
        error: "投稿が見つかりません",
      };
    }

    const post = mapToCamel(rawPost);
    return { post };
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return { error: "投稿の取得に失敗しました" };
  }
}

export async function createPost(formData: FormData) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
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
    let shopId: string | null = null;
    if (shopName) {
      const { data: existingShop } = await supabase
        .from("shops")
        .select("id")
        .eq("name", shopName)
        .maybeSingle();
      if (existingShop) {
        shopId = existingShop.id;
      } else {
        const { data: newShop } = await supabase
          .from("shops")
          .insert({ name: shopName })
          .select("id")
          .single();
        shopId = newShop?.id ?? null;
      }
    }

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert({
        title,
        category,
        bitterness,
        richness,
        sweetness,
        comment: comment || null,
        user_id: currentUser.id,
        shop_id: shopId,
      })
      .select("id")
      .single();

    if (error || !newPost) {
      return { error: "投稿の作成に失敗しました" };
    }

    if (images.filter(Boolean).length > 0) {
      await supabase
        .from("images")
        .insert(
          images.filter(Boolean).map((url) => ({ url, post_id: newPost.id })),
        );
    }

    // 称号獲得状況を更新
    await updateUserTitles(currentUser.id);

    const { data: rawPost } = await supabase
      .from("posts")
      .select("*, images(*)")
      .eq("id", newPost.id)
      .single();
    const post = mapToCamel(rawPost);

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
    const currentUser = await getServerUser();
    if (!currentUser) {
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
    const { data: rawPost } = await supabase
      .from("posts")
      .select("*, user:users(id)")
      .eq("id", id)
      .single();
    if (!rawPost) {
      return {
        error: "投稿が見つかりません",
      };
    }
    const postData = mapToCamel<{ id: string; user: { id: string } }>(rawPost);
    if (postData.user.id !== currentUser.id) {
      return {
        error: "編集権限がありません",
      };
    }

    // 店舗情報の登録・取得
    let shopId: string | null = null;
    if (shopName) {
      const { data: existingShop } = await supabase
        .from("shops")
        .select("id")
        .eq("name", shopName)
        .maybeSingle();
      if (existingShop) {
        // 既存店舗の緯度・経度を更新
        if (shopLat || shopLng) {
          await supabase
            .from("shops")
            .update({
              lat: shopLat ? Number(shopLat) : undefined,
              lng: shopLng ? Number(shopLng) : undefined,
            })
            .eq("id", existingShop.id);
        }
        shopId = existingShop.id;
      } else {
        const { data: newShop } = await supabase
          .from("shops")
          .insert({
            name: shopName,
            lat: shopLat ? Number(shopLat) : null,
            lng: shopLng ? Number(shopLng) : null,
          })
          .select("id")
          .single();
        shopId = newShop?.id ?? null;
      }
    }

    await supabase
      .from("posts")
      .update({
        title,
        category,
        bitterness,
        richness,
        sweetness,
        comment: comment || null,
        shop_id: shopId,
      })
      .eq("id", id);

    // 既存画像を削除
    await supabase.from("images").delete().eq("post_id", id);

    // 新しい画像を追加
    if (imageUrls.length > 0) {
      await supabase
        .from("images")
        .insert(imageUrls.map((url) => ({ url, post_id: id })));
    }

    const updated = mapToCamel(rawPost);

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
    const currentUserDel = await getServerUser();
    if (!currentUserDel) {
      return { error: "認証が必要です" };
    }

    const { data: rawPost2 } = await supabase
      .from("posts")
      .select("*, user:users(id)")
      .eq("id", id)
      .single();

    if (!rawPost2) {
      return {
        error: "投稿が見つかりません",
      };
    }
    const deletePost = mapToCamel<{ id: string; user: { id: string } }>(
      rawPost2,
    );
    if (deletePost.user.id !== currentUserDel.id) {
      return {
        error: "削除権限がありません",
      };
    }

    await supabase.from("images").delete().eq("post_id", id);
    await supabase.from("likes").delete().eq("post_id", id);
    await supabase.from("posts").delete().eq("id", id);

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
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const userId = currentUser.id;
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });
    if (error) {
      return { error: "いいねに失敗しました" };
    }

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
    const currentUser = await getServerUser();
    if (!currentUser) {
      return { error: "Unauthorized" };
    }

    const userId = currentUser.id;
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    revalidatePath("/posts");
    revalidatePath(`/post/${postId}`);
    return { ok: true };
  } catch (error) {
    console.error("いいね解除エラー:", error);
    return { error: "いいね解除に失敗しました" };
  }
}
