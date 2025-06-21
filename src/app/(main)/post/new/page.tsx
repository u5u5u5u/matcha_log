import React from "react";
import PostForm from "@/components/post/new/PostForm";
import styles from "./page.module.scss";

export default function PostNewPage() {
  return (
    <div className={styles.container}>
      <PostForm />;
    </div>
  );
}
