"use client";

import Image from "next/image";
import { useState, useRef } from "react";
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

  if (images.length === 1) {
    return (
      <Image
        src={images[0].url}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
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
        <Image
          src={images[currentIndex].url}
          alt={`${alt} ${currentIndex + 1}`}
          width={width}
          height={height}
          className={className}
        />
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
