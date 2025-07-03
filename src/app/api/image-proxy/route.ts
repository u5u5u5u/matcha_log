import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");
  const convert = searchParams.get("convert"); // HEICファイルの変換指示

  if (!imageUrl) {
    return new NextResponse("URL parameter is required", { status: 400 });
  }

  try {
    // Vercel Blob Storage のURLかどうかを確認
    if (!imageUrl.includes("blob.vercel-storage.com")) {
      return new NextResponse("Invalid image URL", { status: 400 });
    }

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return new NextResponse("Failed to fetch image", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    // HEICファイルで変換指示がある場合はJPEGに変換
    const isHeicFile =
      contentType === "image/heic" ||
      contentType === "image/heif" ||
      imageUrl.toLowerCase().includes(".heic") ||
      imageUrl.toLowerCase().includes(".heif");

    if (isHeicFile && convert === "true") {
      try {
        // Server-side HEIC conversion would require a different library
        // For now, return the original file and let client handle conversion
        console.log(
          "HEIC file detected, returning original for client-side conversion"
        );
      } catch (conversionError) {
        console.error("HEIC conversion failed:", conversionError);
      }
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "X-Original-Content-Type": contentType,
        "X-Is-HEIC": isHeicFile ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
