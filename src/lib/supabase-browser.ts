import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Components 用クライアント (anon key)
 * ログイン・ログアウト・セッション取得に使用
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
