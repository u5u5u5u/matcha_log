"use client";
import React from "react";
import styles from "./CircularProgress.module.scss";

type Props = {
  value: number; // 1-10の値
  max?: number; // 最大値（デフォルト10）
  size?: number; // サイズ（デフォルト60px）
  strokeWidth?: number; // 線の太さ（デフォルト4）
  label?: string; // ラベル
};

export default function CircularProgress({
  value,
  max = 10,
  size = 60,
  strokeWidth = 10,
  label,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <svg className={styles.svg} width={size} height={size}>
        {/* 背景の円 */}
        <circle
          className={styles.backgroundCircle}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* プログレス円 */}
        <circle
          className={styles.progressCircle}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        <span className={styles.max}>/{max}</span>
      </div>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
}
