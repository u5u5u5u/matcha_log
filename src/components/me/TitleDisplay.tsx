import React from "react";
import styles from "./TitleDisplay.module.scss";

type Props = {
  activeTitle: { id: string; name: string } | null;
};

export default function TitleDisplay({ activeTitle }: Props) {
  return (
    <div className={styles.nameAndTitleRow}>
      {activeTitle && <p className={styles.activeTitle}>{activeTitle.name}</p>}
    </div>
  );
}
