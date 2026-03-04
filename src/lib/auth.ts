import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

/**
 * Server Components / Server Actions でログイン中のユーザーを取得する
 * next-auth の getServerSession() の代替
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
