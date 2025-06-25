import { PrismaClient } from "@/generated/prisma";
import { updateUserTitles } from "../src/lib/titleUtils";

const prisma = new PrismaClient();

async function updateAllUserTitles() {
  console.log("Updating titles for all users...");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    console.log(`Updating titles for user: ${user.name || user.email}`);
    try {
      const newTitles = await updateUserTitles(user.id);
      if (newTitles && newTitles.length > 0) {
        console.log(
          `  -> Unlocked ${newTitles.length} new titles: ${newTitles
            .map((t) => t.name)
            .join(", ")}`
        );
      } else {
        console.log(`  -> No new titles unlocked`);
      }
    } catch (error) {
      console.error(`  -> Error updating titles for user ${user.id}:`, error);
    }
  }

  console.log("Finished updating titles for all users!");
}

updateAllUserTitles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
