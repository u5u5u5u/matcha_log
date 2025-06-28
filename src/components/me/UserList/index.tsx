"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

type UserSimple = {
  id: string;
  name: string | null;
  iconUrl: string | null;
};

type UserListProps = {
  users: UserSimple[];
  emptyMessage?: string;
};

export default function UserList({
  users,
  emptyMessage = "なし",
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.userList}>
      {users.map((user) => (
        <div key={user.id} className={styles.userItem}>
          <Link href={`/user/${user.id}`} className={styles.userLink}>
            <div className={styles.userInfo}>
              <Image
                src={user.iconUrl || "/file.svg"}
                alt={`${user.name}のアイコン`}
                width={40}
                height={40}
                className={styles.userIcon}
              />
              <span className={styles.userName}>
                {user.name || "名前未設定"}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
