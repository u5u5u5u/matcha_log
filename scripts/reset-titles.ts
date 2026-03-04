import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const newTitles = [
  // 投稿数系
  {
    name: "抹茶ビギナー",
    description: "初めての投稿をお疲れ様！",
    type: "POST_COUNT",
    condition: { minPosts: 1 },
    rarity: "COMMON",
  },
  {
    name: "茶葉鑑定士",
    description: "10回の投稿を達成しました",
    type: "POST_COUNT",
    condition: { minPosts: 10 },
    rarity: "COMMON",
  },
  {
    name: "抹茶博士",
    description: "50回の投稿を達成しました",
    type: "POST_COUNT",
    condition: { minPosts: 50 },
    rarity: "COMMON",
  },
  {
    name: "ティーマイスター",
    description: "100回の投稿を達成しました",
    type: "POST_COUNT",
    condition: { minPosts: 100 },
    rarity: "COMMON",
  },
  {
    name: "抹茶の匠",
    description: "200回の投稿を達成しました",
    type: "POST_COUNT",
    condition: { minPosts: 200 },
    rarity: "COMMON",
  },
  {
    name: "ゴッド・オブ・マッチャ",
    description: "500回の投稿を達成しました",
    type: "POST_COUNT",
    condition: { minPosts: 500 },
    rarity: "COMMON",
  },

  // 苦味系
  {
    name: "苦味チャレンジャー",
    description: "苦味合計50を達成しました",
    type: "TASTE_BITTER",
    condition: { minTotal: 50 },
    rarity: "COMMON",
  },
  {
    name: "苦味鑑定士",
    description: "苦味合計150を達成しました",
    type: "TASTE_BITTER",
    condition: { minTotal: 150 },
    rarity: "COMMON",
  },
  {
    name: "苦味コレクター",
    description: "苦味合計300を達成しました",
    type: "TASTE_BITTER",
    condition: { minTotal: 300 },
    rarity: "COMMON",
  },
  {
    name: "The Bitterness Taster",
    description: "苦味合計500を達成しました",
    type: "TASTE_BITTER",
    condition: { minTotal: 500 },
    rarity: "COMMON",
  },
  {
    name: "ゴッド・オブ・ビター",
    description: "苦味合計1000を達成しました",
    type: "TASTE_BITTER",
    condition: { minTotal: 1000 },
    rarity: "COMMON",
  },

  // 濃厚系
  {
    name: "コクの探求者",
    description: "濃さ合計50を達成しました",
    type: "TASTE_RICH",
    condition: { minTotal: 50 },
    rarity: "COMMON",
  },
  {
    name: "濃厚鑑定士",
    description: "濃さ合計150を達成しました",
    type: "TASTE_RICH",
    condition: { minTotal: 150 },
    rarity: "COMMON",
  },
  {
    name: "濃厚コレクター",
    description: "濃さ合計300を達成しました",
    type: "TASTE_RICH",
    condition: { minTotal: 300 },
    rarity: "COMMON",
  },
  {
    name: "The Richness Taster",
    description: "濃さ合計500を達成しました",
    type: "TASTE_RICH",
    condition: { minTotal: 500 },
    rarity: "COMMON",
  },
  {
    name: "ゴッド・オブ・リッチ",
    description: "濃さ合計1000を達成しました",
    type: "TASTE_RICH",
    condition: { minTotal: 1000 },
    rarity: "COMMON",
  },

  // 甘味系
  {
    name: "シュガーラバー",
    description: "甘さ合計50を達成しました",
    type: "TASTE_SWEET",
    condition: { minTotal: 50 },
    rarity: "COMMON",
  },
  {
    name: "甘味鑑定士",
    description: "甘さ合計150を達成しました",
    type: "TASTE_SWEET",
    condition: { minTotal: 150 },
    rarity: "COMMON",
  },
  {
    name: "甘味コレクター",
    description: "甘さ合計300を達成しました",
    type: "TASTE_SWEET",
    condition: { minTotal: 300 },
    rarity: "COMMON",
  },
  {
    name: "The Sweetness Taster",
    description: "甘さ合計500を達成しました",
    type: "TASTE_SWEET",
    condition: { minTotal: 500 },
    rarity: "COMMON",
  },
  {
    name: "ゴッド・オブ・スイーツ",
    description: "甘さ合計1000を達成しました",
    type: "TASTE_SWEET",
    condition: { minTotal: 1000 },
    rarity: "COMMON",
  },
];

async function resetTitles() {
  console.log("Resetting titles...");

  // 1. まず、すべてのユーザー称号の関連を削除
  console.log("Deleting all user titles...");
  await supabase.from("user_titles").delete().neq("id", "");

  // 2. アクティブ称号をリセット
  console.log("Resetting active titles...");
  await supabase.from("users").update({ active_title_id: null }).neq("id", "");

  // 3. すべての称号を削除
  console.log("Deleting all titles...");
  await supabase.from("titles").delete().neq("id", "");

  // 4. 新しい称号を作成
  console.log("Creating new titles...");
  for (const title of newTitles) {
    const { error } = await supabase.from("titles").insert({
      name: title.name,
      description: title.description,
      type: title.type,
      condition: title.condition,
      rarity: title.rarity,
    });
    if (error) {
      console.error(`Error creating title "${title.name}":`, error);
    } else {
      console.log(`Created title: ${title.name}`);
    }
  }

  console.log("Titles reset successfully!");
  console.log(`Created ${newTitles.length} new titles`);
}

resetTitles().catch((e) => {
  console.error(e);
  process.exit(1);
});
