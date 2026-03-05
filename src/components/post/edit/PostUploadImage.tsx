"use client";
import { heicTo } from "heic-to";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./PostUploadImage.module.scss";
import { compressImage, getFileSizeMB } from "@/lib/imageUtils";

export default function PostUploadImage({
  onUpload,
  maxCount = 3,
  initialUrls = [],
  autoOpen = false,
}: {
  onUpload: (files: File[], urls: string[]) => void;
  maxCount?: number;
  initialUrls?: string[];
  autoOpen?: boolean;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoOpenedRef = useRef(false);

  // 初期URLsがある場合は、読み込み済みとして設定
  useEffect(() => {
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
  useEffect(() => {
    if (initialUrls.length > 0) {
      onUpload([], initialUrls);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!autoOpen || hasAutoOpenedRef.current || initialUrls.length > 0) {
      return;
    }

    hasAutoOpenedRef.current = true;
    const timer = window.setTimeout(() => {
      inputRef.current?.click();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoOpen, initialUrls.length]);

  // クリーンアップ: コンポーネントのアンマウント時のみObject URLを解放
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    urlsRef.current = urls;
  }, [urls]);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // モバイルデバイスの判定を行う
  useEffect(() => {
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

  //  画像の読み込み完了処理
  const handleImageLoad = (url: string) => {
    setLoadedImages((prev) => new Set([...prev, url]));
  };

  // 画像の読み込みエラー処理
  const handleImageError = (url: string) => {
    console.error("Image failed to load:", url);

    // Blob URLの場合、詳細情報を出力（fetchはしない）
    if (url.startsWith("blob:")) {
      console.error("Blob URL詳細:", {
        url,
        valid: url.length > 5,
        protocol: url.substring(0, 5),
      });
    }

    // エラーの場合も読み込み完了として扱う（表示はされないが、レイアウトは保持）
    setLoadedImages((prev) => new Set([...prev, url]));
  };

  // ファイルアップロード処理
  const uploadFiles = async (selectedFiles: FileList | File[]) => {
    if (isUploading) return;

    setIsUploading(true);
    const fileArray = Array.from(selectedFiles);

    // 画像ファイル（HEIC含む）をフィルタリング
    const imageFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") || isHeicFile(file)
    );

    // ファイルサイズをチェック（4MB制限）
    // HEICファイルは元のファイルサイズで判定（変換後のサイズではない）
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((f) => f.name).join(", ");
      alert(
        `以下のファイルが大きすぎます（4MB以下にしてください）：\n${fileNames}`
      );
      setIsUploading(false);
      return;
    }

    // 最大数を超えないようにファイルを制限
    const validFiles = imageFiles.slice(0, maxCount - files.length);

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      // HEICファイルとその他の画像ファイルを処理
      const processedFilesAndUrls = [];

      for (const file of validFiles) {
        try {
          let fileForSaving = file; // 保存用ファイル（HEICの場合は元のまま）
          let previewUrl = ""; // プレビュー用URL

          if (isHeicFile(file)) {
            try {
              // HEICファイルの場合：
              // 1. 保存用は元のHEICファイルをそのまま使用
              fileForSaving = file;

              // 2. プレビュー用にPNGに変換
              const convertResult = await convertHeicToPng(file);
              previewUrl = convertResult.url;

              console.log(
                `HEICファイルを処理: 保存用=${getFileSizeMB(file).toFixed(
                  2
                )}MB (HEIC), プレビュー用=${(
                  convertResult.blob.size /
                  (1024 * 1024)
                ).toFixed(2)}MB (PNG)`
              );
            } catch (convertError) {
              throw convertError;
            }
          } else {
            // 通常の画像ファイルの場合
            let processedFile = file;

            // ファイルサイズが2MBを超える場合は圧縮
            const COMPRESS_THRESHOLD = 2 * 1024 * 1024; // 2MB
            if (processedFile.size > COMPRESS_THRESHOLD) {
              try {
                processedFile = await compressImage(
                  processedFile,
                  1200,
                  1200,
                  0.8
                );
                console.log(
                  `画像を圧縮しました: ${getFileSizeMB(file).toFixed(
                    2
                  )}MB → ${getFileSizeMB(processedFile).toFixed(2)}MB`
                );
              } catch (compressionError) {
                console.warn(
                  "画像圧縮に失敗しました。元のファイルを使用します:",
                  compressionError
                );
                // 圧縮に失敗した場合は元のファイルを使用
              }
            }

            fileForSaving = processedFile;
            previewUrl = URL.createObjectURL(processedFile);
          }

          processedFilesAndUrls.push({
            file: fileForSaving,
            url: previewUrl,
          });
        } catch (fileError) {
          console.error(`ファイル ${file.name} の処理に失敗:`, fileError);

          // エラーメッセージを表示
          const errorMessage =
            fileError instanceof Error
              ? fileError.message
              : `ファイル ${file.name} の処理に失敗しました。`;

          console.error("エラーメッセージ:", errorMessage);

          // このファイルをスキップして続行
          continue;
        }
      }

      // 処理に成功したファイルがある場合のみ状態を更新
      if (processedFilesAndUrls.length > 0) {
        // 成功した変換結果を取得
        const newFiles = processedFilesAndUrls.map((item) => item.file);
        const newPreviewUrls = processedFilesAndUrls.map((item) => item.url);

        // ステートを更新
        const updatedFiles = [...files, ...newFiles];
        const updatedUrls = [...urls, ...newPreviewUrls];

        setFiles(updatedFiles);
        setUrls(updatedUrls);

        // 親コンポーネントに通知（ファイルとプレビューURLの両方を渡す）
        onUpload(updatedFiles, updatedUrls);
      }
    } catch (error) {
      console.error("ファイル処理エラー:", error);
    }

    setIsUploading(false);
  };

  // ファイル選択時の処理
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    // HEICファイルがある場合は事前に警告
    const heicFiles = Array.from(fileList).filter((file) => isHeicFile(file));
    if (heicFiles.length > 0) {
      const heicFileNames = heicFiles.map((f) => f.name).join(", ");
      const proceed = confirm(
        `以下のHEIC形式のファイルが選択されています：\n${heicFileNames}\n\n` +
          `HEIC形式はブラウザでサポートされていない可能性があります。\n` +
          `変換を試行しますが、失敗する場合があります。\n\n` +
          `続行しますか？（推奨：JPEG/PNG形式に変換してからアップロード）`
      );

      if (!proceed) {
        // ファイル選択をリセット
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }
    }

    await uploadFiles(fileList);

    // ファイル選択後にinputをリセット（同じファイルを再選択可能にする）
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // ドラッグオーバーイベントの処理
  const handleDragOver = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
    setIsDragOver(true);
  };

  // ドラッグリーブイベントの処理
  const handleDragLeave = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    e.preventDefault();
    setIsDragOver(false);
  };

  // ドロップイベントの処理
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

  // 画像削除時の処理
  const handleRemove = (idx: number) => {
    // 削除されるURLがObject URLの場合はメモリリークを防ぐためにrevokeする
    const removedUrl = urls[idx];
    if (removedUrl && removedUrl.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);
    }

    const newUrls = urls.filter((_, i) => i !== idx);
    const newFiles = files.filter((_, i) => i !== idx);

    // 読み込み状態からも削除されたURLを除去
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(removedUrl);
      return newSet;
    });

    setUrls(newUrls);
    setFiles(newFiles);
    onUpload(newFiles, newUrls);
  };

  // クリックイベントでファイル選択ダイアログを開く
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

  // タッチ終了時のスタイルリセット
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) {
      e.currentTarget.style.transform = "";
    }
  };

  // ファイルがheic形式かどうかをチェックする関数
  const isHeicFile = (file: File) => {
    // MIMEタイプまたはファイル拡張子でHEICファイルを判定
    const isHeicByType =
      file.type === "image/heic" || file.type === "image/heif";
    const isHeicByName =
      /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
    const isHeic = isHeicByType || isHeicByName;

    return isHeic;
  };

  // heicファイルをpngに変換する
  const convertHeicToPng = async (file: File) => {
    try {
      const pngBlob = await heicTo({
        blob: file,
        type: "image/png",
        quality: 0.9,
      });

      if (pngBlob.size === 0) {
        throw new Error("変換されたファイルのサイズが0です");
      }

      const convertedUrl = URL.createObjectURL(pngBlob);

      return { blob: pngBlob, url: convertedUrl };
    } catch (error) {
      console.error("HEIC to PNG conversion failed:", error);

      // エラーの詳細を判定してユーザーフレンドリーなメッセージを表示
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === 2) {
          throw new Error(
            "HEIC形式はこのブラウザではサポートされていません。\nファイルをJPEGまたはPNG形式に変換してからアップロードしてください。"
          );
        }
      }

      throw new Error(
        "HEIC画像の変換に失敗しました。\nJPEGまたはPNG形式でアップロードしてください。"
      );
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*,.heic,.HEIC"
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
            <p className={styles.limit}>
              最大{maxCount}枚まで（JPEG, PNG推奨, HEIC対応※）
              <br />
              ファイルサイズ: 4MB以下
            </p>
            <p
              className={styles.subText}
              style={{ fontSize: "0.8em", color: "#666" }}
            >
              ※HEIC形式は変換に失敗する場合があります
              <br />
              大きなファイルは自動で圧縮されます
            </p>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className={styles.previewContainer}>
          {urls.map((url, idx) => {
            const isLoaded = loadedImages.has(url);

            return (
              <div
                key={`preview-${idx}-${url.substring(
                  url.lastIndexOf("/") + 1
                )}`}
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
