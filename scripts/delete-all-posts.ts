import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function deleteAllPosts() {
  try {
    console.log("投稿の削除を開始します...");

    // 関連するデータを順番に削除
    console.log("1. Likeテーブルの投稿関連データを削除中...");
    const { count: likeCount } = await supabase.from("likes").delete().neq("id", "");
    console.log(`${likeCount ?? 0}件のLikeを削除しました`);

    console.log("2. Imageテーブルの投稿関連データを削除中...");
    const { count: imageCount } = await supabase.from("images").delete().neq("id", "");
    console.log(`${imageCount ?? 0}件のImageを削除しました`);

    console.log("3. Postテーブルのデータを削除中...");
    const { count: postCount } = await supabase.from("posts").delete().neq("id", "");
    console.log(`${postCount ?? 0}件のPostを削除しました`);

    console.log("✅ 全ての投稿データの削除が完了しました");
  } catch (error) {
    console.error("❌ 削除中にエラーが発生しました:", error);
  } finally {
    process.exit(0);
  }
}

// 確認プロンプト
console.log("⚠️  警告: このスクリプトは全ての投稿データを削除します");
console.log("実行を続行しますか？ (y/N)");

process.stdin.on("data", (data) => {
  const input = data.toString().trim().toLowerCase();
  if (input === "y" || input === "yes") {
    deleteAllPosts();
  } else {
    console.log("削除をキャンセルしました");
    process.exit(0);
  }
});
