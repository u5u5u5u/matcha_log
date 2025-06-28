"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { heicTo } from "heic-to";

export default function PostUploadImage({
  onUpload,
  maxCount = 1,
  initialUrls = [],
  isProfileMode = false,
}: {
  onUpload: (files: File[], urls: string[]) => void;
  maxCount?: number;
  initialUrls?: string[];
  isProfileMode?: boolean;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

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
    console.log("画像の読み込み完了:", url);
    setLoadedImages((prev) => new Set([...prev, url]));
  };

  // 画像の読み込みエラー処理
  const handleImageError = (url: string) => {
    console.error("Image failed to load:", url);

    // Blob URLの場合、詳細情報を出力
    if (url.startsWith("blob:")) {
      console.error("Blob URL詳細:", {
        url,
        valid: url.length > 5,
        protocol: url.substring(0, 5),
        timestamp: Date.now(),
      });

      // Blob URLの有効性をチェック
      fetch(url)
        .then((response) => {
          console.log("Blob URL fetch成功:", {
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            headers: Object.fromEntries(response.headers.entries()),
          });
        })
        .catch((error) => {
          console.error("Blob URL fetch失敗:", {
            error: error.message,
            name: error.name,
            stack: error.stack,
          });
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

    // 最大数を超えないようにファイルを制限
    // プロフィールモードまたはmaxCount=1の場合は、置き換えなので制限を緩和
    let validFiles: File[];
    if (isProfileMode || maxCount === 1) {
      validFiles = imageFiles.slice(0, 1); // 1つまで選択可能
    } else {
      validFiles = imageFiles.slice(0, maxCount - files.length);
    }

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      // HEICファイルを変換し、その他の画像ファイルはそのまま使用
      const processedFilesAndUrls = [];

      for (const file of validFiles) {
        try {
          if (isHeicFile(file)) {
            console.log("HEIC変換開始:", file.name);

            try {
              // HEICをPNGに変換（ファイルオブジェクトを直接渡す）
              const convertResult = await convertHeicToPng(file);

              // 変換されたBlobからファイルを再作成
              const convertedFileName = file.name.replace(/\.heic$/i, ".png");
              const convertedFile = new File(
                [convertResult.blob],
                convertedFileName,
                {
                  type: "image/png",
                  lastModified: Date.now(),
                }
              );

              console.log("HEIC変換完了:", convertedFileName);
              processedFilesAndUrls.push({
                file: convertedFile,
                url: convertResult.url,
              });
            } catch (convertError) {
              throw convertError;
            }
          } else {
            // 通常の画像ファイル
            const url = URL.createObjectURL(file);
            console.log("通常画像ファイルのBlob URL生成:", {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              blobUrl: url,
            });
            processedFilesAndUrls.push({ file, url });
          }
        } catch (fileError) {
          console.error(`ファイル ${file.name} の処理に失敗:`, fileError);

          // エラーメッセージを表示
          const errorMessage =
            fileError instanceof Error
              ? fileError.message
              : `ファイル ${file.name} の処理に失敗しました。`;

          alert(errorMessage);

          // このファイルをスキップして続行
          continue;
        }
      }

      // 処理に成功したファイルがある場合のみ状態を更新
      if (processedFilesAndUrls.length > 0) {
        // 成功した変換結果を取得
        const newFiles = processedFilesAndUrls.map((item) => item.file);
        const newPreviewUrls = processedFilesAndUrls.map((item) => item.url);

        // プロフィールモードまたはmaxCount=1の場合は置き換え、それ以外は追加
        let updatedFiles: File[];
        let updatedUrls: string[];

        if (isProfileMode || maxCount === 1) {
          // 既存の画像URLがblob URLの場合は解放
          urls.forEach((url) => {
            if (url.startsWith("blob:")) {
              URL.revokeObjectURL(url);
            }
          });

          // 読み込み状態もクリア
          setLoadedImages(new Set());

          // 新しい画像で置き換え
          updatedFiles = newFiles;
          updatedUrls = newPreviewUrls;
        } else {
          // 通常モードは追加
          updatedFiles = [...files, ...newFiles];
          updatedUrls = [...urls, ...newPreviewUrls];
        }

        setFiles(updatedFiles);
        setUrls(updatedUrls);

        // 親コンポーネントに通知（ファイルとプレビューURLの両方を渡す）
        onUpload(updatedFiles, updatedUrls);
      }
    } catch (error) {
      console.error("ファイル処理エラー:", error);
      alert("ファイルの処理中にエラーが発生しました。");
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

  // クリックイベントでファイル選択ダイアログを開く
  const handleClick = () => {
    // プロフィールモードまたはmaxCount=1の場合は常に選択可能（置き換えのため）
    // 通常モードは既存の制限チェック
    const canSelect =
      isProfileMode || maxCount === 1 || files.length < maxCount;

    if (canSelect && !isUploading) {
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

  console.log("urls:", urls);
  console.log("files:", files);

  // ファイルがheic形式かどうかをチェックする関数
  const isHeicFile = (file: File) => {
    console.log("Checking file:", file.name, "type:", file.type);
    // MIMEタイプまたはファイル拡張子でHEICファイルを判定
    const isHeicByType =
      file.type === "image/heic" || file.type === "image/heif";
    const isHeicByName =
      /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
    const isHeic = isHeicByType || isHeicByName;

    console.log(
      "HEIC判定結果:",
      isHeic,
      "by type:",
      isHeicByType,
      "by name:",
      isHeicByName
    );
    return isHeic;
  };

  // heicファイルをpngに変換する
  const convertHeicToPng = async (file: File) => {
    try {
      console.log("HEIC→PNG変換開始:", file.name, "サイズ:", file.size);

      const pngBlob = await heicTo({
        blob: file,
        type: "image/png",
        quality: 0.9,
      });

      console.log(
        "変換後ファイルサイズ:",
        pngBlob.size,
        "タイプ:",
        pngBlob.type
      );

      if (pngBlob.size === 0) {
        throw new Error("変換されたファイルのサイズが0です");
      }

      const convertedUrl = URL.createObjectURL(pngBlob);
      console.log("HEIC→PNG変換完了:", convertedUrl);

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
    <div
      className={`${styles.container} ${
        isProfileMode ? styles.profileUpload : ""
      }`}
    >
      <input
        type="file"
        accept="image/*,.heic,.HEIC"
        ref={inputRef}
        onChange={handleChange}
        multiple={!isProfileMode}
        style={{ display: "none" }}
      />

      <div
        className={`${styles.dropzone} ${
          !isMobile && isDragOver ? styles.dragOver : ""
        } ${files.length >= maxCount ? styles.disabled : ""} ${
          isMobile ? styles.mobileOnly : ""
        } ${isProfileMode && urls.length > 0 ? styles.hidden : ""}`}
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
        ) : files.length >= maxCount && !isProfileMode ? (
          <div className={styles.message}>
            <p>最大{maxCount}枚までアップロードできます</p>
          </div>
        ) : (
          <div
            className={`${styles.message} ${
              isProfileMode ? styles.dropContent : ""
            }`}
          >
            <div
              className={`${styles.icon} ${
                isProfileMode ? styles.uploadIcon : ""
              }`}
            >
              <Upload size={isProfileMode ? 24 : 48} />
            </div>
            {isMobile ? (
              <>
                <p>
                  {isProfileMode ? "タップして選択" : "📸 タップして画像を選択"}
                </p>
                {!isProfileMode && (
                  <p className={styles.subText}>カメラ・ギャラリーから選択</p>
                )}
              </>
            ) : (
              <>
                <p>
                  {isProfileMode ? "画像を選択" : "画像をドラッグ&ドロップ"}
                </p>
                {!isProfileMode && (
                  <p className={styles.subText}>またはクリックして選択</p>
                )}
              </>
            )}
            <p className={styles.limit}>
              最大{maxCount}枚まで（JPEG, PNG推奨, HEIC対応※）
            </p>
            <p
              className={styles.subText}
              style={{ fontSize: "0.8em", color: "#666" }}
            >
              ※HEIC形式は変換に失敗する場合があります
            </p>
          </div>
        )}
      </div>

      {urls.length > 0 && (
        <div className={styles.previewContainer}>
          {urls.map((url, idx) => {
            const isLoaded = loadedImages.has(url);
            const isBlobUrl = url.startsWith("blob:");

            console.log("プレビュー画像レンダリング:", {
              index: idx,
              url: url,
              isBlobUrl: isBlobUrl,
              isLoaded: isLoaded,
              urlLength: url.length,
            });

            return (
              <div
                key={`preview-${idx}-${url.substring(
                  url.lastIndexOf("/") + 1
                )}`}
                className={`${styles.previewItem} ${
                  !isLoaded ? styles.loading : ""
                }`}
                onClick={
                  isProfileMode
                    ? (e) => {
                        // 削除ボタンのクリックでなければファイル選択ダイアログを開く
                        if (
                          !(e.target as HTMLElement).closest(
                            `.${styles.removeButton}`
                          )
                        ) {
                          e.stopPropagation();
                          handleClick();
                        }
                      }
                    : undefined
                }
              >
                {url.startsWith("blob:") ? (
                  // Blob URLの場合は通常のimg要素を使用
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt="preview"
                    width={isProfileMode ? 120 : 80}
                    height={isProfileMode ? 120 : 80}
                    className={styles.previewImage}
                    onLoad={() => handleImageLoad(url)}
                    onError={() => handleImageError(url)}
                    style={{
                      objectFit: "cover",
                      borderRadius: isProfileMode ? "50%" : "8px",
                      width: isProfileMode ? "120px" : "80px",
                      height: isProfileMode ? "120px" : "80px",
                    }}
                  />
                ) : (
                  // 通常のURLの場合はNext.js Imageコンポーネントを使用
                  <Image
                    src={url}
                    alt="preview"
                    width={isProfileMode ? 120 : 80}
                    height={isProfileMode ? 120 : 80}
                    className={styles.previewImage}
                    unoptimized={url.startsWith("blob:")}
                    onLoad={() => handleImageLoad(url)}
                    onError={() => handleImageError(url)}
                  />
                )}
                {!isLoaded && (
                  <div className={styles.imageLoading}>
                    <div className={styles.imageSpinner}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
