"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import styles from "./index.module.scss";
import { House, Leaf, CircleUser, Search } from "lucide-react";

export default function BottomBar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
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
    if (path === "/search") {
      return pathname === "/search";
    }
    return false;
  };

  return (
    <footer className={styles.bottomBar}>
      <nav className={styles.bottomNav}>
        <div className={styles.circle}></div>
        <Link
          href="/posts"
          className={`${styles.bottomNavLink} ${
            isActivePage("/posts") ? styles.active : styles.inactive
          }`}
        >
          <House size={38} strokeWidth={2} />
        </Link>
        <button
          onClick={() => handleProtectedNavigation("/post/new")}
          className={`${styles.bottomNavLink} ${
            isActivePage("/post/new") ? styles.active : styles.inactive
          }`}
        >
          <Leaf size={38} strokeWidth={2} />
        </button>
        <button
          onClick={() => handleProtectedNavigation("/search")}
          className={`${styles.bottomNavLink} ${
            isActivePage("/search") ? styles.active : styles.inactive
          }`}
        >
          <Search size={38} strokeWidth={2} />
        </button>
        <button
          onClick={() => handleProtectedNavigation("/me")}
          className={`${styles.bottomNavLink} ${
            isActivePage("/me") ? styles.active : styles.inactive
          }`}
        >
          <CircleUser size={38} strokeWidth={2} />
        </button>
      </nav>
    </footer>
  );
}
