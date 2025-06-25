import { PrismaClient, TitleType, TitleRarity } from "@/generated/prisma";

const prisma = new PrismaClient();

const titles = [
  // 投稿数系
  { name: "抹茶新人", description: "初めての投稿をお疲れ様！", type: TitleType.POST_COUNT, condition: { minPosts: 0 }, rarity: TitleRarity.COMMON },
  { name: "抹茶初心者", description: "5回の投稿を達成しました", type: TitleType.POST_COUNT, condition: { minPosts: 5 }, rarity: TitleRarity.COMMON },
  { name: "抹茶ファン", description: "10回の投稿を達成しました", type: TitleType.POST_COUNT, condition: { minPosts: 10 }, rarity: TitleRarity.RARE },
  { name: "抹茶愛好家", description: "20回の投稿を達成しました", type: TitleType.POST_COUNT, condition: { minPosts: 20 }, rarity: TitleRarity.RARE },
  { name: "抹茶エキスパート", description: "50回の投稿を達成しました", type: TitleType.POST_COUNT, condition: { minPosts: 50 }, rarity: TitleRarity.EPIC },
  { name: "抹茶マスター", description: "100回の投稿を達成しました", type: TitleType.POST_COUNT, condition: { minPosts: 100 }, rarity: TitleRarity.LEGENDARY },

  // 苦味系
  { name: "苦味探求者", description: "苦味への第一歩", type: TitleType.TASTE_BITTER, condition: { minAvg: 0, maxAvg: 4.9 }, rarity: TitleRarity.COMMON },
  { name: "苦味愛好家", description: "苦味の魅力を知る者", type: TitleType.TASTE_BITTER, condition: { minAvg: 5, maxAvg: 6.9 }, rarity: TitleRarity.RARE },
  { name: "苦味マスター", description: "苦味を極めし者", type: TitleType.TASTE_BITTER, condition: { minAvg: 7, maxAvg: 7.9 }, rarity: TitleRarity.EPIC },
  { name: "苦味の求道者", description: "苦味の道を究める者", type: TitleType.TASTE_BITTER, condition: { minAvg: 8, maxAvg: 10 }, rarity: TitleRarity.LEGENDARY },

  // 濃厚系
  { name: "濃厚探求者", description: "濃厚な味わいの始まり", type: TitleType.TASTE_RICH, condition: { minAvg: 0, maxAvg: 4.9 }, rarity: TitleRarity.COMMON },
  { name: "濃厚愛好家", description: "濃厚さを愛する者", type: TitleType.TASTE_RICH, condition: { minAvg: 5, maxAvg: 6.9 }, rarity: TitleRarity.RARE },
  { name: "濃厚マスター", description: "濃厚さを極めし者", type: TitleType.TASTE_RICH, condition: { minAvg: 7, maxAvg: 7.9 }, rarity: TitleRarity.EPIC },
  { name: "濃厚の極み", description: "濃厚さの頂点に立つ者", type: TitleType.TASTE_RICH, condition: { minAvg: 8, maxAvg: 10 }, rarity: TitleRarity.LEGENDARY },

  // 甘味系
  { name: "甘味探求者", description: "甘さへの憧れ", type: TitleType.TASTE_SWEET, condition: { minAvg: 0, maxAvg: 4.9 }, rarity: TitleRarity.COMMON },
  { name: "甘味愛好家", description: "甘さを愛する者", type: TitleType.TASTE_SWEET, condition: { minAvg: 5, maxAvg: 6.9 }, rarity: TitleRarity.RARE },
  { name: "甘味マスター", description: "甘さを極めし者", type: TitleType.TASTE_SWEET, condition: { minAvg: 7, maxAvg: 7.9 }, rarity: TitleRarity.EPIC },
  { name: "甘味の天使", description: "甘さの化身", type: TitleType.TASTE_SWEET, condition: { minAvg: 8, maxAvg: 10 }, rarity: TitleRarity.LEGENDARY },

  // バランス系
  { name: "味覚の調和者", description: "バランスの取れた味覚を持つ者", type: TitleType.TASTE_BALANCE, condition: { minAvg: 0, maxAvg: 3.9 }, rarity: TitleRarity.COMMON },
  { name: "バランス探求者", description: "調和を求める者", type: TitleType.TASTE_BALANCE, condition: { minAvg: 4, maxAvg: 5.9 }, rarity: TitleRarity.RARE },
  { name: "バランスマスター", description: "完璧な調和を理解する者", type: TitleType.TASTE_BALANCE, condition: { minAvg: 6, maxAvg: 7.9 }, rarity: TitleRarity.EPIC },
  { name: "完璧なバランサー", description: "究極の調和を体現する者", type: TitleType.TASTE_BALANCE, condition: { minAvg: 8, maxAvg: 10 }, rarity: TitleRarity.LEGENDARY },
];

async function seedTitles() {
  console.log("Seeding titles...");
  
  for (const title of titles) {
    await prisma.title.upsert({
      where: { name: title.name },
      update: {},
      create: {
        name: title.name,
        description: title.description,
        type: title.type,
        condition: title.condition,
        rarity: title.rarity,
      },
    });
  }
  
  console.log("Titles seeded successfully!");
}

seedTitles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
