import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "ファイルがありません" },
      { status: 400 }
    );
  }

  // ファイルサイズをチェック（4MB制限）
  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ファイルサイズが大きすぎます（4MB以下にしてください）" },
      { status: 413 }
    );
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

  return NextResponse.json({ url: blob.url });
}
