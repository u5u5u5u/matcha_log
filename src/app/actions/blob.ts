"use server";

import { put } from "@vercel/blob";

export async function uploadPostImage(formData: FormData) {
  try {
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return {
        error: "ファイルがありません",
      };
    }

    // ファイルサイズをチェック（4MB制限）
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: "ファイルサイズが大きすぎます（4MB以下にしてください）",
      };
    }

    const blob = await put(`post-images/${Date.now()}_${file.name}`, file, {
      access: "public",
    });

    return { url: blob.url };
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return { error: "画像のアップロードに失敗しました" };
  }
}

export async function uploadUserIcon(formData: FormData) {
  try {
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return {
        error: "ファイルがありません",
      };
    }

    // ファイルサイズをチェック（4MB制限）
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: "ファイルサイズが大きすぎます（4MB以下にしてください）",
      };
    }

    // HEIC/HEIFファイルの判定
    const isHeicFile =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.heic$/i.test(file.name) ||
      /\.heif$/i.test(file.name);

    // ファイル名の生成（HEICファイルは元の拡張子を保持）
    const timestamp = Date.now();
    const filename = isHeicFile
      ? `user-icons/${timestamp}_${file.name}`
      : `user-icons/${timestamp}_${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return { url: blob.url };
  } catch (error) {
    console.error("アイコンアップロードエラー:", error);
    return { error: "アイコンのアップロードに失敗しました" };
  }
}
