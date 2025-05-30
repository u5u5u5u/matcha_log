import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/generated/prisma";
import React from "react";
import MePageClient from "@/components/me/MePageClient";

const prisma = new PrismaClient();

export default async function MePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>ログインしてください</div>;
  }
  const posts = await prisma.post.findMany({
    where: { user: { email: session.user.email } },
    include: { images: true, shop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <MePageClient
      posts={JSON.parse(JSON.stringify(posts))}
      userName={session.user.name || ""}
    />
  );
}
