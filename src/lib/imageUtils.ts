/**
 * 画像を圧縮する関数
 * @param file 圧縮する画像ファイル
 * @param maxWidth 最大幅（デフォルト: 1200px）
 * @param maxHeight 最大高さ（デフォルト: 1200px）
 * @param quality 画質（0.1-1.0、デフォルト: 0.8）
 * @returns 圧縮された画像ファイル
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // 元画像のサイズ
      const { width, height } = img;

      // リサイズ後のサイズを計算
      let newWidth = width;
      let newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > height) {
          newWidth = Math.min(width, maxWidth);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.min(height, maxHeight);
          newWidth = newHeight * aspectRatio;
        }
      }

      // Canvasのサイズを設定
      canvas.width = newWidth;
      canvas.height = newHeight;

      // 画像をCanvasに描画
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // CanvasからBlobを生成
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 元のファイル名と拡張子を保持
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("画像の圧縮に失敗しました"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("画像の読み込みに失敗しました"));
    };

    // ファイルをData URLとして読み込み
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("ファイルの読み込みに失敗しました"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * ファイルサイズをMB単位で取得
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * ファイルサイズを人間が読みやすい形式で表示
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
