"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
  postId: string;
}

const DropdownMenu = ({
  isOpen,
  onClose,
  position = "right",
  postId,
}: DropdownMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // 削除ダイアログ用のuseEffect
  useEffect(() => {
    const handleDialogClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setShowDeleteDialog(false);
      }
    };

    const handleDialogEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDeleteDialog(false);
      }
    };

    if (showDeleteDialog) {
      document.addEventListener("mousedown", handleDialogClickOutside);
      document.addEventListener("keydown", handleDialogEscape);

      // スクロールバー幅を計算してCSS変数に設定
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollBarWidth}px`
      );

      // ダイアログ表示クラスを追加
      document.body.classList.add("dialog-open");
    }

    return () => {
      document.removeEventListener("mousedown", handleDialogClickOutside);
      document.removeEventListener("keydown", handleDialogEscape);
      document.body.classList.remove("dialog-open");
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [showDeleteDialog]);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    onClose(); // ドロップダウンメニューを閉じる
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/post/${postId}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        alert("投稿を削除しました");
        // ページをリロードして最新の状態を反映
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  if (!isOpen && !showDeleteDialog) return null;

  return (
    <>
      {isOpen && (
        <div
          className={`${styles.dropdown} ${
            position === "left" ? styles.dropdownLeft : styles.dropdownRight
          }`}
          ref={menuRef}
        >
          <Link
            href={`/post/${postId}/edit`}
            className={styles.menuItem}
            onClick={() => {
              onClose();
            }}
          >
            <Edit size={16} />
            <span>編集</span>
          </Link>
          <button className={styles.menuItem} onClick={handleDeleteClick}>
            <Trash2 size={16} />
            <span>削除</span>
          </button>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {showDeleteDialog && (
        <div className={styles.deleteDialogOverlay}>
          <div className={styles.deleteDialog} ref={dialogRef}>
            <div className={styles.deleteDialogHeader}>
              <h3>投稿を削除</h3>
            </div>
            <div className={styles.deleteDialogContent}>
              <p>この投稿を削除しますか？</p>
              <p className={styles.deleteDialogWarning}>
                この操作は取り消すことができません。
              </p>
            </div>
            <div className={styles.deleteDialogActions}>
              <button
                className={styles.deleteDialogCancelButton}
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button
                className={styles.deleteDialogConfirmButton}
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
