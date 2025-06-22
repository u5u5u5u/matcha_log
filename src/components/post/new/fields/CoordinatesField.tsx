import React from "react";
import { Input } from "@/components/util/input";
import styles from "./CoordinatesField.module.scss";

type Props = {
  latValue: string;
  lngValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CoordinatesField({
  latValue,
  lngValue,
  onChange,
}: Props) {
  return (
    <div className={styles.field}>
      <div className={styles.label}>店舗位置（オプション）</div>
      <div className={styles.coordinatesContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="shopLat" className={styles.subLabel}>
            緯度
          </label>
          <Input
            id="shopLat"
            name="shopLat"
            value={latValue}
            onChange={onChange}
            placeholder="例: 35.6895"
            type="text"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="shopLng" className={styles.subLabel}>
            経度
          </label>
          <Input
            id="shopLng"
            name="shopLng"
            value={lngValue}
            onChange={onChange}
            placeholder="例: 139.6917"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}
