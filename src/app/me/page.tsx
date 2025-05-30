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
    select: { name: true, email: true, iconUrl: true },
  });
  const posts = await prisma.post.findMany({
    where: { user: { email: session.user.email } },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <MePageClient
      posts={JSON.parse(JSON.stringify(posts))}
      userName={user?.name || ""}
      userEmail={user?.email || ""}
      userIconUrl={user?.iconUrl || undefined}
    />
  );
}
