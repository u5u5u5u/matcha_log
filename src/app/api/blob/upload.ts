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
  const blob = await put(`user-icons/${Date.now()}_${file.name}`, file, {
    access: "public",
  });
  return NextResponse.json({ url: blob.url });
}
