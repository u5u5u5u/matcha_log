import React from "react";
import { CakeSlice, CupSoda } from "lucide-react";
import styles from "./CategoryField.module.scss";

type CategoryType = "SWEET" | "DRINK";

type Props = {
  value: CategoryType;
  onChange: (category: CategoryType) => void;
};

export default function CategoryField({ value, onChange }: Props) {
  return (
    <div className={styles.field}>
      <label>カテゴリ</label>
      <div className={styles.categorySelector}>
        <button
          type="button"
          className={`${styles.categoryButton} ${
            value === "SWEET" ? styles.active : ""
          }`}
          onClick={() => onChange("SWEET")}
        >
          <div className={styles.categoryIcon}>
            <CakeSlice size={24} />
          </div>
          <span>スイーツ</span>
        </button>
        <button
          type="button"
          className={`${styles.categoryButton} ${
            value === "DRINK" ? styles.active : ""
          }`}
          onClick={() => onChange("DRINK")}
        >
          <div className={styles.categoryIcon}>
            <CupSoda size={24} />
          </div>
          <span>ドリンク</span>
        </button>
      </div>
    </div>
  );
}
