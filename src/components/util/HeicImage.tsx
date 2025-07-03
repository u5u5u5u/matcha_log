"use client";

import { heicTo } from "heic-to";
import { useEffect, useState } from "react";

interface HeicImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function HeicImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  onLoad,
  onError,
}: HeicImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [conversionFailed, setConversionFailed] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // HEICファイルかどうかを判定
  const isHeicFile = (url: string) => {
    const result =
      url.toLowerCase().includes(".heic") ||
      url.toLowerCase().includes(".heif") ||
      url.includes("content-type=image/heic") ||
      url.includes("content-type=image/heif");
    console.log("HeicImage判定:", { url, isHeicFile: result });
    return result;
  };

  useEffect(() => {
    const convertHeicIfNeeded = async () => {
      if (!isHeicFile(src) || conversionFailed) {
        setDisplaySrc(src);
        return;
      }

      setIsConverting(true);

      try {
        // Vercel Blob StorageのHEICファイルはプロキシ経由で取得
        let fetchUrl = src;
        if (src.includes("blob.vercel-storage.com")) {
          fetchUrl = `/api/image-proxy?url=${encodeURIComponent(src)}`;
        }

        console.log("HeicImage: HEICファイル取得開始", {
          originalUrl: src,
          fetchUrl,
        });

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob();
        console.log("HeicImage: Blobサイズ", blob.size, "type:", blob.type);

        // HEICをJPEGに変換
        const convertedBlob = await heicTo({
          blob: blob,
          type: "image/jpeg",
          quality: 0.9,
        });

        console.log("HeicImage: 変換完了", {
          originalSize: blob.size,
          convertedSize: convertedBlob.size,
        });

        // 変換されたBlobからURLを作成
        const convertedUrl = URL.createObjectURL(convertedBlob);
        setDisplaySrc(convertedUrl);
        setIsConverting(false);

        // クリーンアップ用のURLを保存
        return () => {
          URL.revokeObjectURL(convertedUrl);
        };
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        setConversionFailed(true);
        setIsConverting(false);

        // 変換に失敗した場合はno-image.svgを表示
        setDisplaySrc("/no-image.svg");

        // 親コンポーネントのエラーハンドラーも呼び出す
        if (onError) {
          onError();
        }
      }
    };

    convertHeicIfNeeded();
  }, [src, conversionFailed, onError]);

  // 変換中の場合はスピナーを表示
  if (isHeicFile(src) && isConverting) {
    return (
      <>
        <style>
          {`
            @keyframes heic-spinner-rotation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div
          className={className}
          style={{
            ...style,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid #e0e0e0",
              borderTop: "2px solid #666",
              borderRadius: "50%",
              animation: "heic-spinner-rotation 1s linear infinite",
            }}
          />
        </div>
      </>
    );
  }

  // 通常の画像表示
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
