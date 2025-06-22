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
  onUpload: (files: File[], urls: string[]) => void;
  maxCount?: number;
  initialUrls?: string[];
}) {
  const [urls, setUrls] = React.useState<string[]>(initialUrls);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setUrls(initialUrls);
    // 編集時: 初期URLsがある場合はfilesは空のまま（既存の画像）
    // 新規時: 初期URLsが空なのでfilesも空
    setFiles([]);
    // 初期URLsがある場合は、それらを読み込み済みとして設定
    if (initialUrls.length > 0) {
      setLoadedImages(new Set(initialUrls));
    }
  }, [initialUrls]);

  // 初期値が設定された後に一度だけ親に通知
  React.useEffect(() => {
    if (initialUrls.length > 0) {
      onUpload([], initialUrls);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // クリーンアップ: コンポーネントのアンマウント時にObject URLを解放
  React.useEffect(() => {
    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [urls]);

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

  const handleImageLoad = (url: string) => {
    setLoadedImages((prev) => new Set([...prev, url]));
  };

  const handleImageError = (url: string) => {
    console.error("Image failed to load:", url);
    // エラーの場合も読み込み完了として扱う（表示はされないが、レイアウトは保持）
    setLoadedImages((prev) => new Set([...prev, url]));
  };

  const uploadFiles = async (selectedFiles: FileList | File[]) => {
    if (isUploading) return;

    setIsUploading(true);
    const fileArray = Array.from(selectedFiles);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    // 最大数を超えないようにファイルを制限
    const validFiles = imageFiles.slice(0, maxCount - files.length);

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    // ファイルからプレビューURLを生成
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    // ステートを更新
    const newFiles = [...files, ...validFiles];
    const newUrls = [...urls, ...newPreviewUrls];

    setFiles(newFiles);
    setUrls(newUrls);

    // 親コンポーネントに通知（ファイルとプレビューURLの両方を渡す）
    onUpload(newFiles, newUrls);

    setIsUploading(false);
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
    const newFiles = files.filter((_, i) => i !== idx);

    // 削除されるURLがObject URLの場合はメモリリークを防ぐためにrevokeする
    const removedUrl = urls[idx];
    if (removedUrl && removedUrl.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);
    }

    setUrls(newUrls);
    setFiles(newFiles);
    onUpload(newFiles, newUrls);
  };

  const handleClick = () => {
    if (files.length < maxCount && !isUploading) {
      inputRef.current?.click();
    }
  };

  // スマホでのタッチ体験向上
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile && files.length < maxCount && !isUploading) {
      // タッチフィードバックのためのクラス追加などの処理
      e.currentTarget.style.transform = "scale(0.98)";
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) {
      e.currentTarget.style.transform = "";
    }
  };

  console.log("urls:", urls);
  console.log("files:", files);

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
        } ${files.length >= maxCount ? styles.disabled : ""} ${
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
        ) : files.length >= maxCount ? (
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
          {urls.map((url, idx) => {
            const isLoaded = loadedImages.has(url);

            return (
              <div
                key={url}
                className={`${styles.previewItem} ${
                  !isLoaded ? styles.loading : ""
                }`}
              >
                <Image
                  src={url}
                  alt="preview"
                  width={80}
                  height={80}
                  className={styles.previewImage}
                  unoptimized
                  onLoad={() => handleImageLoad(url)}
                  onError={() => handleImageError(url)}
                />
                {!isLoaded && (
                  <div className={styles.imageLoading}>
                    <div className={styles.imageSpinner}></div>
                  </div>
                )}

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
            );
          })}
        </div>
      )}
    </div>
  );
}
