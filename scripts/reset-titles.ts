import { PrismaClient, TitleType, TitleRarity } from "@/generated/prisma";

const prisma = new PrismaClient();

const newTitles = [
  // 投稿数系
  {
    name: "抹茶ビギナー",
    description: "初めての投稿をお疲れ様！",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 1 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "茶葉鑑定士",
    description: "10回の投稿を達成しました",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 10 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "抹茶博士",
    description: "50回の投稿を達成しました",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 50 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "ティーマイスター",
    description: "100回の投稿を達成しました",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 100 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "抹茶の匠",
    description: "200回の投稿を達成しました",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 200 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "ゴッド・オブ・マッチャ",
    description: "500回の投稿を達成しました",
    type: TitleType.POST_COUNT,
    condition: { minPosts: 500 },
    rarity: TitleRarity.COMMON,
  },

  // 苦味系
  {
    name: "苦味チャレンジャー",
    description: "苦味合計50を達成しました",
    type: TitleType.TASTE_BITTER,
    condition: { minTotal: 50 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "苦味鑑定士",
    description: "苦味合計150を達成しました",
    type: TitleType.TASTE_BITTER,
    condition: { minTotal: 150 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "苦味コレクター",
    description: "苦味合計300を達成しました",
    type: TitleType.TASTE_BITTER,
    condition: { minTotal: 300 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "The Bitterness Taster",
    description: "苦味合計500を達成しました",
    type: TitleType.TASTE_BITTER,
    condition: { minTotal: 500 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "ゴッド・オブ・ビター",
    description: "苦味合計1000を達成しました",
    type: TitleType.TASTE_BITTER,
    condition: { minTotal: 1000 },
    rarity: TitleRarity.COMMON,
  },

  // 濃厚系
  {
    name: "コクの探求者",
    description: "濃さ合計50を達成しました",
    type: TitleType.TASTE_RICH,
    condition: { minTotal: 50 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "濃厚鑑定士",
    description: "濃さ合計150を達成しました",
    type: TitleType.TASTE_RICH,
    condition: { minTotal: 150 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "濃厚コレクター",
    description: "濃さ合計300を達成しました",
    type: TitleType.TASTE_RICH,
    condition: { minTotal: 300 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "The Richness Taster",
    description: "濃さ合計500を達成しました",
    type: TitleType.TASTE_RICH,
    condition: { minTotal: 500 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "ゴッド・オブ・リッチ",
    description: "濃さ合計1000を達成しました",
    type: TitleType.TASTE_RICH,
    condition: { minTotal: 1000 },
    rarity: TitleRarity.COMMON,
  },

  // 甘味系
  {
    name: "シュガーラバー",
    description: "甘さ合計50を達成しました",
    type: TitleType.TASTE_SWEET,
    condition: { minTotal: 50 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "甘味鑑定士",
    description: "甘さ合計150を達成しました",
    type: TitleType.TASTE_SWEET,
    condition: { minTotal: 150 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "甘味コレクター",
    description: "甘さ合計300を達成しました",
    type: TitleType.TASTE_SWEET,
    condition: { minTotal: 300 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "The Sweetness Taster",
    description: "甘さ合計500を達成しました",
    type: TitleType.TASTE_SWEET,
    condition: { minTotal: 500 },
    rarity: TitleRarity.COMMON,
  },
  {
    name: "ゴッド・オブ・スイーツ",
    description: "甘さ合計1000を達成しました",
    type: TitleType.TASTE_SWEET,
    condition: { minTotal: 1000 },
    rarity: TitleRarity.COMMON,
  },
];

async function resetTitles() {
  console.log("Resetting titles...");

  // 1. まず、すべてのユーザー称号の関連を削除
  console.log("Deleting all user titles...");
  await prisma.userTitle.deleteMany({});

  // 2. アクティブ称号をリセット
  console.log("Resetting active titles...");
  await prisma.user.updateMany({
    data: {
      activeTitleId: null,
    },
  });

  // 3. すべての称号を削除
  console.log("Deleting all titles...");
  await prisma.title.deleteMany({});

  // 4. 新しい称号を作成
  console.log("Creating new titles...");
  for (const title of newTitles) {
    await prisma.title.create({
      data: {
        name: title.name,
        description: title.description,
        type: title.type,
        condition: title.condition,
        rarity: title.rarity,
      },
    });
    console.log(`Created title: ${title.name}`);
  }

  console.log("Titles reset successfully!");
  console.log(`Created ${newTitles.length} new titles`);
}

resetTitles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
