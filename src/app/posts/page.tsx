import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.scss";

export default async function PostListPage() {
  const posts = await prisma.post.findMany({
    include: { images: true, shop: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.postListWrapper}>
          <h2 className={styles.postListTitle}>新着投稿</h2>
          <div className={styles.postListFilter}>
            <span className={styles.postListFilterCategory}>カテゴリ:</span>
            <Link href="/?cat=SWEET" className={styles.postListFilterLink}>
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
                  className={styles.postCard}
                >
                  <div className={styles.postCardRow}>
                    {post.images.length > 0 ? (
                      <Image
                        src={post.images[0].url}
                        alt="thumb"
                        width={80}
                        height={80}
                        className={styles.postCardImage}
                      />
                    ) : (
                      <div className={styles.postCardNoImage}>No Image</div>
                    )}
                    <div>
                      <div className={styles.postCardTitle}>{post.title}</div>
                      <div className={styles.postCardCategory}>
                        {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
                      </div>
                      <div className={styles.postCardShop}>
                        店舗: {post.shop?.name || "未登録"}
                      </div>
                      <div className={styles.postCardScore}>
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
    </div>
  );
}
