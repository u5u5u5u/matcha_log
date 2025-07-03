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

  const blob = await put(`post-images/${Date.now()}_${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
