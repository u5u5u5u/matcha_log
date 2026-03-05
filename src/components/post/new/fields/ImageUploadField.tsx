import React from "react";
import dynamic from "next/dynamic";
import styles from "./ImageUploadField.module.scss";
import { Asterisk } from "lucide-react";

const UploadImage = dynamic(
  () => import("@/components/post/edit/PostUploadImage"),
  { ssr: false },
);

type Props = {
  onUpload: (files: File[], urls: string[]) => void;
  initialUrls?: string[];
  maxCount?: number;
  autoOpen?: boolean;
};

export default function ImageUploadField({
  onUpload,
  initialUrls = [],
  maxCount = 3,
  autoOpen = false,
}: Props) {
  return (
    <div className={styles.field}>
      <label>
        画像アップロード
        <Asterisk size={12} color={"#dc3545"} />
      </label>
      <UploadImage
        onUpload={onUpload}
        maxCount={maxCount}
        initialUrls={initialUrls}
        autoOpen={autoOpen}
      />
    </div>
  );
}
