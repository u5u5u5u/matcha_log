import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FollowButtonWrapper from "@/components/user/FollowButtonWrapper";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const meId = session?.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: id },
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
    <div>
      <h2>ユーザープロフィール</h2>
      <div>
        <Image
          src={user.iconUrl || "/file.svg"}
          alt="icon"
          width={40}
          height={40}
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
          <div key={post.id}>
            <div>{post.title}</div>
            <div>{post.category === "SWEET" ? "スイーツ" : "ドリンク"}</div>
            <div>
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
            <div>店舗: {post.shop?.name || "未登録"}</div>
          </div>
        ))
      )}
    </div>
  );
}
