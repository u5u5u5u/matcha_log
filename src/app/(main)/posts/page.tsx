import PostCard from "@/components/posts/PostCard";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function PostListPage() {
  const session = await getServerSession(authOptions);
  const myId = session?.user?.id;
  const posts = await prisma.post.findMany({
    include: { images: true, shop: true, user: true, likes: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  console.log("posts", posts);

  return (
    <div>
      {posts.length === 0 ? (
        <div>投稿がありません。</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} myId={myId} />)
      )}
    </div>
  );
}
