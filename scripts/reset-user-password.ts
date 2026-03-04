/**
 * 指定ユーザーのパスワードを管理者権限でリセットするスクリプト
 * 使用例: npx ts-node --project tsconfig.scripts.json scripts/reset-user-password.ts <email> <newPassword>
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function resetPassword(email: string, newPassword: string) {
  // auth.usersからユーザーを検索
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("ユーザー一覧取得エラー:", listError.message);
    process.exit(1);
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    console.error(`ユーザーが見つかりません: ${email}`);
    console.log("登録済みユーザー:");
    users.forEach((u) => console.log(`  - ${u.email}`));
    process.exit(1);
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (error) {
    console.error("パスワードリセット失敗:", error.message);
    process.exit(1);
  }

  console.log(`✅ パスワードをリセットしました: ${email}`);
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error(
    "使用法: npx ts-node scripts/reset-user-password.ts <email> <newPassword>",
  );
  process.exit(1);
}

resetPassword(email, password);
