import React from "react";
import styles from "./RatingSliders.module.scss";

type Props = {
  bitterness: number;
  richness: number;
  sweetness: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RatingSliders({
  bitterness,
  richness,
  sweetness,
  onChange,
}: Props) {
  return (
    <div className={styles.sliderSection}>
      <div className={styles.sliderField}>
        <label htmlFor="bitterness">苦さ</label>
        <div className={styles.sliderContainer}>
          <input
            id="bitterness"
            name="bitterness"
            type="range"
            min={1}
            max={10}
            value={bitterness}
            onChange={onChange}
            className={styles.slider}
          />
          <div className={styles.sliderValue}>{bitterness}</div>
        </div>
        <div className={styles.sliderLabels}>
          <span>弱</span>
          <span>強</span>
        </div>
      </div>

      <div className={styles.sliderField}>
        <label htmlFor="richness">濃さ</label>
        <div className={styles.sliderContainer}>
          <input
            id="richness"
            name="richness"
            type="range"
            min={1}
            max={10}
            value={richness}
            onChange={onChange}
            className={styles.slider}
          />
          <div className={styles.sliderValue}>{richness}</div>
        </div>
        <div className={styles.sliderLabels}>
          <span>薄い</span>
          <span>濃い</span>
        </div>
      </div>

      <div className={styles.sliderField}>
        <label htmlFor="sweetness">甘さ</label>
        <div className={styles.sliderContainer}>
          <input
            id="sweetness"
            name="sweetness"
            type="range"
            min={1}
            max={10}
            value={sweetness}
            onChange={onChange}
            className={styles.slider}
          />
          <div className={styles.sliderValue}>{sweetness}</div>
        </div>
        <div className={styles.sliderLabels}>
          <span>控えめ</span>
          <span>強い</span>
        </div>
      </div>
    </div>
  );
}
