"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.scss";

export default function BottomBar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleProtectedNavigation = (path: string) => {
    if (!session) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  return (
    <footer className={styles.bottomBar}>
      <nav className={styles.bottomNav}>
        <Link href="/posts" className={styles.bottomNavLink}>
          🏠 ホーム
        </Link>
        <Link href="/search" className={styles.bottomNavLink}>
          🔍 検索
        </Link>
        <button
          onClick={() => handleProtectedNavigation("/post/new")}
          className={styles.bottomNavLink}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ＋新規登録
        </button>
        <button
          onClick={() => handleProtectedNavigation("/me")}
          className={styles.bottomNavLink}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          👤 マイページ
        </button>
      </nav>
    </footer>
  );
}
