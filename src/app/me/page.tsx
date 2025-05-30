import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/generated/prisma";
import MePageClient from "@/components/me/MePageClient";

const prisma = new PrismaClient();

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      iconUrl: true,
      following: {
        select: {
          followingId: true,
          following: { select: { name: true, iconUrl: true, id: true } },
        },
      },
      followers: {
        select: {
          followerId: true,
          follower: { select: { name: true, iconUrl: true, id: true } },
        },
      },
    },
  });
  const posts = await prisma.post.findMany({
    where: { user: { email: session.user.email } },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });
  const likedPosts = await prisma.post.findMany({
    where: {
      likes: {
        some: { user: { email: session.user.email } },
      },
    },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <MePageClient
      posts={JSON.parse(JSON.stringify(posts))}
      likedPosts={JSON.parse(JSON.stringify(likedPosts))}
      userName={user?.name || ""}
      userEmail={user?.email || ""}
      userIconUrl={user?.iconUrl || undefined}
      followingList={user?.following?.map((f) => f.following) || []}
      followerList={user?.followers?.map((f) => f.follower) || []}
    />
  );
}
