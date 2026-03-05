import React from "react";
import { Input } from "@/components/util/input";
import styles from "./TitleField.module.scss";
import { Asterisk } from "lucide-react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function TitleField({ value, onChange, error }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor="title">
        タイトル
        <Asterisk size={12} color={"#dc3545"} />
      </label>
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
