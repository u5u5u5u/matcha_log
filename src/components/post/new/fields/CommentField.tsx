import React from "react";
import styles from "./CommentField.module.scss";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function CommentField({ value, onChange }: Props) {
  return (
    <div className={styles.field}>
      <label htmlFor="comment">コメント</label>
      <textarea
        id="comment"
        name="comment"
        value={value}
        onChange={onChange}
        rows={3}
        className={styles.textarea}
        placeholder="感想やメモを自由に入力してください（任意）"
      />
    </div>
  );
}
