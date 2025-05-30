import Link from "next/link";
import styles from "@/app/page.module.scss";

export default function BottomBar() {
  return (
    <footer className={styles.bottomBar}>
      <nav className={styles.bottomNav}>
        <Link href="/posts" className={styles.bottomNavLink}>
          🏠 ホーム
        </Link>
        <Link href="/search" className={styles.bottomNavLink}>
          🔍 検索
        </Link>
        <Link href="/post/new" className={styles.bottomNavLink}>
          ＋新規登録
        </Link>
        <Link href="/me" className={styles.bottomNavLink}>
          👤 マイページ
        </Link>
      </nav>
    </footer>
  );
}
