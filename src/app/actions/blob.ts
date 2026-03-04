"use server";

import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const POST_IMAGES_BUCKET =
  process.env.SUPABASE_STORAGE_POST_IMAGES_BUCKET ?? "post-images";
const USER_ICONS_BUCKET =
  process.env.SUPABASE_STORAGE_USER_ICONS_BUCKET ?? "user-icons";

function getFileExtension(file: File): string {
  const extFromName = file.name.split(".").pop()?.toLowerCase();
  if (extFromName && /^[a-z0-9]{1,8}$/.test(extFromName)) {
    return extFromName;
  }

  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  return mimeToExt[file.type] ?? "bin";
}

function generateStoragePath(file: File): string {
  const extension = getFileExtension(file);
  return `${Date.now()}_${crypto.randomUUID()}.${extension}`;
}

async function uploadToSupabaseStorage(file: File, bucket: string) {
  const path = generateStoragePath(file);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (!publicUrlData.publicUrl) {
    throw new Error("公開URLの取得に失敗しました");
  }

  return publicUrlData.publicUrl;
}

function validateFile(file: FormDataEntryValue | null): file is File {
  if (!file || typeof file === "string") {
    return false;
  }

  return true;
}

export async function uploadPostImage(formData: FormData) {
  try {
    const file = formData.get("file");

    if (!validateFile(file)) {
      return {
        error: "ファイルがありません",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        error: "ファイルサイズが大きすぎます（4MB以下にしてください）",
      };
    }

    const url = await uploadToSupabaseStorage(file, POST_IMAGES_BUCKET);

    return { url };
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return { error: "画像のアップロードに失敗しました" };
  }
}

export async function uploadUserIcon(formData: FormData) {
  try {
    const file = formData.get("file");

    if (!validateFile(file)) {
      return {
        error: "ファイルがありません",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        error: "ファイルサイズが大きすぎます（4MB以下にしてください）",
      };
    }

    const url = await uploadToSupabaseStorage(file, USER_ICONS_BUCKET);

    return { url };
  } catch (error) {
    console.error("アイコンアップロードエラー:", error);
    return { error: "アイコンのアップロードに失敗しました" };
  }
}
