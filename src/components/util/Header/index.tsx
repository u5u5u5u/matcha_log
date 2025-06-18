"use client";

import LogoutButton from "@/components/util/LogoutButton";
import { Button } from "@/components/util/button";
import { ArrowLeft, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./index.module.scss";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  // 投稿一覧ページでは戻るボタン非表示
  const isPostList = pathname === "/posts";

  return (
    <header className={styles.header}>
      <div className={styles.headerNav}>
        {!isPostList && (
          <button
            onClick={() => router.back()}
            aria-label="戻る"
            className={styles.headerBack}
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className={styles.headerLogo}>
          <Link href="/">
            <Image
              src="/matchalog.svg"
              alt="MatchaLog"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>
        {session ? (
          <div className={styles.headerLogout}>
            <LogoutButton />
          </div>
        ) : (
          <div className={styles.headerLogout}>
            <Link href="/login">
              <Button type="button">
                <LogIn size={24} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
