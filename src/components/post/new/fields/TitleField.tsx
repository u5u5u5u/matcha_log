import React from "react";
import { Input } from "@/components/util/input";
import styles from "./TitleField.module.scss";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function TitleField({ value, onChange, error }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor="title">タイトル</label>
      <Input
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        required
        className={error ? styles.error : undefined}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
