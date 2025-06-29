"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./index.module.scss";
import { House, Leaf, CircleUser } from "lucide-react";

export default function BottomBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleProtectedNavigation = (path: string) => {
    if (!session) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  const isActivePage = (path: string) => {
    if (path === "/posts") {
      return pathname === "/" || pathname === "/posts";
    }
    if (path === "/post/new") {
      return pathname === "/post/new";
    }
    if (path === "/me") {
      return pathname === "/me" || pathname.startsWith("/me/");
    }
    return false;
  };

  return (
    <footer className={styles.bottomBar}>
      <nav className={styles.bottomNav}>
        <Link
          href="/posts"
          className={`${styles.bottomNavLink} ${
            isActivePage("/posts") ? styles.active : styles.inactive
          }`}
        >
          <House size={52} strokeWidth={3} />
        </Link>
        <button
          onClick={() => handleProtectedNavigation("/post/new")}
          className={`${styles.bottomNavLink} ${styles.addPostButton} ${
            isActivePage("/post/new") ? styles.active : styles.inactive
          }`}
        >
          <Leaf size={64} strokeWidth={3} />
        </button>
        <button
          onClick={() => handleProtectedNavigation("/me")}
          className={`${styles.bottomNavLink} ${
            isActivePage("/me") ? styles.active : styles.inactive
          }`}
        >
          <CircleUser size={52} strokeWidth={3} />
        </button>
      </nav>
    </footer>
  );
}
