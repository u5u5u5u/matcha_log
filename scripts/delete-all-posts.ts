import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function deleteAllPosts() {
  try {
    console.log("投稿の削除を開始します...");

    // 関連するデータを順番に削除
    console.log("1. Likeテーブルの投稿関連データを削除中...");
    const deletedLikes = await prisma.like.deleteMany({});
    console.log(`${deletedLikes.count}件のLikeを削除しました`);

    console.log("2. Imageテーブルの投稿関連データを削除中...");
    const deletedImages = await prisma.image.deleteMany({});
    console.log(`${deletedImages.count}件のImageを削除しました`);

    console.log("3. Postテーブルのデータを削除中...");
    const deletedPosts = await prisma.post.deleteMany({});
    console.log(`${deletedPosts.count}件のPostを削除しました`);

    console.log("✅ 全ての投稿データの削除が完了しました");
  } catch (error) {
    console.error("❌ 削除中にエラーが発生しました:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prismaクライアントを切断しました");
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
