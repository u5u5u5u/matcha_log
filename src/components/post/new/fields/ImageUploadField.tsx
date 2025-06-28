import React from "react";
import dynamic from "next/dynamic";
import styles from "./ImageUploadField.module.scss";

const UploadImage = dynamic(
  () => import("@/components/post/edit/PostUploadImage"),
  { ssr: false }
);

type Props = {
  onUpload: (files: File[], urls: string[]) => void;
  initialUrls?: string[];
  maxCount?: number;
};

export default function ImageUploadField({
  onUpload,
  initialUrls = [],
  maxCount = 3,
}: Props) {
  return (
    <div className={styles.field}>
      <label>画像アップロード（必須）</label>
      <UploadImage
        onUpload={onUpload}
        maxCount={maxCount}
        initialUrls={initialUrls}
      />
    </div>
  );
}
