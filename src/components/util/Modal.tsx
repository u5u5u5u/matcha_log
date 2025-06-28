"use client";
import { X } from "lucide-react";
import React from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // ESCキーでモーダルを閉じる
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);

      // モーダルが開いているときはスクロールを無効にする
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = originalStyle;
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} strokeWidth={2} />
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
