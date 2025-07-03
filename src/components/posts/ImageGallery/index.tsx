"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import HeicImage from "../../util/HeicImage";
import styles from "./index.module.scss";

interface ImageGalleryProps {
  images: Array<{ url: string }>;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageGallery = ({
  images,
  alt = "image",
  width = 80,
  height = 80,
  className,
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  if (images.length === 0) {
    return (
      <Image
        src="/no-image.svg"
        alt="no image"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  const handleImageError = (index: number) => {
    console.error(
      `Image loading failed for index ${index}: ${images[index].url}`
    );
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // HEICファイルかどうかを判定
  const isHeicFile = (url: string) => {
    return (
      url.toLowerCase().includes(".heic") || url.toLowerCase().includes(".heif")
    );
  };

  // 適切な画像コンポーネントを返す関数
  const renderImage = (url: string, index: number, alt: string) => {
    if (isHeicFile(url)) {
      // HEICファイルの場合はHeicImageコンポーネントを使用（元のURLを直接渡す）
      return (
        <HeicImage
          src={url}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => handleImageError(index)}
        />
      );
    } else {
      // 通常のファイルの場合は従来通りプロキシ経由で取得
      const proxiedUrl = getSafeImageUrl(url, index);
      return (
        <Image
          src={proxiedUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => handleImageError(index)}
        />
      );
    }
  };

  // 画像URLを安全にするヘルパー関数
  const getSafeImageUrl = (url: string, index: number) => {
    if (imageErrors[index]) {
      return "/no-image.svg";
    }

    // Vercel Blob Storage の URL の場合、プロキシ経由で取得
    if (url.includes("blob.vercel-storage.com")) {
      // HEICファイルかどうかを判定
      const isHeicFile =
        url.toLowerCase().includes(".heic") ||
        url.toLowerCase().includes(".heif");

      // HEICファイルの場合は変換指示を追加
      const convertParam = isHeicFile ? "&convert=true" : "";
      return `/api/image-proxy?url=${encodeURIComponent(url)}${convertParam}`;
    }

    return url;
  };

  if (images.length === 1) {
    if (imageErrors[0]) {
      return (
        <Image
          src="/no-image.svg"
          alt="image load failed"
          width={width}
          height={height}
          className={className}
        />
      );
    }
    return renderImage(images[0].url, 0, alt);
  }

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // タッチ/ドラッグイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // 最小スワイプ距離

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // 左にスワイプ（次の画像）
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // 右にスワイプ（前の画像）
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  };

  // マウスドラッグイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      // 左クリックが押されている間
      touchEndX.current = e.clientX;
      isDragging.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  };

  return (
    <div className={styles.imageGallery}>
      <div
        className={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {imageErrors[currentIndex] ? (
          <Image
            src="/no-image.svg"
            alt="image load failed"
            width={width}
            height={height}
            className={className}
          />
        ) : (
          renderImage(
            images[currentIndex].url,
            currentIndex,
            `${alt} ${currentIndex + 1}`
          )
        )}
      </div>

      {/* Dots indicator */}
      <div className={styles.dotsContainer}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={(e) => handleDotClick(index, e)}
            aria-label={`画像 ${index + 1}に移動`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
