import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const POST_IMAGES_BUCKET =
  process.env.SUPABASE_STORAGE_POST_IMAGES_BUCKET ?? "post-images";
const USER_ICONS_BUCKET =
  process.env.SUPABASE_STORAGE_USER_ICONS_BUCKET ?? "user-icons";

const sourceHostKeyword = "blob.vercel-storage.com";

const args = process.argv.slice(2);
const isApplyMode = args.includes("--apply");
const usersOnly = args.includes("--users-only");
const imagesOnly = args.includes("--images-only");

if (usersOnly && imagesOnly) {
  console.error(
    "--users-only と --images-only は同時に指定できません。どちらか一方のみ指定してください。",
  );
  process.exit(1);
}

if (args.includes("--help")) {
  console.log(`
Vercel Blob から Supabase Storage へ既存画像URLを移行します。

Usage:
  tsx scripts/migrate-blob-to-supabase-storage.ts [options]

Options:
  --apply         実際に Storage へアップロードし、DB の URL を更新
                  指定しない場合は dry-run（件数確認のみ）
  --users-only    users.icon_url のみ移行
  --images-only   images.url のみ移行
  --limit=N       対象件数を上位 N 件に制限
  --help          このヘルプを表示

Examples:
  pnpm migrate-storage -- --limit=20
  pnpm migrate-storage -- --apply
  pnpm migrate-storage -- --apply --users-only --limit=50
`);
  process.exit(0);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です。",
  );
  process.exit(1);
}

const limitArg = args.find((arg) => arg.startsWith("--limit="));
let limit: number | undefined;
if (limitArg) {
  const raw = Number(limitArg.split("=")[1]);
  if (!Number.isInteger(raw) || raw <= 0) {
    console.error("--limit は 1 以上の整数で指定してください");
    process.exit(1);
  }
  limit = raw;
}

const shouldMigrateImages = !usersOnly;
const shouldMigrateUsers = !imagesOnly;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any>(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

type ImageRow = {
  id: string;
  url: string;
};

type UserRow = {
  id: string;
  icon_url: string | null;
};

type UserRowWithIcon = {
  id: string;
  icon_url: string;
};

type MigrationStats = {
  target: "images" | "users";
  candidates: number;
  migrated: number;
  failed: number;
  bytesUploaded: number;
};

const mimeToExt: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/avif": "avif",
};

const extToMime: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  avif: "image/avif",
};

function isBlobStorageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(sourceHostKeyword);
  } catch {
    return false;
  }
}

function getExtFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split("/").pop() ?? "";
    const ext = last.split(".").pop()?.toLowerCase();
    if (ext && /^[a-z0-9]{1,8}$/.test(ext)) {
      return ext;
    }
    return null;
  } catch {
    return null;
  }
}

function getExtension(url: string, contentType: string | null): string {
  const normalizedType = contentType?.split(";")[0].trim().toLowerCase();
  if (normalizedType && mimeToExt[normalizedType]) {
    return mimeToExt[normalizedType];
  }

  const extFromUrl = getExtFromUrl(url);
  if (extFromUrl) {
    return extFromUrl;
  }

  return "bin";
}

function getContentType(extension: string, contentType: string | null): string {
  const normalizedType = contentType?.split(";")[0].trim().toLowerCase();
  if (normalizedType) {
    return normalizedType;
  }
  return extToMime[extension] ?? "application/octet-stream";
}

async function uploadUrlToSupabase(
  sourceUrl: string,
  bucket: string,
  directory: string,
): Promise<{ newUrl: string; bytes: number }> {
  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent": "MatchaLogMigration/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`画像取得失敗: ${response.status} ${response.statusText}`);
  }

  const contentTypeHeader = response.headers.get("content-type");
  const arrayBuffer = await response.arrayBuffer();
  const extension = getExtension(sourceUrl, contentTypeHeader);
  const contentType = getContentType(extension, contentTypeHeader);

  const storagePath = `${directory}/${new Date().toISOString().slice(0, 10)}/${Date.now()}_${randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, Buffer.from(arrayBuffer), {
      cacheControl: "31536000",
      contentType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (!publicUrlData.publicUrl) {
    throw new Error("公開URL取得に失敗しました");
  }

  return {
    newUrl: publicUrlData.publicUrl,
    bytes: arrayBuffer.byteLength,
  };
}

async function fetchImageRows(limitValue?: number): Promise<ImageRow[]> {
  let query = supabase
    .from("images")
    .select("id, url")
    .ilike("url", `%${sourceHostKeyword}%`)
    .order("id", { ascending: true });

  if (limitValue) {
    query = query.limit(limitValue);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ImageRow[];
  return rows.filter(
    (row) => typeof row.url === "string" && isBlobStorageUrl(row.url),
  );
}

async function fetchUserRows(limitValue?: number): Promise<UserRowWithIcon[]> {
  let query = supabase
    .from("users")
    .select("id, icon_url")
    .not("icon_url", "is", null)
    .ilike("icon_url", `%${sourceHostKeyword}%`)
    .order("id", { ascending: true });

  if (limitValue) {
    query = query.limit(limitValue);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  const rows = (data ?? []) as UserRow[];
  return rows.filter(
    (row): row is UserRowWithIcon =>
      typeof row.icon_url === "string" && isBlobStorageUrl(row.icon_url),
  );
}

async function migrateImageUrls(limitValue?: number): Promise<MigrationStats> {
  const rows = await fetchImageRows(limitValue);

  const stats: MigrationStats = {
    target: "images",
    candidates: rows.length,
    migrated: 0,
    failed: 0,
    bytesUploaded: 0,
  };

  if (!isApplyMode) {
    console.log(`images: ${rows.length} 件が移行対象です（dry-run）`);
    rows.slice(0, 10).forEach((row) => {
      console.log(`  - images.id=${row.id}`);
    });
    return stats;
  }

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      const { newUrl, bytes } = await uploadUrlToSupabase(
        row.url,
        POST_IMAGES_BUCKET,
        "legacy/post-images",
      );

      const { error } = await supabase
        .from("images")
        .update({ url: newUrl })
        .eq("id", row.id);

      if (error) {
        throw error;
      }

      stats.migrated += 1;
      stats.bytesUploaded += bytes;
      console.log(
        `[images ${index + 1}/${rows.length}] migrated: id=${row.id} (${Math.round(bytes / 1024)}KB)`,
      );
    } catch (error) {
      stats.failed += 1;
      console.error(
        `[images ${index + 1}/${rows.length}] failed: id=${row.id}`,
        error,
      );
    }
  }

  return stats;
}

async function migrateUserIcons(limitValue?: number): Promise<MigrationStats> {
  const rows = await fetchUserRows(limitValue);

  const stats: MigrationStats = {
    target: "users",
    candidates: rows.length,
    migrated: 0,
    failed: 0,
    bytesUploaded: 0,
  };

  if (!isApplyMode) {
    console.log(`users: ${rows.length} 件が移行対象です（dry-run）`);
    rows.slice(0, 10).forEach((row) => {
      console.log(`  - users.id=${row.id}`);
    });
    return stats;
  }

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    try {
      const { newUrl, bytes } = await uploadUrlToSupabase(
        row.icon_url,
        USER_ICONS_BUCKET,
        "legacy/user-icons",
      );

      const { error } = await supabase
        .from("users")
        .update({ icon_url: newUrl })
        .eq("id", row.id);

      if (error) {
        throw error;
      }

      stats.migrated += 1;
      stats.bytesUploaded += bytes;
      console.log(
        `[users ${index + 1}/${rows.length}] migrated: id=${row.id} (${Math.round(bytes / 1024)}KB)`,
      );
    } catch (error) {
      stats.failed += 1;
      console.error(
        `[users ${index + 1}/${rows.length}] failed: id=${row.id}`,
        error,
      );
    }
  }

  return stats;
}

function printSummary(results: MigrationStats[]): void {
  const totalCandidates = results.reduce(
    (sum, result) => sum + result.candidates,
    0,
  );
  const totalMigrated = results.reduce(
    (sum, result) => sum + result.migrated,
    0,
  );
  const totalFailed = results.reduce((sum, result) => sum + result.failed, 0);
  const totalBytes = results.reduce(
    (sum, result) => sum + result.bytesUploaded,
    0,
  );

  console.log("\n========== Migration Summary ==========");
  for (const result of results) {
    console.log(
      `${result.target}: candidates=${result.candidates}, migrated=${result.migrated}, failed=${result.failed}`,
    );
  }
  console.log(
    `TOTAL: candidates=${totalCandidates}, migrated=${totalMigrated}, failed=${totalFailed}, uploaded=${Math.round(totalBytes / 1024)}KB`,
  );

  if (!isApplyMode) {
    console.log(
      "\n※ dry-run です。実際に移行する場合は --apply を付けて再実行してください。",
    );
  }
}

async function main() {
  console.log(
    `Start migration mode=${isApplyMode ? "apply" : "dry-run"}, limit=${limit ?? "none"}, postBucket=${POST_IMAGES_BUCKET}, userBucket=${USER_ICONS_BUCKET}`,
  );

  const results: MigrationStats[] = [];

  if (shouldMigrateImages) {
    results.push(await migrateImageUrls(limit));
  }

  if (shouldMigrateUsers) {
    results.push(await migrateUserIcons(limit));
  }

  printSummary(results);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
