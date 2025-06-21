import React from "react";
import { Input } from "@/components/util/input";
import styles from "./ShopField.module.scss";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ShopField({ value, onChange }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor="shop">店舗名</label>
      <Input
        id="shop"
        name="shop"
        value={value}
        onChange={onChange}
        placeholder="店舗名を入力してください（任意）"
      />
    </div>
  );
}
