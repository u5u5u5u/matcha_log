import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/app/page.module.scss";
import LogoutButton from "@/components/ui/LogoutButton";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  // 投稿一覧ページでは戻るボタン非表示
  const isPostList = pathname === "/posts";
  console.log("Header pathname:", pathname);
  console.log("Header isPostList:", isPostList);

  return (
    <header className={styles.header}>
      <div
        className={styles.headerNav}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {!isPostList && (
          <button
            onClick={() => router.back()}
            aria-label="戻る"
            style={{
              position: "absolute",
              left: 0,
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: "0 16px",
              color: "#000",
            }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <Link href="/" className={styles.headerLogo} style={{ margin: 0 }}>
            MatchaLog
          </Link>
        </div>
        <div style={{ position: "absolute", right: 0, padding: "0 16px" }}>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
