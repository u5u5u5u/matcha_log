import React from "react";
import styles from "./Button.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantClass = variant === "ghost" ? styles.ghost : "";
    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantClass} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
