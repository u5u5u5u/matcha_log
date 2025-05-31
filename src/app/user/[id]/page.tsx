import { prisma } from "@/lib/prisma";
import Image from "next/image";
import styles from "../../me/MePage.module.scss";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FollowButtonWrapper from "@/components/user/FollowButtonWrapper";

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const meId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      iconUrl: true,
      posts: { include: { images: true, shop: true } },
    },
  });
  if (!user) return notFound();
  let initialIsFollowing = false;
  if (meId && meId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: meId, followingId: user.id },
      },
    });
    initialIsFollowing = !!follow;
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ユーザープロフィール</h2>
      <div className={styles.welcome}>
        <Image
          src={user.iconUrl || "/file.svg"}
          alt="icon"
          width={40}
          height={40}
          className={styles.iconPreview}
        />
        {user.name}
        {meId && meId !== user.id && (
          <FollowButtonWrapper
            userId={user.id}
            initialIsFollowing={initialIsFollowing}
          />
        )}
      </div>
      <div style={{ marginBottom: 24, color: "#888", fontSize: "0.95rem" }}>
        {user.email}
      </div>
      <h3 style={{ fontWeight: "bold", marginBottom: 12 }}>投稿一覧</h3>
      {user.posts.length === 0 ? (
        <div>まだ投稿がありません。</div>
      ) : (
        user.posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.cardTitle}>{post.title}</div>
            <div className={styles.cardCategory}>
              {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
            </div>
            <div className={styles.cardImage}>
              {post.images.length > 0 && (
                <Image
                  src={post.images[0].url}
                  alt="thumb"
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
              )}
            </div>
            <div className={styles.cardShop}>
              店舗: {post.shop?.name || "未登録"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
