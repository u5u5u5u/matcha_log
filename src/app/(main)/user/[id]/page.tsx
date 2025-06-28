import UserProfileClient from "@/components/user/UserProfileClient";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

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
      activeTitle: true,
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

  if (!user) return notFound();

  const posts = await prisma.post.findMany({
    where: { userId: user.id },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });

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
    <UserProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        iconUrl: user.iconUrl,
        activeTitle: user.activeTitle,
      }}
      posts={JSON.parse(JSON.stringify(posts))}
      followingList={user.following?.map((f) => f.following) || []}
      followerList={user.followers?.map((f) => f.follower) || []}
      initialIsFollowing={initialIsFollowing}
      showFollowButton={meId !== undefined && meId !== user.id}
    />
  );
}
