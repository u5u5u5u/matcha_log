import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * サーバーサイド専用クライアント (RLS をバイパス)
 * Server Actions / Server Components 内で使用してください
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: { persistSession: false },
  }
);

// ========================================
// snake_case → camelCase 変換ユーティリティ
// Supabase は snake_case で返すが、既存コンポーネントは camelCase を期待する
// ========================================

type AnyObject = Record<string, unknown>;

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function mapToCamel<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map(mapToCamel) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const result: AnyObject = {};
    for (const [key, value] of Object.entries(obj as AnyObject)) {
      result[snakeToCamel(key)] = mapToCamel(value);
    }
    return result as T;
  }
  return obj as T;
}

// ========================================
// camelCase → snake_case 変換ユーティリティ
// INSERT / UPDATE 時に使用
// ========================================

function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}

export function mapToSnake<T extends AnyObject>(obj: T): AnyObject {
  const result: AnyObject = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
}
