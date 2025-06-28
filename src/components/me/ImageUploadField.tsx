import React from "react";
import dynamic from "next/dynamic";
import styles from "./ImageUploadField.module.scss";

const UploadImage = dynamic(() => import("@/components/me/IconUploadImage"), {
  ssr: false,
});

type Props = {
  onUpload: (files: File[], urls: string[]) => void;
  initialUrls?: string[];
  maxCount?: number;
};

export default function ImageUploadField({
  onUpload,
  initialUrls = [],
  maxCount = 1,
}: Props) {
  return (
    <div className={styles.field}>
      <label>プロフィール画像</label>
      <UploadImage
        onUpload={onUpload}
        maxCount={maxCount}
        initialUrls={initialUrls}
        isProfileMode={true}
      />
    </div>
  );
}
