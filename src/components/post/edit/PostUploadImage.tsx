"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import styles from "./PostUploadImage.module.scss";

export default function PostUploadImage({
  onUpload,
  maxCount = 3,
  initialUrls = [],
}: {
  onUpload: (urls: string[]) => void;
  maxCount?: number;
  initialUrls?: string[];
}) {
  const [urls, setUrls] = React.useState<string[]>(initialUrls);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls]);

  React.useEffect(() => {
    // モバイルデバイスの判定をより詳細に行う
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      // より厳密な判定
      const isMobileDevice =
        mobileRegex.test(userAgent) ||
        (isTouchDevice && isSmallScreen) ||
        "orientation" in window;

      setIsMobile(isMobileDevice);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    if (isUploading) return;

    setIsUploading(true);
    const uploadPromises = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length && urls.length + i < maxCount; i++) {
      const file = fileArray[i];

      // 画像ファイルかチェック
      if (!file.type.startsWith("image/")) {
        console.log("画像ファイルではありません:", file.name, file.type);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      uploadPromises.push(
        fetch("/api/blob/post-upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => data.url)
      );
    }

    try {
      const newUrls = await Promise.all(uploadPromises);
      const allUrls = [...urls, ...newUrls].slice(0, maxCount);
      setUrls(allUrls);
      onUpload(allUrls);
    } catch {
      alert("アップロード失敗");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    await uploadFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  // ドラッグイベントの完全な無効化（モバイル時）
  const preventDragEvents = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
  };

  const handleRemove = (idx: number) => {
    const newUrls = urls.filter((_, i) => i !== idx);
    setUrls(newUrls);
    onUpload(newUrls);
  };

  const handleClick = () => {
    if (urls.length < maxCount && !isUploading) {
      inputRef.current?.click();
    }
  };

  // スマホでのタッチ体験向上
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile && urls.length < maxCount && !isUploading) {
      // タッチフィードバックのためのクラス追加などの処理
      e.currentTarget.style.transform = "scale(0.98)";
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) {
      e.currentTarget.style.transform = "";
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
        multiple
        style={{ display: "none" }}
      />

      <div
        className={`${styles.dropzone} ${
          !isMobile && isDragOver ? styles.dragOver : ""
        } ${urls.length >= maxCount ? styles.disabled : ""} ${
          isMobile ? styles.mobileOnly : ""
        }`}
        onDragOver={!isMobile ? handleDragOver : preventDragEvents}
        onDragLeave={!isMobile ? handleDragLeave : preventDragEvents}
        onDragEnter={!isMobile ? preventDragEvents : preventDragEvents}
        onDrop={!isMobile ? handleDrop : preventDragEvents}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className={styles.uploading}>
            <div className={styles.spinner}></div>
            <p>アップロード中...</p>
          </div>
        ) : urls.length >= maxCount ? (
          <div className={styles.message}>
            <p>最大{maxCount}枚までアップロードできます</p>
          </div>
        ) : (
          <div className={styles.message}>
            <div className={styles.icon}>
              <Upload size={48} />
            </div>
            {isMobile ? (
              <>
                <p>📸 タップして画像を選択</p>
                <p className={styles.subText}>カメラ・ギャラリーから選択</p>
              </>
            ) : (
              <>
                <p>画像をドラッグ&ドロップ</p>
                <p className={styles.subText}>またはクリックして選択</p>
              </>
            )}
            <p className={styles.limit}>最大{maxCount}枚まで（JPEG, PNG等）</p>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className={styles.previewContainer}>
          {urls.map((url, idx) => (
            <div key={url} className={styles.previewItem}>
              <Image
                src={url}
                alt="preview"
                width={80}
                height={80}
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className={styles.removeButton}
                aria-label="画像を削除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
