import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";

export default async function Home() {
  // 新着投稿を取得
  const posts = await prisma.post.findMany({
    include: { images: true, shop: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>

        <div style={{ maxWidth: 700, margin: "40px auto" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            新着投稿
          </h2>
          <div style={{ marginBottom: 24 }}>
            {/* フィルターUI（カテゴリ・店舗名・評価）: 今後拡張 */}
            <span style={{ marginRight: 16 }}>カテゴリ:</span>
            <Link href="/?cat=SWEET" style={{ marginRight: 8 }}>
              スイーツ
            </Link>
            <Link href="/?cat=DRINK">ドリンク</Link>
          </div>
          <div>
            {posts.length === 0 ? (
              <div>投稿がありません。</div>
            ) : (
              posts.map((post) => (
                <a
                  key={post.id}
                  href={`/post/${post.id}`}
                  style={{
                    display: "block",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    marginBottom: 16,
                    padding: 16,
                    textDecoration: "none",
                    color: "#222",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {post.images.length > 0 ? (
                      <Image
                        src={post.images[0].url}
                        alt="thumb"
                        width={80}
                        height={80}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 16,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          background: "#eee",
                          borderRadius: 8,
                          marginRight: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        No Image
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          marginBottom: 4,
                        }}
                      >
                        {post.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          color: "#666",
                          marginBottom: 4,
                        }}
                      >
                        {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          color: "#888",
                          marginBottom: 4,
                        }}
                      >
                        店舗: {post.shop?.name || "未登録"}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#888" }}>
                        濃さ: {post.richness} 苦さ: {post.bitterness} 甘さ:{" "}
                        {post.sweetness}
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
