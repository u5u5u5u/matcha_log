import React from "react";
import styles from "./Input.module.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${styles.input} ${className}`} {...props} />
  )
);
Input.displayName = "Input";
