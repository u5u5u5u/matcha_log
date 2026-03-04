"use client";

import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useState } from "react";
import { Button } from "../button";
import Modal from "../Modal";
import styles from "./index.module.scss"; // Assuming you have some styles defined

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setIsModalOpen(false);
    window.location.href = "/login";
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsModalOpen(true)}
      >
        <LogOut strokeWidth={3} />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ログアウト確認"
      >
        <div className={styles.modalContent}>
          <h3>ログアウトしますか？</h3>
          <div className={styles.buttonGroup}>
            <Button
              type="button"
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              ログアウト
            </Button>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={styles.cancelButton}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
