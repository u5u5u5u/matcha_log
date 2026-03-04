import { createClient } from "@supabase/supabase-js";
import { updateUserTitles } from "../src/lib/titleUtils";
import * as dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function updateAllUserTitles() {
  console.log("Updating titles for all users...");

  const { data: users } = await supabase
    .from("users")
    .select("id, name, email");

  if (!users) {
    console.log("No users found");
    return;
  }

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    console.log(`Updating titles for user: ${user.name || user.email}`);
    try {
      const newTitles = await updateUserTitles(user.id);
      if (newTitles && newTitles.length > 0) {
        console.log(
          `  -> Unlocked ${newTitles.length} new titles: ${newTitles
            .map((t: { name: string }) => t.name)
            .join(", ")}`
        );
      } else {
        console.log(`  -> No new titles unlocked`);
      }
    } catch (error) {
      console.error(`  -> Error updating titles for user ${user.id}:`, error);
    }
  }

  console.log("Done!");
}

updateAllUserTitles().catch((e) => {
  console.error(e);
  process.exit(1);
});
