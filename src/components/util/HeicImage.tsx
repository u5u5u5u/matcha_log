"use client";

import { heicTo } from "heic-to";
import Image from "next/image";
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
  unoptimized?: boolean;
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
  unoptimized = false,
}: HeicImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionFailed, setConversionFailed] = useState(false);

  // HEICファイルかどうかを判定
  const isHeicFile = (url: string) => {
    return (
      url.toLowerCase().includes(".heic") ||
      url.toLowerCase().includes(".heif") ||
      url.includes("content-type=image/heic") ||
      url.includes("content-type=image/heif")
    );
  };

  useEffect(() => {
    const convertHeicIfNeeded = async () => {
      if (!isHeicFile(src) || conversionFailed) {
        setDisplaySrc(src);
        return;
      }

      setIsConverting(true);

      try {
        // 元の画像を取得
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();

        // HEICをJPEGに変換
        const convertedBlob = await heicTo({
          blob: blob,
          type: "image/jpeg",
          quality: 0.9,
        });

        // 変換されたBlobからURLを作成
        const convertedUrl = URL.createObjectURL(convertedBlob);
        setDisplaySrc(convertedUrl);

        // クリーンアップ用のURLを保存
        return () => {
          URL.revokeObjectURL(convertedUrl);
        };
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        setConversionFailed(true);
        setDisplaySrc(src); // 変換に失敗した場合は元のURLを使用
      } finally {
        setIsConverting(false);
      }
    };

    convertHeicIfNeeded();
  }, [src, conversionFailed]);

  // 変換中の表示
  if (isConverting) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          width: width,
          height: height,
        }}
      >
        <div style={{ fontSize: "12px", color: "#666" }}>変換中...</div>
      </div>
    );
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      unoptimized={unoptimized || displaySrc.startsWith("blob:")}
    />
  );
}
