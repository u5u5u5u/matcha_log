import React from "react";
import styles from "./Button.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className = "", ...props }, ref) => (
    <button ref={ref} className={`${styles.button} ${className}`} {...props} />
  )
);
Button.displayName = "Button";
