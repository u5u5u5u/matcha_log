"use client";

import BottomBar from "@/components/util/BottomBar";
import Header from "@/components/util/Header";
import { usePathname } from "next/navigation";
import styles from "./index.module.scss";

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTopPage = pathname === "/";

  return (
    <>
      {!isTopPage && <Header />}
      <main className={styles.main}>{children}</main>
      {!isTopPage && <BottomBar />}
    </>
  );
}
