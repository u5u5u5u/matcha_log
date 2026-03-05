import React from "react";
import styles from "./RatingSliders.module.scss";
import { Asterisk, Leaf } from "lucide-react";

type RatingName = "bitterness" | "richness" | "sweetness";

const MAX_LEVEL = 5;

const levelFromValue = (value: number) => {
  const safeValue = Math.max(1, value);
  if (safeValue > MAX_LEVEL) {
    return Math.min(MAX_LEVEL, Math.max(1, Math.ceil(safeValue / 2)));
  }

  return Math.min(MAX_LEVEL, safeValue);
};

const valueFromLevel = (level: number) => level;

type Props = {
  bitterness: number;
  richness: number;
  sweetness: number;
  onChange: (name: RatingName, value: number) => void;
};

type RatingFieldProps = {
  name: RatingName;
  label: string;
  value: number;
  onChange: (name: RatingName, value: number) => void;
};

function RatingField({ name, label, value, onChange }: RatingFieldProps) {
  const selectedLevel = levelFromValue(value);

  return (
    <div className={styles.sliderField}>
      <label htmlFor={`${name}-rating`}>
        {label}
        <Asterisk size={12} color="#dc3545" />
      </label>

      <div
        id={`${name}-rating`}
        className={styles.ratingContainer}
        role="radiogroup"
        aria-label={`${label}の評価`}
      >
        {Array.from({ length: MAX_LEVEL }, (_, index) => {
          const level = index + 1;
          const isActive = level <= selectedLevel;
          const isSelected = level === selectedLevel;

          return (
            <button
              key={`${name}-${level}`}
              type="button"
              className={`${styles.ratingButton} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => onChange(name, valueFromLevel(level))}
              aria-label={`${label} ${level} / ${MAX_LEVEL}`}
              aria-pressed={isSelected}
            >
              <Leaf
                size={28}
                className={`${styles.ratingIcon} ${
                  isActive ? styles.active : styles.inactive
                }`}
                fill={isActive ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RatingSliders({
  bitterness,
  richness,
  sweetness,
  onChange,
}: Props) {
  return (
    <div className={styles.sliderSection}>
      <RatingField
        name="bitterness"
        label="苦さ"
        value={bitterness}
        onChange={onChange}
      />

      <RatingField
        name="richness"
        label="濃さ"
        value={richness}
        onChange={onChange}
      />

      <RatingField
        name="sweetness"
        label="甘さ"
        value={sweetness}
        onChange={onChange}
      />
    </div>
  );
}
